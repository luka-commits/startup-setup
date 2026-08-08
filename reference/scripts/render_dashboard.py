#!/usr/bin/env python3
"""Rendert context/today.html aus den Workspace-Dateien.

Das Dashboard ist eine ANSICHT. Der Zustand lebt in den Markdown-Dateien:

    STATUS.md    Aufgaben, Tagesplan
    PROJECTS.md  Projektkarten
    JOURNAL.md   Notizen
    BRIEFING.md  der Briefing-Text (Lead, Fliesstext, Abschnitte)

Kalender- und Mail-Fragmente kommen aus context/.mail_cache.json, weil sie
einen Netzabruf brauchen, den /morning macht. Der Werkzeuge- und der
Audit-Tab kommen aus zwei Node-Scripts; ihre Ausgabe wird in
context/.tabs_cache.html zwischengelegt.

    --full   auch die beiden Node-Scripts starten (langsam, ~3 s). Fuer /morning.
    --fast   nur die Markdown-Teile, Tabs aus dem Cache (~0,2 s). Fuer den Waechter.
    --date   Datum ueberschreiben (Wiederhollauf), sonst Systemdatum.

Faellt ein Platzhalter aus, wird today.html NICHT ueberschrieben. Ein halb
gefuelltes Dashboard sieht aus wie ein Ladefehler und verunsichert mehr,
als ein alter Stand es tut.
"""
import re, html, json, os, pathlib, datetime, subprocess, sys, argparse

W = pathlib.Path(__file__).resolve().parents[2]
TPL = W / 'context/today_template.html'
OUT = W / 'context/today.html'
CACHE = W / 'context/.mail_cache.json'
TABS = W / 'context/.tabs_cache.html'
BRIEF = W / 'context/BRIEFING.md'
FRAG = W / 'context/.fragments.json'

# Bloecke, die ein Urteil brauchen (Selbsttest-Befunde, Empfehlungen) oder nicht
# taeglich entstehen. Sie kommen aus context/.fragments.json, geschrieben vom
# Modell. Fehlt einer, klappt der Block im Template von selbst zu -- das ist
# vorgesehen und deshalb KEIN Abbruch wie bei einem Kernplatzhalter. Das offene
# Startup-Setup nutzt sie fuer seinen Start-Here-Tab; hier bleiben sie leer.
OPTIONAL = ('COMMANDS_USED', 'MEMORY_FILES', 'OWN_TOOLS', 'SELBSTTEST', 'TOOLS_EXTRA')

def _sprache():
    m = re.search(r'^language:\s*"?([a-z]{2})',
                  (W / 'context/config.yaml').read_text(encoding='utf-8'), re.M)
    return m.group(1) if m and m.group(1) in ('de', 'en') else 'de'


