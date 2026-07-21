# Connectors verbinden (MCP)

Mail und Kalender sind in diesem Paket nicht fest verdrahtet. Es gibt keine feste Anbindung an ein bestimmtes Mailprogramm. Stattdessen läuft alles über **Connectors**, die du selbst in **Claude Cowork** verbindest. Claude Code nutzt dieselbe Verbindung, du richtest es also nur einmal ein.

Das ist der eigentliche Vorteil: Du entscheidest, was angebunden wird. Verbindest du Microsoft 365, läuft es darüber. Verbindest du Google Workspace, genauso. Beides geht auch parallel.

## Die Zusage vorweg

> ### Es wird nie gesendet und nie in den Kalender geschrieben
> Das System legt **Entwürfe** an. Abgeschickt wird von Hand, mit einem Klick in deinem Mailprogramm. Termine werden gelesen, nie angelegt, geändert oder abgesagt. Auch dann nicht, wenn ein Connector das technisch könnte. Wünschst du dir das trotzdem, sagt Claude dir, dass diese Entscheidung bewusst bei dir bleibt.

Ebenfalls unverändert: Mail und Kalender werden nur mit deiner Erlaubnis angefasst, und die gilt pro Sitzung neu. Sensible Themen (HR, Gehalt, Performance) bleiben draußen.

## Was ein Connector ist

Ein Connector ist eine Verbindung zwischen Claude und einem Dienst, den du ohnehin nutzt. Er läuft über einen offenen Standard (MCP, Model Context Protocol). Praktisch heißt das: Du meldest dich einmal bei dem Dienst an und erlaubst Claude den Zugriff. Danach kann Claude dort lesen, ohne dass du etwas kopierst oder exportierst.

Wichtig zu wissen:

- Die Verbindung gilt für deinen Account, nicht für diesen Ordner. Sie steht in jedem Claude-Fenster zur Verfügung.
- Du siehst jederzeit in den Einstellungen, was verbunden ist, und kannst es dort auch wieder trennen.
- Beim ersten Werkzeugaufruf fragt Claude Code einmal um Erlaubnis. Einmal „immer erlauben" klicken, dann kommt die Frage nicht wieder.

## Verbinden

1. **Claude Cowork** öffnen
2. **Einstellungen → Connectors**
3. Den gewünschten Connector auswählen und mit deinem Arbeits-Account anmelden
4. Claude Code neu starten, damit die Verbindung greift

Kommt in Claude Code trotzdem die Meldung, ein Werkzeug sei nicht verfügbar: einmal neu starten, dann in der Sitzung nochmal fragen.

## Welche Connectors dieses Paket nutzt

### Mail

**Was damit geht:** Die Postfach-Triage in `/morning` (was braucht eine Antwort, wo wartest du auf jemanden, was ist nur zur Kenntnis). Das Ableiten deines persönlichen Schreibstils aus deinen eigenen gesendeten Mails. Und je nach Connector das Anlegen von Entwürfen direkt im Postfach.

**Ohne:** Das Briefing läuft weiter, nur ohne Mail-Teil. Entwürfe entstehen dann über einen `mailto:`-Link, der einfach das Verfassen-Fenster deines Standard-Mailprogramms öffnet. Das funktioniert überall und braucht keine Rechte.

### Kalender

**Was damit geht:** Die Termine des Tages im Briefing und die Tages-Zeitachse im Dashboard, inklusive der freien Blöcke dazwischen. Erinnerungen werden dabei getrennt von echten Terminen ausgewiesen.

**Ohne:** Das Briefing sagt ehrlich, dass es heute nicht an den Kalender kommt, und zeigt dir stattdessen Aufgaben und Projekte. Der Kalender-Tab im Dashboard bleibt leer statt zu raten.

### Dateiablage (optional)

**Was damit geht:** Dokumente, die in eurer Ablage liegen, lassen sich direkt einsortieren, ohne sie vorher herunterzuladen.

**Ohne:** Du legst die Datei in den `inbox/`-Ordner und sagst „lies das ein". Das ist der Normalfall und völlig ausreichend.

### CRM (optional)

Nutzt ihr ein CRM wie HubSpot, Salesforce oder Pipedrive und gibt es dafür einen Connector, könnt ihr ihn verbinden wie jeden anderen.

**Was damit geht:** Fragen im Chat, die sonst einen Tab-Wechsel kosten. „Wie ist der Stand bei Kunde X", „welche Deals hängen seit zwei Wochen", „worüber haben wir zuletzt gesprochen, bevor ich die Mail schreibe". Für Mail-Entwürfe ist das der größte Hebel, weil der Kontext dann aus dem CRM kommt statt aus dem Gedächtnis.

**Ehrlich dazu:** Das Tagesbriefing zieht heute **keine** CRM-Daten. `/morning` liest Kalender, Postfach und die eigenen Projektdateien, mehr nicht. Ein verbundenes CRM hilft also im Gespräch, läuft aber nicht automatisch mit. Wer das will, sagt Bescheid, dann wird es in den Briefing-Skill eingebaut.

**Ohne:** Nichts fehlt. Das System kennt euer CRM dann einfach nicht.

## Der Schalter `draft_method`

Wie ein Entwurf entsteht, hängt vom Rechner ab. Das Setup probiert die Wege durch und trägt den funktionierenden als `draft_method` in `context/config.yaml` ein:

