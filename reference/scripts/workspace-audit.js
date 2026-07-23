#!/usr/bin/env node
// Workspace-Audit: beurteilt einen Ordner als Arbeitssystem, nicht als Dateihaufen.
//
//   node reference/scripts/workspace-audit.js [--root <pfad>] [--json] [--render] [--selftest]
//
// Misst zehn Dimensionen in drei Gruppen. Die Kriterien prüfen EIGENSCHAFTEN, nie
// Konventionen: nie "gibt es einen context-Ordner", sondern "gibt es genau einen
// erkennbaren Ort für Zustand, und ist der frisch". Nur so läuft es auf fremden Ordnern.
//
// Befund-Disziplin, geerbt aus projects/_external/claude-code-security-review:
// jeder Befund traegt severity UND confidence, unter 0.7 wird gar nicht gemeldet, und
// lieber ein theoretisches Problem übersehen als den Bericht mit Rauschen fluten.
//
// ponytail: alles Mechanische, kein Modell. Das Urteil (Widersprüche, Angemessenheit,
// Empfehlungen) macht der /audit-Skill auf Basis dieser JSON.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const argOf = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const ROOT = path.resolve(argOf('--root') || process.cwd());
const L = require('./lib-workspace.js')(ROOT);
const { esc, norm, skills, plugins, projectRepos, originUrl, installed, mcpServers,
        readInventory, hasKey, KNOWN_CLIS, WORK_CLIS } = L;

// Diese Daten beschreiben die MASCHINE, nicht den geprueften Ordner. Laeuft das Audit
// mit --root auf einen fremden Ordner, gehoeren sie nicht in den Bericht: am 22.07. stand
// im Audit eines Sandkastens "104 Skills, 7 MCP, 46 Jobs" samt einem Job-Namen mit
// Kundenbezug — also der Rechner des Pruefers in einem Bericht ueber jemand anderen.
// Auf dem eigenen Workspace bleibt alles wie gehabt.
const FOREIGN_ROOT = ROOT !== path.resolve(process.cwd());

const DAYS = 90;
const NOW = Date.now();
const days = (ms) => Math.floor((NOW - ms) / 86400000);
const IGNORE = /(^|\/)(\.git|node_modules|\.venv|venv|__pycache__|dist|build|\.next|\.cache|tmp|_tmp)(\/|$)/;
const ARCHIVE = /(^|\/)(_?archiv[e]?|_archive|old|alt|deprecated|skills-(deprecated|archive)|_abgeloest)(\/|$)/i;

// ---------------------------------------------------------------- Dateien einlesen

// Ein verschachteltes Repo ist ein FREMDER Workspace mit eigener Historie und eigener
// Doku. Wer es mitzählt, misst nicht diesen Ordner. Dasselbe gilt für eingekaufte
// Skills und Plugins: die bringen ihre Doku selbst mit.
const NESTED_REPOS = [];
function isNestedRepo(dir) {
  if (path.resolve(dir) === ROOT) return false;
  try { return fs.existsSync(path.join(dir, '.git')); } catch { return false; }
}

function walk(dir, depth = 6, acc = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full);
    if (IGNORE.test('/' + rel)) continue;
    if (e.isSymbolicLink()) {
      let ok = true;
      try { fs.statSync(full); } catch { ok = false; }
      acc.push({ rel, full, dir: false, symlink: true, broken: !ok, size: 0, mtime: 0 });
      continue;
    }
    if (e.isDirectory()) {
      if (isNestedRepo(full)) { NESTED_REPOS.push(rel); continue; }
      acc.push({ rel, full, dir: true });
      if (depth > 0) walk(full, depth - 1, acc);
    } else {
      let st; try { st = fs.statSync(full); } catch { continue; }
      acc.push({ rel, full, dir: false, size: st.size, mtime: st.mtimeMs, ext: path.extname(e.name) });
    }
  }
  return acc;
}

const FILES = walk(ROOT);
// Dokumente, die über den Skill-Mechanismus gefunden werden, brauchen keinen Link aus
// der CLAUDE.md — sie sind nicht verwaist, sie werden anders entdeckt.
const SELF_DISCOVERED = /(^|\/)\.claude(\/|$)/;
const DOCS = FILES.filter((f) => !f.dir && f.ext === '.md' && !f.symlink);
const OWN_DOCS = DOCS.filter((f) => !SELF_DISCOVERED.test('/' + f.rel));
// Dokumentation gegen Material: was tief im Projektbaum liegt, ist Arbeitsmaterial
// (Eingänge, Arbeitsstaende, Ergebnisse) und muss von nirgends verlinkt sein. Nur was
// oben liegt oder sich README/CLAUDE nennt, ist Wegweiser und gehört erreichbar.
const isDoc = (rel) => {
  const base = path.basename(rel);
  if (/\d{4}-\d{2}-\d{2}/.test(base)) return false;              // datierte Artefakte
  if (/(^|\/)\.|backup|\.bak$/i.test(rel)) return false;          // Backups und Verstecktes
  return rel.split('/').length <= 2
    || /^(README|CLAUDE|AGENTS?|CONTRIBUTING|SETUP|VERSION|ONBOARDING)\.md$/i.test(base);
};
const GUIDE_DOCS = OWN_DOCS.filter((f) => isDoc(f.rel));
const read = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } };

// Einstiegspunkte: was eine frische Session ohnehin laedt.
// Nach echtem Ziel entdoppeln: zeigt AGENT.md als Symlink auf CLAUDE.md, ist es EINE
// Datei und darf nicht zweimal als Session-Kosten zaehlen.
const ENTRIES = (() => {
  const seenReal = new Set(); const out = [];
  for (const f of ['CLAUDE.md', 'AGENTS.md', 'AGENT.md', 'README.md']) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) continue;
    let real = full;
    try { real = fs.realpathSync(full); } catch {}
    if (seenReal.has(real)) continue;
    seenReal.add(real); out.push(f);
  }
  return out;
})();
const GLOBAL_MD = (() => { try { return fs.readFileSync(path.join(os.homedir(), '.claude', 'CLAUDE.md'), 'utf8'); } catch { return ''; } })();
const ENTRY_TEXT = ENTRIES.map(read).join('\n');
const ALL_INSTRUCTIONS = ENTRY_TEXT + '\n' + GLOBAL_MD;

// ---------------------------------------------------------------- Nutzung aus den Session-Logs

