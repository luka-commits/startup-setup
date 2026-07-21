# Claude Code Plugins

> **Kurz vorweg:** Plugins gelten für die ganze Maschine, nicht nur für diesen Ordner. Wer eines installiert, hat es in jedem Claude-Code-Projekt. Und: **Das Paket braucht keines davon.** Alle Werkzeuge (`/morning`, `/eod`, `/email`, `/ingest`, `/setup`) laufen ohne jedes Plugin. Was hier steht, sind Erfahrungswerte, keine Voraussetzungen.

Wenn Commands nach einer Installation nicht erkannt werden: `/reload-plugins`.

Für die zwei empfohlenen Kommandozeilen-Werkzeuge (firecrawl, playwright) siehe [`tools.md`](tools.md). Das sind keine Plugins.

## Empfohlen

### Anthropic Official Marketplace — und was davon wirklich zählt

**Wird beim Setup freigeschaltet** (SETUP.md Schritt 3): `/plugin marketplace add anthropics/claude-plugins-official` — das macht nur den Katalog bekannt, installiert wird einzeln und erst auf dein Ja. Im Alltag gilt: Merkt Claude bei einer Aufgabe, dass ein Plugin aus dem Katalog konkret helfen würde, empfiehlt es das in einem Satz mit dem Install-Befehl — nie ungefragt installieren, nie wiederholt nerven.

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

## Nach Use Case — was wofür

Die Kurz-Übersicht, aus der Claude im Alltag empfiehlt (installiert wird nur auf dein Ja):

| Du willst … | Werkzeug | Wann |
|---|---|---|
| Wiederkehrende Abläufe zu eigenen Befehlen machen | `skill-creator` (offizieller Katalog) | Sobald der erste Ablauf zweimal gleich lief |
| Herausfinden, was sich bei DIR lohnt zu automatisieren | `claude-code-setup` (offizieller Katalog) — analysiert deine bisherige Nutzung und schlägt Automatisierungen vor | Nach 2–4 Wochen Nutzung; vorher gibt es keine Muster zu lesen |
| Eigenen Code reviewen lassen | Nichts installieren: `/code-review` und `/security-review` sind in Claude Code **eingebaut** | Sofort, wenn ihr Code im Workspace habt |
| Designs / Oberflächen erstellen und verbessern | `impeccable` (unten) | Erst bei ernsthafter Frontend-Arbeit |
| Token-Kosten sehen und senken | `codeburn` (unten, läuft ohne Installation via `npx`) | Wenn die Rechnung Fragen aufwirft |
| Umbauten einfach halten statt aufblasen | `ponytail` (oben) | Vor jedem größeren Eigenbau |
| Die CLAUDE.md nach Monaten aufräumen | `claude-md-management` (offizieller Katalog) | Wenn die Regeln Wildwuchs ansetzen |
| Vertriebs-/Marketing-Arbeit mit Claude | `anthropics/knowledge-work-plugins` (offiziell, unten) | Wenn Sales/Marketing im Team Claude nutzt |
| Einen Skill finden, den es vielleicht schon gibt | `find-skills` (unten) | Bevor etwas selbst gebaut wird |
| Ernsthaft Software entwickeln (TDD, Debugging, Planung) | `superpowers` (unten) | Nur auf Entwickler-Rechnern |

## Optional (bei Bedarf)

### `claude-code-setup`: Automatisierungs-Kandidaten finden

**Install:** `/plugin install claude-code-setup@claude-plugins-official`

Liest die eigene Claude-Code-Nutzung (lokal) und empfiehlt, welche deiner wiederkehrenden Abläufe sich als Skill, Hook oder Routine lohnen würden. Das perfekte Gespann mit `system-erweitern.md` und `routinen.md`: erst zeigt es dir WAS, dann bauen wir es. Vor Woche 2 sinnlos — es braucht Nutzungsgeschichte.

### `impeccable`: Design-Guidance für Frontends

**Install:**
```
/plugin marketplace add pbakaus/impeccable
/plugin install impeccable@impeccable
```
Docs: https://impeccable.style

**Wann:** Erst, wenn du das Dashboard optisch ernsthaft weiterentwickelst, zum Beispiel mit `/impeccable critique context/today.html`. Vorher überflüssig.

### `knowledge-work-plugins`: Sales, Marketing & Co (offiziell von Anthropic)

**Install:** `/plugin marketplace add anthropics/knowledge-work-plugins`, dann z.B. `/plugin install sales@knowledge-work-plugins`

