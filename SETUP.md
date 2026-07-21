# Setup

Einmalig pro Person, etwa 20 bis 30 Minuten. Danach startest du jeden Tag nur noch Claude Code in diesem Ordner.

Diese Anleitung deckt alles ab, was **vor** dem ersten Chat passieren muss: Werkzeuge installieren, Repo holen, Claude Code am richtigen Ort starten, Verbindungen herstellen. Dieselben Schritte gibt es als visuelle Karte zum Abhaken: **`SETUP-ROADMAP.html`** (Doppelklick, öffnet im Browser, merkt sich deinen Fortschritt). Die eigentliche Personalisierung (dein Name, deine Projekte, dein Mail-Stil) fragt Claude im ersten Chat selbst ab. Du musst hier nichts über dich eintragen.

**Reihenfolge zählt.** Schritt 2 ist der Punkt, an dem die meisten Setups scheitern. Nimm ihn ernst, auch wenn er trivial aussieht.

---

## Lass dich durchführen (empfohlen)

Sobald Schritt 0 erledigt ist, ist Claude Code selbst da und kann dich durch den Rest führen. Starte `claude` und sag:

> „Führ mich durch das SETUP.md ab Schritt 1. Gib mir einen Befehl nach dem anderen, warte bis ich ihn ausgeführt habe, und prüf das Ergebnis, bevor wir weitergehen."

Browser-Logins (OAuth, Connectors) machst du selbst, den Rest kann Claude übernehmen. Wer lieber liest und tippt, arbeitet die Schritte einfach von oben nach unten ab.

---

## 0. Voraussetzungen

Vier Bausteine, einmalig pro Rechner:

- **git** holt das Repo und hält es aktuell.
- **GitHub-Konto + GitHub CLI (`gh`)** — dein Workspace lebt in einem privaten GitHub-Repo: dort holst du ihn dir, und dorthin sichert der Tagesabschluss deinen Stand (dein Konto, dein Zugriff). Die CLI erledigt die Anmeldung einmal, danach fragt nie wieder etwas nach einem Passwort.
- **Node.js** führt die Zusatz-Werkzeuge aus und rendert das Dashboard. Ohne Node läuft alles außer der Dashboard-Datei.
- **Claude Code** ist der Assistent selbst.

