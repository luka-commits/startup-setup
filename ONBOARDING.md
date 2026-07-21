# ONBOARDING

Wie man mit diesem Workspace arbeitet. `CLAUDE.md` sind die Instruktionen für Claude Code selbst — dieses Dokument ist für den Menschen: was ist das hier, wie sieht der Alltag aus, wo fange ich an.

## Was ist das

Ein persönliches "Operating System" für deine Arbeit, gebaut auf Claude Code: Slash-Command-Skills für wiederkehrende Abläufe (Morning-Briefing, End-of-Day), ein Live-Dashboard, und eine Struktur aus Markdown-Files, die als Gedächtnis zwischen Sessions dient. Schreib beim ersten Mal einfach „hallo": Claude erkennt, dass der Workspace noch niemandem gehört, und führt dich durchs Setup (Fragen zu dir + deinen laufenden Projekten, optional Dokumente einsortieren und deinen Mail-Stil ableiten). Dieses Dokument setzt voraus, dass alles installiert ist. Ist es das noch nicht, geh zuerst durch [`SETUP.md`](SETUP.md).

## Wie der Workspace organisiert ist

```
dein-workspace/
├── context/                 Das Gedächtnis. Wird bei jedem Lauf gelesen.
│   ├── config.yaml          Deine Werte: Name, Standort, Office-Tage, Mail-Einstellungen
│   ├── PROJECTS.md          WIE die Projekte stehen: Zweck, Status, Blocker, Timeline
│   ├── STATUS.md            WAS zu tun ist: Tasks, Tagesplan, Inbox, frisch erledigt
│   ├── JOURNAL.md           WAS WAR: Verlauf, Entscheidungen, Erkenntnisse
│   ├── PERSONAL.md          Wer du bist: Rolle, Fachbereich, wichtige Menschen
│   └── EMAIL_STYLE.md       Dein Schreibstil, aus deinen eigenen Mails abgeleitet
│
├── projects/<case>/         Ein Ordner pro Case oder Workstream
│   ├── README.md            Zweck, Stakeholder, Entscheidungs-Log
│   ├── inputs/              Was du BEKOMMST: Decks, Excel, Transkripte (unverändert)
│   ├── work/                Werkbank: woran du gerade ARBEITEST
│   ├── outputs/             Was RAUSGEGANGEN ist (datiert)
│   └── _archive/            Ersetzte Arbeitsstände (räumt Claude selbst weg)
│
├── inbox/                   Drop-Zone: hier legst du ab, was eingelesen werden soll
├── _tmp/                    Flüchtig: kurze Skripte von Claude (Entwürfe, Dashboard) — überschreibt sich selbst
└── reference/               Nachschlagewerke: Connectors, Werkzeuge, Triage-Regeln
```

Dasselbe als visuelle Karte mit Farbcode (was dir gehört vs. was bei Updates frisch kommt): [`ORDNERKARTE.html`](ORDNERKARTE.html) — Doppelklick, öffnet im Browser. Was in `reference/` steckt: [`mcp.md`](reference/mcp.md) (Mail- und Kalender-Connectors, inkl. IMAP-Ersatzweg), [`tools.md`](reference/tools.md) (firecrawl und playwright), [`mail-triage-rules.md`](reference/mail-triage-rules.md) (wie `/morning` sortiert), [`plugins.md`](reference/plugins.md) (optionale Erweiterungen, hier ausdrücklich erlaubt), [`routinen.md`](reference/routinen.md) (vorgebaute Automatik-Läufe), [`uebungen.md`](reference/uebungen.md) (die erste Woche zum Üben) und [`links.md`](reference/links.md) (alle Links an einem Ort).

### Warum drei Dateien für Projekte, und nicht eine

`PROJECTS.md` sagt, **wie es steht**. `STATUS.md` sagt, **was zu tun ist**. `JOURNAL.md` sagt, **was war**. Das wirkt wie eine Trennung zu viel, bis man die Alternative kennt: Steht dieselbe Aufgabe an zwei Orten, muss jemand sie synchron halten. Am Anfang tut das jemand. Nach drei Wochen tut es niemand mehr, und ab da weiß man nicht mehr, welche Version stimmt.

Deshalb gilt hart: **Tasks leben ausschließlich in `STATUS.md`.** Nirgends sonst. Was dort nicht steht, existiert für das System nicht.

**Was du davon hast:** Du kannst jeder Datei einzeln vertrauen. Die Task-Liste ist vollständig, weil sie die einzige ist.

### Die Ordner eines Projekts — und warum du dich um sie nicht kümmerst

Vier Ordner, vier klare Jobs: `inputs/` ist, was du **bekommen** hast, und bleibt unverändert liegen — damit du in vier Wochen noch weißt, was Klientenstand war und was deine Interpretation. `work/` ist die **Werkbank**: woran du (oder Claude für dich) gerade arbeitest. `outputs/` ist, was **rausgegangen** ist, datiert — die Antwort auf „welchen Stand hat der Klient gesehen?" in einem Blick. `_archive/` fängt ersetzte Arbeitsstände auf.

