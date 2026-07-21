---
name: setup
description: "Einmalige Ersteinrichtung eines frisch kopierten Workspace. Läuft AUTOMATISCH beim ersten Start (CLAUDE.md-Regel erkennt die unausgefüllte context/config.yaml) — oder manuell via /setup, 'richte das für mich ein', 'ersteinrichtung', 'neuer nutzer'. Fragt in einem Rutsch: Name, E-Mail, Rolle, Standort/Office-Tage und ALLE laufenden Projekte. Schreibt die Antworten in context/config.yaml (die einzige Config-Quelle — Skill-Dateien werden nie editiert), füllt die leeren context/-Vorlagen, legt pro Projekt einen Ordner an, sortiert mitgebrachte Dokumente ein und leitet auf Wunsch den persönlichen Mail-Stil aus den eigenen Sent Items ab. Archiviert sich danach selbst. NICHT für den Alltag — läuft einmal."
---

# Setup Skill — One-Time Workspace Personalization

## Core Principle

**Detect state, ask once, write ONE config file, fill templates, archive itself.**

**Und: der User darf nie ins Leere warten.** Nach seinen Antworten arbeitest du mehrere Minuten am Stück. Vor jedem längeren Block eine kurze Zeile in den Chat — `⚙️ Ich lege deine Projekt-Ordner an …`, `📄 Ich sortiere deine Dokumente ein …`, `✉️ Ich schaue mir deine gesendeten Mails an …`. Eine Zeile, kein Statusbericht.

Personal values live only in `context/config.yaml` — skills read them from there at runtime. This skill never edits skill files.

## Step 0: Detect Package State

Read `context/config.yaml`.

- **Contains `[DEIN NAME]`** → fresh, unpersonalized package. Proceed straight to Step 1 — nothing to lose here.
- **A real name is already filled in** → **ein früherer Lauf ist abgebrochen.** Kein "schon eingerichtet": Step 8 archiviert diesen Skill weg, wenn er fertig wird — dass du hier überhaupt läufst, heißt also, dass der letzte Lauf zwischen Step 3 (schreibt den Namen) und Step 8 abgerissen ist. Sag das ehrlich und mach dort weiter, wo es fehlt, statt alles zu überschreiben: prüfe, was noch Platzhalter trägt (`context/PROJECTS.md` → `[Erstes Projekt`, `context/STATUS.md` → `[YYYY-MM-DD]`, Projekt-Ordner in `projects/`, `context/EMAIL_STYLE.md` vorhanden?) und hol nur das nach. Muster: *"Dein Setup ist beim letzten Mal nicht ganz durchgelaufen — Name und Standort stehen, aber deine Projekte fehlen noch. Ich hol das nach, dauert 5 Minuten."* Nur wenn der User ausdrücklich neu anfangen will, alles überschreiben.
- **File missing entirely** → die Kopie ist unvollständig, nicht rekonstruierbar: `config.yaml` ist die einzige Stelle, die das erwartete Schema kennt, und `/morning` liest daraus exakte Schlüssel. Nichts erfinden, sondern sagen: der Ordner muss frisch kopiert werden (Ansprechpartner in `VERSION.md`).

## Step 1: Ask Onboarding Questions

Greet briefly and **sag ehrlich, was jetzt kommt** — der User hat gerade "hallo" getippt und weiß nicht, worauf er sich einlässt. Drei Sätze, nicht mehr, nach diesem Muster:

> *"Das hier wird dein persönlicher Arbeits-Ordner: Morgen-Briefing, Projekt-Übersicht, Mail-Entwürfe in deinem Stil. Ich richte ihn jetzt für dich ein — ich stelle dir gleich vier Fragen auf einmal, danach lege ich die Ordner an. Rechne mit 10 bis 20 Minuten, je nachdem wie viele Projekte und Dokumente du mitbringst."*

Nie "2 Minuten" versprechen. Wer mit falscher Erwartung startet, bricht in Minute vier ab. Dann ask these together in ONE message — like a short intake form, not one-by-one back-and-forth:

1. **Name + geschäftliche E-Mail-Adresse**
2. **Position/Rolle + Bereich** (z.B. "Consultant, PIPE" oder "Project Leader, TMT")
3. **Standort:** Home City, Office-Kürzel (z.B. "MUN", "FRA", "BER"), und an welchen Wochentagen sie typischerweise ins Büro gehen (Rest = Remote-Default)
4. **Laufende Projekte/Workstreams — ALLE:** pro Projekt Name, 1-Satz-Zweck, wichtigste Stakeholder, aktueller Stand/nächster Meilenstein (soweit bekannt). Das ist die wichtigste Frage des Setups — das System ist nur so gut wie dieser Anfangszustand. Stichpunkte reichen, Details kommen in Schritt 6 aus den Dokumenten.

Don't over-explain each question.

## Step 2: Compute the Workspace Root

