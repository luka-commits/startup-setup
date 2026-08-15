#!/usr/bin/env python3
"""Was in DIESEM Workspace offen ist — beim Sitzungsstart, ungefragt.

Der Anlass: die Aufgaben lagen zentral, gearbeitet wird aber im jeweiligen
Workspace, weil nur dort dessen Skills laufen. Wer morgens einen Satelliten
oeffnet, soll seine Liste sehen und nicht erst im Command Center suchen.

Laeuft in jedem Workspace, ohne Konfiguration: er findet seine Task-Datei
selbst. In der Wurzel (~/dev) bleibt der gespiegelte Satelliten-Block
bewusst DRAUSSEN — sonst steht die lange Liste wieder da, die weg sollte;
stattdessen eine Zaehlzeile je Satellit als Hinweis, wo zu oeffnen ist.

Aufruf:  python3 reference/scripts/tasks_hier.py [--root PFAD] [--alle]
"""
import argparse
import datetime as dt
import re
import subprocess
import sys
from pathlib import Path

# team/luka/status.md zuerst: in geteilten Workspaces (sqanit) ist die
# Wurzel-STATUS.md der Team-Roll-up, nicht die eigene Liste. Gleiche
# Reihenfolge wie in rollup_satellites.py — eine Konvention, nicht zwei.
CANDIDATES = ('team/luka/status.md', 'context/STATUS.md', 'STATUS.md')
ROLLUP_START, ROLLUP_END = '<!-- ROLLUP:satelliten -->', '<!-- /ROLLUP:satelliten -->'
# Jeder Workspace nennt seine Task-Sektion anders ("Tasks (offen)", "Tasks (open)",
# "Tasks — Offen"). Deshalb wird ausgeschlossen statt aufgezaehlt: alles ist eine
# Aufgabenliste, ausser den Sektionen, die erkennbar keine sind. Eine Aufzaehlung
# haette sqanit still auf null gesetzt, so wie sie es beim ersten Lauf tat.
NICHT_TASKS = ('erledigt', 'done', 'journal', 'briefing', 'note', 'notiz',
               'fokus', 'focus', 'inbox', 'plan', 'archiv', 'historie')
AKTIV = ('aktiv', 'in arbeit', 'in progress', 'läuft', 'laeuft')
TODAY = dt.date.today()
LIMIT = 8

# Gelesen wird zweisprachig, geschrieben in der Sprache aus config.yaml — dieselbe
# Regel wie im Renderer. Ohne sie bekaeme ein englischer Workspace deutschen Text,
# und zwar ohne Fehlermeldung: ein Muster, das nicht trifft, ist kein Fehler.
TXT = {
    'de': dict(offen='Offen in {w}: {n}', leer='{w}: nichts offen.',
               ueber='überfällig', bis='bis {d}', mehr='… und {n} weitere (--alle zeigt alles)',
               sats='Satelliten (dort öffnen, nur dort laufen ihre Skills): ',
               anweisung='[Aufgaben-Hook] Bei der ersten Antwort: diesen Block UNVERAENDERT '
                         'als Liste ausgeben, nicht zusammenfassen, nicht umformulieren. '
                         'Danach EINE Aufgabe vorschlagen: die oberste, die weder mit ▶ als '
                         'laufend markiert ist noch auf jemand anderen wartet ("wartet auf") '
                         '— dort liegt der Ball nicht beim Nutzer. Dazu in ein bis zwei '
                         'Saetzen der konkrete erste Schritt und was du davon selbst '
                         'uebernehmen kannst. Keine Auswahlliste, kein "womit moechtest du '
                         'anfangen". Sagt er zu, holst du ZUERST den Kontext, bevor du '
                         'irgendetwas tust: die Kontextzeile der Aufgabe, jeden Pfad und '
                         'jede Datei die darin genannt sind, den Projekt-Block in '
                         'PROJECTS.md und die letzten Journal-Eintraege dazu. Dann sagst '
                         'du in einem Satz, wo genau du ansetzt und was der Stand ist — '
                         'nie "wo waren wir stehengeblieben". Danach markierst du die '
                         'Aufgabe mit "#laeuft:<heute>" in ihrer Datei.'),
    'en': dict(offen='Open in {w}: {n}', leer='{w}: nothing open.',
               ueber='overdue', bis='due {d}', mehr='… and {n} more (--alle shows all)',
               sats='Satellites (open them there, their skills only run there): ',
               anweisung='[task hook] On your first reply: print this block VERBATIM as a '
                         'list, do not summarise or reword it. Then propose ONE task: the '
                         'topmost one that is neither marked running with ▶ nor waiting on '
                         'someone else ("waiting on") — the ball is not with the user there. '
                         'Add one or two sentences with the concrete first step and what you '
                         'can take on yourself. No menu of options, no "what would you like '
                         'to start with". If they agree, gather the context FIRST, before '
                         'doing anything: the task\'s context line, every path and file it '
                         'names, the project block in PROJECTS.md and the latest journal '
                         'entries about it. Then say in one sentence where exactly you are '
                         'picking up and what the state is — never "where did we leave off". '
                         'After that, mark the task with "#running:<today>" in its file.'),
}


