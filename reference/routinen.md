# Vorgebaute Routinen

Routinen sind Aufgaben, die zeitgesteuert in Anthropics Cloud laufen, ohne dass jemand davor sitzt — wie sie technisch funktionieren und was dabei mit den Daten passiert, steht in `SETUP.md` § „Das Briefing automatisch laufen lassen". Diese Datei ist der Katalog: fertige Routinen zum Einschalten, jeweils ein Satz zum Kopieren.

**Die eine Voraussetzung für alle:** Eine Routine arbeitet mit einem frischen Klon des Repos — sie sieht nur, was gepusht ist. Der Tagesabschluss (`/eod`) pusht automatisch; wer `/eod` regelmäßig macht, muss hier nichts weiter tun. Ergebnisse einer Routine landen im Repo und sind nach einem `git pull` da (oder unterwegs in der GitHub-App lesbar).

**Was Routinen nie tun:** Mails senden, Termine anlegen, etwas löschen. Dieselben Regeln wie lokal.

---

## 1. Morgen-Briefing (der Klassiker)

Das Briefing ist fertig, bevor du den Rechner aufklappst. Die Routine macht dasselbe wie „guten Morgen" im Chat: Kalender, Mail-Triage, Aufgaben, Dashboard — und pusht das Ergebnis.

Einschalten (im Chat, in diesem Ordner):

> `/schedule jeden Werktag um 7:30: Morgen-Briefing erstellen (/morning voll durchlaufen), committen und pushen`

Beim Anlegen fragt Claude nach Repo und Connectors — Mail/Kalender müssen an die Routine gehängt werden, sonst läuft sie auf der „ohne Postfach"-Stufe. Ergebnis: `inbox/briefing-JJJJ-MM-TT.md` + frisches Dashboard im Repo.

## 2. Wochenrückblick (Freitagnachmittag)

Was diese Woche passiert ist, was entschieden wurde, was liegen geblieben ist — aus Journal, Projektständen und erledigten Aufgaben, als eine lesbare Seite. Gut als Grundlage für den eigenen Status-Bericht nach oben.

> `/schedule jeden Freitag um 16:00: Wochenrückblick aus JOURNAL.md und PROJECTS.md der letzten 7 Tage schreiben nach inbox/wochenrueckblick-JJJJ-MM-TT.md — nur Belegtes, keine Bewertung, keine Rangfolge — committen und pushen`

## 3. Montags-Vorausblick (Sonntagabend)

Der Blick auf die kommende Woche, bevor sie anfängt: anstehende Fälligkeiten, wartende Antworten, stille Projekte. Bewusst ohne Mail-Zugriff — reine Workspace-Sicht, damit sonntags niemand dein Postfach anfasst.

> `/schedule jeden Sonntag um 18:00: Vorausblick auf die kommende Woche aus STATUS.md (Fälligkeiten, wartet-auf-Einträge) und PROJECTS.md (Timelines) schreiben nach inbox/vorausblick-JJJJ-MM-TT.md, ohne Mail- und Kalender-Zugriff — committen und pushen`

---

**Verwalten:** `/schedule list` zeigt alles, `/schedule run` testet sofort, Übersicht im Browser unter [claude.ai/code/routines](https://claude.ai/code/routines). Eine Routine, die nervt, wird gelöscht statt ertragen — sag es einfach im Chat.

**Eigene Routine bauen:** Beschreib im Chat, was regelmäßig passieren soll und wann — Claude formuliert den `/schedule`-Satz mit. Die Regeln aus `system-erweitern.md` § 1 gelten auch hier: Ziel sagen, Quelle sagen, Ausnahme benennen.
