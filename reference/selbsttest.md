# Selbsttest

Die Prüfliste, mit der das System sich selbst kontrolliert. Sie wird an zwei Stellen gelesen:

- **`/morning`, am Ende des Laufs** — still. Es wird NUR etwas gesagt, wenn etwas nicht stimmt, und dann höchstens **eine** Zeile. Läuft alles, merkt der Nutzer nie, dass es diese Prüfung gibt.
- **`/checkup`** — auf Zuruf, meldet auch das Gute. Gedacht für den Support-Fall („lass mal /checkup laufen und schick mir das Ergebnis").

Der Sinn: Die gefährlichen Fehler dieses Systems sind die **stillen**. Ein Platzhalter, der nie ersetzt wurde, eine fehlende Datei, ein Zugang, der nicht mehr antwortet — nichts davon erzeugt eine Fehlermeldung, alles davon macht die Arbeit schlechter. Diese Liste macht sie sichtbar.

## Regeln für die Ausgabe

1. **Nur lokale Dateien lesen.** Der Selbsttest ruft nie Mail oder Kalender ab, er kostet damit praktisch nichts. Ob die Anbindung antwortet, weiß `/morning` ohnehin schon aus dem eigenen Lauf (Step 0c) — dieses Wissen wird verwendet, nicht neu erhoben.
2. **Eine Zeile, kein Bericht.** Im Briefing wird der **wichtigste** offene Punkt genannt, sonst keiner. Zwei Probleme heißt nicht zwei Zeilen.
3. **Klartext, kein Systemjargon.** Nie Dateinamen, Pfade, Feldnamen oder Fehlertexte. Immer: was ist die Folge für den Nutzer, und was macht er dagegen (ein Satz, wörtlich sagbar).
4. **Takt nach Schwere.** Stufe A wird bei jedem Briefing genannt, solange sie besteht (es ist ein echter Defekt). Stufe B nur **montags**, damit es nicht nörgelt.
5. **Nie selbst Werte erfinden.** Fehlt eine Angabe, wird gefragt, nicht geraten.

## Stufe A — verfälscht die Arbeit, täglich melden

| Prüfung | Woran erkennbar | Was der Nutzer hört |
|---|---|---|
| Einrichtung unvollständig | `context/config.yaml` enthält noch `[DEIN NAME]` | „Deine Einrichtung ist nicht fertig geworden. Sag `/setup`, dann machen wir das in zehn Minuten zu Ende." |
| Firmen-Domain fehlt | `company_domains` ist leer oder enthält `[deine-firma.de]` | „Ich weiß noch nicht, wie eure Mail-Domain heißt, deshalb behandle ich Mails von Kollegen wie externe. Sag mir eure Domain, dann sortiere ich richtig." |
| Config unlesbar | Datei existiert, lässt sich aber nicht als YAML lesen | „In deinen Einstellungen ist eine Zeile verrutscht, ich arbeite gerade mit halben Angaben. Ich kann den Stand von gestern zurückholen, sag Bescheid." Dazu die betroffene Zeile nennen. |
| Kern-Datei fehlt | Eine von `PROJECTS.md`, `STATUS.md`, `JOURNAL.md` ist weg | Still aus dem Backup wiederherstellen (Safeguard 4), danach EIN Satz, was repariert wurde. Nur wenn das nicht geht, melden. |
| Dashboard-Vorlage fehlt | `context/today_template.html` ist weg | „Die Dashboard-Vorlage fehlt, deshalb gibt es heute nur das Briefing im Chat. Die Datei muss aus der Original-Kopie zurück." |

## Stufe B — Komfort fehlt, montags melden

| Prüfung | Woran erkennbar | Was der Nutzer hört |
|---|---|---|
| Mail-Stil nie abgeleitet | `context/EMAIL_STYLE.md` fehlt | „Ich schreibe Entwürfe noch im Standardton. Sag ‚leite meinen Mail-Stil ab', dann klingen sie nach dir." |
| Entwurfsweg unbekannt | `draft_method` ist leer | „Für Mail-Entwürfe habe ich noch keinen Weg. Sag Bescheid, dann finden wir den passenden." |
| Dashboard-Weg unbekannt | `script_command` ist leer | „Das Dashboard kann ich gerade nicht bauen, das Briefing im Chat läuft normal weiter." |
| Ausstattung nie erfasst | `inventory` ist komplett leer | „Im Workspace-Tab ist deine Ausstattung noch leer. Wenn du magst, trage ich ein, was bei dir verbunden ist." |
| Routine ohne Lebenszeichen | Eine Routine steht in `inventory.routines`, aber ihre jüngste Ergebnis-Datei (z.B. `inbox/briefing-*.md` bei der Morgen-Routine) ist älter als 2 Werktage | „Deine [Routine] hat seit [X] nichts mehr abgeliefert — vermutlich ist die Verbindung in der Cloud abgelaufen. Auf claude.ai/code/routines siehst du den letzten Lauf; ‚Run now' testet sie sofort." |
| Karteileichen | Tasks, die seit über 30 Tagen unverändert offen stehen | „Drei Aufgaben stehen seit über einem Monat unverändert. Sollen die weg, oder sind sie noch aktuell?" |
| Ausstattung driftet | Der heutige Lauf widerspricht `config.yaml → inventory`: ein Connector antwortet, der als „nicht verbunden" geführt wird (oder umgekehrt, Wissen aus `/morning` Step 0c bzw. ToolSearch — kein Extra-Abruf), ein gelistetes CLI fehlt auf dem Rechner | Still korrigieren (inventory anpassen, Safeguard 4), danach EIN Satz nur, wenn etwas Neues auftauchte, das eine Entscheidung braucht: „Du hast inzwischen [X] verbunden — soll ich es ins Briefing einbeziehen?" |

## Was NICHT geprüft wird

- **Ob Postfach und Kalender antworten.** Das erledigt `/morning` im eigenen Lauf und sagt es dort schon (Step 0c). Doppelt melden nervt.
- **Ob Inhalte stimmen.** Der Selbsttest prüft die Mechanik, nie die fachliche Richtigkeit. Ein falscher Projektstatus ist kein technischer Fehler.
- **Nichts, was einen zusätzlichen Abruf kostet.** Sobald eine Prüfung Geld kostet, gehört sie nicht in einen stillen Hintergrundlauf.