def sprache(root: Path):
    f = root / 'context/config.yaml'
    if not f.is_file():
        return TXT['de']
    m = re.search(r'^language:\s*"?([a-z]{2})', f.read_text(encoding='utf-8'), re.M)
    return TXT.get(m.group(1) if m else 'de', TXT['de'])


def person(root: Path):
    """Wer sitzt hier? In geteilten Workspaces (sqanit) haengen Aufgaben an der
    Person, nicht am Repo. Abgeleitet aus der Git-Mail gegen die vorhandenen
    team/-Ordner — findet sich keiner, bleibt die Personen-Ebene einfach aus."""
    if not (root / 'team').is_dir():
        return None
    try:
        mail = subprocess.run(['git', 'config', 'user.email'], cwd=root, timeout=5,
                              capture_output=True, text=True).stdout.strip().lower()
    except Exception:
        return None
    lokal = mail.split('@')[0]
    for d in sorted((root / 'team').iterdir()):
        if d.is_dir() and d.name.lower() in lokal:
            return d.name
    return None


def task_file(root: Path, wer=None):
    reihe = (f'team/{wer}/status.md',) + CANDIDATES if wer else CANDIDATES
    for c in reihe:
        if (root / c).is_file():
            return root / c
    return None


# Bewusst KEINE Owner-Ebene: es gab sie kurz und sie holte aus sqanit zusaetzlich
# jedes Projekt mit `owner: luka` (seo, website — zusammen 8 Punkte). Luka hat sie
# am 15.08. wieder gestrichen, und das ist die sauberere Trennung: ein geteilter
# Workspace unterscheidet zwischen der Aufgabenliste EINER Person und dem Stand
# EINES Projekts. Wer beides mischt, flutet die persoenliche Liste mit
# Projekt-Checklisten, die niemand als Tagesaufgabe gemeint hat.


def quadrant(cat, due):
    """Regel 4 in CLAUDE.md: dringend aus der Frist, wichtig aus der Kategorie."""
    dringend = bool(due) and (due - TODAY).days <= 7
    wichtig = cat in ('deep-work', 'admin', 'prep')
    return 'Q1' if (dringend and wichtig) else 'Q2' if wichtig else 'Q3' if dringend else 'Q4'


def parse_due(raw):
    m = re.search(r'\((?:bis|due) (\d{2})\.(\d{2})\.\)', raw)
    if not m:
        return None
    d, mo = int(m.group(1)), int(m.group(2))
    # Das Jahr, das den Termin am dichtesten an heute legt. Die alte Regel
    # ("alles Vergangene ist naechstes Jahr") hat genau die dringenden Aufgaben
    # entschaerft: PhotoTAN war seit dem 13.08. faellig und galt als Q2 statt Q1.
    moegl = []
    for y in (TODAY.year - 1, TODAY.year, TODAY.year + 1):
        try:
            moegl.append(dt.date(y, mo, d))
        except ValueError:
            pass
    return min(moegl, key=lambda x: abs((x - TODAY).days)) if moegl else None