Du legst darin nichts selbst ab und räumst nicht auf: Claude schreibt neue Arbeit in die Werkbank (und aktualisiert lieber ein bestehendes Dokument, als ein zweites mit demselben Inhalt anzulegen), verschiebt datiert nach `outputs/`, wenn du sagst, dass etwas rausgegangen ist, und räumt ersetzte Stände selbst nach `_archive/`.

**Was du davon hast:** Der Projekt-Ordner zeigt immer den aktuellen Stand und bleibt in sich vollständig — wer ihn aufmacht, hat den Case. Das macht auch das Archivieren am Ende erst sinnvoll, und die Übergabe an jemand anderen.

Die Unterordner entstehen beim ersten Inhalt. Leere Ordner legt niemand auf Vorrat an.

**Und wo lebt das Tägliche?** Aufgaben, Projekt-Stände und Tagebuch bleiben zentral in `context/` — sie beantworten Tages-Fragen („was liegt an?") und werden bei jedem Lauf gelesen. Das Projekt-README führt mit Entscheidungs-Log und Verlauf sein eigenes Gedächtnis. So hat jede Information genau ein Zuhause.

### Warum Claude nicht priorisiert

Es kennt deine echte Business-Priorität nicht. Ein Rang, den es trotzdem behauptet, ist geraten, und geraten sieht aus wie gewusst. Deshalb bekommst du alles Offene, getaggt und filterbar. Sortieren tust du.

## Wie das zusammenspielt

Du legst nichts selbst ab und pflegst keine Ordner. Du sagst, was ist, und die Sachen wandern dorthin, wo sie hingehören. Drei typische Wege:

**Ein Dokument kommt rein.** Du legst das Deck in `inbox/` und sagst „lies das ein".

| Was daraus wird | Wohin |
|---|---|
| Die To-dos daraus | `context/STATUS.md`, unter dem Projekt |
| Der neue Projektstand | `context/PROJECTS.md` |
| Die Entscheidungen | `context/JOURNAL.md` + Entscheidungs-Log des Projekts |
| Das Dokument selbst | `projects/<case>/inputs/`, unverändert |

Der letzte Punkt ist der, der später zählt: Verweist ein Transkript nächste Woche auf „das Deck von neulich", findet Claude es dort wieder. Landet Projekt-Material im allgemeinen Ablagefach, sucht es dort vergeblich und versteht nur die Hälfte.

**Eine Mail braucht dich.** `/morning` liest dein Postfach und legt jeden Fund, der eine Entscheidung von dir braucht, als **Inbox-Zeile** in `STATUS.md`. Nicht als Task: Erst wenn du „übernimm 1 ins Projekt X" sagst, wird eine Task daraus. Der Grund ist Absicht. Bereits gelesene Mails werden nicht erneut gescannt, also würde ein Fund, den du heute liegen lässt, morgen spurlos verschwinden. In der Inbox bleibt er stehen, bis du entscheidest.

**Du sagst etwas im Chat.** „Kapitel 3 ist fertig", „warte auf die IT", „der Termin lief gut". Kein Befehl, keine Datei. Claude routet es selbst: Status zu `PROJECTS.md`, Aufgaben zu `STATUS.md`, Ereignisse zu `JOURNAL.md`, und das Dashboard zieht nach. Und was sich noch nicht einordnen lässt — der lose Gedanke, die Idee, das „irgendwann mal" — landet in der Inbox, bis du sagst, was draus werden soll. Das ist der eigentliche Betriebsmodus. Die Befehle sind nur Abkürzungen für die Fälle, in denen mehr passieren soll.

## Täglicher/wöchentlicher Loop

1. **Morgens:** `/morning` — Kalender + Mail + offene Tasks als Briefing im Chat + volles Dashboard (`context/today.html`, 6 Tabs: Heute / Kalender / Projekte & Notizen / Workspace / Start Here / Hilfe — der Workspace-Tab zeigt jederzeit, was verbunden ist, was noch offen ist und was zuletzt lief). Neue Mail-Funde landen in der Inbox-Zone (übernehmen oder verwerfen — nichts verschwindet still). Am Ende optional: Tag kurz durchplanen — dein Plan landet mit Fortschrittsbalken im Dashboard. Bereits triagierte Mails werden nicht doppelt gelesen (Markierung im Postfach + internes Ledger).
2. **Tagsüber:** normal mit Claude arbeiten. Status-Änderungen, Blocker, Entscheidungen einfach im Chat erwähnen — der Workspace aktualisiert sich selbst.
3. **Abends:** `/eod` — kurzer Check-in: Plan gegen Realität, was liegen bleibt, was entschieden wurde.
4. **Der Kalender-Tab zeigt bewusst nur heute:** deine Termine als Zeitachse mit den freien Blöcken dazwischen, und bei Terminen mit Projekt-Bezug ein aufklappbares Briefing. Was in den nächsten Tagen ansteht, fragst du im Chat („was steht diese Woche an?").

## Kernregeln

- **Keine Top-3/Priorisierung durch Claude.** Du siehst die vollständige, getaggte Sicht auf alles Offene — du filterst und priorisierst.
- **Immer Bestätigung vor Mail-Entwürfen** — nie automatisches Senden.
- **Nie Mail/Kalender ohne explizite Erlaubnis** (pro Session neu bestätigt).
- **Keine sensiblen Daten** (HR, Gehalt, Performance) im Dashboard oder Chat-Output.
- **Tokengünstig by design:** Routine-Arbeit (Mail-Fetch, Klassifikation) läuft auf einem günstigen Modell; Urteil und Texte beim Hauptmodell.

## Realität: das hier verzeiht Lücken

Du wirst `/morning` vergessen. Du wirst zwei Wochen beim Klienten sein und hier nicht reinschauen. **Das ist eingeplant, nicht schlimm:**

- Das System **tut nie so, als wäre es aktuell.** Das Dashboard zeigt sein echtes Alter, und nach ein paar Tagen sagt Claude dir beim Einstieg einmal, dass dein Stand alt ist — einmal, ohne Mahnung.
- **Der Wiedereinstieg kostet EINE Nachricht:** Sag „guten Morgen", du wirst gefragt, was in der Zwischenzeit passiert ist — zwei, drei Stichpunkte genügen, den Rest räumt Claude auf (auch die Aufgaben, die längst erledigt sind).
- **Es gibt keinen Verfall.** Wer im Chat arbeitet, hält das System nebenbei aktuell, auch ganz ohne Befehle.

## Wünsche äußern kostet einen Satz

Fehlt dir etwas („kann das auch Angebote nachverfolgen?", „ich hätte gern einen Befehl für den Wochenbericht") — sag es einfach im Chat. Was sich sofort bauen lässt, wird gebaut. Was das Paket selbst weiterentwickeln müsste, verpackt Claude auf Wunsch als fertige Mail an die Person, von der du das System hast — du liest drüber und klickst Senden. So fließt dein Bedarf zurück, ohne dass du irgendwo ein Ticket schreiben musst.

## Wenn etwas hakt

- **Einfach im Chat sagen, was komisch ist** ("das Dashboard zeigt alte Daten", "die Task ist doppelt") — das System repariert abgeleitete Dateien selbst und sichert vor jeder Änderung den letzten Projektstand.
- **Wenn eine Aussage falsch ist** ("das hab ich längst beantwortet", "das gehört nicht zu dem Projekt") — sag es. Es wird korrigiert, ohne Rechtfertigung; wiederholt sich derselbe Fehler, wird die Ursache abgestellt, nicht nur der Einzelfall. Mail-Einschätzungen sind Einschätzungen: Claude sieht dein Postfach, nicht dein Telefonat.
- **"Mach das rückgängig"** funktioniert für die letzte Änderung am Projektstand.
- **Kein Briefing, obwohl du "guten Morgen" gesagt hast?** Wahrscheinlich läuft Claude Code im falschen Ordner — siehe [`SETUP.md`](SETUP.md), Schritt 2.
- Nichts hier kann versehentlich Mails senden oder Termine ändern — Entwürfe musst du immer selbst in deinem Mailprogramm abschicken.

## Quick-Start (nach dem Setup)

1. `/morning` laufen lassen (Erlaubnis für Mail/Kalender wird einmal pro Session abgefragt). Der erste Lauf dauert ein paar Minuten (Postfach-Erstaufnahme), danach geht's schneller.
2. Wenn im Briefing Kalender-Rauschen auftaucht (private Blöcke, Gym, …): den Betreff in `config.yaml → calendar.noise_subjects` eintragen — oder einfach im Chat sagen, dass der Termin nicht ins Briefing gehört.
3. **Diktieren schlägt Tippen.** Das System lebt davon, dass du ihm Dinge erzählst — und ein Status-Update ist schneller gesprochen als getippt. Windows: `Win + H` startet das eingebaute Diktat in jedem Textfeld, auch im Claude-Fenster. Mac: Diktat einmal unter Systemeinstellungen → Tastatur aktivieren, danach genügt zweimal `Ctrl`.
4. Ab hier trägt sich das System größtenteils selbst — je konsequenter du Status-Änderungen im Chat erwähnst (oder diktierst), desto besser die Briefings.

**Eine Sache noch:** [`WAS-DIESES-SYSTEM-TUT.md`](WAS-DIESES-SYSTEM-TUT.md) — eine Seite dazu, was gelesen wird und was nie passiert. Auch die Antwort, wenn dich jemand fragt, ob du das nutzen darfst.
