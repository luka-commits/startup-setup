---
name: eod
description: "Tagesabschluss am Abend: gleicht den Tagesplan gegen die Realität ab, hält fest was passiert ist, was liegen bleibt und was entschieden wurde. Trigger: /eod, 'Feierabend', 'Tagesabschluss', 'das war's für heute', 'end of day'. Lädt Kalender + Tagesplan + Tasks + Session-Verlauf, zeigt EINEN fertigen Vorschlag, holt nur Korrekturen ab, schreibt JOURNAL.md + PROJECTS.md und gibt einen kurzen Vorblick auf morgen. Kein Stunden-Tracking."
---

# /eod — Tagesabschluss

Kurzer Abschluss am Abend. Lädt den Kontext selbst, zeigt einen fertigen Vorschlag, holt nur noch Korrekturen — und schreibt weg, was der Tag ergeben hat.

**Wann verwenden:** abends vor Feierabend, wenn der Tag Spuren hinterlassen hat, die das System kennen sollte.

---

## Phase 1 — Kontext laden (automatisch, parallel)

Alle Reads parallel, bevor du fragst:

1. **Datum + Wochentag** aus System-Context
2. **`context/STATUS.md`** — **Tagesplan** (falls heute gesetzt: Basis für den Plan-vs-Ist-Abgleich), Tasks (offen), Inbox (unbehandelte Funde), Current Focus
3. **`context/PROJECTS.md`** — wie die Projekte stehen: Status, Blocker, Timeline
4. **`context/JOURNAL.md`** — heutiger Eintrag schon da? (nicht duplizieren)
5. **Kalender heute** über den verbundenen Kalender-Connector (nur mit erteilter Erlaubnis):
   - Deferred Tool: erst das Kalender-Such-Tool laden. Bei Microsoft 365 ist das `ToolSearch select:mcp__claude_ai_Microsoft_365__outlook_calendar_search`; bei einem anderen Connector den Tool-Namen per `ToolSearch query:calendar` ermitteln und den nutzen
   - Query `*`, afterDateTime = heute 00:00, **beforeDateTime = morgen 23:59** (heute für den Rückblick, morgen für den Vorblick in Phase 5 — sonst müsstest du die Zahl erfinden), order = oldest
   - Meetings mit Titel + Uhrzeit extrahieren, nach heute/morgen trennen
   - **Scheitert der Abruf** (Connector fehlt, Auth abgelaufen, Erlaubnis nicht erteilt): NICHT abbrechen, nicht wiederholen — ohne Kalender abschließen und im Vorschlag einen ruhigen Satz einbauen (_„An den Kalender komme ich gerade nicht — der Rückblick kommt aus deinen Aufgaben und dem Journal."_). Kein Tool-Name, kein Fehlertext. Der Abschluss ohne Kalender ist vollwertig, kein Fehlerzustand.
6. **Session-Verlauf — nur als Bonus, nie als Basis:** Die verlässlichen Quellen sind die Files aus 2–4 (Regel-1-Updates von heute stehen bereits dort) plus der Kalender. Steht im Chat-Verlauf zusätzlich Heutiges (Erledigtes, Termin-Ergebnisse, Entscheidungen), einarbeiten — aber der Abschluss muss in einem frisch geöffneten Fenster mit leerem Verlauf genauso gut funktionieren. Ist der Verlauf leer, deshalb NICHT nachbohren („was hast du heute gemacht?") — der Vorschlag entsteht aus den Files, Lücken schließt der User in der Korrektur-Runde.

---

## Phase 2 — Vorschlag zeigen (nicht abfragen)

EIN fertiger Vorschlag, den der User nur noch korrigiert:

```
Das war dein Tag — passt das so?

📅 [Wochentag] [DD.MM.]

🎯 Tagesplan: [N] von [M] — [was offen blieb, in einem Halbsatz]
   (Section weglassen, wenn kein Plan gesetzt war)

Was passiert ist:
- [Projekt A]: [Aktivität, abgeleitet aus Kalender/Session/Tasks]
- [Meeting-Titel, HH:MM] — [Outcome, falls im Chat erwähnt; sonst: "Outcome?"]

Bleibt liegen: [offene Plan-Items / überfällige Tasks, kurz]
[Falls Inbox-Einträge unbehandelt: "N Mail-Funde warten noch in der Inbox."]

Blocker, Entscheidungen oder Erkenntnisse, die noch fehlen?
```

**Regeln:**
- Nur aktive Projekte aus PROJECTS.md vorschlagen
- Nichts erfinden: Aktivitäten nur aus Kalender, Session oder Files. Wo ein Meeting-Outcome fehlt, danach fragen statt zu raten.
- Leerer Kalender + keine Session-Spuren → trotzdem Vorschlag aus dem Tagesplan; wenn auch der leer ist: "Ruhiger Tag? Dann halte ich nur fest, was offen bleibt."

---

## Phase 3 — Nur Delta abholen

Der User korrigiert (streichen, ergänzen, Outcome nachtragen). Kein Frage-Katalog — was im Vorschlag stimmt, bleibt unkommentiert.

---

## Phase 4 — Schreiben

**A) `context/JOURNAL.md`** — Tages-Recap unter dem heutigen Datum (append, nie überschreiben; existiert der Eintrag schon, ergänzen):

```markdown
## [YYYY-MM-DD]
- [Projekt]: [was passiert ist, 1 Satz]
- [Meeting]: [Outcome]
- Entscheidung: [was, warum] — nur wenn genannt
- Erkenntnis: [was] — nur wenn genannt
```

**Ton:** konkrete Halbsätze mit Namen und Zahlen (`Schwellenwert auf 250k bestätigt (Nicole)`), keine Nominal-Prosa (`Besprechung von Parametern`). Wer das in drei Wochen liest, muss ohne dich verstehen, was gemeint war.

**B) `context/PROJECTS.md`** — nur bei Status-relevanten Updates. **Vorher sichern** (CLAUDE.md Safeguard 3): `mkdir -p context/.backup` + die drei Kern-Files (`PROJECTS.md`, `STATUS.md`, `JOURNAL.md`) dorthin kopieren, je eine Generation genügt. Dann: Status-Zeile (ersetzen), Blocker, Timeline, "Letzte Aktualisierung".

