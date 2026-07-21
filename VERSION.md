# Version

**v1.1-open** · Stand 2026-07-21

Offene Variante. Baut auf demselben Skelett wie die eingeschränkte Konzern-Fassung auf, hat aber keine Plugin- und Connector-Beschränkungen.

**Fragen, Fehler, Verbesserungswünsche:** Luka Knieling · luka@flouence.com · GitHub-Konto `luka-commits`

## Was das heißt

Dieses Paket kommt als **Repo**, das du klonst. Beim Einrichten legt Claude dir daraus **dein eigenes privates Repo** an: es gehört deinem GitHub-Konto, niemand sonst kommt hinein, und der Tagesabschluss sichert deinen Stand jeden Abend dorthin.

Deine Kopie bleibt so, wie du sie bekommen hast: sie aktualisiert sich nicht von selbst, und sie wird auch nicht heimlich verändert. Neue Versionen holst du dir bewusst, wenn du sie brauchst — ein Satz im Chat genügt („hol mal die neue Version"), technisch ist es ein `git pull upstream main`.

Wenn etwas nicht funktioniert: **melde dich mit der Versionsnummer oben.** Es kann sein, dass es in einer neueren Version schon behoben ist.

**Das gehört dir und bleibt bei einem Update unangetastet:**

| Ordner | Was drin ist |
|---|---|
| `context/` | Deine Projekte, Aufgaben, Notizen, Config, Mail-Stil |
| `projects/` | Ein Ordner pro Case, inklusive der abgelegten Original-Dokumente |
| `inbox/` | Eingelesene Quellen ohne Projekt-Bezug und deine bisherigen Briefings — hier liegen **Originale, keine Kopien** |
| `reference/` | Nur falls du selbst etwas ergänzt hast (z.B. eigene Links, eigene Triage-Regeln) |

Alles andere (`.claude/`, `CLAUDE.md`, die Doku) ist austauschbar und kommt frisch aus der neuen Version. Deshalb gilt: eigene Änderungen gehören in diese vier Ordner, nicht in die Maschinerie.

## Änderungen

**v1.1-open** — Die Einrichtung führt jetzt bis zum einsatzfähigen System, statt an der Personalisierung aufzuhören. Neu darin: Werkzeuge werden installiert statt nur geprüft, deine sechs Anschlüsse (Postfach, Kalender, Ablage, Team-Chat, CRM, Entwicklung) werden einzeln durchgegangen und auf Wunsch verbunden, Zugänge wie Firecrawl und OpenRouter werden mit dir angelegt, und gehört zu einem Projekt ein Repository, wird es gleich mit angebunden. Supabase und Vercel kommen nur zur Sprache, wenn du Anwendungen baust. Dazu **16 mitgelieferte Skills**: Web-Recherche, Browser-Steuerung, Word, PDF, PowerPoint, Textschliff, eigene Befehle bauen, Datenbanken. Eine neue Routing-Tabelle in `CLAUDE.md` sorgt dafür, dass diese Ausstattung im Alltag auch benutzt wird, statt nur dazuliegen. Das Dashboard prüft den echten Zustand, statt die Einstellungen abzuschreiben, und zeigt in einer eigenen Sektion, was noch offen ist. Nachrüsten geht jederzeit über `/checkup` oder einen Satz im Chat. Neue Denkwerkzeuge (mehrere Perspektiven, Pre-Mortem, Steelman) für Entscheidungen mit offenem Ausgang. Das Paket wächst dadurch auf rund 4 MB, was einen einmaligen Klon nicht spürbar verlangsamt.

**v1.0-open** — Erste Version der offenen Variante. Auslieferung als Repo statt als Ordner-Kopie. Mail und Kalender laufen über frei wählbare Connectors, die du in Claude Cowork verbindest (`reference/mcp.md`), statt über eine feste Anbindung. `firecrawl` und `playwright` sind Standard (`reference/tools.md`). Plugins sind erlaubt (`reference/plugins.md`). Neu: `SETUP.md` mit der vollständigen Installationsstrecke, und ein Verzeichnis eigener Tools (`own_tools` in `context/config.yaml`), das als Kacheln im Dashboard erscheint.

### Vorgeschichte des gemeinsamen Skeletts

**v1.2** — Mac-Support: läuft jetzt auf Windows und Mac (OS-Erkennung beim Setup; Dashboard-Öffnen via `open`). Entwürfe jetzt mit automatischer Weg-Wahl pro Rechner (`draft_method` in config.yaml): MCP-Draft-Tool falls vorhanden, sonst COM auf Windows bzw. `mailto:` auf Mac — `mailto:` braucht keine Rechte und kein MDM-Okay; AppleScript nur noch opt-in. Dashboard-Fill läuft auf Node.js statt Python (kommt mit Claude Code mit, nichts nachinstallieren). VS Code ist jetzt der empfohlene Einstieg im README. Setup endet jetzt mit Beweis statt Versprechen: Dashboard wird direkt gerendert und geöffnet, auf Wunsch gibt es einen Test-Entwurf an dich selbst, und der Alltag wird in fünf Chat-Zeilen erklärt. Projektstruktur mit Mechanismen statt Ablage-Disziplin: `inputs/` (bekommen, unverändert) + `work/` (Werkbank, Überlappungs-Check vor neuen Dateien) + `outputs/` (rausgegangen, datiert — wird gefüllt, wenn du sagst „X ist raus") + `_archive/` (ersetzte Arbeitsstände, räumt Claude selbst weg). Dashboard: Hilfe-Tab mit Chat-Einstieg, aktualisierten Start-Wegen und neuer „Verbrauch im Griff"-Sektion; der Werkzeuge-Tab ist jetzt **Start Here** — mit Platz für ein Erklärvideo oben (`reference/quickstart.mp4`) und den Karten Mail-Stil, Neuer Case, Problembericht. Setup inventarisiert jetzt auch weitere verbundene Connectors und CLAUDE.md hat Regeln für neue Situationen und fremde Tools. Neu: `_tmp/`-Ordner für flüchtige Skripte (feste Dateinamen, überschreibt sich selbst), Schutz gegen eingebettete Anweisungen in Mails/Dokumenten (Prompt-Injection), Backup jetzt auch für Aufgabenliste und Tagebuch, erster Mail-Scan klar auf 24 Stunden festgelegt.

**v1.1** — Windows-Fixes: Dashboard öffnet sich jetzt wirklich (`cmd //c start`), PowerShell-Entwürfe laufen auch bei gesperrter Execution-Policy, Python-Aufruf wird beim Setup ermittelt statt geraten. Dazu präzisiert, was mit deinen Mails passiert (`WAS-DIESES-SYSTEM-TUT.md`). Neu: `ORDNERKARTE.html` (visuelle Ordner-Übersicht), weniger Nachfrage-Klicks im Alltag, Feinschliff nach Komplett-Audit.

**v1.0** — Erste Version: `/setup`, `/morning`, `/eod`, `/ingest`, `/email` + Dashboard.
