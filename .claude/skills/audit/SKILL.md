---
name: audit
description: "Beurteilt einen Ordner als Arbeitssystem und sagt, was ihn besser machen würde. Misst 11 Dimensionen (Deckung und Routing, Automatisierungsgrad, Sicherheit, Erreichbarkeit der Dokumente, Frische, Kontext-Ballast, Kaltstart, Entscheidungs-Gedächtnis, Lebenszyklus, Sicherung, Code) und urteilt danach in Alltagssprache. Nutze diesen Skill, wenn jemand sagt 'audit', 'prüf mal mein Setup', 'ist mein Workspace gut aufgestellt', 'was fehlt mir noch', 'wie sauber ist der Ordner', 'bewerte das Claude-Setup', 'schau dir den Ordner von X an', 'welche Skills brauche ich', 'welche Tools sollte ich anbinden', 'lohnt sich mein CRM noch', oder wenn ein fremdes Setup vor einem Erstgespräch eingeschätzt werden soll. Läuft auf JEDEM Ordner, auch ohne git, ohne Config und ohne Vorgeschichte. Nicht zu verwechseln mit /checkup — das prüft nur, ob die Mechanik dieses einen Workspace gerade intakt ist."
---

# /audit

Beurteilt einen Ordner als **Arbeitssystem**: nicht ob die Dateien ordentlich liegen, sondern ob das Ganze die Arbeit trägt, die darin tatsächlich stattfindet.

**Der Unterschied zu `/checkup`:** `/checkup` fragt „ist die Mechanik gerade intakt" — feste Liste, täglich, still, nur dieser Workspace. `/audit` fragt „taugt dieser Ordner als Arbeitssystem" — allgemeine Kriterien, monatlich, auf jedem Ordner. Klingt es nach „bei mir spinnt was", ist `/checkup` richtig.

## Zwei Ebenen, und nur die erste läuft immer

**Ebene 1, der Ordner selbst.** Messung und Urteil: was liegt hier, wird es benutzt, findet Claude es, stimmt es noch, ist es gesichert. Braucht keine Fragen und keine Vorbereitung, läuft in Sekunden. **Das ist der Standardlauf** und für die meisten Fälle der ganze Wert — besonders in Umgebungen, in denen Werkzeuge ohnehin von der IT gesetzt werden und niemand ein CRM aussucht.

**Ebene 2, der Betrieb dahinter.** Passen die Werkzeuge zu dem, was dieser Mensch tut? Braucht ein kurzes Profil und Recherche, deshalb wird sie **angeboten, nicht vorausgesetzt** (Schritt 5). Existiert `context/profile.md` bereits, läuft sie ohne Nachfrage mit.

Diese Trennung ist der Grund, warum der Skill in einem Konzern-Workspace genauso funktioniert wie bei einem Selbstständigen: dort bleibt es bei Ebene 1, und das ist vollständig, nicht halbiert.

## Schritt 1 — Messen

```
node reference/scripts/workspace-audit.js [--root <pfad>]
```

Schreibt `context/audit.json` und druckt eine Zusammenfassung nach stderr. Liest ausschließlich lokale Dateien und die Session-Logs unter `~/.claude/projects/`, kostet also nichts.

**Die JSON lesen, nicht die stderr-Ausgabe interpretieren.** Jede Dimension hat `level` (`ok`/`watch`/`act`/`unknown`), `metric` und `findings` mit `what`/`why`/`fix`/`evidence`.

**`unknown` ist kein Befund**, sondern ein fehlender Beleg: kein git, keine Session-Logs, keine Config. Das gehört als Einschränkung gesagt, nicht als Mangel bewertet. Ein frisch geklonter Kundenordner hat keine Nutzungsdaten — dann stützt sich das Urteil auf Struktur und Inhalt.

## Schritt 2 — Urteilen

Was kein Script sieht. Die Einstiegsdokumente lesen (`CLAUDE.md`, `AGENTS.md`, `README.md`) plus die Dateien aus den Fundstellen, **gedeckelt auf etwa 15 Dateien**:

- **Widersprechen sich zwei Anweisungen?** Zwei Regeln, die dasselbe verschieden regeln, sind schlimmer als keine Regel — befolgt wird dann die zufällig zuletzt gelesene.
- **Sind die Regeln überprüfbar formuliert?** „Sei gründlich" ist Prosa. „Vor dem Schreiben prüfen, ob die Datei existiert" ist eine Regel.
- **Passt die Ordnerlogik zu der Arbeit, die laut Session-Logs wirklich stattfindet?** Wenn 90 Prozent der Arbeit in einem Bereich passiert, der drei Ebenen tief liegt, stimmt die Struktur nicht mehr mit der Realität überein.
- **Welche unbenutzte Fähigkeit ist eine echte Lücke, und welche schlicht überflüssig?** Ein Skill, den es seit einem halben Jahr gibt und den nie jemand aufgerufen hat, ist kein Vorrat, sondern Ballast — es sei denn, er deckt einen seltenen, wichtigen Fall.