| Wert | Was passiert |
|---|---|
| `mcp` | Der Connector legt den Entwurf direkt im Postfach an. Nur das Entwurfs-Werkzeug wird genutzt, nie ein Sende-Werkzeug. |
| `com` | Windows-Weg über die installierte Outlook-App. |
| `applescript` | Mac-Weg über die klassische Outlook-App. |
| `mailto` | Öffnet das Verfassen-Fenster deines Standard-Mailprogramms. Universeller Fallback, funktioniert immer. |
| `manual` | Claude zeigt den Text im Chat, du kopierst ihn. |

Fällt der eingetragene Weg irgendwann aus, fällt Claude automatisch eine Stufe tiefer und sagt dir in einem Satz, was stattdessen passiert ist.

## Welche Connectors sich zusätzlich lohnen

Alles, was in Claude Cowork verbunden ist, steht auch hier in Claude Code bereit — verbinden ist immer derselbe Weg (Einstellungen → Connectors), und das Setup inventarisiert einmal, was da ist. **Grundsatz: nach Bedarf verbinden, nicht auf Vorrat.** Jeder Connector ist Zugriff auf eure Daten, und Claude sagt von selbst, wenn ihm für eine Aufgabe eine Verbindung fehlt.

Was sich im Startup-Alltag am ehesten lohnt, in dieser Reihenfolge:

| Connector | Was er bringt | Zaun |
|---|---|---|
| **Slack** | Mentions und Direktnachrichten als Briefing-Kontext, Thread-Nachschlagen („was war da nochmal?") | Wie Mail: nur lesen, nur mit Erlaubnis pro Session |
| **Notion** (o.ä. Firmen-Wiki) | „Was steht bei uns dazu?" — Claude liest die Doku als Kontext, statt dass du sie zusammenkopierst | Lesen für Kontext, kein zweiter Ablage-Ort |
| **CRM** (HubSpot, Salesforce, …) | Pipeline-Stand im Briefing, Kunden-Historie beim Mail-Entwurf | Nur lesen; CRM-Pflege bleibt im CRM |
| **Linear / Jira / Asana** | Ticket-Kontext zu Projekten | **Wichtig:** lesen für Kontext, nie zweite Aufgaben-Wahrheit — deine Tasks leben in STATUS.md, sonst gibt es zwei Listen und keine stimmt |
| **Stripe** | Umsatz-Zahlen auf Zuruf | Auf Zuruf, nicht im täglichen Briefing |

**Wenn ihr selbst Produkte baut**, lohnt zusätzlich die Entwickler-Schiene:

| Connector | Was er bringt | Zaun |
|---|---|---|
| **GitHub Integration** | Issues, Pull Requests und Repo-Stände direkt im Gespräch | Unabhängig vom Workspace-Repo aus Schritt 1 — das läuft über `gh` und braucht diesen Connector nicht |
| **Supabase** | Datenbank ansehen und ändern per Gespräch (Tabellen, Abfragen, Migrationen) | Bei Produktions-Datenbanken: erst ansehen lassen, Änderungen bewusst freigeben |
| **Vercel** | Deploys, Logs und Projekt-Config | Kein fertiger Katalog-Eintrag — über „Add" als eigener MCP-Server (`mcp.vercel.com`) hinzufügen |

**Für Routinen gilt extra:** Ein lokal verbundener Connector reicht der Cloud-Routine nicht — er muss der Routine beim Anlegen angehängt werden (der Assistent fragt das ab, siehe `SETUP.md` § Briefing automatisch).

## Weg B: IMAP direkt (wenn es keinen Connector gibt)

Für Postfächer, an die kein Connector kommt: kein Claude-Cowork-Zugang, Connector von der IT geblockt, oder die Mail läuft über einen eigenen Mailserver. Dann geht Mail und sogar Kalender über **IMAP direkt** — zwei kleine, read-only Skripte liegen dafür in `reference/scripts/`:

- **`mail-day.py`** — listet alle Mails eines Tages (ein- und ausgehend). Damit kann Claude die Triage-Rohdaten holen, wenn der Connector fehlt.
- **`mail-freebusy.py`** — der Trick für den Kalender: Die meisten Termine kommen als iCal-Einladung per Mail. Das Skript liest die Einladungen aus dem Postfach und baut daraus Belegt-Blöcke plus freie Termin-Vorschläge. **Kein OAuth, kein Kalender-Zugriff nötig.**

**Einrichten:** Zugangsdaten einmalig in `~/.config/credentials.env` (Datei mit `chmod 600` schützen, liegt außerhalb des Repos und landet nie in Git):

```
MAIL_IMAP_HOST=imap.deine-firma.de
MAIL_USER=du@deine-firma.de
MAIL_PASS=app-passwort
```

**Ehrliche Voraussetzung:** Das Postfach muss IMAP mit Passwort oder App-Passwort erlauben. Eigene Mailserver und die meisten Hoster: ja. Microsoft 365 und Google Workspace: nur, wenn die IT das freigeschaltet hat — dort ist der Connector (Weg A) der vorgesehene Weg. Beides gleichzeitig braucht niemand.

**Grenzen:** Nur lesen (BODY.PEEK — nichts wird verschoben, gelöscht oder als gelesen markiert), keine Dateiablage, kein Teams/Chat. Claude ruft die Skripte bei Bedarf selbst per Terminal auf, wenn der Connector fehlt und die Zugangsdaten da sind.

## Ganz ohne Connector und ohne IMAP

Das Paket läuft auch dann. Projekt-Tracking, Dashboard, Dokumenten-Einsortierung, Aufgabenverwaltung und Mail-Entwürfe brauchen keinen Connector. Es fehlt genau zweierlei: die Termine im Briefing und die Postfach-Triage. Das Setup prüft das selbst und sagt dir in einem Satz, was fehlt und was dadurch wegfällt.