# GELESEN wird immer zweisprachig -- die Muster weiter unten akzeptieren beide
# Formen. GESCHRIEBEN wird in der Sprache aus config.yaml. Bis 08.08.2026 stand
# hier deutscher Text fest verdrahtet; ein englischer Workspace bekam dadurch
# Projektkarten ohne Zweck, Aufgaben ohne Frist und deutsche Wochentage -- ohne
# Fehlermeldung, weil ein Muster, das nicht trifft, kein Fehler ist.
TXT = {
    'de': dict(
        wd=['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        mon=['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
             'August', 'September', 'Oktober', 'November', 'Dezember'],
        cats={'deep-work': 'Deep Work', 'quick-win': 'Quick Win', 'comms': 'Kommunikation',
              'prep': 'Vorbereitung', 'admin': 'Admin'},
        datum='{wd}, {d}. {mon} {y}', offen='offen', wartet='wartet auf {}',
        todos='Offene To-dos',
        meta='{t} Aufgaben offen · {i} in der Inbox · {p} Projekte · {e} Termine heute',
        kein_kal='Kalender heute nicht abgerufen', keine_mail='Postfach heute nicht geprüft',
        kein_inv='Noch nicht erfasst — beim nächsten Morgen-Lauf.',
        kein_audit='Kein Audit-Stand — sag „/audit".',
        start_t='Tag starten', start_z='Kalender und Postfach sind heute noch nicht geholt.',
        ende_t='Tag abschließen', ende_z='Heute steht noch nichts im Journal.',
    ),
    'en': dict(
        wd=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        mon=['', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
             'August', 'September', 'October', 'November', 'December'],
        cats={'deep-work': 'Deep Work', 'quick-win': 'Quick Win', 'comms': 'Communication',
              'prep': 'Preparation', 'admin': 'Admin'},
        datum='{wd}, {d} {mon} {y}', offen='open', wartet='waiting on {}',
        todos='Open to-dos',
        meta='{t} tasks open · {i} in the inbox · {p} projects · {e} meetings today',
        kein_kal='Calendar not fetched today', keine_mail='Mailbox not checked today',
        kein_inv='Not recorded yet — with the next morning run.',
        kein_audit='No audit yet — say "/audit".',
        start_t='Start the day', start_z='Calendar and mailbox have not been fetched today.',
        ende_t='Close the day', ende_z='Nothing in the journal for today yet.',
    ),
}[_sprache()]

WD, MON, CATS = TXT['wd'], TXT['mon'], TXT['cats']

ap = argparse.ArgumentParser()
ap.add_argument('--full', action='store_true', help='Werkzeuge- und Audit-Tab neu bauen')
ap.add_argument('--fast', action='store_true', help='Tabs aus dem Cache (Voreinstellung)')
ap.add_argument('--date', help='YYYY-MM-DD, sonst heute')
args = ap.parse_args()
TODAY = datetime.date.fromisoformat(args.date) if args.date else datetime.date.today()


def esc(s):
    return html.escape(s or '', quote=True)


def md(s):
    """Escapen, dann die Markdown-Formen aufloesen, die in den Context-Dateien vorkommen."""
    t = html.escape(s or '', quote=True)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    return t


def shorten(t, n=150):
    """An der Wortgrenze kuerzen, nie mitten im Wort."""
    t = t.strip()
    if len(t) <= n:
        return t
    return t[:n].rsplit(' ', 1)[0].rstrip(' ,.;:-') + ' …'


