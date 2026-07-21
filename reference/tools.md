# Die zwei empfohlenen CLIs

Zwei Kommandozeilen-Werkzeuge gehören in dieser Variante zur Standard-Ausstattung: **firecrawl** und **playwright**. Sie sind keine Plugins und ändern nichts an Claude Code selbst. Sie liegen einfach auf dem Rechner, und Claude ruft sie auf, wenn eine Aufgabe sie braucht.

Das Paket läuft auch ohne beide. Es fällt dann aber alles weg, was aus dem Internet kommt oder einen echten Browser braucht.

**Du musst nichts davon von Hand machen.** Die Einrichtung installiert beide Werkzeuge und richtet die Zugänge mit dir ein. Diese Seite ist zum Nachschlagen, wenn du später etwas ändern willst oder wissen möchtest, wofür das Ganze gut ist. Fehlt dir hinterher etwas, genügt ein Satz im Chat („richte mir den Firecrawl-Zugang ein"), dann führt Claude dich durch.

**Die Bedienungsanleitungen liegen schon bei.** Zu jedem Werkzeug gehört ein Skill, der Claude sagt, wie es richtig benutzt wird. Die sind im Paket enthalten, du musst nichts nachladen:

| Werkzeug | Mitgelieferte Skills |
|---|---|
| firecrawl | `firecrawl` plus `firecrawl-scrape`, `-search`, `-crawl`, `-map`, `-download`, `-agent`, `-browser` |
| playwright | `playwright-cli` |
| OpenRouter | kein eigener Skill nötig, der Zugang genügt |
| Supabase (nur wenn du Datenbanken nutzt) | `supabase`, `supabase-postgres-best-practices` |
| Eigene Agenten in der Cloud | `managed-agents` (braucht einen kostenpflichtigen API-Zugang zusätzlich zum Abo) |

Welche Aufgabe über welches Werkzeug läuft, steht als Tabelle in `CLAUDE.md` unter „Werkzeug-Routing". Das ist die Stelle, die dafür sorgt, dass die Ausstattung im Alltag überhaupt benutzt wird.

## firecrawl: Web-Inhalte und Suche

**Wofür im Alltag:**

- Ein Kunde schickt einen Link statt eines Dokuments. Claude liest die Seite als sauberen Text und sortiert sie ins Projekt ein, statt dass du Copy-Paste machst.
- Vor einem Termin: kurz nachsehen, was die Firma des Gesprächspartners öffentlich macht, und daraus eine Vorbereitungsnotiz.
- Eine Frage, deren Antwort aktueller ist als das Modellwissen. firecrawl sucht und liefert die Volltexte der Treffer, nicht nur die Snippet-Zeilen einer Suchmaschine.
- Eine ganze Dokumentationsseite in den Projektordner ziehen, um sie offline durchzuarbeiten.

**Was ohne nicht geht:** Alles, was hinter JavaScript liegt. Viele moderne Seiten liefern beim einfachen Abruf eine leere Hülle, der Inhalt wird erst im Browser nachgeladen. firecrawl rendert vorher, deshalb kommt Text zurück statt eines leeren Gerüsts. Ohne firecrawl bleibt der eingebaute Seitenabruf, der bei solchen Seiten regelmäßig nichts findet.

**Verhältnis zu den eingebauten Fähigkeiten:** Claude Code kann selbst suchen und Seiten abrufen. firecrawl ist der bessere Weg, wenn es auf den vollständigen Inhalt ankommt oder die Seite modern gebaut ist. Für eine schnelle Faktenfrage tut es die eingebaute Suche.

**Installation** (verifiziert, global über npm):

```
npm install -g firecrawl-cli
```

Danach braucht firecrawl einen API-Key. Der Key stammt aus einem **eigenen Firecrawl-Account** eurer Firma, nicht aus einem geteilten — Abrechnung und Nutzungsdaten bleiben damit bei euch. Account anlegen auf [firecrawl.dev](https://firecrawl.dev) (kostenloser Einstieg reicht zum Testen), der Key steht dort unter **API Keys**.

Den Key einmal dauerhaft setzen:

**Mac** (Terminal):
```
echo 'export FIRECRAWL_API_KEY="fc-DEIN-KEY"' >> ~/.zshrc
```

**Windows** (PowerShell):
```
setx FIRECRAWL_API_KEY "fc-DEIN-KEY"
```

Danach das Terminal einmal schließen und neu öffnen. Ob der Key sitzt, zeigt:

```
firecrawl --status
``` Wer die Daten gar nicht aus dem Haus geben will, kann Firecrawl selbst hosten und `FIRECRAWL_API_URL` auf die eigene Instanz zeigen lassen.

## playwright: alles, was einen echten Browser braucht

**Wofür im Alltag:**

- Das Dashboard nach einem Umbau ansehen und prüfen, ob es wirklich so aussieht wie gedacht. Nicht „der Code sollte stimmen", sondern ein Screenshot.
- Eine Seite, die einen Login verlangt. firecrawl kommt dort nicht rein, ein echter Browser schon.
- Ein Formular ausfüllen, das kein Interface für Maschinen anbietet.
- Ein PDF oder Screenshot von einer Seite erzeugen, um es in ein Projekt zu legen.

**Was ohne nicht geht:** Jede visuelle Prüfung. Ohne playwright kann Claude behaupten, das Dashboard sei in Ordnung, ohne es je gesehen zu haben. Das ist der häufigste Weg, wie ein „fertig" nicht stimmt.

**Verhältnis zu firecrawl:** Die Regel ist einfach. Geht es um den **Inhalt** einer Seite, ist firecrawl schneller und billiger. Geht es um **Interaktion oder Aussehen** (klicken, tippen, anmelden, ansehen), dann playwright. Beides gleichzeitig braucht man selten.

**Installation** (verifiziert, global über npm):

```
npm install -g playwright
playwright install chromium
```

Der zweite Befehl lädt den Browser herunter, den playwright steuert. Ohne ihn ist das Werkzeug installiert, aber ohne Browser nutzlos. Ein schneller Test:

```
playwright screenshot https://example.com test.png
```

> **Auf verwalteten Firmen-Laptops** kann dieser Browser-Download blockiert sein oder über einen internen Proxy laufen müssen. Schlägt er fehl, liegt es fast nie an dir: melde dich beim Ansprechpartner aus `VERSION.md`. Der Rest des Systems läuft ohne playwright vollständig weiter.

## OpenRouter: Bilder und Spezial-Modelle (optional)

Claude kann keine Bilder erzeugen. Wenn im Alltag Produktbilder, Illustrationen oder Social-Grafiken gebraucht werden — oder ein selbstgebauter Skill mal ein anderes Modell (Gemini-Bildmodelle, Kimi, …) aufrufen soll — läuft das über **einen** OpenRouter-Account statt fünf einzelner Anbieter-Konten: ein Key, alle Modelle, Abrechnung an einer Stelle.

**Einrichten:** Account auf [openrouter.ai](https://openrouter.ai), Key unter **Keys**, dann dauerhaft setzen (gleiches Muster wie beim Firecrawl-Key):

```
echo 'export OPENROUTER_API_KEY="sk-or-DEIN-KEY"' >> ~/.zshrc     # Mac
setx OPENROUTER_API_KEY "sk-or-DEIN-KEY"                          # Windows (PowerShell)
```

**Ehrliche Einordnung:** Das ist nichts für Tag 1. Der Chat selbst läuft immer über Claude (dein Abo, kein Doppel-Zahlen); OpenRouter kommt erst ins Spiel, wenn ein konkreter Bedarf da ist — dann sagt Claude von selbst, dass dafür der Key fehlt, und dieser Abschnitt ist die Anleitung.

## Reihenfolge beim Einrichten

Beide gehören zur Standard-Ausstattung dieser Variante und werden im Setup mitinstalliert. Das Kernsystem (Briefing, Projekte, Entwürfe, Einsortieren) läuft auch ohne sie, es kann dann nur weniger. Wenn du wirklich nur eines aufsetzt, nimm firecrawl. Web-Inhalte kommen im Alltag häufiger vor als Browser-Automatisierung.