Derive the absolute path from the actual current working directory Claude Code is running in — **do not ask the user to type this**. (This package may have been moved/renamed after being received — compute fresh, never assume from any file's existing content.)

## Step 2.5: Systemcheck (still, während der User die Fragen beantwortet)

Vier Prüfungen. **Ergebnis NICHT einzeln melden** — es fließt in EINE Zeile im Abschluss (Step 8). Der User soll nicht Zuschauer eines Selbsttests sein.

| Prüfen | Wie | Wenn's fehlt |
|---|---|---|
| **Skills da?** | existiert `.claude/skills/morning/SKILL.md`? | **Kritisch.** Der `.claude`-Ordner ist versteckt und geht beim Kopieren/Zippen gern verloren. Sag es klar: _„Beim Kopieren ist ein versteckter Teil des Ordners verlorengegangen — ohne den funktionieren die Befehle nicht. Hol dir bitte eine frische Kopie (siehe VERSION.md) und kopiere sie als Ganzes, nicht die einzelnen Dateien darin."_ Setup danach abbrechen — ohne Skills ist alles Weitere sinnlos. |
| **Welches OS?** | `uname -s` → `Darwin` = mac, `MINGW*/MSYS*` = windows | Nicht raten. Steuerung für Draft-Mechanik (PowerShell vs. AppleScript) und Dashboard-Öffnen — in Step 3 als `os:` festhalten. |
| **Mail-/Kalender-Connector?** | Zuerst ermitteln, was überhaupt verbunden ist: breite `ToolSearch query:mail` und `ToolSearch query:calendar`. Bei Microsoft 365 kommen `mcp__claude_ai_Microsoft_365__outlook_email_search` und `mcp__claude_ai_Microsoft_365__outlook_calendar_search` zurück; bei einem anderen Anbieter die tatsächlich zurückgegebenen Tool-Namen übernehmen, nie einen Namen raten. | Kein Abbruch. **Findet die Suche nichts, EINMAL fragen: „Arbeitet ihr mit Microsoft 365 (Outlook) oder mit Google Workspace?“** (dritte Option: etwas anderes). Die Antwort für Step 8 merken, damit das Hilfsangebot dort den richtigen Connector beim Namen nennt statt allgemein zu bleiben. Nicht weiter nachbohren, wenn der User es nicht weiß: dann bleibt es beim allgemeinen Weg. Merken für Step 8: der Mail-Teil fehlt, der Rest läuft. |
| **Script-Laufzeit?** | `node --version` (Default — kommt mit Claude Code mit), dann `uv run python -c "print(1)"`, `python3`, `python` | Kein Abbruch. Die funktionierende Variante in Step 3 als `script_command:` festhalten. Geht keine: Dashboard-Rendering fällt aus, Briefing im Chat läuft. |
| **Entwurfs-Weg?** | `ToolSearch query:draft` — gibt der verbundene Connector ein Draft-Tool zurück? (keins gefunden → `ToolSearch query:create` noch probieren) | **Ja → `mcp`** (plattform- und anbieterunabhängig, bester Weg). **Nein → OS-Default:** Windows `com` (setzt klassisches Outlook lokal voraus), Mac `mailto` (braucht keine Rechte, kein MDM-Risiko, funktioniert mit jedem Mailprogramm). In Step 3 als `draft_method:` festhalten. Keine Test-Entwürfe anlegen — nichts darf beim Setup im Mailprogramm aufpoppen. **Nur das DRAFT-Tool zählt:** bietet der Connector zusätzlich ein Send-Tool, wird das NICHT genutzt und NICHT erwähnt — gesendet wird hier nie. Hinweis für Step 8: der erste Entwurf per MCP fragt einmal um Erlaubnis — einmal „immer erlauben" klicken, dann ist Ruhe. |
| **Weitere MCPs verbunden?** | Breite `ToolSearch`-Suchen (z.B. `query:people`, `query:transcript`, `query:search`) — was antwortet außer dem Mail-Connector noch? | Kein Abbruch, keine Pflicht. Für Step 8 merken: EINE Zeile _„Zusätzlich verbunden: [Namen] — die kann ich auch nutzen, sag einfach, was du brauchst."_ Nichts gefunden → nicht erwähnen. |
| **Sync-Duplikate?** | Dateien mit ` 2.` im Namen (`STATUS 2.md`) — OneDrive-Konfliktkopien | Merken für Step 8: _„OneDrive hat beim Synchronisieren Doppel angelegt ([Namen]) — ich lasse sie liegen, aber lösch sie im Explorer, sonst lese ich irgendwann die falsche."_ Nie selbst löschen (Safeguard 2). |

## Step 3: Write `context/config.yaml`

Fill every section of `context/config.yaml` from Step 1 + Step 2:

**Jede Section der Vorlage bleibt erhalten** — nur Werte einsetzen, nie Blöcke löschen (die Skills lesen alle):

- `user:` name, first_name (aus dem Namen), email, role
- `location:` home_city, office_abbreviation, office_room_patterns (das Kürzel plus "Office"), other_office_patterns (nur wenn genannt), office_days, timezone (Default Europe/Berlin)
- `calendar:` `noise_subjects` bleibt leer (füllt sich, wenn dem User Kalender-Rauschen auffällt — im Step-8-Summary erwähnen)
- `mail:` unverändert lassen (`tag_processed: true`, `processed_categories: ["KI-Triagiert"]`) — nur anfassen, wenn der User das Kategorie-Tag im Postfach ablehnt. Auf Mac `tag_processed` gern auf `true` lassen — `/morning` überspringt den Tag dort von selbst.
- `company_domains:` **aus der E-Mail-Adresse von Step 1 ableiten** — Domain hinter dem `@` eintragen, z.B. `anna@musterfirma.de` → `["musterfirma.de"]`. NIE den Platzhalter stehen lassen: die intern/extern-Priorisierung im Briefing hängt daran. Nur bei privaten Anbietern (gmail.com, web.de, outlook.com, gmx…) stattdessen EINE kurze Frage: _„Habt ihr eine Firmen-Mail-Domain? Dann sortiere ich Mails von Kollegen und Externen unterschiedlich ein."_ — keine Antwort/keine Domain → `[]` (leer ist ehrlich, Platzhalter ist ein stiller Fehler).
- `workspace_root:` Step 2's berechneter Pfad
- `os:` Ergebnis aus Step 2.5 (`windows` oder `mac`)
- `script_command:` Ergebnis aus Step 2.5 (`node`, `uv run python`, `python3` oder `python`) — `/morning` nutzt genau das für den Dashboard-Fill. Leer lassen, wenn keine Laufzeit gefunden wurde.
- `draft_method:` Ergebnis aus Step 2.5 (`mcp`, `com` oder `mailto`) — `/email` und `/morning` nutzen genau das für Mail-Entwürfe.
- `inventory:` **hier nur den Stand aus Step 2.5 festhalten, nicht raten.** Den Block füllen später die Steps 7.1 bis 7.4, wenn die Ausstattung wirklich eingerichtet wird. Jetzt schon eintragen, was Step 2.5 tatsächlich gesehen hat:
  - `inventory.connectors:` je gefundenem Connector ein Eintrag mit `name`, `purpose` in Klartext, `slot:` und `status: true`. Ein System, das der User nur genannt hat, das aber nicht antwortet, bekommt `status: false`. Step 7.2 ergänzt und korrigiert das.
  - `inventory.clis:` `firecrawl` und `playwright` mit dem Ergebnis ihres Versionsbefehls. Step 7.1 installiert nach und aktualisiert.
  - `inventory.accounts:` leer lassen, das macht Step 7.3.
  - `inventory.repos:` das eigene Workspace-Repo trägt Step 8 ein, Projekt-Repos Step 7.4.
  - `inventory.plugins:` und `inventory.routines:` bleiben leer. Beides ist nichts, was das Setup einrichtet. Im Abschluss (Step 8) EINE kurze Frage: _„Hast du Claude-Code-Plugins installiert oder soll etwas zeitgesteuert laufen?"_ Was der User nicht nennt, bleibt leer. Der Leerfall im Dashboard erklärt selbst, wie man nachträgt.
- **Dauerhaft, nicht nur beim Setup:** kommt später etwas dazu (ein Connector, ein Plugin, ein Repo, eine Routine), gehört es sofort ins `inventory` in `context/config.yaml`, ohne dass der User darum bitten muss. Das ist derselbe Persistier-Auftrag wie bei „ab jetzt / immer" (Safeguard 10): einmal gesagt, dauerhaft verankert, in einer Zeile bestätigt.

Keine anderen Datei-Rewrites. Fehlt eine Antwort, Feld leer lassen — nie einen plausiblen Wert erfinden.

**Keine Script-Laufzeit gefunden (Step 2.5):** im Step-8-Summary EINEN Satz sagen: *"Für das Dashboard brauche ich eine kleine Laufzeit (Node.js) — ohne läuft alles andere, nur die Dashboard-Datei entsteht nicht. Sag Bescheid, dann richten wir das zusammen ein, dauert ein paar Minuten."* Keine ungefragte Installationsanleitung — aber nimmt der User das Angebot an, Schritt für Schritt durch die Installation führen und danach den Check wiederholen. Nie das Dashboard-HTML selbst schreiben (siehe CLAUDE.md).

## Step 4: Fill In the Blank Context Templates

These ship blank with placeholder tokens (`[DEIN NAME]`, `[YYYY-MM-DD]`):

- **`context/PERSONAL.md`** — Name, E-Mail, Position, **Fachbereich**, Standort from Step 1; leave the Stakeholder table empty (fills in as real projects/people show up).
- **`context/PROJECTS.md`** — ONE block per project from Step 1 #4 (Zweck/Status/Phase/Stakeholder/Timeline/Blocker — Lücken ehrlich als `[noch offen]`, nie erfinden). **Keine To-dos hier** — die gehören nach STATUS.md. "Letzte Aktualisierung" stempeln. **Schreibregeln (das Template zeigt das Beispiel):** kurze, konkrete Sätze in der Sprache des Users — Zweck = ein Satz, warum es das Projekt gibt, so wie man's einem Kollegen sagt („Der Klient vermutet Geld in der Preissetzung — wir prüfen, wo und wie viel"), nie Abstrakta ohne das konkrete Ding dahinter („Potenzialidentifikation"). Status = was zuletzt passiert ist + was als Nächstes ansteht. Diese Blöcke speisen später die Projekt-Karten im Dashboard — Formulardeutsch hier wird auch dort Formulardeutsch.
- **`context/STATUS.md`** — hier landen die ersten Tasks, aber **nicht ungefragt und nicht alle.** Zwei Schritte, kein Direktschreiben:
  1. **Selbst filtern, bevor du etwas zeigst.** Aus den Antworten kommt nur mit, was den Regel-4-Aufnahmefilter besteht (CLAUDE.md): nichts unter 15 Minuten, keine reinen Kenntnis-Brocken, keine Meilensteine/Fristen — **die gehören als `Timeline:` in den Projekt-Block in PROJECTS.md, nicht als Task** (ein Termin ist keine Arbeit). Übrig bleiben sollte: pro Projekt 1–3 echte, konkret anpackbare nächste Aktionen.
  2. **Vorschlag zeigen, erst nach OK schreiben** (dasselbe Prinzip wie /ingest — der User erlebt sonst am ersten Tag, dass das System Dinge an ihm vorbei ins System schreibt):

     > „Aus dem, was du mir erzählt hast, würde ich diese Aufgaben anlegen:
     > - **[Projekt]:** [Headline] — [ein Satz, warum die ansteht]
     > - …
     > Passt das so — was streichen, was fehlt?"

     Korrekturen einarbeiten, dann schreiben: Headline + eingerückte Kontext-Zeile + `#kategorie` (Format: STATUS.md-Kopf). **Die Kontext-Zeile ist Pflicht und muss ohne dich verständlich sein** — in zwei Wochen liest der User nur noch sie im Dashboard-Aufklapper; eine Task wie „Segmentierung finalisieren" ohne Warum ist dann wertlos.
  **Weniger ist hier mehr:** die Liste füllt sich ab morgen von selbst (Mail-Funde, Chat). Ein Setup, das mit 15 Tasks startet, bringt dem User bei, die Liste ab Tag eins zu ignorieren — genau das darf nicht passieren. **Ohne diesen Schritt (mit Vorschlag) zeigt das erste `/morning` null Tasks** — nach einem Setup, in dem der User alle Projekte genannt hat. Tagesplan/Inbox/Frisch erledigt bleiben leer (korrekt). „Letzte Aktualisierung" mit heutigem Datum stempeln — das ersetzt zugleich den `[YYYY-MM-DD]`-Marker, den Step 0 als „noch nicht befüllt"-Signal prüft.
- **`context/JOURNAL.md`** — heutiges Datum stempeln, ein Eintrag "Workspace eingerichtet" mit den angelegten Projekten.

## Step 5: Scaffold Their Projects

Create `projects/<slug>/README.md` from `projects/_template/README.md` for EVERY project from Step 1 #4, filled in with what's known so far.

## Step 6: Collect + File Existing Documents

Ask: *"Hast du Dokumente zu diesen Projekten, die ich einordnen soll — Projektpläne, Meeting-Notes, Decks, Org-Übersichten? Leg sie in den `inbox/`-Ordner (oder paste sie hier), ich sortiere sie ein."*

- For each provided document, run the **`/ingest`-flow** (that skill's preview + OK loop applies): extract decisions/actions/stakeholders/facts → update the matching project's PROJECTS.md block + `projects/<name>/README.md` → **die Ablage macht der `/ingest`-Flow nach seiner eigenen Regel-Tabelle** (Projekt-Material → `projects/<slug>/inputs/`, nur Heimatloses → `inbox/processed/`). **Hier kein eigenes Ziel vorschreiben** — was der User beim Setup mitbringt, ist fast immer Projekt-Material, und genau danach sucht `/ingest` später in `inputs/`.
- Reference material that isn't project-state (guides, standards, org charts) → `reference/` statt ingest, kurz benennen wo es liegt.
- Bulk-Extraktion großer Dokumente (Transkripte, lange PDFs) an einen **Haiku-Subagenten** delegieren (structured return), das Einordnungs-Urteil bleibt hier.
- Nothing provided → skip, remind in the summary that `/ingest` files documents any time.

After this step PROJECTS.md should reflect the person's real current workload — that's the bar for "Setup fertig".

## Step 7: Derive the Personal Mail Style (optional, needs permission)

**Vorab-Check:** Hat Step 2.5 KEINEN Mail-Connector gefunden → diesen Step komplett überspringen (die Frage wäre leer, der Fetch scheitert ohnehin) und stattdessen im Step-8-Summary notieren: Stil-Ableitung jederzeit nachholbar, sobald die Anbindung steht.

Ask ONE question: *"Soll ich einmal deine gesendeten Mails der letzten Monate durchgehen und deinen Schreibstil ableiten? Dann klingen alle Mail-Drafts (/email, /morning) von Anfang an nach dir. (Lesen only, nichts wird gesendet.)"*

- **Yes:**
  1. Delegate the fetch to a **Haiku sub-agent** (self-contained prompt — er muss als ERSTES das in Step 2.5 ermittelte Mail-Such-Tool per `ToolSearch` laden, Subagenten erben keine Tools; bei Microsoft 365 ist das `ToolSearch select:mcp__claude_ai_Microsoft_365__outlook_email_search`): damit suchen mit `sender = user.email`, last ~6 months, limit ~50; fetch full bodies; return 15–25 representative excerpts (openers, closers, sign-offs, one-liners), grouped DE/EN, skipping sensitive threads (HR/Gehalt/Performance).
  2. From the excerpts, derive (main model, judgment work): typical openers, Du/Sie, tone markers, typical length, closers + signature block, DE vs EN habits, filler phrases the user never uses.
  3. Write the profile to **`context/EMAIL_STYLE.md`** (structure mirrors `/email`'s Style-Reference section). `/email` and `/morning` read this file first and fall back to their built-in example templates only if it doesn't exist.
  4. Show the derived profile in 5–8 bullets and ask for a quick sanity-check ("passt das so?") — apply corrections directly to EMAIL_STYLE.md.
- **No / too little history:** skip silently; note in the Step 8 summary that drafts use the package's example style until the user asks Claude to derive their own (same flow as above, works any time).

## Steps 7.1–7.4: Die Ausstattung (der Teil, der sonst nie passiert)

Diese vier Schritte laufen **vor** dem Archivieren, weil es danach keinen geführten Weg mehr gibt. Sie sind der Unterschied zwischen „eingerichtet" und „einsatzfähig".

**Eine Regel gilt in allen vieren, ausnahmslos:** Befehle, die eine Eingabe oder eine Anmeldung verlangen (`gh auth login`, `firecrawl login`, jeder OAuth-Fluss), **bleiben in deiner Bash hängen** — es gibt dort kein Terminal, auf das sie antworten könnten. Solche Befehle NIE selbst ausführen. Stattdessen: dem User die Zeile zum Einfügen geben, sagen was danach passiert, und auf seine Rückmeldung warten. Alles Nicht-Interaktive (`npm install -g`, `command -v`, `git clone` bei öffentlichen Repos) machst du selbst.

**Ton in allen vieren:** je Schritt EINE Frage, Klartext, kein Fachwort ohne Erklärung. Ein „nein" ist immer eine vollständige Antwort und wird nie nachverhandelt. Was der User ablehnt, wird mit `status: false` ins `inventory` geschrieben — nicht weggelassen, sonst taucht es später nirgends als Möglichkeit auf.

### Step 7.1: Werkzeuge installieren

**Playwright zuerst**, bewusst: Sobald es da ist, kannst du in den folgenden Schritten Oberflächen selbst aufrufen, statt dem User aus dem Gedächtnis zu beschreiben, wo er klicken soll.

```bash
npm install -g playwright firecrawl-cli
playwright install chromium
```

Nicht-interaktiv, also machst du das selbst. Vorher `command -v npm` prüfen: fehlt npm, ist das kein Drama — sagen, dass die beiden Werkzeuge fehlen und was ohne sie trotzdem läuft (alles ausser Web-Recherche und Browser-Aufgaben), dann weiter. Scheitert die Installation an Rechten: **niemals `sudo` vorschlagen**, stattdessen den Ansprechpartner aus `VERSION.md` nennen.

Ergebnis je Werkzeug per `<name> --version` prüfen und nach `inventory.clis` schreiben. Die mitgelieferten Skills (`playwright-cli`, die `firecrawl-*`-Familie) sind bereits im Paket, es ist nichts nachzuladen — im Summary EINEN Satz dazu, dass sie da sind.

### Step 7.2: Die sechs Anschlüsse durchgehen

Verbindungen zu Mail, Kalender und Co. laufen über **Claude Cowork → Einstellungen → Connectors**. Das Paket bringt keine eigene Anbindung mit; Claude Code greift auf dieselbe Verbindung zu. Details und Kategorien: `reference/mcp.md`.

Geh die sechs Slots **einzeln** durch, aber verbinde **nur, was der User bejaht**. Nicht auf Vorrat (das widerspräche `reference/mcp.md`), aber auch keinen Slot verschweigen — sonst bleiben CRM und Chat für immer leer, weil sie nie zur Sprache kamen.

| Slot | Wie du damit umgehst |
|---|---|
| `mail` + `kalender` | **Nicht optional.** Ohne sie ist `/morning` eine leere Hülle. Frag nicht ob, sondern welches System: Microsoft 365 oder Google Workspace. Aus Step 2.5 weisst du oft schon, was da ist. |
| `ablage` | Fragen. Bei Microsoft 365 kommt SharePoint/OneDrive meist mit, dann ist es ein Häkchen. |
| `chat` | Fragen. Teams bei Microsoft 365, sonst Slack. Nutzen in einem Halbsatz: Nachrichten mitlesen, die sonst untergehen. |
| `crm` | Fragen — **mit der ehrlichen Einschränkung aus `reference/mcp.md`**, dass `/morning` heute keine CRM-Daten ins Briefing zieht. Der Nutzen ist das gezielte Nachschlagen im Gespräch, nicht das Briefing. Das gehört gesagt, bevor jemand verbindet. |
| `dev` | Nur ansprechen, wenn Step 7.3 „ja" ergeben hat. Sonst überspringen, kommentarlos. |

Pro bejahtem Slot: den User durch Cowork führen (Einstellungen → Connectors → das System auswählen → mit dem Arbeits-Account anmelden). Die Anmeldung macht **er**, im Browser. Danach **per ToolSearch verifizieren**, ob die Werkzeuge jetzt da sind — das ist die belastbare Probe, nicht seine Selbstauskunft und auch kein Browser-Blick. Erst dann in `inventory.connectors` schreiben, mit `slot:`.

Klappt es nach zwei Versuchen nicht: nicht festbeissen. Notieren mit `status: false`, sagen was ohne diesen Anschluss trotzdem geht, und weiter. Der Rest des Setups darf daran nicht scheitern.

### Step 7.3: Zugänge und Schlüssel

Schlüssel gehören **nie ins Repo** (es wird geklont und versioniert; ein einmal eingecheckter Schlüssel bleibt in der Historie stehen). Alle liegen in `~/.config/credentials.env`, Rechte `600`.

**Zwei Zugänge bietest du immer an**, weil die Werkzeuge aus 7.1 ohne sie halb tot sind:

- **Firecrawl** — ohne Schlüssel kann das Werkzeug keine Webseiten lesen. Eigener Account auf firecrawl.dev, kostenloser Einstiegstarif reicht zum Ausprobieren. Der Account gehört **ihm**, nicht dem Dienstleister: so laufen Abrechnung und Nutzung bei ihm, und niemand teilt sich ein Limit.
- **OpenRouter** — braucht es für Bilder und für Modelle, die nicht von Anthropic kommen. Ohne ihn sagt das System bei „mach mir ein Bild" ehrlich, dass ihm der Zugang fehlt.

**Nicht von selbst anbieten, nur auf Nachfrage:** einen **Anthropic-API-Schlüssel**. Den braucht ausschliesslich der Skill `managed-agents` (eigene Agenten, die dauerhaft in der Cloud laufen). Wichtig und ehrlich zu sagen, wenn es zur Sprache kommt: **das ist eine zweite Rechnung neben dem Abo** und wird pro Nutzung abgerechnet. Der normale Alltag braucht ihn nie — alles, was dieses System tut, läuft über das Abo. Zeitgesteuerte Routinen (`/schedule`) brauchen ihn übrigens **nicht**, die laufen über den Abo-Zugang.

**Eine weitere Frage, nur einmal:** _„Baust du auch Anwendungen, oder arbeitest du mit Datenbanken?"_

- **Nein** (der Regelfall) → kommentarlos überspringen. Kein Wort über Supabase oder Vercel, das ist Werkzeug für andere Rollen.
- **Ja** → durch **Supabase** (Datenbank) und **Vercel** (Veröffentlichen) führen. Beide Skills liegen im Paket. Danach Slot `dev` in 7.2 nachholen.

Anlegen läuft immer gleich: Registrierungsseite aufrufen (mit Playwright aus 7.1 kannst du sie ihm direkt öffnen), er meldet sich an und erzeugt den Schlüssel, dann hängst **du** ihn an:

```bash
mkdir -p ~/.config && touch ~/.config/credentials.env && chmod 600 ~/.config/credentials.env
echo 'FIRECRAWL_API_KEY=<sein-key>' >> ~/.config/credentials.env
```

Jeden eingerichteten Zugang nach `inventory.accounts` schreiben (`name`, `purpose`, `key_env`). **Den Schlüsselwert nie in den Chat schreiben, nie in eine Datei im Repo, nie wiederholen.** `status` nicht tippen, sondern aus der Existenz des Eintrags in `credentials.env` ableiten.

### Step 7.4: Projekt-Repos anbinden

Gehört zu einem der Projekte aus Step 5 ein Git-Repo (Produktcode, Website, Firmen-Repo), wird es **in das Projekt geklont**, nicht in den Workspace gemischt:

```bash
git clone <repo-url> projects/<slug>/code
```

Damit sieht Claude in einer Sitzung beides: den Projektkontext und den echten Code. Die Historien bleiben getrennt, `.gitignore` schliesst `projects/*/code/` aus — der Tagesabschluss committet also nie fremden Code in das private Workspace-Repo. Vollständige Begründung: `projects/README.md`.

Ist das Repo privat, braucht es eine Anmeldung, die du nicht leisten kannst → Zeile geben, ihn machen lassen. Danach in `inventory.repos` eintragen (`name`, `url`, `path`).

Frag pro Projekt **höchstens einmal** und nur dort, wo es plausibel ist. Bei einem Projekt namens „Quartalsabschluss" nicht nach einem Repo fragen.

## Step 8: Archive This Skill + Confirm

1. Move `.claude/skills/setup/` to `.claude/skills-deprecated/setup/` (its job is done — archival pattern, not deletion).
2. **Eigenes Repo anlegen** — nur wenn der Workspace ein Git-Klon ist (`git rev-parse --is-inside-work-tree`) UND `gh auth status` eine Anmeldung meldet. Fehlt eins von beidem: still überspringen, kein Wort dazu (`/eod` überspringt seine Sicherung dann ebenfalls).

   **Warum das nicht optional ist:** Der geklonte Ordner zeigt noch auf das Repo dessen, der das Paket verschickt hat. Ohne diesen Schritt pusht `/eod` die Arbeit des Users jeden Abend dorthin — oder scheitert jeden Abend. Beides fällt erst nach Tagen auf.

   EINE Frage, in Klartext: _„Ich lege dir dein eigenes privates Repo auf GitHub an. Das ist deine tägliche Sicherung, sie gehört dir, und öffentlich ist davon nichts. Soll ich?"_ Bei Ja:

   ```bash
   git remote rename origin upstream
   gh repo create <ordnername> --private --source=. --remote=origin --push
   ```

   `gh` legt das Repo unter dem **angemeldeten Konto des Users** an — er ist von Anfang an Eigentümer, es gibt keine Übertragung. `upstream` bleibt als Bezugsquelle stehen, darüber kommen später Updates (`git pull upstream main`).

   Danach die **zweite Frage, getrennt gestellt und nie vorausgewählt** (Ansprechpartner-Name und GitHub-Konto aus `VERSION.md`): _„Soll <Ansprechpartner> Zugriff auf dieses Repo bekommen? Dann kann er dir bei Problemen direkt helfen und Verbesserungen einspielen. Er kann damit aber auch alles lesen, was hier mit der Zeit landet — deine Projekte, Notizen und Mail-Zusammenfassungen. Du kannst den Zugriff jederzeit wieder entziehen."_

   - Ja → `gh api -X PUT repos/<user>/<repo>/collaborators/<github-konto> -f permission=push`, danach EIN bestätigender Satz inklusive Hinweis, wo man es zurücknimmt (Repo → Settings → Collaborators).
   - Nein → kommentarlos weiter. Das ist die genauso richtige Antwort, sie wird nie nachverhandelt.

   Angelegtes Repo in `context/config.yaml → inventory.repos` eintragen. Scheitert ein Befehl: nicht dramatisieren, EIN Satz im Summary plus Hilfsangebot — der Workspace läuft ohne Repo vollständig, es fehlt nur die Sicherung.
3. Output a summary: what was written to config.yaml, what was filled in (context/ files), which projects were scaffolded, which documents were filed, whether EMAIL_STYLE.md was derived (Step 7), plus these follow-ups:
   - **`/email`-Stil** (nur falls Step 7 übersprungen): Drafts nutzen den Beispiel-Stil des Pakets — jederzeit "leite meinen Mail-Stil aus meinen Sent Items ab" sagen.
   - **Kalender-Rauschen:** wiederkehrende private Kalender-Blöcke (Gym, Lernslots, …) in `config.yaml → calendar.noise_subjects` eintragen, damit Briefings sie ignorieren.
   - **Diktieren statt tippen (EIN Satz, freundlich):** das System lebt davon, dass man ihm Dinge erzählt — Status-Updates diktieren geht schneller als tippen. Windows: `Win + H` startet das native Diktat in jedem Textfeld, auch im Claude-Code-Fenster. Mac: Diktat unter Systemeinstellungen → Tastatur aktivieren, danach startet zweimal `Ctrl` tippen das Mikrofon.
4. **Systemcheck-Zeile (Step 2.5), EINE Zeile, freundlich:**
   - Alles grün → _„Alles startklar."_ Mehr nicht — kein Häkchen-Report über Dinge, die funktionieren.
   - Etwas fehlt → was fehlt, was trotzdem geht, und ein KONKRETES Hilfsangebot — nie nur ein Verweis auf Dritte. Muster Mail, **mit dem in Step 2.5 genannten System konkret eingesetzt** (Microsoft 365 bzw. Google Workspace) statt allgemein: _„Eine Mail-Anbindung finde ich noch nicht — Aufgaben, Projekte und Dashboard laufen trotzdem, nur der Mail-Teil des Briefings fehlt. Einrichten geht in Claude Cowork: Einstellungen → Connectors → <das genannte System> mit deinem Arbeits-Account verbinden; ich greife dann auf dieselbe Verbindung zu. Sag ‚prüf die Mail-Anbindung nochmal', wenn du das gemacht hast — oder ‚hilf mir dabei', dann gehen wir es Schritt für Schritt durch."_ Nimmt der User das Hilfsangebot an: durch die Einrichtung führen, danach die Anbindung erneut per ToolSearch testen und das Ergebnis in einem Satz bestätigen. (Welche Connectors es gibt und was sie dürfen: `reference/mcp.md`.)
5. **Dashboard-Erstrender (wenn `script_command` gefunden wurde):** Einmal das Dashboard aus den frischen Daten rendern — wie `/morning` Step 7b, aber mit `mail_checked: false` (Mail-Felder ehrlich leer, Kalender erst morgen) — und öffnen. Zwei Fliegen: der User sieht sofort einen sichtbaren Erfolg („das ist dein Dashboard, ab morgen ist es gefüllt"), und der Render-Weg ist auf DIESEM Rechner bewiesen, solange du daneben sitzt. Schlägt er fehl: nicht dramatisieren — im Summary einen Satz (Briefing im Chat läuft trotzdem) + Hilfsangebot. Kein `script_command` → überspringen.
6. **Opt-in-Testentwurf (nur wenn ein `draft_method` verfügbar ist):** EINE Frage: _„Soll ich dir einen Test-Entwurf an dich selbst öffnen, damit du siehst, wie das später aussieht?"_ Bei Ja: kurzer Willkommens-Entwurf an `user.email` (Betreff etwa „Dein Workspace ist eingerichtet ✓", 2–3 Sätze), via `draft_method` aus der Config — das ist der End-to-End-Beweis des Entwurfswegs; scheitert er, fällt es HIER auf und wird sofort repariert, nicht allein am ersten Morgen. Bei Nein: kommentarlos überspringen. Grundsatz bleibt: Entwürfe poppen nie ungefragt auf — dieser ist ausdrücklich eingeladen, geht nur an den User selbst, und gesendet wird nie.
7. **Das Mini-Briefing — so läuft der Alltag ab jetzt.** Direkt im Chat ausgeben (das ist der Moment, in dem der User garantiert liest — eine Doku-Datei öffnet er nie). Genau diese fünf Zeilen, nicht mehr:

   > **So benutzt du das ab jetzt:**
   > - **Morgens:** „Guten Morgen" sagen — ich hole Kalender und Mails, briefe dich und baue dein Dashboard.
   > - **Tagsüber:** einfach erzählen, was ist — „Kapitel 3 ist fertig", „warte auf die IT". Ich sortiere es an die richtige Stelle.
   > - **Dokumente:** in den `inbox/`-Ordner legen und „lies das ein" sagen.
   > - **Abends:** „Feierabend" sagen — zwei Minuten Tagesabschluss.
   >
   > Befehle musst du dir nicht merken — schreib in eigenen Worten, was du willst.

   Danach EIN Verweis-Satz: „Mehr steht in `ONBOARDING.md` und später im Hilfe-Tab deines Dashboards — aber das oben ist alles, was du brauchst." Schlage `/morning` als ersten echten Lauf vor (morgen früh oder gleich jetzt).
8. **Einmal auf `WAS-DIESES-SYSTEM-TUT.md` hinweisen** — ein Satz: _„Was das System liest und was es nie tut (senden, Termine ändern, HR-Themen anfassen), steht in `WAS-DIESES-SYSTEM-TUT.md` — die Seite ist auch die Antwort, wenn dich jemand fragt, ob du das nutzen darfst."_ Nicht ausführen, nur zeigen, dass es sie gibt.

## Quality Guidelines

- **No silent fabrication:** if an answer leaves a gap, say so in the summary — don't invent a plausible default.
- **Re-runs ask first:** never overwrite an already-personalized config silently.

## Test Drive

1. First session in a fresh copy → CLAUDE.md's first-run rule triggers this skill automatically, straight to Step 1 questions.
2. Answer the questions → config.yaml written, context files filled, every named project scaffolded. **Tasks erscheinen NICHT sofort in STATUS.md** — erst kommt der Vorschlag im Chat (pro Projekt 1–3 echte Aktionen, Meilensteine als `Timeline:` in PROJECTS.md), erst nach dem OK wird geschrieben, jede Task mit selbsterklärender Kontext-Zeile.
3. Grep the workspace for `[DEIN NAME]` → zero hits outside `.claude/skills-deprecated/`.
4. `context/PROJECTS.md` shows exactly the new user's real projects, dated today; ingested documents are reflected there and filed in the owning project's `projects/<slug>/inputs/` (only project-less material lands in `inbox/processed/`).
5. `.claude/skills/setup/` no longer exists; `.claude/skills-deprecated/setup/` does.
5b. `git remote -v` zeigt **`origin` auf das Repo des Users** und `upstream` auf die Bezugsquelle — nie umgekehrt. Der erste Push ist durch, `gh repo view` meldet `private`. Hat der User beim Zugriff Nein gesagt, steht unter Collaborators niemand außer ihm.
5c. **Ausstattung (Steps 7.1–7.4):** `inventory.clis` spiegelt, was `command -v` wirklich findet. Alle sechs Slots kamen zur Sprache — jeder steht in `inventory.connectors`, entweder mit `status: true` oder `status: false`, keiner fehlt. Kein Schlüsselwert steht im Chat oder in einer Datei im Repo; `~/.config/credentials.env` hat Rechte `600`. Wurde ein Projekt-Repo geklont, liegt es unter `projects/<slug>/code/` und `git status` im Workspace zeigt es NICHT als zu committen.
6. Run `/setup` again → Step 0 detects the real name in config.yaml and asks before doing anything.
7. Bei gefundener Script-Laufzeit steht am Ende ein gerendertes `context/today.html` (ohne Mail-Teil); bei vorhandenem `draft_method` und Ja des Users liegt ein Test-Entwurf an die eigene Adresse bereit — niemals gesendet, niemals an Dritte.
