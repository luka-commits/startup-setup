# QA-Checkliste für /morning (nur bei Änderungen am Skill lesen, nicht im Alltagslauf)

## Test Drive

Try these prompts to validate:

1. `/morning` — default, today
2. `/morning 2026-04-27` — specific future date (light test, mail/journal data may not exist)
3. `Guten Morgen` — should trigger DE output
4. `Brief me` — should trigger EN output

**Sanity checks after a real run:**
- HANDLUNGSBEDARF only contains direct asks from real people (Compliance/IT mails are in TICKETS)
- WARTET vs FOLLOW-UP split: WARTET ≤3d, FOLLOW-UP >3d
- Reminder events (no attendees, user-organized) appear in 📌 Reminder section, not in Kalender
- No same thread appears in two different sections
- Section caps respected
- Every Handlungsbedarf/Follow-up item carries a Draft-Status tier (🟢/🟡/🔴)
- At least one artificial 🟡 test case asks its question inline instead of guessing or silently skipping
- Declining Step 5b's draft offer costs nothing — briefing, STATUS.md, JOURNAL.md, dashboard all already happened
- Sensitive-flagged mails never appear as draft candidates in Step 5b
- Step 3a's Haiku sub-agent actually fetched full body text before classifying anything as resolved/closed — spot-check one thread against the real mailbox
- If the Haiku sub-agent call fails, Step 3a falls back gracefully (noted in audit footer), briefing still completes
- Re-run on the same day: already-triaged mails are skipped (audit footer shows the count), but a NEW reply in a previously triaged thread still shows up in the briefing
- After the run, triaged mails carry the processed-category in the mailbox (if `mail.tag_processed`), and `.triage_ledger.json` has one entry per triaged thread
- Ein gestern NICHT behandelter Mail-Fund steht heute noch als Inbox-Zeile in der Task-Liste (Persistenz via STATUS.md — der Ledger-Skip darf ihn nicht verschwinden lassen)
- "übernimm 1 ins Projekt X" macht aus dem Inbox-Eintrag eine Task unter Projekt X in STATUS.md; beim nächsten Render steht sie in der Task-Liste, der Inbox-Marker ist weg
- Tagesplan gesetzt → grüne Plan-Punkte an den Tasks + Fortschritts-Zeile; "X ist erledigt" im Chat → Re-Render, Balken rückt vor
- Das Dashboard hat KEINE Schreib-Interaktion (kein Abhaken, keine Buttons) — nur Tabs/Filter/Sortierung; alles Operative läuft im Chat
- Kalender-Tab: Überfällig-Zeile oben, fällige Tasks am richtigen Wochentag, "Später fällig" unten — alles aus data-due, ohne extra Fragmente
- Briefing-Block oben erzählt den Tag konversational und lässt sich ein-/ausklappen (Zustand überlebt Auto-Reloads)