Open-Source-Plugins von Anthropic für Wissensarbeit jenseits von Code — Vertrieb, Marketing und mehr. Für ein Startup oft der relevanteste Katalog nach dem offiziellen: Wer im Team Angebote, Kampagnen oder Kunden-Recherche mit Claude macht, findet hier fertige Abläufe statt Eigenbau.

### `find-skills`: erst suchen, dann bauen

**Install:** `npx skills add vercel-labs/skills --skill find-skills`

Durchsucht die offene Skill-Registry (skills.sh), bevor etwas selbst gebaut wird — die „gibt es das schon?"-Frage als Werkzeug. Zaun dazu: Die Registry ist Community-Ware, Qualität schwankt. Gefundene Skills erst ansehen (Quelle, was sie lesen/schreiben), dann installieren — nie blind, und Claude installiert grundsätzlich nichts ungefragt.

### `superpowers`: Entwicklungs-Methodik für die Techniker im Team

**Install:** `/plugin marketplace add obra/superpowers-marketplace`, dann `/plugin install superpowers@superpowers-marketplace`

Bewährtes Skill-Framework für ernsthafte Software-Entwicklung: Brainstorming → Plan → Umsetzung, testgetrieben, systematisches Debugging. **Aber:** Es hängt sich in jede Session ein und drückt seine Methodik durch — auf dem Rechner von jemandem, der hier nur Briefings und Projekte steuert, ist das Lärm und kollidiert mit dem schlanken Alltag dieses Pakets. Deshalb: nur auf Entwickler-Rechnern, nicht als Team-Standard.

### `codeburn`: Verbrauch sichtbar machen

**Test ohne Installation:** `npx codeburn`

Read-only, liest nur lokale Session-Dateien, nichts verlässt den Rechner. Zeigt den Verbrauch nach Modell und Projekt; `codeburn optimize` findet Token-Verschwendung mit konkreten Fixes.

**Wann:** Wenn du wissen willst, was deine Nutzung konkret treibt. Für den Alltagsfall reicht die Sektion „Verbrauch im Griff" im Hilfe-Tab des Dashboards.

## Power-User — mit offenen Augen

Zwei Werkzeuge für Leute, die das System schon sicher fahren und mehr wollen. Beide bewusst NICHT für die erste Zeit und nicht für jeden Rechner.

### `claude-mem`: Session-übergreifendes Zusatz-Gedächtnis

**Install:** `/plugin marketplace add thedotmack/claude-mem`, dann `/plugin install claude-mem@thedotmack`

Merkt sich, was in früheren Sessions passiert ist, und macht es durchsuchbar — nützlich, wenn viel außerhalb der Kern-Befehle gearbeitet wird und Kontext zwischen Sessions verloren geht. **Vor dem Einschalten drei Dinge wissen:**

1. **Es loggt Werkzeugaufrufe** — inklusive gelesener Projektinhalte — in eine eigene lokale Datenbank. Wer mit vertraulichen Kundendaten arbeitet, klärt das vorher (dieselbe Frage wie bei jedem Werkzeug mit Vollzugriff).
2. **Es bringt einen Daemon und eine Vektor-Datenbank mit** — läuft im Hintergrund, will gewartet werden. Wenn etwas klemmt, ist das eine Fehlerquelle mehr.
3. **Das Datei-Gedächtnis bleibt die Wahrheit.** `PROJECTS.md`, `STATUS.md` und `JOURNAL.md` sind weiterhin der Ort, an dem der Stand lebt — lesbar, korrigierbar, in Git versioniert. claude-mem ist Zusatz-Recall, nie Ersatz. Nichts aus dem System darauf umbauen.

### `task-observer`: Skill-Lücken automatisch protokollieren (Experiment)

**Install:** `npx skills add rebelytics/one-skill-to-rule-them-all --skill task-observer`

Beobachtet die Arbeit, loggt Lücken und Verbesserungs-Kandidaten, speist wöchentliche Reviews. Ehrliche Einordnung: **Dieses Paket hat dafür schon eigene Mechanik** — die „ab jetzt"-Lernschleife, den Tagesabschluss und `claude-code-setup` für die Automatisierungs-Analyse. task-observer legt ein zweites Beobachtungs-Log daneben (zwei Orte für dieselbe Art Wissen) und kostet in jeder Session etwas mit. Wer es probiert: als Experiment mit Ablaufdatum — nach zwei Wochen entscheiden, ob es die eingebaute Schleife wirklich schlägt, sonst wieder raus.
