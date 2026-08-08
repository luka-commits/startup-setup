#!/usr/bin/env python3
"""Prueft, ob die Routing-Karte eines Workspace jeden Skill kennt.

Ob ein Skill je geladen wird, entscheidet seine Description -- und die steht in
vielen einzelnen Dateien, die nie gemeinsam gelesen werden. Deshalb hat jeder
Workspace eine Karte: bei kleinen Bestaenden eine Tabelle in der CLAUDE.md, ab
etwa hundert Skills eine eigene Datei. Diese Pruefung haelt sie ehrlich.

    routing_check.py [--root <pfad>]     ein Workspace
    routing_check.py --alle              dieser plus jeder Satellit

Zwei Fehler, beide Exit 1:

    Skill ohne Eintrag      wird nie gefunden, obwohl er existiert
    Eintrag ohne Skill      die Karte zeigt auf etwas, das es nicht gibt

Der zweite ist der teurere: man verlaesst sich darauf und merkt nichts.

Gezaehlt werden Skills aus allen drei Quellen, die eine Sitzung tatsaechlich
sieht -- die des Workspace, die globalen unter ~/.claude/skills und die aus
aktivierten Plugins. Ein Plugin, das nur im Cache liegt, zaehlt nicht: seine
Skills werden nie geladen.
"""
import argparse
import json
import os
import pathlib
import re
import sys

HOME = pathlib.Path.home()

# Von Claude Code selbst mitgebracht. Sie stehen zu Recht in den Karten, haben
# aber keine Datei im Workspace -- ohne diese Liste meldet die Pruefung sie als
# verwaist, und ein Pruefer mit Fehlalarmen wird nach zwei Tagen ignoriert.
EINGEBAUT = {'mcp', 'schedule', 'setup', 'security-review', 'code-review', 'init',
             'config', 'help', 'clear', 'compact', 'model', 'review', 'run', 'loop',
             'context', 'usage', 'plugin', 'doctor', 'login', 'logout', 'agents',
             'terminal-setup', 'vim', 'memory', 'export', 'resume', 'status'}


def aktive_plugins():
    """Nur was in enabledPlugins auf true steht. Der Cache allein sagt nichts."""
    try:
        s = json.loads((HOME / '.claude/settings.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return set()
    return {k.split('@')[0] for k, v in (s.get('enabledPlugins') or {}).items() if v}


def bestand(wurzel, maschinenweit):
    """Was diese Karte zu verantworten hat.

    Immer: die Skills und Commands des Workspace selbst. Das Paket legt seine
    unter _claude-template/, weil sie erst beim Ausliefern zu .claude/ werden.

    Global und Plugins NUR bei einem Workspace mit eigener Router-Datei. Sie
    liegen auf der Maschine, nicht im Ordner -- susanns CLAUDE.md hat nicht zu
    verantworten, dass hier `hyperframes` installiert ist. Der erste Lauf am
    08.08. meldete genau das als 80 Luecken je Satellit und war damit wertlos.
    """
    gefunden = {}
    for muster, art in (('.claude/skills/*/SKILL.md', 'workspace'),
                        ('_claude-template/skills/*/SKILL.md', 'paket'),
                        ('.claude/commands/*.md', 'command')):
        for p in sorted(wurzel.glob(muster)):
            gefunden.setdefault(p.stem if art == 'command' else p.parent.name, art)
    if not maschinenweit:
        return gefunden
    for p in sorted(HOME.glob('.claude/skills/*/SKILL.md')):
        gefunden.setdefault(p.parent.name, 'global')
    an = aktive_plugins()
    for p in sorted(HOME.glob('.claude/plugins/cache/*/*/*/skills/*/SKILL.md')):
        plugin = p.parts[p.parts.index('cache') + 2]
        if plugin in an:
            gefunden.setdefault(p.parent.name, f'plugin/{plugin}')
    return gefunden


def karte(wurzel):
    """Die Routing-Karte: eigene Datei, sonst die CLAUDE.md."""
    eigen = wurzel / 'reference/skill-router.md'
    dateien = [eigen] if eigen.is_file() else []
    for name in ('CLAUDE.md', 'AGENTS.md'):
        f = wurzel / name
        if f.is_file() and not f.is_symlink():
            dateien.append(f)
    return dateien


def pruefe(wurzel):
    dateien = karte(wurzel)
    if not dateien:
        print(f'{wurzel.name}: keine CLAUDE.md und kein Router — nichts zu pruefen')
        return 0
    text = '\n'.join(f.read_text(encoding='utf-8') for f in dateien)
    # Eine eigene Router-Datei heisst: dieser Workspace dokumentiert die ganze
    # Maschine, nicht nur seinen Ordner. Nur dann zaehlen global und Plugins mit.
    skills = bestand(wurzel, maschinenweit=(wurzel / 'reference/skill-router.md').is_file())

    # Der Name muss irgendwo im Text auftauchen, mit Slash oder in Backticks.
    # Ein strengeres Muster meldete am 08.08. fuenf Luecken, die keine waren:
    # in der Tabelle stand `/prospect-brief [firma]`, der Name also nicht allein.
    fehlend = [n for n in sorted(skills)
               if not re.search(r'[`/]' + re.escape(n) + r'\b', text)]

    # Genannte Namen, die es nicht mehr gibt -- nur solche, die wie ein Befehl
    # geschrieben sind (mit Slash). Backticks tragen auch Pfade und Kommandos.
    genannt = set(re.findall(r'`/([a-z][a-z0-9_-]{2,})`', text))
    verwaist = sorted(n for n in genannt if n not in skills and n not in EINGEBAUT)

    quelle = ', '.join(f.name for f in dateien)
    print(f'{wurzel.name}: {len(skills)} Skills+Commands, Karte in {quelle}')
    if fehlend:
        print(f'  {len(fehlend)} ohne Eintrag (werden nie gefunden):')
        for n in fehlend:
            print(f'    · {n}  [{skills[n]}]')
    if verwaist:
        print(f'  {len(verwaist)} Eintraege ohne Skill (die Karte luegt):')
        for n in verwaist:
            print(f'    · /{n}')
    if not fehlend and not verwaist:
        print('  vollstaendig, nichts verwaist')
    # Nur die fehlenden lassen den Lauf scheitern. Ein Name ohne lokale Datei hat
    # legitime Faelle -- ein Skill, der von auswaerts installiert wird (/last30days
    # im Paket), oder eine historische Erwaehnung (/inbox-triage ging in /morning
    # auf). Ein geloeschter Skill landet hier ebenfalls, deshalb wird gedruckt,
    # nur nicht abgebrochen: sonst waere die Pruefung dauerhaft rot und damit tot.
    return 1 if fehlend else 0


def satelliten(wurzel):
    """Projektordner mit eigener CLAUDE.md — dieselbe Regel wie ueberall hier."""
    return [c.parent for c in sorted(wurzel.glob('projects/*/*/CLAUDE.md'))
            if not {'_archive', '_external'} & set(c.parent.parts)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', help='Workspace, sonst der Ordner dieses Skripts')
    ap.add_argument('--alle', action='store_true', help='dieser Workspace plus jeder Satellit')
    a = ap.parse_args()

    basis = pathlib.Path(a.root).expanduser().resolve() if a.root \
        else pathlib.Path(__file__).resolve().parents[2]
    if not basis.is_dir():
        print(f'FEHLT: {basis}', file=sys.stderr)
        return 1

    schlecht = pruefe(basis)
    if a.alle:
        for s in satelliten(basis):
            print()
            schlecht |= pruefe(s)
    return schlecht


if __name__ == '__main__':
    sys.exit(main())