# ─────────────────────────────────────────── STATUS.md
def parse_status():
    """Aufgaben: Projekt aus der ###-Ueberschrift, Note aus der eingerueckten Zeile.
    Code-Bloecke werden uebersprungen — Format-Beispiele sind keine Aufgaben."""
    t = (W / 'context/STATUS.md').read_text(encoding='utf-8')
    tasks, proj, in_open, in_code = [], None, False, False
    lines = t.splitlines()
    for i, ln in enumerate(lines):
        if ln.strip().startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if ln.startswith('## '):
            # Beide Sprachen: das offene Startup-Setup liefert englische Ueberschriften
            # ("## Tasks (open)"). Bis 08.08.2026 pruefte das nur auf "offen" -- Susanns
            # Dashboard meldete daraufhin 0 Aufgaben bei 2 offenen, mit Exit 0.
            in_open = ln.strip().startswith(('## Tasks (offen)', '## Tasks (open)'))
            continue
        if ln.startswith('### '):
            proj = ln[4:].split('(')[0].strip()
            continue
        if not in_open or not re.match(r'^\s*- \[ \]', ln):
            continue
        raw = re.sub(r'^\s*- \[ \]\s*', '', ln)
        b = re.search(r'\*\*(.+?)\*\*', raw)
        text = (b.group(1) if b else raw)
        text = re.sub(r'\s*\((?:since|seit):?[^)]*\)', '', text).strip()
        waits = re.match(r'^\((?:wartet auf|waiting on) ([^)]+)\)', text)
        status = 'wartet' if waits else 'zu-tun'
        stat_lbl = TXT['wartet'].format(waits.group(1)) if waits else TXT['offen']
        due = ''
        m = re.search(r'\((?:bis|due) (\d{2})\.(\d{2})\.\)', raw)
        if m:
            d, mo = int(m.group(1)), int(m.group(2))
            y = TODAY.year + (1 if (mo, d) < (TODAY.month, TODAY.day) else 0)
            due = f'{y}-{mo:02d}-{d:02d}'
        cm = re.search(r'#(deep-work|quick-win|komm|comms|prep|admin)', raw)
        if cm:
            cat = 'comms' if cm.group(1) == 'komm' else cm.group(1)
        else:                       # Kategorie herleiten, wenn das Suffix fehlt
            low = text.lower()
            cat = ('comms' if any(k in low for k in ('mail', 'anschreiben', 'call', 'nachricht', 'antwort', 'outreach'))
                   else 'prep' if any(k in low for k in ('termin', 'meeting', 'vorbereit'))
                   else 'admin' if any(k in low for k in ('anmeld', 'rechnung', 'steuer', 'buchen', 'konto', 'ticket'))
                   else 'deep-work')
        # Aufgabentext von den Suffixen befreien, die als Spalten eigene Zellen haben
        text = re.sub(r'\s*#(deep-work|quick-win|komm|comms|prep|admin)', '', text)
        text = re.sub(r'^\((?:wartet auf|waiting on) [^)]+\)\s*', '', text)
        text = re.sub(r'\s*\((?:bis|due) \d{2}\.\d{2}\.\)', '', text).strip()
        note = ''
        if i + 1 < len(lines) and lines[i + 1].startswith(('  ', '\t')) \
                and not re.match(r'^\s*- \[', lines[i + 1]):
            note = lines[i + 1].strip()
        tasks.append(dict(text=text[:180], proj=proj or 'Allgemein', status=status,
                          stat_lbl=stat_lbl, due=due, cat=cat, note=note[:400]))
    return tasks


def parse_plan():
    """Tagesplan: nur zaehlen, wenn die Datumszeile darunter von heute ist."""
    t = (W / 'context/STATUS.md').read_text(encoding='utf-8')
    m = re.search(r'^## (?:Tagesplan|Day Plan)\s*\n(.*?)(?=\n## |\Z)', t, re.S | re.M)
    if not m:
        return ''
    body = m.group(1)
    done = len(re.findall(r'^\s*- \[x\]', body, re.M | re.I))
    total = len(re.findall(r'^\s*- \[[ x]\]', body, re.M | re.I))
    return f' data-done="{done}" data-total="{total}"' if total else ''


# ─────────────────────────────────────────── PROJECTS.md
def parse_projects():
    t = (W / 'context/PROJECTS.md').read_text(encoding='utf-8')
    out = []
    for blk in re.split(r'\n## ', t)[1:]:
        name = blk.splitlines()[0].strip()
        if name.lower().startswith(('history', 'historie', 'ruhend', 'dormant')):
            continue

        def f(*keys):
            m = re.search(rf'\*\*(?:{"|".join(keys)}):\*\*\s*(.+)', blk)
            return m.group(1).strip() if m else ''

        out.append(dict(name=name, zweck=f('Zweck', 'Purpose'), status=f('Status'),
                        phase=f('Phase') or 'Active', blocker=f('Blocker'),
                        timeline=f('Timeline', 'Zeitachse'), ort=f('Ort')))
    return out