**Noch kein GitHub-Konto?** Auf [github.com/signup](https://github.com/signup) eines anlegen (kostenlos, die Firmen-Mail nehmen). Den Benutzernamen brauchst du gleich; der Person, von der du das Paket hast, sagst du ihn einmal — sie schaltet dich für das Repo frei.

**Mac:**

```bash
# Homebrew, falls noch nicht vorhanden
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node git gh
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows:**

1. Node.js LTS von [nodejs.org](https://nodejs.org) installieren (Standard-Installer, alle Vorgaben übernehmen).
2. Git for Windows von [git-scm.com/downloads/win](https://git-scm.com/downloads/win) installieren. Claude Code nutzt das mitgelieferte Git Bash als Shell, deshalb ist das kein optionaler Schritt.
3. GitHub CLI in **PowerShell**: `winget install GitHub.cli`
4. Claude Code in **PowerShell** installieren:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Alternativ über WinGet: `winget install Anthropic.ClaudeCode` (aktualisiert sich dann nicht automatisch).

**Einmal bei GitHub anmelden** (Mac: Terminal, Windows: Git Bash — Fenster danach einmal neu öffnen, damit `gh` gefunden wird):

```bash
gh auth login
```

Die Fragen so beantworten: `GitHub.com` → `HTTPS` → `Login with a web browser`, dann den angezeigten Code im Browser eingeben. Das war's — diese Anmeldung gilt dauerhaft, auch für die tägliche Sicherung.

**Check** (Mac: Terminal, Windows: Git Bash oder PowerShell):

```bash
node --version
git --version
gh auth status
claude --version
```

Drei Versionsnummern plus ein „Logged in to github.com", dann passt es. Beim ersten `claude`-Start meldest du dich einmal im Browser an. Claude Code braucht ein Pro-, Max-, Team- oder Enterprise-Konto.

---

## 1. Repo klonen

Das ist die Adresse:

```
https://github.com/luka-commits/startup-setup
```

Das Repo ist privat. Damit du es sehen kannst, musst du einmal freigeschaltet sein — dafür hast du in Schritt 0 deinen GitHub-Benutzernamen durchgegeben. Bekommst du beim Klonen „repository not found", ist meistens genau das der Grund, nicht ein Tippfehler.

**Weg A, in VS Code (kein Terminal nötig):**

1. VS Code öffnen.
2. `Strg+Umschalt+P` (Mac: `Cmd+Umschalt+P`), `Git: Clone` tippen, Enter.
3. Die Adresse oben einfügen, Enter.
4. Als Zielort einen eigenen Ordner wählen, zum Beispiel `code` in deinem Benutzerverzeichnis.
5. Auf „Öffnen" klicken, wenn VS Code fragt, ob es den geklonten Ordner öffnen soll.

Beim ersten Mal fragt VS Code nach deiner GitHub-Anmeldung und schickt dich in den Browser. Das ist normal, danach nie wieder.

**Weg B, im Terminal:**

```bash
mkdir -p ~/code && cd ~/code
gh repo clone luka-commits/startup-setup
cd startup-setup
```

**Egal welcher Weg: nicht** nach `Desktop` oder `Dokumente` klonen, wenn diese Ordner mit iCloud oder OneDrive synchronisiert werden. Die Sync-Dienste legen bei schnellen Schreibvorgängen Konfliktkopien an (`STATUS 2.md`), und das System liest irgendwann die falsche Datei. Ein eigener Ordner wie `~/code` ist der sichere Ort.

**Check:** Im VS-Code-Explorer links siehst du `CLAUDE.md`, `context/`, `projects/` und den Ordner `.claude`. Im Terminal zeigt `ls -a` dasselbe. Fehlt `.claude`, ist der Klon unvollständig und nichts Weiteres funktioniert.

**Dieser Ordner bleibt nicht meiner.** Beim Einrichten in Schritt 3 legt Claude daraus dein eigenes privates Repo unter deinem GitHub-Konto an — dir gehörend, für niemanden sonst sichtbar. Von da an sichert der Tagesabschluss dorthin, und Updates von mir holst du dir bewusst mit einem Satz im Chat.

---

## 2. Claude Code IN diesem Ordner öffnen

**Das ist der wichtigste Schritt der ganzen Anleitung.**

Claude Code hat kein Programm-Icon und kein Fenster, das dir sagt, wo es gerade ist. Es liest immer den Ordner, in dem es gestartet wurde. Startest du es irgendwo anders, kennt es dieses System nicht: keine Befehle, keine Projekte, kein Briefing. Es antwortet dann wie ein ganz normaler Chat, ohne Fehlermeldung. Genau deshalb fällt der Fehler oft erst nach zwanzig Minuten auf.

Zwei Wege, beide führen zum selben Ergebnis:

**Weg A, VS Code (für die meisten der bequemste):**
Wenn du in Schritt 1 über VS Code geklont hast, ist der Ordner schon offen — sonst „Datei → Ordner öffnen" und den geklonten Ordner wählen. Dann das Claude-Panel aufmachen (Claude-Symbol in der Seitenleiste; fehlt es, in den Erweiterungen nach „Claude Code" suchen und installieren). Links im Explorer siehst du `CLAUDE.md` und `context/`. Das ist dein Beweis, dass der richtige Ordner offen ist.

**Weg B, Terminal:**

```bash
cd ~/code/startup-setup
claude
```

Auf Windows geht das auch schneller: den Ordner im Explorer öffnen, oben in die Adresszeile klicken, `cmd` tippen, Enter, dann `claude` eingeben.

### Woran du erkennst, dass du richtig bist

Nach dem Start zeigt Claude Code den aktuellen Arbeitsordner an. Steht dort der Name deines geklonten Ordners, passt es.

Die verlässlichere Probe kommt in Schritt 3: **Wenn Claude auf deine erste Nachricht mit der geführten Einrichtung antwortet und dich nach Name und Projekten fragt, bist du richtig.** Antwortet es stattdessen wie ein normaler Chat, bist du im falschen Ordner. Dann Claude Code beenden (`/exit`), mit `cd` in den richtigen Ordner wechseln und neu starten.

---

## 3. Erster Start

Tipp `hallo` und drücke Enter. Mehr nicht.

Claude erkennt selbst, dass dieser Ordner noch niemandem gehört, und startet die Einrichtung: ein paar Fragen zu Name, Rolle, Standort und deinen laufenden Projekten, danach legt es deine Ordner und Dateien an. Optional kannst du dabei Dokumente einsortieren lassen und deinen Mail-Stil aus deinen eigenen gesendeten Mails ableiten.

Rechne mit 10 bis 20 Minuten, je nachdem wie viele Projekte und Dokumente du mitbringst. Beides lässt sich später nachziehen.

**Zwei Fragen am Ende sind wichtig, überlies sie nicht.** Claude bietet an, dir dein eigenes privates Repo anzulegen — das ist deine tägliche Sicherung, sie gehört deinem Konto. Sag hier Ja, sonst hat der Tagesabschluss nichts, wohin er sichern kann. Danach fragt es getrennt, ob der Ansprechpartner aus `VERSION.md` Zugriff auf dieses Repo bekommen soll, damit er dir bei Problemen helfen kann. Das ist eine echte Wahl: mit Zugriff kann er auch alles lesen, was mit der Zeit darin landet. Nein ist eine völlig normale Antwort, und du kannst es später jederzeit ändern.

**Claude wartet immer auf deine erste Nachricht.** Ein leeres Eingabefeld nach dem Start ist kein Fehler.

**Noch im selben Fenster, ein Befehl:** den offiziellen Plugin-Katalog von Anthropic freischalten —

```
/plugin marketplace add anthropics/claude-plugins-official
```

Das installiert nichts. Es macht den Katalog bekannt, damit Claude dir im Alltag das passende Werkzeug daraus empfehlen kann, wenn eine Aufgabe eines braucht — installiert wird nur, wenn du Ja sagst. Was aus dem Katalog wirklich zählt, steht in `reference/plugins.md`.

---

## 4. Connectors verbinden (Mail, Kalender, Ablage)

Damit das Morgen-Briefing deinen Kalender kennt und Mail-Entwürfe im richtigen Postfach landen, braucht Claude Zugriff auf deine Systeme. Das läuft über Connectors, die du **einmal in Claude Cowork** unter Einstellungen verbindest: Microsoft 365, Google Workspace, Google Drive, oder was ihr sonst nutzt. Claude Code greift danach auf dieselbe Verbindung zu, du musst hier nichts doppelt einrichten.

Welche Connectors welchen Teil des Systems freischalten, was ohne sie noch läuft und wie du prüfst, ob eine Verbindung wirklich steht: **`reference/mcp.md`**.

Ohne Connector funktioniert der Rest weiter: Projekte, Aufgaben, Dashboard und Dokumenten-Einsortierung brauchen keine Anbindung. Es fehlt dann nur der Mail- und Kalender-Teil.

---

## 5. Empfohlene CLIs

Zwei Kommandozeilen-Werkzeuge gehören in dieser Variante zur Standard-Ausstattung. Sie erweitern, was Claude praktisch tun kann, und werden hier gleich mitinstalliert.

```bash
npm install -g firecrawl-cli playwright
playwright install
```

- **firecrawl** holt Web-Inhalte und durchsucht das Netz.
- **playwright** steuert einen echten Browser: Formulare, Logins, Screenshots, Oberflächen prüfen. `playwright install` lädt die dazugehörigen Browser nach, das dauert beim ersten Mal ein paar Minuten.

**Check:** `firecrawl --version` und `playwright --version` geben je eine Version aus.

Wofür die beiden im Alltag konkret gut sind und welche Werkzeuge sonst noch sinnvoll sind: **`reference/tools.md`**.

---

## 6. API-Keys

firecrawl braucht einen eigenen Zugang, andere Dienste später ebenfalls. Diese Schlüssel gehören **nicht ins Repo**: das Repo wird geteilt, geklont und versioniert, ein einmal committeter Schlüssel bleibt in der Git-Historie stehen, auch wenn du ihn danach löschst. Deshalb liegen alle Schlüssel in einer einzigen Datei außerhalb des Repos.

**Schritt 1:** Einen **eigenen** Account auf [firecrawl.dev](https://firecrawl.dev) anlegen, unter *API Keys* einen Schlüssel erzeugen (beginnt mit `fc-`). Es gibt einen kostenlosen Einstiegs-Tarif, der zum Ausprobieren reicht.

Der Account gehört euch, nicht dem Dienstleister, der euch dieses Paket eingerichtet hat. So laufen Abrechnung und Nutzungsdaten bei euch, und niemand teilt sich ein Limit.

**Schritt 2:** Schlüssel lokal hinterlegen:

```bash
mkdir -p ~/.config
cat > ~/.config/credentials.env <<'EOF'
FIRECRAWL_API_KEY=fc-DEIN_KEY
EOF
chmod 600 ~/.config/credentials.env
```

`chmod 600` heißt: nur dein Benutzerkonto darf die Datei lesen. Weitere Schlüssel hängst du später einfach an:

```bash
echo 'ANDERER_KEY=wert' >> ~/.config/credentials.env
```

**Check:** `grep -c KEY ~/.config/credentials.env` gibt die Anzahl deiner Einträge zurück.

Auf Windows führst du diese Befehle in Git Bash aus. Die Datei landet dann unter `C:\Users\<DU>\.config\credentials.env`. `chmod` hat auf Windows-Dateisystemen nur begrenzte Wirkung, der Ordner ist aber ohnehin nur für dein Benutzerkonto vorgesehen.

---

## 7. Smoke-Test

Einmal alles prüfen, damit nichts halb konfiguriert bleibt.

Im Terminal:

```bash
claude --version                    # Claude Code installiert
node --version                      # Dashboard-Laufzeit da
firecrawl --version                 # aus Schritt 5
ls context/config.yaml              # Setup hat geschrieben
```

Im Chat (Claude Code im Ordner gestartet):

```
/morning
```

**Das erwartete Ergebnis:**

- Claude begrüßt dich mit deinem Namen, nicht generisch.
- Es zeigt deine Projekte und Aufgaben aus dem Setup.
- Es öffnet `context/today.html` im Browser, dein Dashboard.
- Bei verbundenem Connector kommen Kalender und Mail dazu, sonst sagt es in einem Satz, dass dieser Teil fehlt.

Läuft das durch, ist das Setup fertig. Ab morgen ist `/morning` dein täglicher Einstieg.

---

## Wenn etwas fehlt oder fehlschlägt

| Symptom | Ursache und Lösung |
|---|---|
| Claude antwortet auf `hallo` wie ein normaler Chat, fragt nichts | Falscher Ordner. Zurück zu Schritt 2. Der mit Abstand häufigste Fall. |
| `claude: command not found` | Terminal nach der Installation nicht neu geöffnet. Fenster schließen, neu öffnen. Hilft das nicht: `claude doctor` in einem Terminal, das es kennt, sonst Schritt 0 wiederholen. |
| `ls -a` zeigt kein `.claude` | Klon unvollständig oder Ordner von Hand kopiert statt geklont. Neu klonen, Schritt 1. |
| Beim Klonen: „repository not found" | Du bist noch nicht freigeschaltet, oder `gh auth login` fehlt. Benutzernamen durchgeben und Schritt 0 prüfen. Ein Tippfehler in der Adresse ist der seltenere Fall. |
| Abends: „Push scheitert" oder „nichts gesichert" | Beim Setup wurde kein eigenes Repo angelegt. Sag im Chat „leg mir mein eigenes Repo an", dann wird es nachgeholt. |
| Dashboard entsteht nicht | Node.js fehlt oder ist nicht im PATH. `node --version` prüfen, sonst Schritt 0. Briefing im Chat läuft trotzdem. |
| Kein Kalender, keine Mail im Briefing | Connector nicht verbunden. Schritt 4 und `reference/mcp.md`. |
| Dateien mit ` 2.` im Namen tauchen auf | Der Ordner liegt in einem Sync-Verzeichnis. Konfliktkopien löschen, Repo nach `~/code` verschieben, Schritt 1. |
| `npm install -g` scheitert mit Rechte-Fehler | Nicht mit `sudo` wiederholen. Auf Mac hilft eine Homebrew-Node-Installation, sonst npm-Präfix auf einen Ordner im Home-Verzeichnis setzen. |

Kommst du an einer Stelle nicht weiter: die fehlschlagende Zeile plus die vollständige Ausgabe melden, Ansprechpartner steht in `VERSION.md`. Ratet nicht drumherum, halb konfigurierte Setups fallen sonst erst Wochen später auf.

---

## Optional: Das Briefing automatisch laufen lassen

Wer morgens `/morning` tippen muss, vergisst es irgendwann. Dagegen gibt es **Routinen**: Claude Code führt eine Aufgabe zeitgesteuert aus, ohne dass jemand davor sitzt.

**Wichtig zu verstehen, bevor ihr das einschaltet:** Eine Routine läuft **nicht auf eurem Rechner**, sondern in Anthropics Cloud, mit einem frischen Klon eures Repos. Sie sieht keine lokalen Dateien und keine lokal hinterlegten Zugangsdaten. Sie arbeitet im Klon, committet und pusht. Auf eurem Rechner erscheint das Ergebnis erst nach einem `git pull`.

Daraus folgen drei Bedingungen:

1. Der Workspace muss ein Repo sein, auf das die Cloud zugreifen kann. Bei dieser Auslieferung ist er das ohnehin.
2. Mail- und Kalender-Connector müssen **an die Routine** gehängt werden, nicht nur lokal verbunden sein. Der Assistent fragt das beim Anlegen ab.
3. Der Arbeitsstand liegt damit auf GitHub und wird in Anthropics Cloud verarbeitet. Das ist eine bewusste Abweichung von der sonst rein lokalen Arbeitsweise, siehe `WAS-DIESES-SYSTEM-TUT.md`. Wer das nicht will, lässt Routinen weg und tippt `/morning` selbst.

Einrichten geht im Gespräch, direkt in diesem Ordner:

```
/schedule jeden Werktag um 8:00: Morgen-Briefing erstellen, committen und pushen
```

Claude fragt Repo, Umgebung, Modell und Connectors ab und legt die Routine an. Verwalten: `/schedule list`, `/schedule update`, `/schedule run`. Übersicht im Browser: [claude.ai/code/routines](https://claude.ai/code/routines) (Login nötig).

**Check:** `/schedule list` zeigt die Routine. Auf der Detailseite startet „Run now" einen Testlauf.

**Voraussetzung:** ein Abo-Login mit aktiviertem Claude Code im Web. Der kürzeste mögliche Abstand zwischen zwei Läufen ist eine Stunde.

**Mehr fertige Routinen** (Wochenrückblick, Montags-Vorausblick) stehen mit Kopier-Sätzen in [`reference/routinen.md`](reference/routinen.md).

---

## Optional: Diktieren statt Tippen

Dieses System läuft über Text im Chat. Genau da sitzt die Bremse: Wer den Kontext zu einem Projekt eintippen muss, tippt irgendwann weniger, und dann weiß das System weniger.

**Wispr Flow** wandelt Sprache in sauberen Text um, in jedem Eingabefeld, auch auf Deutsch. Statt drei Sätze zu tippen, sagst du sie. Für längere Prompts, Meeting-Notizen und Mail-Entwürfe ist der Unterschied deutlich.

- Download: [wisprflow.ai](https://wisprflow.ai)
- Der erste Monat ist kostenlos.

Rein optional. Wer lieber tippt, lässt es weg.

---

## Danach

Jeden Tag: VS Code mit diesem Ordner öffnen, oder im Terminal `cd` in den Ordner und `claude` starten. Ein „Guten Morgen" genügt, den Rest kennt das System.

Wie der Ordner aufgebaut ist, steht in `ONBOARDING.md` und in der `ORDNERKARTE.html` (Doppelklick, öffnet im Browser). Was das System liest und was es nie tut, steht in `WAS-DIESES-SYSTEM-TUT.md`. **Für die erste Woche:** die Übungen in `reference/uebungen.md` — ein Szenario pro Tag, daran lernt man das Arbeiten mit dem System schneller als durch Lesen. Alle Links und Anleitungen an einem Ort: `reference/links.md`.
