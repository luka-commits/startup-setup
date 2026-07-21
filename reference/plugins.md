# Claude Code Plugins

> **Kurz vorweg:** Plugins gelten für die ganze Maschine, nicht nur für diesen Ordner. Wer eines installiert, hat es in jedem Claude-Code-Projekt. Und: **Das Paket braucht keines davon.** Alle Werkzeuge (`/morning`, `/eod`, `/email`, `/ingest`, `/setup`) laufen ohne jedes Plugin. Was hier steht, sind Erfahrungswerte, keine Voraussetzungen.

Wenn Commands nach einer Installation nicht erkannt werden: `/reload-plugins`.

Für die zwei empfohlenen Kommandozeilen-Werkzeuge (firecrawl, playwright) siehe [`tools.md`](tools.md). Das sind keine Plugins.

## Empfohlen

### Anthropic Official Marketplace — und was davon wirklich zählt

**Install:** `/plugin marketplace add anthropics/claude-plugins-official`

Kuratiertes, geprüftes Directory von Anthropic selbst — der erste Ort, an dem man nachsieht, bevor man ein Plugin aus einer fremden Quelle installiert. Aber: Das meiste darin ist Entwickler-Werkzeug (Code-Review, Commits, Debugging) und für diesen Workspace irrelevant. **Für dich zählen zwei:**

- **`skill-creator`** — baut neue Skills und verbessert bestehende. Das ist das Werkzeug hinter dem Versprechen aus `VISION.md`: du beschreibst, was du jede Woche tust, und bekommst einen eigenen Befehl dafür (Ablauf: `reference/system-erweitern.md`). Install: `/plugin install skill-creator@claude-plugins-official`
- **`claude-md-management`** — auditiert die CLAUDE.md, wenn der Workspace über Monate gewachsen ist und die Regeln Wildwuchs ansetzen. Install erst bei Bedarf.

Alles Weitere aus dem Marketplace nur auf konkreten Anlass installieren: Jedes Plugin gilt für die ganze Maschine, bringt eigene Befehle mit und liest bei jeder Session mit — drei installierte Plugins, die niemand nutzt, machen `/help` unübersichtlich und jede Antwort ein bisschen teurer.

### `ponytail`: Anti-Over-Engineering

**Install:**
```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Erzwingt die einfachste, kürzeste Lösung (YAGNI). Nützlich, bevor man Skills oder das Dashboard erweitert: `/ponytail-review` nach größeren Umbauten, `/ponytail-audit` für ein ganzes Projekt. Wer dieses Paket anpasst, spart sich damit die typische Runde, in der aus einer kleinen Änderung ein Framework wird.

## Optional (bei Bedarf)

### `impeccable`: Design-Guidance für Frontends

**Install:**
```
/plugin marketplace add pbakaus/impeccable
/plugin install impeccable@impeccable
```
Docs: https://impeccable.style

**Wann:** Erst, wenn du das Dashboard optisch ernsthaft weiterentwickelst, zum Beispiel mit `/impeccable critique context/today.html`. Vorher überflüssig.

### `codeburn`: Verbrauch sichtbar machen

**Test ohne Installation:** `npx codeburn`

Read-only, liest nur lokale Session-Dateien, nichts verlässt den Rechner. Zeigt den Verbrauch nach Modell und Projekt; `codeburn optimize` findet Token-Verschwendung mit konkreten Fixes.

**Wann:** Wenn du wissen willst, was deine Nutzung konkret treibt. Für den Alltagsfall reicht die Sektion „Verbrauch im Griff" im Hilfe-Tab des Dashboards.

## Bewusst NICHT installieren

### `claude-mem`: Memory-Plugin

Die Gründe, in der Reihenfolge ihres Gewichts:

1. **Es loggt jeden Werkzeugaufruf**, einschließlich der gelesenen Projektdaten, in eine eigene Datenbank. Wer mit Kundendaten arbeitet, gibt damit eine Kopie an eine Stelle, die er nicht kontrolliert.
2. **Großer Dependency-Footprint:** Daemon, Vektor-Datenbank und ein permanent laufender Hintergrund-Server. Viel bewegliches Teil für einen Nutzen, den dieses Paket schon abdeckt.
3. **Assoziierter Crypto-Token beim Maintainer.** Kein technisches Argument, aber es sagt etwas über die langfristigen Anreize eines Projekts, dem man Lesezugriff auf alles gibt.

**Der Ersatz ist schon eingebaut:** Das dateibasierte Gedächtnis dieses Workspace (`context/PROJECTS.md`, `STATUS.md`, `JOURNAL.md`) deckt denselben Bedarf, ohne einen Server Dritter. Es hat außerdem einen Vorteil, den kein Vektor-Speicher hat: Du kannst es lesen, korrigieren und in Git versionieren.