# ─────────────────────────────────────────── BRIEFING.md
def parse_briefing():
    """Lead, Fliesstext und die aufklappbaren Abschnitte.

    ## Lead      -> ein Satz
    ## Text      -> Absaetze
    ## <Titel>   -> je ein aufklappbarer Abschnitt, Listenpunkte werden zu <p>
    """
    if not BRIEF.is_file():
        return '', '', ''
    raw = BRIEF.read_text(encoding='utf-8')
    secs, cur, buf = {}, None, []
    order = []
    for ln in raw.splitlines():
        if ln.startswith('## '):
            if cur:
                secs[cur] = '\n'.join(buf).strip()
            cur = ln[3:].strip()
            order.append(cur)
            buf = []
        elif cur:
            buf.append(ln)
    if cur:
        secs[cur] = '\n'.join(buf).strip()

    lead = md(secs.pop('Lead', '').strip()) if 'Lead' in secs else ''
    if 'Lead' in order:
        order.remove('Lead')

    def paras(block):
        return ''.join(f'<p>{md(p.strip())}</p>'
                       for p in re.split(r'\n\s*\n', block) if p.strip())

    text = paras(secs.pop('Text', '')) if 'Text' in secs else ''
    if 'Text' in order:
        order.remove('Text')

    parts, first = [], True
    for title in order:
        body = secs.get(title, '').strip()
        if not body:
            continue                      # leerer Abschnitt entfaellt ganz
        items = re.findall(r'^\s*[-*]\s+(.+)$', body, re.M)
        if items:
            inner = ''.join(f'<p>{md(i)}</p>' for i in items)
            count = len(items)
        else:
            inner = paras(body)
            count = len(re.findall(r'<p>', inner))
        op = ' open' if first else ''
        first = False
        parts.append(f'<details class="brf-sec"{op}><summary>'
                     f'<span class="bs-title">{esc(title)}</span>'
                     f'<span class="bs-count">{count}</span></summary>'
                     f'<div>{inner}</div></details>')
    return lead, text, ''.join(parts)


# ─────────────────────────────────────────── Cache
def journal_heute():
    """Hat JOURNAL.md einen heutigen Eintrag MIT Inhalt?

    Die leere Tagesueberschrift, die der Morgen anlegt, zaehlt nicht -- sonst
    gilt der Tag als abgeschlossen, bevor irgendwas passiert ist.
    """
    try:
        t = (W / 'context/JOURNAL.md').read_text(encoding='utf-8')
    except OSError:
        return False
    m = re.search(rf'^## {TODAY.isoformat()}(.*?)(?=\n## |\Z)', t, re.S | re.M)
    return bool(m and re.search(r'^\s*[-*]\s+\S', m.group(1), re.M))


def tagesstatus(cache_stale):
    """Der eine Knopf, der gerade dran ist -- oder keiner.

    Gemessen am 08.08.2026: /morning lief in 90 Tagen 6 Mal, /eod null Mal. Nicht
    weil die Befehle zu schwer waeren, sondern weil niemand dran denkt. Ein Knopf,
    der einen ansieht, wird gedrueckt; ein Slash-Befehl muss erinnert werden.
    Geklickt wird nur kopiert -- gehandelt wird im Chat, das Dashboard bleibt Ansicht.
    """
    if cache_stale:
        titel = TXT['start_t']
        zeile = TXT['start_z']
        cmd = '/morning'
    elif not journal_heute():
        titel = TXT['ende_t']
        zeile = TXT['ende_z']
        cmd = '/eod'
    else:
        return ''
    return (f'<div class="tagstatus-in"><b>{esc(titel)}</b><span>{esc(zeile)}</span>'
            f'<button class="say-btn" data-say="{cmd}">{cmd}</button></div>')


def read_cache():
    """Mail- und Kalender-Fragmente. Nie mit gestrigem Stand rendern."""
    empty = dict(agenda='', week_days=f'<p class="sub">{TXT["kein_kal"]}</p>',
                 birthdays='', inbox_items='', email_status=TXT['keine_mail'],
                 audit_footer='', stale=True)
    if not CACHE.is_file():
        return empty
    try:
        c = json.loads(CACHE.read_text(encoding='utf-8'))
    except Exception:
        return empty
    if c.get('date') != TODAY.isoformat():
        return empty
    return dict(agenda=c.get('agenda', ''),
                week_days=c.get('week_days') or empty['week_days'],
                birthdays=c.get('birthdays', ''),
                inbox_items=c.get('inbox_items', ''),
                email_status=c.get('email_status') or empty['email_status'],
                audit_footer=c.get('audit_footer', ''),
                stale=False)


