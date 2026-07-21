# Übungen — die erste Woche

Das hier ist kein Handbuch, sondern ein Trainingsplan. Nach dem Setup lernst du das System am schnellsten, indem du es benutzt, nicht indem du darüber liest. Jede Übung ist ein kleines Szenario zum Nachmachen, mit einem klaren Zeichen, woran du siehst, dass es geklappt hat.

**So arbeitest du damit:** Eine Übung pro Tag reicht. Jede dauert 5 bis 15 Minuten. Die Reihenfolge ist eine Empfehlung, kein Zwang. Du musst nichts auswendig können, sag einfach die Beispiel-Sätze so oder in deinen eigenen Worten. Tipp: diktieren geht schneller als tippen (Windows: `Win + H`, Mac: zweimal `Ctrl`).

---

## Stufe 1 — Der Tagesrhythmus (Tag 1 bis 3)

**Übung 1 — Dein erstes Briefing** (10 Min)
Szenario: Du startest den Tag zum ersten Mal mit dem System. Beim ersten Mal fragt Claude einmal, ob es in Postfach und Kalender schauen darf.
Sag: > „Guten Morgen."
Erfolgreich wenn: Du wirst einmal um Erlaubnis für Mail und Kalender gefragt, danach öffnet sich `context/today.html` im Browser mit deinem Tag.
Dahinter steckt: Zugriff auf Mail und Kalender bleibt bei dir, jede Session neu, nichts passiert heimlich im Hintergrund.

**Übung 2 — Drei Sätze in den Chat erzählen** (10 Min)
Szenario: Im Lauf des Tages ändert sich was. Du erzählst es einfach, ohne Befehl, ohne selbst eine Datei anzufassen.
Sag: > „Kapitel drei ist fertig. Beim Projekt X warte ich noch auf die IT. Und leg mir eine Notiz an, ich will nächste Woche das Angebot für Meier nachfassen."
Erfolgreich wenn: Claude bestätigt dir in ein, zwei Sätzen, wo jedes der drei Dinge gelandet ist (Status, Journal oder als Aufgabe), und die Aufgabe taucht danach in deinem Dashboard unter dem Projekt auf.
Dahinter steckt: Das ist der eigentliche Betriebsmodus. Du sagst, was ist, das System sortiert ein, du pflegst keine Ordner.

**Übung 3 — Dein erster Tagesabschluss** (10 Min)
Szenario: Feierabend. Du willst festhalten, was der Tag ergeben hat.
Sag: > „Ich bin durch für heute."
Erfolgreich wenn: Claude zeigt dir einen fertigen Vorschlag, was heute war, du korrigierst nur noch. Danach steht ein neuer Eintrag mit dem heutigen Datum oben in `context/JOURNAL.md`.
Dahinter steckt: Das lange Gedächtnis. Du kannst in zwei Wochen nachlesen, was an welchem Tag entschieden wurde, ohne dich zu erinnern.

---

## Stufe 2 — Material und Mail (Tag 3 bis 5)

**Übung 4 — Ein Dokument einlesen** (15 Min)
Szenario: Du hast ein echtes Deck, ein Protokoll oder ein PDF, das zu einem deiner Projekte gehört. Leg die Datei in den Ordner `inbox/`.
Sag: > „Lies das mal ein."
Erfolgreich wenn: Claude zeigt dir, was drin steht (To-dos, Entscheidungen), und danach liegt die Datei in `projects/<dein-projekt>/inputs/`, nicht mehr in `inbox/`. Die To-dos stehen unter dem Projekt in deiner Aufgabenliste.
Dahinter steckt: Projekt-Material landet beim Projekt. Verweist nächste Woche jemand auf „das Deck von neulich", findet Claude es dort wieder.

**Übung 5 — Deinen Mail-Stil ableiten lassen** (10 Min)
Szenario: Damit Entwürfe nach dir klingen und nicht nach Standard-KI, liest Claude einmal deine eigenen gesendeten Mails und lernt deinen Ton.
Sag: > „Leite meinen Mail-Stil aus meinen gesendeten Mails ab."
Erfolgreich wenn: Claude zeigt dir in ein paar Stichpunkten, was es erkannt hat (wie du grüßt, wie lang, wie du dich verabschiedest), und legt das in `context/EMAIL_STYLE.md` ab.
Dahinter steckt: Struktur schlägt Formulierung. Steht dein Stil einmal als Datei da, klingen alle künftigen Entwürfe nach dir, ganz ohne dass du es jedes Mal erklärst.