// Der einzige Weg, "echte Fähigkeit" von "toter Kontext" zu unterscheiden. Wir zählen
// INVERTIERT (pro bekanntem Namen suchen) — sonst gewinnt Shell-Rauschen wie `do` oder `}`.
function readUsage() {
  const slug = ROOT.replace(/\//g, '-');
  const dir = path.join(os.homedir(), '.claude', 'projects', slug);
  const out = { available: false, sessions: 0, skills: {}, bins: {}, mcp: {}, commands: [], windowDays: DAYS };
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl')); } catch { return out; }
  const cut = NOW - DAYS * 86400000;
  files = files.filter((f) => { try { return fs.statSync(path.join(dir, f)).mtimeMs > cut; } catch { return false; } });
  if (!files.length) return out;
  out.available = true;
  out.sessions = files.length;

  for (const f of files) {
    let text = '';
    try { text = fs.readFileSync(path.join(dir, f), 'utf8'); } catch { continue; }
    for (const line of text.split('\n')) {
      if (!line.includes('"tool_use"')) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const content = (o.message || {}).content;
      if (!Array.isArray(content)) continue;
      for (const b of content) {
        if (!b || b.type !== 'tool_use') continue;
        const name = b.name || '';
        const inp = b.input || {};
        if (name === 'Skill' && inp.skill) out.skills[inp.skill] = (out.skills[inp.skill] || 0) + 1;
        if (name.startsWith('mcp__')) {
          const srv = name.split('__')[1] || name;
          out.mcp[srv] = (out.mcp[srv] || 0) + 1;
        }
        if (name === 'Bash' && inp.command) out.commands.push(String(inp.command).slice(0, 400));
      }
    }
  }
  // Binaries invertiert zählen: nur bekannte Namen, kein Shell-Rauschen
  const known = new Set([...KNOWN_CLIS, ...readInventory().clis.map((c) => c.name)]);
  for (const cmd of out.commands) {
    const seen = new Set();
    for (const part of cmd.split(/&&|\|\||[|;]/)) {
      const tok = part.trim().split(/\s+/)[0];
      if (known.has(tok) && !seen.has(tok)) { seen.add(tok); out.bins[tok] = (out.bins[tok] || 0) + 1; }
    }
  }
  return out;
}
const USAGE = readUsage();

// ---------------------------------------------------------------- Profil

// Bewusst nachsichtig geparst: `- schlüssel: wert` oder `schlüssel: wert`, Listen mit
// Einrückung. Fehlt die Datei, gilt jeder Slot als "nuetzlich" und der Bericht sagt das.
function readProfile() {
  const raw = read('context/profile.md');
  if (!raw.trim()) return { present: false, tools: [], painpoints: [], team: null, kind: null, channels: [] };
  const p = { present: true, tools: [], painpoints: [], team: null, kind: null, channels: [], local: null };
  let section = null;
  for (const line of raw.split(/\r?\n/)) {
    const key = line.match(/^[-*]?\s*(betrieb|kind|team|kanal|channels|tools|werkzeuge|painpoints|schmerz|lokal|local)\s*:\s*(.*)$/i);
    if (key) {
      section = key[1].toLowerCase();
      const val = key[2].trim();
      if (val) {
        if (/^(team)$/.test(section)) p.team = parseInt(val, 10) || null;
        else if (/^(betrieb|kind)$/.test(section)) p.kind = val;
        else if (/^(lokal|local)$/.test(section)) p.local = /ja|yes|true|lokal/i.test(val);
        else if (/^(kanal|channels)$/.test(section)) p.channels = val.split(/[,;]/).map((x) => x.trim()).filter(Boolean);
        section = null;
      }
      continue;
    }
    const item = line.match(/^\s+[-*]\s+(.*)$/);
    if (item && section) {
      const v = item[1].trim();
      if (/^(tools|werkzeuge)$/.test(section)) {
        const m = v.split(/\s+[—–-]\s+/);
        p.tools.push({ name: m[0].trim(), why: (m[1] || '').trim() });
      } else if (/^(painpoints|schmerz)$/.test(section)) p.painpoints.push(v);
      else if (/^(kanal|channels)$/.test(section)) p.channels.push(v);
    }
  }
  return p;
}
const PROFILE = readProfile();

// ---------------------------------------------------------------- Befunde

const F = [];
// severity: high | medium | low   ·   confidence: 0..1, unter 0.7 wird verworfen
const finding = (dim, severity, confidence, what, why, fix, evidence) =>
  ({ dim, severity, confidence, what, why, fix, evidence: evidence || null });

const dims = [];
function dim(id, group, label, level, metric, findings, note) {
  const kept = (findings || []).filter((f) => f && f.confidence >= 0.7);
  dims.push({ id, group, label, level, metric, note: note || null, findings: kept });
}
const worst = (findings, base) => {
  if (findings.some((f) => f.severity === 'high')) return 'act';
  if (findings.some((f) => f.severity === 'medium')) return 'watch';
  return base || 'ok';
};

// =========================================================== 1. Deckung & Routing

(function coverage() {
  const inv = readInventory();
  // Auf einem fremden Ordner zaehlen nur dessen eigene Skills. Die globalen liegen unter
  // ~/.claude/skills und gehoeren dem Pruefer, nicht dem Geprueften — sonst meldet ein
  // Kundenbericht "104 Skills", von denen der Kunde keinen einzigen hat.
  const skillList = FOREIGN_ROOT ? skills().filter((s) => s.scope === 'workspace') : skills();
  const cliNames = new Set(KNOWN_CLIS.filter(installed).map(norm));
  // Dasselbe fuer die MCP-Server: `claude mcp list` beschreibt die Maschine, nicht den Ordner.
  const servers = FOREIGN_ROOT ? [] : mcpServers();
  const mentions = (n) => new RegExp(`\\b${String(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(ALL_INSTRUCTIONS);
  const findings = [];

  // Vier Quadranten je Fähigkeit: referenziert x benutzt
  const usedSkill = (n) => (USAGE.skills[n] || 0) > 0;
  const usedBin = (n) => (USAGE.bins[n] || 0) > 0;

  const quiet = [];      // referenziert, aber nie benutzt
  const lucky = [];      // benutzt, aber nirgends referenziert
  for (const s of skillList) {
    const ref = mentions(s.name), use = usedSkill(s.name);
    if (use && !ref) lucky.push(s.name);
  }
  for (const c of WORK_CLIS.filter(installed)) {
    const ref = mentions(c), use = usedBin(c);
    if (use && !ref) lucky.push(c);
    if (!use && ref) quiet.push(c);
  }
  for (const a of inv.accounts) {
    if (hasKey(a.key_env) && !mentions(a.name) && !mentions(a.key_env)) quiet.push(a.name);
  }

  if (lucky.length && USAGE.available) {
    findings.push(finding('coverage', 'medium', 0.85,
      `Benutzt, aber nirgends verdrahtet: ${lucky.slice(0, 8).join(', ')}`,
      'Claude findet das nur, wenn es zufaellig im Gespraech auftaucht. In einer frischen Session ist es weg.',
      'Eine Zeile in der Routing-Tabelle der CLAUDE.md: welche Aufgabe fuehrt zu diesem Werkzeug.',
      { count: lucky.length }));
  }
  if (quiet.length) {
    findings.push(finding('coverage', 'low', 0.75,
      `Eingerichtet, aber in ${USAGE.windowDays} Tagen nicht benutzt: ${quiet.slice(0, 8).join(', ')}`,
      'Entweder fehlt der Anlass, oder Claude greift nicht danach. Beides kostet Kontext, ohne zu tragen.',
      'Entweder eine konkrete Aufgabe damit verbinden, oder ersatzlos entfernen.',
      { count: quiet.length }));
  }

  // Routing: ueberschneidende Trigger fuehren zu stillen Fehlgriffen
  const words = new Map();
  for (const s of skillList) {
    for (const w of (s.full || '').toLowerCase().match(/'[^']{4,30}'/g) || []) {
      const k = w.replace(/'/g, '');
      if (!words.has(k)) words.set(k, []);
      words.get(k).push(s.name);
    }
  }
  const clashes = [...words.entries()].filter(([, v]) => v.length > 1).slice(0, 5);
  if (clashes.length) {
    findings.push(finding('coverage', 'medium', 0.72,
      `${clashes.length} Auslöser beanspruchen mehrere Skills, z.B. "${clashes[0][0]}" (${clashes[0][1].join(', ')})`,
      'Bei mehrdeutigen Auslösern startet mal der eine, mal der andere. Der Nutzer merkt nur, dass es unzuverlaessig ist.',
      'Auslöser trennen oder die Skills zusammenlegen.'));
  }

  const noDesc = skillList.filter((s) => !s.purpose).map((s) => s.name);
  if (noDesc.length) {
    findings.push(finding('coverage', 'medium', 0.9,
      `${noDesc.length} Skills ohne Beschreibung: ${noDesc.slice(0, 6).join(', ')}`,
      'Ohne Beschreibung wird ein Skill nie automatisch gefunden, er existiert praktisch nicht.',
      'Je eine Zeile description mit den Auslösern in die SKILL.md.'));
  }

  const metric = USAGE.available
    ? `${Object.keys(USAGE.skills).length} von ${skillList.length} Skills benutzt (${USAGE.windowDays} Tage)`
    : `${skillList.length} Skills, ${servers.length} MCP, Nutzung unbekannt`;
  dim('coverage', 'Anbindung', 'Deckung & Routing',
    USAGE.available ? worst(findings) : 'unknown', metric, findings);
})();

// =========================================================== 2. Automatisierungsgrad

// Geplante Jobs auf Betriebssystem-Ebene. Der Befund vom 22.07. war genau hier: die
// Config sagte "0 Routinen", waehrend ein launchd-Job taeglich lief und still starb.
// "Nicht eingetragen" und "existiert nicht" sind zwei verschiedene Dinge.
function scheduledJobs() {
  const jobs = [];
  if (FOREIGN_ROOT) return jobs;
  try {
    const out = execSync('launchctl list', { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e7 }).toString();
    for (const line of out.split('\n')) {
      const m = line.match(/^(-|\d+)\s+(-|\d+)\s+(\S+)$/);
      if (!m || /^com\.apple\./.test(m[3])) continue;
      const exit = m[2] === '-' ? null : parseInt(m[2], 10);
      jobs.push({ label: m[3], exit, running: m[1] !== '-' });
    }
  } catch {}
  try {
    const cron = execSync('crontab -l', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    for (const line of cron.split('\n')) {
      if (line.trim() && !line.trim().startsWith('#')) jobs.push({ label: line.trim().slice(0, 60), exit: null, cron: true });
    }
  } catch {}
  return jobs;
}

(function automation() {
  const inv = readInventory();
  const findings = [];

  // Ein Job, der laeuft und scheitert, ist schlimmer als keiner: niemand merkt es.
  const jobs = scheduledJobs();
  const failing = jobs.filter((j) => j.exit !== null && j.exit !== 0);
  if (failing.length) {
    findings.push(finding('automation', 'high', 0.9,
      `${failing.length} geplante Jobs beenden mit einem Fehler: ${failing.slice(0, 4).map((j) => `${j.label} (Exit ${j.exit})`).join(', ')}`,
      'Sie starten weiter nach Plan und sterben sofort. Niemand bekommt eine Meldung, und was sie liefern sollten, fehlt einfach.',
      'Den Job einmal von Hand starten, den Fehler lesen, den Pfad oder das Script richtigstellen.',
      { jobs: failing.slice(0, 6) }));
  }
  // Wiederholte Handgriffe sind belegte Automatisierungs-Kandidaten
  const sig = new Map();
  for (const cmd of USAGE.commands) {
    const s = cmd.replace(/["'][^"']*["']/g, '_').replace(/\s+/g, ' ').trim().slice(0, 70);
    if (s.length < 12) continue;
    sig.set(s, (sig.get(s) || 0) + 1);
  }
  const repeats = [...sig.entries()].filter(([, n]) => n >= 8).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (repeats.length) {
    findings.push(finding('automation', 'medium', 0.8,
      `${repeats.length} Handgriffe wiederholen sich, der häufigste ${repeats[0][1]}-mal`,
      'Jede Wiederholung kostet Zeit und ist eine Fehlerquelle. Wiederholung ist der beste Beleg für einen Automatisierungs-Kandidaten.',
      'Aus dem häufigsten Ablauf ein Kommando oder eine Routine machen.',
      { samples: repeats.map(([s, n]) => ({ pattern: s, count: n })) }));
  }
  if (!inv.routines.length && !jobs.length) {
    findings.push(finding('automation', 'low', 0.8,
      'Keine Routine eingerichtet',
      'Alles passiert nur, wenn jemand daran denkt. Genau die wiederkehrenden Dinge fallen dann als erstes aus.',
      'Mit dem anfangen, was taeglich sowieso passiert.'));
  }
  // Auf einem fremden Ordner wurden geplante Jobs bewusst NICHT gelesen (sie beschreiben
  // die Maschine). Das gehoert gesagt statt als "0 Jobs" behauptet — nicht geprueft und
  // nicht vorhanden sind zwei verschiedene Dinge, so steht es oben im Kommentar.
  dim('automation', 'Anbindung', 'Automatisierung',
    USAGE.available ? worst(findings) : 'unknown',
    `${inv.routines.length} Routinen, ${FOREIGN_ROOT ? 'geplante Jobs nicht geprueft (fremder Ordner)' : jobs.length + ' geplante Jobs'}, ${repeats.length} Wiederholungsmuster`,
    findings);
})();

// =========================================================== 3. Sicherheit

(function security() {
  const findings = [];
  const credFile = path.join(os.homedir(), '.config', 'credentials.env');
  try {
    const st = fs.statSync(credFile);
    const mode = (st.mode & 0o777).toString(8);
    if (mode !== '600') {
      findings.push(finding('security', 'high', 0.9,
        `credentials.env hat Rechte ${mode} statt 600`,
        'Andere Konten auf diesem Rechner können die Schlüssel lesen.',
        'chmod 600 ~/.config/credentials.env'));
    }
  } catch { /* keine Datei, kein Befund */ }

  // Secrets in getrackten Dateien: nur echte Schlüsselmuster, keine Platzhalter
  let tracked = [];
  try {
    tracked = execSync('git ls-files', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8 })
      .toString().split('\n').filter(Boolean);
  } catch { /* kein Repo */ }
  const SECRET = /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----)/;
  const hits = [];
  for (const rel of tracked.slice(0, 4000)) {
    if (!/\.(md|json|ya?ml|env|js|ts|py|sh|txt|html)$/i.test(rel)) continue;
    const full = path.join(ROOT, rel);
    let st; try { st = fs.statSync(full); } catch { continue; }
    if (st.size > 400000) continue;
    const txt = read(rel);
    const m = txt.match(SECRET);
    // Harte Ausschlussliste (Muster aus claude-code-security-review): Platzhalter in
    // Beispielen sind keine Secrets. Ein Fehlalarm hier kostet mehr Vertrauen, als der
    // Fund wert wäre.
    const PLACEHOLDER = /(your|my|dein|example|sample|placeholder|dummy|test|xxx|abc123|here|token-|\.\.\.|<)/i;
    if (m && !PLACEHOLDER.test(m[0])) hits.push(rel);
    if (hits.length >= 5) break;
  }
  if (hits.length) {
    findings.push(finding('security', 'high', 0.95,
      `Schlüsselmuster in getrackten Dateien: ${hits.join(', ')}`,
      'Was im Repo liegt, ist mit dem nächsten Push außerhalb dieses Rechners und bleibt in der Historie.',
      'Schlüssel rotieren, aus der Datei nehmen, nach ~/.config/credentials.env verschieben.',
      { files: hits }));
  }

  // Was darf der Agent ohne Rückfrage? NUR die allow-Liste zaehlt, und was in deny steht,
  // ist geschuetzt, nicht gefaehrlich. Vorher durchsuchte die Regex den ganzen settings-Text
  // inklusive deny-Block — `Bash(rm:*)` in deny (das dich SCHUETZT) loeste den Alarm aus, den
  // es verhindert. Ein Befund ohne Beleg, ausgeloest von der Schutzregel. 23.07.
  // Nur echte destruktive Binaries. Breite Wildcards wie Bash(python3:*) sind hier
  // bewusst NICHT dabei — sie sind fuer den Workspace noetig, und jede zu melden waere
  // das Rauschen, gegen das der ganze Audit gebaut ist.
  const DANGER = /^Bash\((rm|sudo|dd|git push (--force|-f)|curl.*\|\s*(ba)?sh)/;
  let allow = [], deny = [];
  for (const f of ['.claude/settings.json', '.claude/settings.local.json']) {
    try {
      const p = JSON.parse(read(f) || '{}').permissions || {};
      allow = allow.concat(p.allow || []);
      deny = deny.concat(p.deny || []);
    } catch { /* keine oder kaputte Datei */ }
  }
  const denySet = new Set(deny);
  const risky = allow.filter((r) => DANGER.test(r) && !denySet.has(r));
  if (risky.length) {
    findings.push(finding('security', 'medium', 0.8,
      `${risky.length} Allow-Regel${risky.length === 1 ? '' : 'n'} lässt destruktive Kommandos ohne Rückfrage zu`,
      'Ein Fehlgriff läuft dann ohne Bestätigung durch, und deny greift für genau diese Regel nicht.',
      'Die betroffene Regel enger fassen, streichen oder eine deny-Regel dagegensetzen.',
      { rules: risky }));
  }
  dim('security', 'Anbindung', 'Sicherheit', worst(findings),
    `${tracked.length} getrackte Dateien geprüft`, findings);
})();

// =========================================================== 4. Erreichbarkeit

(function reach() {
  const findings = [];
  const rels = new Set(FILES.filter((f) => !f.dir).map((f) => f.rel));
  const linksOf = (text) => {
    const out = new Set();
    for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) out.add(m[1]);
    for (const m of text.matchAll(/`([^`\n]+\.[a-z]{2,4})`/gi)) out.add(m[1]);
    return [...out].map((t) => t.split('#')[0].replace(/^\.\//, ''))
      .filter((t) => !/^https?:/.test(t))
      // Platzhalter in Mustern sind keine Verweise: `projects/<gruppe>/`, `skills/*/SKILL.md`
      .filter((t) => !/[<>{}*]|\.\.\./.test(t));
  };
  const byBase = new Map();
  for (const r of rels) {
    const b = path.posix.basename(r);
    byBase.set(b, byBase.has(b) ? byBase.get(b) : r);   // erster Treffer genuegt
  }
  const seen = new Set(ENTRIES);
  const queue = [...ENTRIES];
  const dead = [];
  while (queue.length) {
    const cur = queue.shift();
    const text = read(cur);
    if (!text) continue;
    for (const target of linksOf(text)) {
      if (target.startsWith('~') || target.startsWith('/')) continue;   // außerhalb des Ordners
      const cand = [target, path.posix.join(path.posix.dirname(cur), target)]
        .map((t) => t.replace(/^\.\//, ''));
      let hit = cand.find((c) => rels.has(c));
      // In der Doku steht oft nur der Dateiname (`PROJECTS.md`), nicht der Pfad. Existiert
      // genau eine Datei mit dem Namen, ist das gemeint und kein toter Verweis.
      if (!hit) hit = byBase.get(path.posix.basename(target));
      if (!hit) {
        // Ein Befehl ist kein Verweis. `open context/today.html` und
        // `cmd //c start "" context/today.html` stehen in der Doku als AUSFUEHRBARE Zeile,
        // nicht als Link — wer sie als Pfad liest, meldet drei tote Verweise, die keine
        // sind. Und ein Pruefwerkzeug, das dauerhaft falsch meckert, wird ignoriert:
        // der Fehlalarm ist teurer als der Befund. Gefunden am 23.07. im eigenen Paket.
        const looksLikePath = target.includes('/') && !/\s/.test(target);
        // Ein Journal beschreibt die Vergangenheit, ein Archiv ebenso. Dass dort Genanntes
        // heute nicht mehr existiert, ist der Normalfall und kein Befund.
        const isChronicle = /(JOURNAL|CHANGELOG|HISTORY)/i.test(path.basename(cur)) || ARCHIVE.test('/' + cur);
        if (looksLikePath && !isChronicle && /\.(md|html|ya?ml|json|js|py|sh)$/i.test(target)) {
          dead.push({ from: cur, to: target });
        }
        continue;
      }
      if (!seen.has(hit)) { seen.add(hit); if (hit.endsWith('.md')) queue.push(hit); }
    }
  }
  // Selbstfindende Dokumente: README, weil es im Ordner liegt — und CLAUDE.md/AGENTS.md,
  // weil sie der Einstieg eines Unter-Workspace sind und geladen werden, sobald jemand
  // dort arbeitet. Beide brauchen keinen Link von oben.
  const SELF_ENTRY = /^(README|CLAUDE|AGENTS?)\.md$/i;
  const candidates = GUIDE_DOCS.filter((d) => !ARCHIVE.test('/' + d.rel)
    && !SELF_ENTRY.test(path.basename(d.rel)));
  const orphans = candidates.filter((d) => !seen.has(d.rel));
  const rate = candidates.length ? Math.round((orphans.length / candidates.length) * 100) : 0;
  if (rate > 30 && orphans.length > 3) {
    findings.push(finding('reach', rate > 60 ? 'high' : 'medium', 0.8,
      `${orphans.length} von ${candidates.length} Dokumenten (${rate} %) sind von den Einstiegsdateien aus nicht erreichbar`,
      'Auf diese Dokumente zeigt nichts. Claude liest sie nie, außer jemand nennt den Pfad von Hand.',
      'Verlinken, wo sie hingehören, oder ins Archiv verschieben.',
      { examples: orphans.slice(0, 8).map((o) => o.rel) }));
  }
  const deadInEntry = dead.filter((d) => ENTRIES.includes(d.from));
  if (deadInEntry.length) {
    findings.push(finding('reach', 'high', 0.9,
      `${deadInEntry.length} tote Verweise in einer Einstiegsdatei`,
      'Ein Verweis ins Leere in genau der Datei, die jede Session laedt. Der Hinweis wirkt vorhanden, fuehrt aber nirgendwohin.',
      'Ziel wiederherstellen oder den Verweis entfernen.',
      { examples: deadInEntry.slice(0, 6) }));
  } else if (dead.length > 5) {
    findings.push(finding('reach', 'medium', 0.75,
      `${dead.length} tote Verweise in der Dokumentation`,
      'Jeder tote Verweis kostet einen Fehlversuch und Vertrauen in die Doku.',
      'Ziele prüfen, Verweise nachziehen.',
      { examples: dead.slice(0, 8) }));
  }
  // Ein toter Symlink ist nicht gleich ein toter Symlink — die Schwere haengt am ORT.
  // In .claude/skills/ ist es ein still totes Kommando (hoch). Anderswo ist es ein
  // kaputter Verweis auf Material, eine fehlende Datei: aergerlich, aber nicht dringend.
  // Vorher wurde alles als high/0.95 mit Skill-Begruendung gemeldet, auch fuenf fehlende
  // Uni-PDFs — genau der Fehlbefund, gegen den dieses Script sonst gebaut ist. 23.07.
  const allBroken = FILES.filter((f) => f.symlink && f.broken && !ARCHIVE.test('/' + f.rel));
  const SKILL_LINK = /(^|\/)\.claude\/skills\//;
  const deadSkills = allBroken.filter((f) => SKILL_LINK.test('/' + f.rel));
  const deadOther = allBroken.filter((f) => !SKILL_LINK.test('/' + f.rel));
  if (deadSkills.length) {
    findings.push(finding('reach', 'high', 0.95,
      `${deadSkills.length} tote Skill-Verknüpfungen`,
      'Ein toter Symlink in .claude/skills/ meldet keinen Fehler, er tut einfach nichts: das Kommando existiert scheinbar und passiert nie.',
      'Ziel wiederherstellen oder den Link entfernen.',
      { examples: deadSkills.slice(0, 6).map((b) => b.rel) }));
  }
  if (deadOther.length) {
    findings.push(finding('reach', 'low', 0.8,
      `${deadOther.length} kaputte Datei-Verweise`,
      'Symlinks, die ins Leere zeigen — meist eine Quelldatei, die verschoben oder gelöscht wurde. Wird sie gebraucht, ist sie nicht da; ein Kommando bricht dadurch nicht.',
      'Bei Gelegenheit prüfen: Datei wieder herbringen oder den toten Link entfernen.',
      { examples: deadOther.slice(0, 6).map((b) => b.rel) }));
  }
  // Ohne Dokumente gibt es kein Erreichbarkeitsproblem. Vorher meldete ein Ordner ohne
  // jede Doku "0 von 0 Dokumenten erreichbar" als Handlungsbedarf — ein Alarm ueber eine
  // leere Menge, also genau der Fehlbefund, den dieses Script sonst verbietet.
  dim('reach', 'Wissen', 'Erreichbarkeit',
    candidates.length === 0 ? 'unknown' : worst(findings),
    candidates.length === 0
      ? 'keine Dokumente vorhanden, nichts zu erreichen'
      : `${candidates.length - orphans.length} von ${candidates.length} Dokumenten erreichbar`,
    candidates.length === 0 ? [] : findings);
})();

// =========================================================== 5. Frische

(function freshness() {
  const findings = [];
  const STATE = /(STATUS|JOURNAL|PROJECTS|ROADMAP|CHANGELOG|NEXT|TODO)/i;
  const STAMP = /(Last updated|Letzte Aktualisierung|Stand)\s*:?\s*\**\s*(\d{4}-\d{2}-\d{2}|\d{2}\.\d{2}\.\d{4})/i;
  const workMtime = Math.max(0, ...FILES.filter((f) => !f.dir && !ARCHIVE.test('/' + f.rel)).map((f) => f.mtime || 0));
  // Ein archiviertes Dokument ist absichtlich alt. Es zu bemängeln heisst, Ablage zu bestrafen.
  const stateDocs = OWN_DOCS.filter((d) => !ARCHIVE.test('/' + d.rel)
    && (STATE.test(path.basename(d.rel)) || STAMP.test(read(d.rel).slice(0, 1500))));
  const stale = [];
  for (const d of stateDocs) {
    const gap = days(d.mtime) - days(workMtime);
    if (gap > 30) stale.push({ file: d.rel, staleDays: days(d.mtime) });
  }
  if (stale.length) {
    findings.push(finding('freshness', stale.length > 2 ? 'high' : 'medium', 0.85,
      `${stale.length} Zustandsdokumente sind deutlich älter als die letzte Arbeit im Ordner`,
      'Sie behaupten einen Stand, den es nicht mehr gibt. Das ist schlimmer als kein Dokument, weil man ihm glaubt.',
      'Nachziehen oder ehrlich als historisch kennzeichnen.',
      { examples: stale.slice(0, 6) }));
  }
  dim('freshness', 'Wissen', 'Frische', worst(findings),
    `${stateDocs.length} Zustandsdokumente, ${stale.length} veraltet`, findings);
})();

// =========================================================== 6. Ballast

(function bloat() {
  const findings = [];
  const bytes = ENTRIES.reduce((n, f) => n + read(f).length, 0) + GLOBAL_MD.length;
  const tokens = Math.round(bytes / 4);
  if (tokens > 12000) {
    findings.push(finding('bloat', tokens > 25000 ? 'high' : 'medium', 0.8,
      `Die Einstiegsdateien kosten rund ${tokens.toLocaleString('de-DE')} Token pro Session`,
      'Das faellt bei jeder einzelnen Unterhaltung an, bevor irgendetwas passiert.',
      'Selten gebrauchte Regeln in eine Referenzdatei auslagern und nur bei Bedarf lesen lassen.',
      { tokens }));
  }
  // Mehrere Einstiegsdateien sind LEGITIM: verschiedene Agenten lesen verschiedene Namen
  // (Claude Code liest CLAUDE.md, andere lesen AGENTS.md oder AGENT.md). Ihre Doppelung
  // ist deshalb kein Ballast-Befund. Das echte Risiko ist, dass sie auseinanderlaufen —
  // dann arbeitet ein Agent still mit einer aelteren Fassung.
  const entryTexts = ENTRIES.map((f) => ({ f, t: read(f).replace(/\s+/g, ' ').trim() }));
  for (let i = 0; i < entryTexts.length; i++) {
    for (let j = i + 1; j < entryTexts.length; j++) {
      const a = entryTexts[i], b = entryTexts[j];
      if (!a.t.length || !b.t.length) continue;
      // "Zwillinge" heisst: ueber 80 % gemeinsame Absaetze. Dann sind sie als Kopie gemeint.
      const pa = new Set(read(a.f).split(/\n\s*\n/).map((x) => x.replace(/\s+/g, ' ').trim()).filter((x) => x.length > 80));
      const pb = new Set(read(b.f).split(/\n\s*\n/).map((x) => x.replace(/\s+/g, ' ').trim()).filter((x) => x.length > 80));
      if (!pa.size || !pb.size) continue;
      const shared = [...pa].filter((x) => pb.has(x)).length;
      const ratio = shared / Math.max(pa.size, pb.size);
      if (ratio < 0.8) continue;
      if (a.t === b.t) continue;                       // identisch, alles gut
      const onlyA = [...pa].filter((x) => !pb.has(x)).length;
      const onlyB = [...pb].filter((x) => !pa.has(x)).length;
      findings.push(finding('bloat', 'high', 0.9,
        `${a.f} und ${b.f} sind Zwillinge, aber auseinandergelaufen (${onlyA} bzw. ${onlyB} Absätze nur in einer)`,
        'Zwei Einstiegsdateien für verschiedene Agenten sind in Ordnung. Zwei Fassungen derselben Regeln sind es nicht: ein Agent arbeitet ab jetzt mit einem älteren Stand, und niemand bekommt eine Meldung.',
        'Eine zur Wahrheit machen und die andere als Symlink darauf zeigen lassen, dann kann die Drift nicht wiederkommen.',
        { dateien: [a.f, b.f], nurInA: onlyA, nurInB: onlyB }));
    }
  }

  // Duplikate: derselbe Absatz an mehreren Orten
  const TWINS = new Set(ENTRIES);
  const blocks = new Map();
  for (const f of [...ENTRIES, ...OWN_DOCS.slice(0, 200).map((d) => d.rel)]) {
    const text = read(f);
    for (const para of text.split(/\n\s*\n/)) {
      const key = para.replace(/\s+/g, ' ').trim();
      if (key.length < 200) continue;
      if (!blocks.has(key)) blocks.set(key, new Set());
      blocks.get(key).add(f);
    }
  }
  // Absaetze, die nur zwischen den Einstiegsdateien doppelt sind, sind oben schon behandelt.
  // Und Backups zaehlen nie: eine Sicherungskopie SOLL identisch sein.
  const dupes = [...blocks.entries()].filter(([, files]) => {
    const real = [...files].filter((f) => !/backup|\.bak$/i.test(f));
    return new Set(real.filter((f) => !TWINS.has(f))).size >= 1 && real.length > 1;
  });
  if (dupes.length) {
    findings.push(finding('bloat', dupes.length > 5 ? 'medium' : 'low', 0.8,
      `${dupes.length} Textbloecke stehen wortgleich in mehreren Dateien`,
      'Derselbe Fakt an zwei Orten heißt: einer davon wird irgendwann falsch, und niemand merkt welcher.',
      'Einen Ort zur Wahrheit machen, die anderen darauf verweisen lassen.',
      { examples: dupes.slice(0, 4).map(([k, v]) => ({ files: [...v], preview: k.slice(0, 90) })) }));
  }
  dim('bloat', 'Wissen', 'Ballast', worst(findings), `~${tokens.toLocaleString('de-DE')} Token je Session`, findings);
})();

// =========================================================== 7. Kaltstart

(function coldstart() {
  const findings = [];
  if (!ENTRIES.length) {
    findings.push(finding('coldstart', 'high', 0.95,
      'Keine Einstiegsdatei (CLAUDE.md, AGENTS.md oder README.md)',
      'Eine frische Session weiss nichts über diesen Ordner und faengt jedes Mal bei null an.',
      'Eine CLAUDE.md anlegen: was ist das hier, wo liegt was, wie wird gearbeitet.'));
  } else {
    const t = ENTRY_TEXT.toLowerCase();
    const missing = [];
    if (!/(ordner|struktur|folder|structure|verzeichnis)/.test(t)) missing.push('die Ordnerstruktur');
    if (!/(skill|kommando|command|\/[a-z-]{3,})/.test(t)) missing.push('die verfügbaren Kommandos');
    if (!/(zweck|purpose|wofuer|ziel|was ist)/.test(t)) missing.push('den Zweck des Ordners');
    if (missing.length) {
      findings.push(finding('coldstart', missing.length > 1 ? 'medium' : 'low', 0.75,
        `Die Einstiegsdatei erklärt nicht: ${missing.join(', ')}`,
        'Ein neuer Mensch oder eine frische Session muss sich das zusammensuchen, statt loslegen zu können.',
        'Je zwei bis drei Zeilen dazu an den Anfang der Einstiegsdatei.'));
    }
  }
  dim('coldstart', 'Wissen', 'Kaltstart', worst(findings),
    ENTRIES.length ? `${ENTRIES.join(', ')}` : 'keine Einstiegsdatei', findings);
})();

// =========================================================== 8. Entscheidungs-Gedächtnis

(function decisions() {
  const findings = [];
  const WHY = /(entschieden|entscheidung|decision|weil|begruendung|rationale|stattdessen|verworfen)/i;
  const journals = OWN_DOCS.filter((d) => /(JOURNAL|DECISION|ADR|CHANGELOG)/i.test(path.basename(d.rel)));
  const withWhy = journals.filter((d) => WHY.test(read(d.rel)));
  if (!journals.length) {
    findings.push(finding('decisions', 'medium', 0.75,
      'Kein Ort, an dem Entscheidungen mit Begruendung stehen',
      'In sechs Monaten ist nicht mehr beantwortbar, warum etwas so gebaut wurde. Verworfene Wege werden dann noch einmal probiert.',
      'Ein Journal mit drei bis fuenf Zeilen pro Tag reicht: was entschieden wurde und warum.'));
  } else if (!withWhy.length) {
    findings.push(finding('decisions', 'low', 0.7,
      'Es wird protokolliert, was passiert ist, aber nicht warum',
      'Das Was steht ohnehin in der Historie. Wertvoll ist das Warum, und genau das fehlt.',
      'Bei jeder Entscheidung einen Halbsatz Begruendung mitschreiben.'));
  }
  dim('decisions', 'Wissen', 'Entscheidungs-Gedächtnis', worst(findings),
    `${journals.length} Protokolldateien, ${withWhy.length} mit Begruendungen`, findings);
})();

// =========================================================== 9. Lebenszyklus

(function lifecycle() {
  const findings = [];
  // bewusst eng: "slide-1.html" und "2026-07-20.md" sind KEINE Versionsspuren
  const VERSIONED = /((^|[ _\-])(final|fertig|endgueltig|neu|new|alt|old|kopie|copy|backup|test)|[ _\-]v\d+|\(\d+\)|\s\d+)\.[a-z0-9]{2,4}$/i;
  const versioned = FILES.filter((f) => !f.dir && !ARCHIVE.test('/' + f.rel) && VERSIONED.test(path.basename(f.rel)));
  if (versioned.length > 5) {
    findings.push(finding('lifecycle', 'medium', 0.75,
      `${versioned.length} Dateien tragen Versionsspuren im Namen`,
      'Bei "final" und "neu" weiss niemand mehr, welches der gueltige Stand ist. Ueberschreiben und Doppelarbeit sind die Folge.',
      'Ergebnisse mit Datum benennen statt mit Version, ueberholte Staende ins Archiv.',
      { examples: versioned.slice(0, 8).map((v) => v.rel) }));
  }
  const byBase = new Map();
  for (const f of FILES) {
    if (f.dir || ARCHIVE.test('/' + f.rel)) continue;
    const b = path.basename(f.rel).toLowerCase();
    if (/^(readme|index|claude|__init__|package)\./.test(b)) continue;
    if (!byBase.has(b)) byBase.set(b, []);
    byBase.get(b).push(f.rel);
  }
  const clones = [...byBase.entries()].filter(([, v]) => v.length > 1);
  if (clones.length > 2) {
    findings.push(finding('lifecycle', 'low', 0.7,
      `${clones.length} Dateinamen kommen an mehreren Orten vor`,
      'Gleicher Name, zwei Orte: irgendwann pflegt jemand die falsche Kopie.',
      'Einen Ort zur Wahrheit machen.',
      { examples: clones.slice(0, 5).map(([k, v]) => ({ name: k, at: v })) }));
  }
  dim('lifecycle', 'Handwerk', 'Lebenszyklus', worst(findings),
    `${versioned.length} Versionsspuren, ${clones.length} doppelte Namen`, findings);
})();

// =========================================================== 10. Sicherung

(function backup() {
  const findings = [];
  const origin = originUrl();
  let dirty = [], lastPush = null, hasGit = false;
  try {
    execSync('git rev-parse --git-dir', { cwd: ROOT, stdio: 'ignore' });
    hasGit = true;
    dirty = execSync('git status --porcelain', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8 })
      .toString().split('\n').filter(Boolean);
    lastPush = execSync('git log -1 --format=%ct', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { /* kein Repo */ }

  // Ein Unterordner eines groesseren Repos ist gesichert, nur eben nicht selbst.
  let parentRepo = null;
  if (hasGit && !origin) {
    try {
      const top = execSync('git rev-parse --show-toplevel', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (path.resolve(top) !== ROOT) parentRepo = path.relative(path.dirname(ROOT), top) || top;
    } catch {}
  }

  if (parentRepo) {
    dim('backup', 'Handwerk', 'Sicherung', 'ok', `gesichert über das übergeordnete Repo`, [],
      'Dieser Ordner hat kein eigenes git, liegt aber in einem Repo. Die Sicherung haengt an dessen Remote.');
    return;
  }
  if (!hasGit) {
    findings.push(finding('backup', 'high', 0.9,
      'Kein git in diesem Ordner',
      'Es gibt keinen Rückweg. Ein Fehlgriff oder ein Plattenschaden nimmt alles mit.',
      'git init, dann ein privates Remote anlegen.'));
  } else if (!origin) {
    findings.push(finding('backup', 'high', 0.9,
      'git ist da, aber kein Remote gesetzt',
      'Die Historie liegt ausschliesslich auf diesem Rechner. Das ist kein Backup.',
      'Ein privates Remote anlegen und einmal pushen.'));
  } else {
    const ageDays = lastPush ? days(parseInt(lastPush, 10) * 1000) : null;
    if (ageDays !== null && ageDays > 14) {
      findings.push(finding('backup', 'medium', 0.85,
        `Der letzte Commit ist ${ageDays} Tage her`,
        'Alles seither existiert nur lokal.',
        'Committen und pushen.'));
    }
    if (dirty.length > 60) {
      findings.push(finding('backup', 'medium', 0.75,
        `${dirty.length} Dateien sind uncommittet`,
        'Bei der Menge ist nicht mehr erkennbar, was bewusste Arbeit ist und was Müll.',
        'In Portionen committen oder ignorieren, was nicht ins Repo gehört.'));
    }
  }
  dim('backup', 'Handwerk', 'Sicherung', worst(findings),
    hasGit ? (origin ? `Remote gesetzt, ${dirty.length} offen` : 'kein Remote') : 'kein git', findings);
})();

// =========================================================== 11. Code-Qualität

// Hier wird bewusst NICHT der Code gelesen. Eine echte Code-Review ist teuer und gehoert
// pro Repo angestossen, nicht als Nebenprodukt eines Ordner-Audits ueber 25 Repos.
// Gemessen wird, was mechanisch und billig zu haben ist und trotzdem etwas aussagt:
// laesst sich das Repo aufgreifen (README), ist Arbeit ungesichert, ruht es.
(function code() {
  if (!NESTED_REPOS.length) {
    dim('code', 'Handwerk', 'Code-Qualität', 'unknown', 'keine Repos im Ordner', [],
      'Greift nur bei Ordnern, die Code enthalten.');
    return;
  }
  const findings = [];
  const repos = NESTED_REPOS.slice(0, 25).map((rel) => {
    const full = path.join(ROOT, rel);
    const has = (d) => { try { return fs.existsSync(path.join(full, d)); } catch { return false; } };
    let dirty = 0, ageDays = null;
    try {
      dirty = execSync('git status --porcelain', { cwd: full, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e7 })
        .toString().split('\n').filter(Boolean).length;
      const ct = execSync('git log -1 --format=%ct', { cwd: full, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (ct) ageDays = days(parseInt(ct, 10) * 1000);
    } catch { /* leeres oder kaputtes Repo */ }
    return {
      rel, dirty, ageDays,
      readme: has('README.md') || has('readme.md') || has('README.rst'),
      tests: has('tests') || has('test') || has('__tests__') || has('spec'),
      ci: has('.github/workflows'),
    };
  });

  const noReadme = repos.filter((r) => !r.readme);
  const uncommitted = repos.filter((r) => r.dirty > 0 && (r.ageDays === null || r.ageDays > 14));
  const dormant = repos.filter((r) => r.ageDays !== null && r.ageDays > 180);
  const active = repos.filter((r) => r.ageDays !== null && r.ageDays <= 30);

  if (uncommitted.length) {
    findings.push(finding('code', 'medium', 0.85,
      `${uncommitted.length} Repos tragen uncommittete Arbeit, seit über zwei Wochen unangetastet`,
      'Angefangenes, das weder fertig noch gesichert ist. Beim nächsten Aufgreifen weiß niemand mehr, ob das ein Versuch war oder der Stand.',
      'Committen oder verwerfen, je Repo einmal kurz hinsehen.',
      { repos: uncommitted.slice(0, 8).map((r) => ({ repo: r.rel, offen: r.dirty })) }));
  }
  if (noReadme.length && active.length) {
    const hits = noReadme.filter((r) => r.ageDays !== null && r.ageDays <= 90);
    if (hits.length) {
      findings.push(finding('code', 'low', 0.75,
        `${hits.length} aktive Repos haben kein README`,
        'Wer es in drei Monaten aufmacht, muss sich aus dem Code erschließen, wofür es da war. Das gilt auch für Claude.',
        'Fünf Zeilen genügen: wofür, wie starten, wo liegt der Rest.',
        { repos: hits.slice(0, 8).map((r) => r.rel) }));
    }
  }
  if (dormant.length > repos.length / 2) {
    findings.push(finding('code', 'low', 0.7,
      `${dormant.length} von ${repos.length} Repos ruhen seit über einem halben Jahr`,
      'Ruhend ist in Ordnung, unsichtbar nicht: sie werden bei jeder Suche mitgelesen und machen die Übersicht unschärfer.',
      'Ruhende Repos ins Archiv verschieben, dann bleibt vorne nur, was läuft.'));
  }

  dim('code', 'Handwerk', 'Code-Qualität', worst(findings),
    `${repos.length} Repos, ${active.length} aktiv, ${dormant.length} ruhend`, findings,
    'Der Code selbst wird hier nicht gelesen. Für ein echtes Urteil über ein einzelnes Repo: /security-review oder /code-review darin laufen lassen.');
})();

// ---------------------------------------------------------------- Ausgabe

const result = {
  generatedAt: new Date(NOW).toISOString(),
  root: ROOT,
  profile: { present: PROFILE.present, kind: PROFILE.kind, team: PROFILE.team,
             tools: PROFILE.tools, painpoints: PROFILE.painpoints, channels: PROFILE.channels },
  usage: { available: USAGE.available, sessions: USAGE.sessions, windowDays: USAGE.windowDays,
           skills: USAGE.skills, bins: USAGE.bins, mcp: USAGE.mcp },
  dimensions: dims,
  judgement: null,      // wird vom /audit-Skill gefüllt
};

if (args.includes('--render')) {
  process.stdout.write(renderFragment());
} else if (args.includes('--json')) {
  process.stdout.write(JSON.stringify(result, null, 2));
} else {
  const outPath = path.join(ROOT, 'context', 'audit.json');
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
    process.stderr.write(`geschrieben: ${outPath}\n`);
  } catch (e) { process.stderr.write(`konnte nicht schreiben (${e.message}), nutze --json\n`); }
  for (const d of dims) {
    process.stderr.write(`${d.level.padEnd(8)} ${d.label.padEnd(26)} ${d.metric}\n`);
    for (const f of d.findings) process.stderr.write(`         · ${f.what}\n`);
  }
}

// Das Fragment für den Dashboard-Tab: dieselben KPI-Kacheln wie die Setup-Uebersicht.
function renderFragment() {
  let data = result;
  try { data = JSON.parse(fs.readFileSync(path.join(ROOT, 'context', 'audit.json'), 'utf8')); } catch {}
  if (!data || !data.dimensions) {
    return '<div class="ivempty">Noch kein Audit gelaufen. Sag <code>/audit</code> im Chat, dann steht hier der Stand.</div>';
  }
  // Elf gleich grosse Kacheln behandeln "alles in Ordnung" und "hier musst du ran"
  // als gleich wichtig, und eine geoeffnete Kachel sprengt die Rasterordnung. Beides
  // war derselbe Denkfehler: das hier sind Textbefunde, keine Zahlen zum Ueberfliegen.
  // Jetzt eine Liste nach Dringlichkeit — und was in Ordnung ist, bekommt EINE ruhige
  // Zeile statt fuenf Karten, weil es niemand einzeln lesen will. 23.07.
  const esc2 = esc;
  const samples = (f) => {
    const s = f.evidence && f.evidence.samples;
    if (!Array.isArray(s) || !s.length) return '';
    // Roh-Signaturen sind der Beleg. "5 Handgriffe" ohne die Handgriffe ist die generische
    // Aussage, die Luka zu Recht nicht will — hier stehen sie konkret, mit Zaehler.
    return '<ul class="audsamples">' + s.map((x) =>
      `<li><code>${esc2(String(x.pattern || x).slice(0, 78))}</code><span>${esc2(String(x.count || ''))}${x.count ? '×' : ''}</span></li>`
    ).join('') + '</ul>';
  };
  const findingRows = (d) => d.findings.length
    ? d.findings.map((f) => `<div class="audfind"><b>${esc2(f.what)}</b>`
        + `<p>${esc2(f.why)}</p>${samples(f)}<p class="audfix">${esc2(f.fix)}</p></div>`).join('')
    : `<div class="audfind"><p>${esc2(d.note || 'Nichts gefunden.')}</p></div>`;
  const row = (d) => `<details class="audrow lvl-${esc2(d.level)}"><summary>`
    + `<span class="audlvl">${d.level === 'act' ? 'handeln' : 'beobachten'}</span>`
    + `<span class="audname">${esc2(d.label)}</span>`
    + `<span class="audmetric">${esc2(d.metric)}</span>`
    + `<span class="audcount">${d.findings.length}</span></summary>`
    + `<div class="audbody">${findingRows(d)}</div></details>`;
  const cls = { ok: 'ok', watch: 'part', act: 'part', unknown: 'none' };
  // Die grosse Zahl war die ANZAHL DER BEFUNDE und las sich wie eine Note: "1 Sicherheit"
  // sah schlechter aus als ein Haken, hiess aber nur "ein Befund". Jetzt fuehrt die Stufe,
  // die Befundzahl steht als Abzeichen daneben. 23.07.
  const lvl = { ok: 'in Ordnung', watch: 'beobachten', act: 'handeln', unknown: 'nicht messbar' };
  // Handlungsbedarf zuerst, "nicht messbar" zuletzt. Eine alphabetische oder zufaellige
  // Reihenfolge zwingt jeden dazu, elf Kacheln zu lesen, um die eine zu finden, die zaehlt.
  const rank = { act: 0, watch: 1, ok: 2, unknown: 3 };
  const tiles = [...data.dimensions].sort((a, b) => (rank[a.level] ?? 9) - (rank[b.level] ?? 9)).map((d) => {
    const body = d.findings.length
      ? d.findings.map((f) => `<div class="ivrow"><div class="ivname"><b>${esc(f.what)}</b>`
          + `<span class="inv-badge${f.severity === 'high' ? '' : ' xref'}">${esc(f.severity)}</span></div>`
          + `<p>${esc(f.why)}</p><p><b>${esc(f.fix)}</b></p></div>`).join('')
      : `<div class="ivempty">${esc(d.note || 'Nichts gefunden.')}</div>`;
    return `<details class="kpi ${cls[d.level] || 'none'}" id="aud-${esc(d.id)}"><summary>`
      + `<span class="kpi-num">${d.level === 'ok' ? '✓' : d.level === 'unknown' ? '–' : d.findings.length}</span>`
      + `<span class="kpi-lab">${esc(d.label)}</span>`
      + `<span class="kpi-sub">${esc(lvl[d.level] || d.level)}${d.metric ? ' · ' + esc(d.metric) : ''}</span></summary>`
      + `<div class="kpi-body">${body}</div></details>`;
  }).join('');

  // Der Gesamtstand als EINE Zahl, und zwar eine zaehlbare: wie viele der bewerteten
  // Dimensionen stehen auf "in Ordnung". Keine erfundene Note, keine Gewichtung, die
  // niemand nachrechnen kann — "nicht messbar" faellt aus dem Nenner, sonst wuerde ein
  // fehlender Beleg wie ein Mangel aussehen.
  const judged = data.dimensions.filter((d) => d.level !== 'unknown');
  const good = judged.filter((d) => d.level === 'ok').length;
  const act = judged.filter((d) => d.level === 'act').length;
  const unknown = data.dimensions.length - judged.length;
  const pct = judged.length ? Math.round((good / judged.length) * 100) : 0;
  const scoreSub = `${good} von ${judged.length} bewerteten Dimensionen in Ordnung`
    + (act ? `, ${act} mit Handlungsbedarf` : '')
    + (unknown ? `, ${unknown} nicht messbar` : '');
  const score = `<details class="kpi ${pct === 100 ? 'ok' : 'part'} wide" id="aud-score"><summary>`
    + `<span class="kpi-num">${pct}%</span>`
    + `<span class="kpi-lab">Gesamtstand</span>`
    + `<span class="kpi-sub">${esc(scoreSub)}</span>`
    + `<span class="kpi-bar" aria-hidden="true"><i style="width:${pct}%"></i></span></summary>`
    + `<div class="kpi-body"><div class="ivempty">Die Zahl ist eine Auszählung, keine Note: wie viele Dimensionen auf „in Ordnung" stehen. Was zu tun ist, steht in den Kacheln darunter — die mit Handlungsbedarf zuerst.</div></div></details>`;

  const byLevel = (lv) => data.dimensions.filter((d) => d.level === lv);
  const acts = byLevel('act');
  const watches = byLevel('watch');
  const oks = byLevel('ok');
  const unknowns = byLevel('unknown');

  const group = (title, sub, rows) => rows.length
    ? `<h4 class="audgrp">${esc(title)}<span>${esc(sub)}</span></h4><div class="audlist">${rows}</div>` : '';

  const quiet = (title, dims, hint) => dims.length
    ? `<div class="audquiet"><b>${esc(title)}</b> ${dims.map((d) => esc(d.label)).join(' · ')}`
      + `<p>${esc(hint)}</p></div>` : '';

  const stamp = new Date(data.generatedAt).toLocaleDateString('de-DE');
  return `<p class="sec-sub">Stand ${esc(stamp)}, läuft nicht automatisch mit. Neuer Lauf: <code>/audit</code> im Chat.</p>`
    + `<div class="kpigrid">${score}</div>`
    + group('Hier musst du ran', `${acts.length} von ${data.dimensions.length}`, acts.map(row).join(''))
    + group('Im Auge behalten', `${watches.length} von ${data.dimensions.length}`, watches.map(row).join(''))
    + quiet('In Ordnung:', oks, 'Nichts zu tun. Aufgeklappt stünde hier nur, dass alles passt.')
    + quiet('Nicht messbar:', unknowns, 'Kein Beleg vorhanden — das ist eine Einschränkung des Audits, kein Mangel deines Ordners.');
}

// --- Selbstpruefung:  node reference/scripts/workspace-audit.js --selftest
if (args.includes('--selftest')) {
  const assert = require('assert');
  assert.ok(dims.length >= 10, `mindestens zehn Dimensionen erwartet, ${dims.length} gefunden`);
  assert.ok(dims.every((d) => ['ok', 'watch', 'act', 'unknown'].includes(d.level)), 'ungueltiges level');
  assert.ok(dims.every((d) => d.group && d.label && d.metric), 'Dimension ohne Gruppe, Label oder Metrik');
  const all = dims.flatMap((d) => d.findings);
  assert.ok(all.every((f) => f.confidence >= 0.7), 'Befund unter der Confidence-Schwelle durchgerutscht');
  assert.ok(all.every((f) => f.what && f.why && f.fix), 'Befund ohne was/warum/wie');
  assert.ok(!JSON.stringify(result).includes('undefined'), 'undefined im Ergebnis');
  const frag = renderFragment();
  assert.ok(frag.includes('kpigrid') || frag.includes('ivempty'), 'Fragment leer');
  console.error(`ok, ${dims.length} Dimensionen, ${all.length} Befunde, ${USAGE.sessions} Sessions ausgewertet`);
}