def node(cmd, fresh=False):
    try:
        env = dict(os.environ)
        if fresh:
            env['MCP_FRESH'] = '1'
        r = subprocess.run(['node', str(W / 'reference/scripts' / cmd[0]), *cmd[1:]],
                           capture_output=True, text=True, cwd=W, timeout=180, env=env)
        return r.stdout if r.returncode == 0 else ''
    except Exception:
        return ''


def tabs():
    """Ausstattung läuft LIVE bei jedem Render, der Audit kommt aus dem Cache.

    Gemessen am 23.07.: inventory.js braucht 0,4 s, sobald die eine teure Stelle
    (`claude mcp list`, 4,45 s) zwischengespeichert ist — der Rest sind Datei-Leser.
    workspace-audit.js braucht 8,4 s und ist ein periodisches Urteil, kein Zustand.
    Deshalb diese Trennung: was sich beim Arbeiten ändert, ist frisch; was eine
    Bewertung ist, bleibt stehen bis zum nächsten vollen Lauf.
    """
    cached = {}
    if TABS.is_file():
        try:
            cached = json.loads(TABS.read_text(encoding='utf-8'))
        except Exception:
            cached = {}

    a = node(['inventory.js'], fresh=args.full) or cached.get('ausstattung', '')
    b = node(['workspace-audit.js', '--render']) if args.full else cached.get('audit', '')

    if a or b:
        TABS.write_text(json.dumps({'ausstattung': a, 'audit': b}), encoding='utf-8')
    return (a or f'<p class="sub">{TXT["kein_inv"]}</p>',
            b or f'<p class="sub">{TXT["kein_audit"]}</p>')


def user_name():
    m = re.search(r'^\s*name:\s*"([^"]+)"', (W / 'context/config.yaml').read_text(encoding='utf-8'), re.M)
    return m.group(1) if m else ''


# ─────────────────────────────────────────── Bauen
tasks = parse_status()
projects = parse_projects()
cache = read_cache()
lead, brief_text, brief_secs = parse_briefing()
ausstattung, audit = tabs()

ti = []
for n, t in enumerate(tasks, 1):
    attrs = (f'data-id="t{n}" data-project="{esc(t["proj"])}" data-status="{t["status"]}" '
             f'data-cat="{t["cat"]}"')
    if t['due']:
        attrs += f' data-due="{t["due"]}"'
    if t['note']:
        attrs += ' data-note="1"'
    due_lbl = f'{t["due"][8:10]}.{t["due"][5:7]}.' if t['due'] else ''
    note_div = f'<div class="t-note">{md(t["note"])}</div>' if t['note'] else ''
    ti.append(f'<li {attrs}><span class="t-text">{md(t["text"])}</span>'
              f'<span class="c-proj">{esc(t["proj"])}</span>'
              f'<span class="c-cat">{CATS[t["cat"]]}</span>'
              f'<span class="c-status">{esc(t["stat_lbl"])}</span>'
              f'<span class="c-due">{due_lbl}</span>{note_div}</li>')