**Code wird im Standardlauf nicht gelesen.** Die Code-Kachel misst nur mechanisch (README vorhanden, uncommittete Arbeit, ruhende Repos). Will der Nutzer danach ein Urteil über ein einzelnes Repo („schau dir X genauer an"), dann **`references/code-review.md` lesen** — dort stehen die Prüfkriterien, die Ausschlussliste gegen Fehlalarme und das Vorgehen mit mehreren Blickwinkeln plus getrennter Confidence-Runde. Hat das Repo einen offenen Pull Request, ist `/code-review` der bessere Weg und wird stattdessen empfohlen.

Ergebnis als `judgement` zurück in `context/audit.json`.

**Befund-Disziplin:** Jeder Befund trägt `severity` und `confidence`. Unter 0.7 Confidence gar nicht melden. Lieber ein theoretisches Problem übersehen als den Bericht mit Rauschen fluten — ein Prüfer, der Fehlalarme meldet, wird nach zwei Tagen ignoriert und ist dann schlimmer als keiner. Die Probe vor jedem Befund: Würde ein erfahrener Mensch das im Gespräch tatsächlich ansprechen?

## Schritt 3 — Vorschlagen

Aus den Befunden **das Setup entwerfen, das dieser Ordner haben sollte**. Drei Sorten, alle drei ohne Profil ableitbar:

| Sorte | Woraus | Beispiel |
|---|---|---|
| **Kommandos** | wiederkehrende Handgriffe, die noch keinen Namen haben | „das machst du dreimal die Woche von Hand" |
| **Routinen** | was regelmäßig passieren müsste, aber vergessen wird | Wochenrückblick, Postfach-Durchgang |
| **Automatisierungen** | **belegt** aus den Wiederholungsmustern in `audit.json` | „diesen Ablauf hast du 40-mal getippt" |

Je Vorschlag: was er löst, was er kostet, was man sich einhandelt. **Nie eine Einzelempfehlung** — zwei bis drei Wege nebeneinander, einer markiert mit Begründung. Format: `references/report.md`.

**Nicht selbst ausdenken, was es schon gibt.** Für die Frage „welche Claude-Automatisierung passt zu dieser Codebasis" existiert der Skill `claude-automation-recommender` (aus dem Plugin `claude-code-setup`). Der kennt den vollständigen Katalog — Hooks, Subagenten, Skills, Plugins, MCP-Server — und leitet aus Codebase-Mustern ab, was sich lohnt. Ihn aufrufen und sein Ergebnis übernehmen, statt eine eigene, schmalere Liste zu erfinden.

**Was er nicht hat, haben wir:** er liest nur die Codebasis, nicht die Session-Logs. Die Wiederholungsmuster aus `audit.json` (`dimensions[automation].findings[].evidence.samples`) sind der Beleg, den seine Vorschläge nicht liefern können — „diesen Ablauf hast du 40-mal getippt" schlägt jede Katalog-Empfehlung. Beides zusammenführen: sein Katalog, unsere Belege.

## Schritt 4 — Berichten

Im Chat: ein Satz Gesamturteil, dann je Dimension höchstens eine Zeile, dann die drei Dinge mit dem größten Hebel. Alltagssprache, **Konsequenz statt Messwert** („diese zwölf Dokumente liest Claude nie, weil nichts auf sie zeigt" statt „12 Waisen"). Keine Prüfprotokoll-Optik, keine Aufzählung jeder bestandenen Prüfung.

Das Ergebnis liegt in `context/audit.json`. **Das Dashboard zeigt es nicht** — es gibt dafuer keinen Platzhalter, und das ist Absicht: ein Audit ist eine Momentaufnahme mit Datum, kein Dauerzustand. Wer den Befund festhalten will, laesst ihn ins Journal schreiben. Die Datei selbst ist von der Auslieferung ausgeschlossen, sie beschreibt genau eine Maschine.

**Nichts reparieren ohne Ansage.** Was gefahrlos und offensichtlich ist (ein toter Symlink, ein Verweis auf eine umbenannte Datei), nach kurzer Ansage direkt korrigieren. Alles andere vorschlagen.

## Schritt 5 — Die Betriebs-Ebene anbieten

Nach dem Bericht **einmal** anbieten, nicht drängen:

> „Wenn du willst, schaue ich auch, ob deine Werkzeuge zu dem passen, was du tatsächlich machst — welches CRM, welche Anbindungen fehlen, was doppelt bezahlt wird. Dafür brauche ich zwei Minuten Fragen."

Sagt der Nutzer zu (oder existiert `context/profile.md` schon), weiter mit **`references/business-layer.md`** — dort stehen die sechs Fragen, die Ableitung des Soll-Profils und die Werkzeug-Dossiers.

**Wann dieses Angebot gar nicht kommt:** wenn der Ordner erkennbar in einer Umgebung liegt, in der Werkzeuge nicht selbst gewählt werden (Konzern-Setup, verwaltete Connectoren, IT-Vorgaben in der CLAUDE.md). Dort ist die Frage „welches CRM wäre besser" sinnlos und wirkt weltfremd. Im Zweifel: nicht anbieten. Ebene 1 steht für sich.

## Selbstverbesserung

Zwei Signale: ein Befund wird korrigiert („das ist kein Problem"), oder einer wird ausdrücklich gelobt. Bei beidem fragen: „Soll das dauerhaft rein?"

Wohin die Korrektur wandert, hängt davon ab, was falsch war:

- **Fehlalarm oder verpasster Befund in einer gemessenen Dimension** → nach `reference/scripts/workspace-audit.js`, als Ausschluss oder als neue Prüfung. Eine zählbare Regel gehört ins Script, nicht in Prosa, sonst ist sie Deko.
- **Ton oder Aufbau des Berichts** → nach `references/report.md`.
- **Falsch gewichteter Slot oder Werkzeug-Urteil** → nach `references/business-layer.md`.
- **Eine Frage im Intake fehlt oder nervt** → ebenfalls `references/business-layer.md`.

Fehlalarm heißt: Prüfer reparieren, nicht Befund wegklicken.
