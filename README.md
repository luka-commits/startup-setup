# Dein Claude-Code-Workspace für den Arbeitsalltag

Dieses Paket macht Claude Code zu deinem persönlichen Arbeits-System: tägliches Briefing (Kalender + Mail-Triage), Projekt-Tracking mit Live-Dashboard und fertige Mail-Entwürfe in deinem eigenen Schreibstil.

> ### ⚠️ Claude fragt dich nicht nach Name und Projekten?
> **Schreib zuerst irgendetwas** („hallo" genügt). Claude wartet immer auf deine erste Nachricht, es fängt nie von allein an zu reden. Ein leeres Eingabefeld ist also kein Fehler.
>
> **Antwortet Claude darauf ganz normal, ohne nach deinem Namen und deinen Projekten zu fragen?** Dann läuft es im falschen Ordner. Das ist der mit Abstand häufigste Stolperstein: Claude Code muss **in diesem Ordner** geöffnet werden, sonst weiß es nichts von diesem System und verhält sich wie ein gewöhnlicher Chat. Der sichere Weg steht in [`SETUP.md`](SETUP.md), Schritt 2. Kein Fehler von dir, man sieht es dem Programm einfach nicht an.

## Was das ist (und was nicht)

Das hier **ersetzt nicht dein Mailprogramm** und auch kein Team-Tool. Es ist dein **privater Chief of Staff**: Es liest mit, erinnert sich und briefed dich. Was dein Team sehen muss, pflegst du weiter dort, wo dein Team es sieht — hier landet, was sonst nur in deinem Kopf ist.

Was das System liest, was es nie tut, und was du antwortest, wenn dich jemand fragt, ob du das nutzen darfst: **[`WAS-DIESES-SYSTEM-TUT.md`](WAS-DIESES-SYSTEM-TUT.md)** — eine Seite, lohnt sich vor dem ersten Start.

## Voraussetzungen

- **Claude Code** auf **Windows oder Mac**, dazu **git** (holt und aktualisiert das Repo) und **Node.js** (rendert das Dashboard; fehlt es, läuft alles andere trotzdem)
- **Ein Connector für Mail und Kalender.** Nichts ist hier fest an ein Mailprogramm verdrahtet: du verbindest in **Claude Cowork** unter Einstellungen, was ihr nutzt (Microsoft 365, Google Workspace oder anderes), Claude Code greift auf dieselbe Verbindung zu. Ohne Connector läuft alles außer dem Mail- und Kalender-Teil des Briefings. Welcher Connector was freischaltet: [`reference/mcp.md`](reference/mcp.md)
- **firecrawl und playwright** gehören hier zur Standard-Ausstattung und werden beim Einrichten mitinstalliert: Web-Inhalte holen und einen echten Browser steuern. Wofür genau: [`reference/tools.md`](reference/tools.md)

Was davon fehlt, sagt dir das Setup selbst, in einem Satz. Du musst vorher nichts nachsehen.

## Los geht's

Die vollständige Installationsstrecke steht in **[`SETUP.md`](SETUP.md)**: vom leeren Rechner über das Klonen des Repos und den ersten Chat bis zum Smoke-Test. Rechne mit 20 bis 30 Minuten, einmalig pro Person. Claude Code kann dich dabei selbst Schritt für Schritt durchführen, das steht dort oben.

**Der eine Schritt, der wirklich zählt** (Schritt 2 dort): Claude Code muss **in diesem Ordner** gestartet werden. Es hat kein Programm-Icon und sagt dir nicht, wo es gerade ist. Im falschen Ordner kennt es dieses System nicht und antwortet wie ein gewöhnlicher Chat, ohne Fehlermeldung. Genau daran scheitern die meisten Setups, und es fällt oft erst nach zwanzig Minuten auf.

**Das ist auch dein täglicher Einstieg:** VS Code mit diesem Ordner aufmachen, oder im Terminal in den Ordner wechseln und `claude` starten.

Nach dem Setup: `ONBOARDING.md` lesen und `/morning` ausprobieren. Wie der Ordner aufgebaut ist und was davon dir gehört, zeigt die **`ORDNERKARTE.html`** (Doppelklick, öffnet im Browser).

## Was du bekommst

| Befehl | Was er tut |
|---|---|
| `/morning` | Tages-Briefing: Kalender, Mail-Triage (was braucht Antwort, wo wartest du), Tasks, Dashboard |
| `/eod` | Tagesabschluss: Plan gegen Realität, was bleibt liegen, was wurde entschieden |
| `/email` | Mail-Entwurf in deinem Stil, fertig zum Abschicken in deinem Mailprogramm |
| `/ingest` | Dokumente, Transkripte, Notizen automatisch in deine Projekte einsortieren |
| _(kein Befehl)_ | Einfach im Chat reden: „2h an X gearbeitet", „warte auf Y" — landet automatisch am richtigen Ort |

**Du musst dir diese Befehle nicht merken.** „Was liegt heute an?" tut dasselbe wie `/morning`. Schreib in eigenen Worten, was du willst — die Befehle sind eine Abkürzung, kein Passwort.

**In Eile?** „Guten Morgen, schnell" überspringt die Postfach-Analyse und gibt dir in ~30 Sekunden Kalender und Aufgaben.

Grundprinzipien: Claude priorisiert nicht für dich (du siehst alles Offene, getaggt — du entscheidest), sendet nie automatisch, und fasst Mail/Kalender nur mit deiner Erlaubnis an. Sensible Themen (HR, Gehalt, Performance) bleiben komplett draußen.

## Wenn etwas falsch ist

Sag es einfach: „das stimmt nicht", „hab ich längst beantwortet", „das gehört nicht zu dem Projekt". Es wird korrigiert, ohne Diskussion — und wenn derselbe Fehler öfter kommt, wird die Ursache abgestellt, nicht nur der Einzelfall. **Widerspruch ist der Weg, wie das System besser wird**, nicht ein Zeichen, dass es kaputt ist.

## Kosten-Hinweis

Die Nutzung läuft über euer eigenes Claude-Konto und wird nach AI-Verbrauch abgerechnet. Zur Einordnung: **ein Morgen-Briefing entspricht ungefähr einer ausführlichen Chat-Konversation** — die Routine-Arbeit (Mails durchsehen, sortieren) läuft bewusst auf dem günstigsten Modell, die Berichte sind knapp gehalten. Der tägliche Betrieb fällt damit kaum ins Gewicht. Spürbar wird es nur, wenn du sehr große Dokumentenmengen einliest — und das kündigt Claude vorher an.

---

_Version + Ansprechpartner: [`VERSION.md`](VERSION.md)_