**Übung 6 — Ein Entwurf und der Korrektur-Loop** (10 Min)
Szenario: Du willst jemandem antworten. Wichtig: Claude schreibt nur den Entwurf, gesendet wird nie automatisch, das machst du selbst in deinem Mailprogramm.
Sag: > „Schreib eine kurze Mail an Nicole, dass der Termin am Freitag passt." Wenn der erste Entwurf kommt, sag bewusst: > „Zu förmlich, mach es kürzer und lockerer."
Erfolgreich wenn: Der zweite Entwurf ist spürbar kürzer und lockerer als der erste, und er liegt als Entwurf in deinem Mailprogramm, nicht im Postausgang.
Dahinter steckt: Du korrigierst, statt neu zu bauen. „Das stimmt nicht" oder „kürzer" genügt, Claude passt an.

**Übung 7 — Einen Inbox-Fund übernehmen** (5 Min)
Szenario: Nach einem Briefing stehen Mail-Funde in deiner Inbox-Zone. Die sind absichtlich noch keine Aufgaben, bis du entscheidest.
Sag: > „Übernimm den ersten Inbox-Eintrag als Aufgabe ins Projekt X."
Erfolgreich wenn: Der Eintrag verschwindet aus der Inbox und steht danach als Aufgabe unter Projekt X, mit einer kurzen Kontext-Zeile.
Dahinter steckt: Nichts verschwindet still, aber nicht jeder Fund ist gleich eine Aufgabe. Du entscheidest, was aus einem Fund wird.

---

## Stufe 3 — Das System formen (Woche 2)

**Übung 8 — Eine Falschklassifikation dauerhaft korrigieren** (5 Min)
Szenario: Im Briefing taucht ein Kalender-Termin auf, der da nicht hingehört, zum Beispiel dein Sportkurs oder ein privater Block.
Sag: > „Der Sportkurs am Dienstag taucht ab jetzt nie mehr im Briefing auf."
Erfolgreich wenn: Claude bestätigt in einer Zeile, wo es das festgehalten hat, und am nächsten Morgen ist der Termin weg, ohne dass du es nochmal sagst.
Dahinter steckt: „Ab jetzt", „immer" und „nie" sind der Hebel. Damit wird aus einer einmaligen Korrektur eine dauerhafte Regel, und das System wird mit der Zeit besser.

**Übung 9 — Einen guten Auftrag formulieren** (10 Min)
Szenario: Du willst etwas gebaut haben. Statt den Weg vorzugeben, beschreibst du das Ziel, dann findet Claude oft eine bessere Lösung als die, die du dir ausgedacht hättest.
Sag statt „Mach eine Tabelle mit drei Spalten": > „Ich will beim Freitagstermin in dreißig Sekunden sehen, welche Angebote seit mehr als zwei Wochen unbeantwortet sind."
Erfolgreich wenn: Claude fragt nur nach, was es wirklich wissen muss, und liefert etwas, das die Frage beantwortet, nicht bloß die Tabelle, die du beschrieben hast.
Dahinter steckt: Sag das Ziel, nicht den Weg. Das ist der größte Hebel bei der Arbeit mit KI (siehe `reference/system-erweitern.md`, Abschnitt 1).

**Übung 10 — Deinen ersten eigenen Befehl bauen** (15 Min)
Szenario: Es gibt eine Sache, die du regelmäßig gleich machst, zum Beispiel einen wöchentlichen Statusbericht. Ab dem dritten Mal lohnt ein eigener Befehl dafür.
Sag: > „Ich schreibe jeden Freitag einen Statusbericht, immer dieselben Projekte, immer dieselbe Struktur. Bau mir einen Befehl dafür."
Erfolgreich wenn: Claude fragt kurz nach (welche Projekte, wie lang, wer liest das), danach kannst du den neuen Befehl mit einem Schrägstrich aufrufen und bekommst dein Ergebnis.
Dahinter steckt: Wiederkehrende Abläufe werden zu eigenen Befehlen. Du beschreibst, Claude baut, du programmierst nichts.

**Übung 11 — Den Selbst-Check laufen lassen** (5 Min)
Szenario: Du willst wissen, ob mit dem System selbst alles in Ordnung ist, bevor du dich drauf verlässt.
Sag: > „/checkup"
Erfolgreich wenn: Claude prüft den Workspace und sagt dir in wenigen Zeilen, dass alles stimmt, oder was es still repariert hat.
Dahinter steckt: Das System tut nie so, als wäre es aktuell. Wenn etwas hakt, findest du es hier, ohne dass du beschreiben können musst, was los ist.

---

Nach diesen elf Übungen kennst du den ganzen Rhythmus. Ab hier lernt das System einfach weiter mit: Jedes Mal, wenn dich etwas stört, sag „ab jetzt", und es ist dauerhaft geregelt. Je öfter du im Chat erzählst, was ist, desto besser werden deine Briefings.