def tasks(path: Path, skip_rollup: bool):
    text = path.read_text(encoding='utf-8')
    if skip_rollup and ROLLUP_START in text and ROLLUP_END in text:
        head, _, rest = text.partition(ROLLUP_START)
        text = head + rest.partition(ROLLUP_END)[2]
    out, proj, in_open, sekt_aktiv, in_code = [], None, False, False, False
    for ln in text.splitlines():
        if ln.strip().startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if ln.startswith('## '):
            h = ln[3:].lower()
            in_open = not any(w in h for w in NICHT_TASKS)
            sekt_aktiv = any(w in h for w in AKTIV)
            proj = None
            continue
        if ln.startswith('### '):
            proj = ln[4:].split('(')[0].strip()
            continue
        if not in_open or not re.match(r'^\s*- \[ \]', ln):
            continue
        raw = re.sub(r'^\s*- \[ \]\s*', '', ln)
        if 'DD.MM.' in raw or '#kategorie' in raw:   # die Format-Vorlage
            continue
        # Nur FETT AM ZEILENANFANG ist die Ueberschrift. Ungeankert schnappte sich
        # ein "**nach**" mitten im Satz die ganze Zeile — eine sqanit-SEO-Aufgabe
        # stand danach als Wort "nach" in der Liste.
        b = re.match(r'\*\*(.+?)\*\*', raw)
        txt = b.group(1) if b else raw
        cm = re.search(r'#(deep-work|quick-win|komm|prep|admin)', raw)
        cat = cm.group(1) if cm else 'deep-work'
        due = parse_due(raw)
        laeuft = sekt_aktiv or bool(
            re.search(r'#(?:läuft|laeuft|running)(?::' + TODAY.isoformat() + r')?\b', raw))
        for pat in (r'\s*#(?:deep-work|quick-win|komm|prep|admin)',
                    r'\s*#(?:läuft|laeuft|running)(?::\d{4}-\d{2}-\d{2})?',
                    r'\s*\((?:bis|due) \d{2}\.\d{2}\.\)'):
            txt = re.sub(pat, '', txt)
        out.append(dict(text=txt.strip(), proj=proj or 'Allgemein', due=due,
                        quad=quadrant(cat, due), laeuft=laeuft))
    return out


def satellites(root: Path):
    """Ein Satellit ist an seiner eigenen CLAUDE.md erkennbar — dieselbe Regel,
    nach der auch der Roll-up und `ws` gehen."""
    found = []
    for d in sorted((root / 'projects').glob('*/*')):
        if not (d / 'CLAUDE.md').is_file():
            continue
        # Genauso zaehlen wie beim Oeffnen dort, sonst widerspricht sich das
        # System selbst — die Zeile sagte einmal "sqanit 3" bei 11 beim Oeffnen.
        f = task_file(d, person(d))
        if f:
            found.append((d.name, len(tasks(f, skip_rollup=True))))
    return [(n, c) for n, c in found if c]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.')
    ap.add_argument('--alle', action='store_true', help='alle Aufgaben statt der ersten acht')
    ap.add_argument('--fallback', default=None,
                    help='Workspace, der gilt, wenn --root keiner ist. Ein neues '
                         'Terminal startet im Home-Ordner, und dort gibt es keine '
                         'Aufgabenliste — ohne das bleibt der Hook dann stumm.')
    a = ap.parse_args()

    root = Path(a.root).resolve()
    wer = person(root)
    f = task_file(root, wer)
    if not f and a.fallback:
        root = Path(a.fallback).resolve()
        wer = person(root)
        f = task_file(root, wer)
    if not f:
        return 0                      # kein Workspace mit Aufgaben — still bleiben

    t9n = sprache(root)
    # Die Wurzel erkennt man am gespiegelten Satelliten-Block, nicht an
    # projects/+reference/ — die hat jeder Satellit aus dem Paket auch.
    ist_wurzel = ROLLUP_START in f.read_text(encoding='utf-8')
    offen = tasks(f, skip_rollup=ist_wurzel)
    if not offen:
        print(t9n['leer'].format(w=root.name))
        return 0

    offen.sort(key=lambda t: (not t['laeuft'], t['quad'], t['due'] or dt.date.max))
    zeige = offen if a.alle else offen[:LIMIT]

    # Zwei Dinge muessen mitreisen, weil in einem Satelliten die CLAUDE.md von
    # ~/dev NICHT gilt — eine Regel dort erreicht diesen Hook nie.
    # (1) Ohne die Ausgabe-Anweisung fasst die neue Sitzung die Liste in Prosa
    #     zusammen; gemessen am 15.08.2026 beim ersten echten Lauf.
    # (2) Luka will nicht die Liste, sondern den naechsten Schritt: eine Aufgabe
    #     vorgeschlagen, nicht siebzehn zur Auswahl gestellt.
    if not a.alle:
        print(t9n['anweisung'])
    print(t9n['offen'].format(w=root.name, n=len(offen)))
    for t in zeige:
        frist = ''
        if t['due']:
            frist = '  (' + (t9n['ueber'] if (t['due'] - TODAY).days < 0
                             else t9n['bis'].format(d=t['due'].strftime('%d.%m.'))) + ')'
        mark = '▶ ' if t['laeuft'] else ''
        print(f'  {t["quad"]}  {mark}{t["text"][:95]}{frist}  · {t["proj"]}')
    if len(offen) > len(zeige):
        print('  ' + t9n['mehr'].format(n=len(offen) - len(zeige)))

    if ist_wurzel:
        sats = satellites(root)
        if sats:
            print(t9n['sats'] + ' · '.join(f'{n} {c}' for n, c in sats))
    return 0


if __name__ == '__main__':
    sys.exit(main())
