#!/usr/bin/env bash
# Meldet beim Sitzungsstart, wenn die Einrichtung noch aussteht.
#
# Warum es diesen Hook gibt: Die Anweisung in CLAUDE.md allein ist nicht
# zuverlaessig — in Tests am 21.07.2026 sprang die Einrichtung bei "hallo" mal an
# und mal nicht, bei identischem Stand. Fuer einen neuen Nutzer ist das der
# schlimmste Fall: Er tippt "hallo", bekommt einen normalen Chat und haelt das
# System fuer kaputt. Ein Hook laeuft dagegen immer.
#
# Der Marker ist der setup-Ordner selbst: Der Skill archiviert sich am Ende weg,
# seine Anwesenheit heisst also verlaesslich "noch nicht fertig".
set -u
DIR="${CLAUDE_PROJECT_DIR:-.}"

if [ -d "$DIR/.claude/skills/setup" ]; then
  MSG="EINRICHTUNG STEHT AUS. Dieser Workspace gehoert noch niemandem: der Ordner .claude/skills/setup/ ist noch da, und der Skill archiviert sich am Ende selbst weg. Begruesse den Nutzer bei seiner ersten Nachricht in hoechstens zwei Saetzen (was das hier ist) und starte danach SOFORT den Skill 'setup' ueber das Skill-Tool. Nicht auf einen Befehl warten, nicht nachfragen, ob er moechte, und keine Einrichtung improvisieren."
  printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$MSG"
fi
exit 0