**C) `context/STATUS.md`** — hier lebt die Arbeit: erledigte Tasks nach "Frisch erledigt" (max 6, ältere raus), Tagesplan-Items abhaken, neue Tasks aus dem Gespräch anlegen. Dashboard mitziehen (Regel 1).

**D) Git-Sicherung (still, nie blockierend)** — Versionierung ohne Git-Wissen: der Tagesstand wandert ins eigene private Repo, „nichts geht verloren" wird damit beweisbar, und zeitgesteuerte Läufe in der Cloud sehen nur, was gepusht ist.

```bash
git add -A && git commit -m "eod YYYY-MM-DD" && git push
```

- Nur wenn der Workspace ein Git-Repo ist (sonst still überspringen, kein Wort dazu).
- Commit klappt, Push scheitert (offline, Auth abgelaufen): kein Drama — der Commit ist die Sicherung, der Push holt beim nächsten Mal auf. EINMAL pro Session ruhig sagen: _„Gesichert ist alles — nur die Kopie auf GitHub hinkt gerade hinterher, das holt sich beim nächsten Mal auf."_ Bei dauerhaft scheiterndem Push (mehrere Tage): einmal `gh auth login` vorschlagen (steht in SETUP.md Schritt 0).
- Nie `--force`, nie Konflikte selbst auflösen: meldet der Push einen Konflikt (zweiter Rechner?), sagen was los ist und den Ansprechpartner aus `VERSION.md` empfehlen.
- Der Commit umfasst den ganzen Workspace — `.gitignore` hält Laufzeit-Artefakte (Cache, Ledger, today.html, Backups) ohnehin draußen.

---

## Phase 5 — Bestätigung + Vorblick

```
✓ Festgehalten: [1 Halbsatz was ins Journal ging]
✓ PROJECTS.md: [was geupdated | "keine Änderungen"]

Morgen [Wochentag]: [N Termine, erster um HH:MM] · [was vom heutigen Plan mitkommt]
```

Kein Ranking im Vorblick (Regel 10) — beschreiben, was ansteht, nicht bewerten was wichtig ist.

---

## Spezialfälle

**Nachholung:** User sagt "für gestern" → klar kommunizieren, für welchen Tag geschrieben wird. Ältere Einträge nur nach Bestätigung ändern.

**Freitag:** nach Phase 5 anbieten, die Woche kurz zusammenzufassen (aus den JOURNAL-Einträgen der Woche) — nur wenn der User will, kein Ritual.

---

## Output-Stil

- Per Du, knapp, freundlich
- Keine Em-Dashes
- Bestätigung mit Häkchen (✓)
- Kein Fluff, kein "great job!"
