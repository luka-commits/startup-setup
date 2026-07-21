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

## Ganz ohne Connector

Das Paket läuft auch dann. Projekt-Tracking, Dashboard, Dokumenten-Einsortierung, Aufgabenverwaltung und Mail-Entwürfe brauchen keinen Connector. Es fehlt genau zweierlei: die Termine im Briefing und die Postfach-Triage. Das Setup prüft das selbst und sagt dir in einem Satz, was fehlt und was dadurch wegfällt.