pd = []
for p in projects:
    health = 'red' if p['blocker'] and any(w in p['blocker'].lower() for w in ('offen', 'open')) else ('amber' if p['blocker'] else 'green')
    key = p['name'].lower().split()[0].rstrip('—')
    mine = [t for t in tasks if key in t['proj'].lower() or t['proj'].lower().split()[0] in p['name'].lower()][:5]
    parts = [f'<div class="head"><h3>{esc(p["name"])}</h3>'
             f'<span class="badge {health}">{esc(p["phase"])}</span></div>']
    if p['zweck']:
        parts.append(f'<p class="p-about">{md(p["zweck"])}</p>')
    if p['status']:
        parts.append(f'<p class="story">{md(p["status"])}</p>')
    if p['blocker']:
        parts.append(f'<p class="blocker-line">{md(p["blocker"])}</p>')
    if mine:
        parts.append(f'<h4>{TXT["todos"]}</h4><ul>' +
                     ''.join(f'<li>{md(shorten(t["text"], 110))}</li>' for t in mine) + '</ul>')
    parts.append('<div class="p-spacer"></div>')
    if p['timeline']:
        parts.append(f'<p class="p-time">{md(p["timeline"])}</p>')
    pd.append(f'<article class="pdetail" data-health="{health}">' + ''.join(parts) + '</article>')

jt = (W / 'context/JOURNAL.md').read_text(encoding='utf-8')
notes, last_d = [], None
for m in re.finditer(r'^## (\d{4}-\d{2}-\d{2})(.*?)(?=\n## |\Z)', jt, re.S | re.M):
    d = m.group(1)
    for b in re.findall(r'^- (.+)$', m.group(2), re.M):
        if len(notes) >= 10:
            break
        lbl = '' if d == last_d else '<b>' + d[8:10] + '.' + d[5:7] + '.</b> '
        last_d = d
        notes.append('<li>' + lbl + md(shorten(b)) + '</li>')
    if len(notes) >= 10:
        break

inbox_n = cache['inbox_items'].count('data-inbox=')
termine_n = cache['agenda'].count('<li class="ev')
meta = TXT['meta'].format(t=len(tasks), i=inbox_n, p=len(pd), e=termine_n)

mtime = OUT.stat().st_mtime if OUT.exists() else 0
vals = {
    'USER_NAME': esc(user_name()),
    'DATE_LONG': TXT['datum'].format(wd=WD[TODAY.weekday()], d=TODAY.day, mon=MON[TODAY.month], y=TODAY.year),
    'DATE_ISO': TODAY.isoformat(),
    'GENERATED_AT': datetime.datetime.now().strftime('%H:%M'),
    'META_LINE': meta,
    'BRIEFING_LEAD': lead,
    'BRIEFING': brief_text,
    'BRIEFING_SECTIONS': brief_secs,
    'AGENDA': cache['agenda'],
    'BIRTHDAYS': cache['birthdays'],
    'TASK_ITEMS': ''.join(ti),
    'INBOX_ITEMS': cache['inbox_items'],
    'PLAN_STATE': parse_plan(),
    'WEEK_DAYS': cache['week_days'],
    'EMAIL_STATUS': esc(cache['email_status']),
    'AUDIT_FOOTER': cache['audit_footer'],
    'PROJECT_DETAIL': ''.join(pd),
    'NOTES': ''.join(notes),
    'TAGESSTATUS': tagesstatus(cache['stale']),
    'AUSSTATTUNG': ausstattung,
    'AUDIT': audit,
}

h = TPL.read_text(encoding='utf-8')
for k, v in vals.items():
    h = h.replace('{{' + k + '}}', v)

frags = {}
if FRAG.is_file():
    try:
        frags = json.loads(FRAG.read_text(encoding='utf-8'))
    except Exception:
        frags = {}
for k in OPTIONAL:
    h = h.replace('{{' + k + '}}', frags.get(k) or '')

rest = sorted(set(re.findall(r'\{\{([A-Z_]+)\}\}', h)))
if rest:
    print(f'ABBRUCH: Platzhalter ohne Wert: {rest}', file=sys.stderr)
    print('today.html wurde NICHT überschrieben.', file=sys.stderr)
    sys.exit(1)

OUT.write_text(h, encoding='utf-8')
mode = 'voll' if args.full else 'schnell'
stale = ' · Mail/Kalender nicht von heute, Felder leer' if cache['stale'] else ''
print(f'{mode} · {len(tasks)} Aufgaben · {len(pd)} Projekte · {len(notes)} Notizen{stale}')
