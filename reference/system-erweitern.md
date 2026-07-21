# Das System erweitern

Dieses Paket kommt mit fünf Befehlen: `/setup`, `/morning`, `/eod`, `/ingest`, `/email`. Sie decken den Tagesrhythmus ab. Alles darüber hinaus baust du dir selbst dazu, und zwar so:

**Du beschreibst, Claude baut.**

Du schreibst hier nie eine Datei, keinen Befehl, kein Programm. Du sagst in eigenen Worten, was du willst, und Claude legt es an. Die Fähigkeit, um die es in dieser Anleitung geht, ist nicht Technik. Es ist gut beschreiben und im richtigen Moment danach fragen.

---

## 1. Gute Aufträge geben

Das ist der größte Hebel, deshalb steht er zuerst. Ein guter Auftrag ist nicht länger als ein schlechter, er enthält nur andere Dinge.

**Sag das Ziel, nicht den Weg.**

> Schlecht: „Mach eine Tabelle mit drei Spalten und sortier sie nach Datum."
> Gut: „Ich will beim Freitagstermin in 30 Sekunden sehen, welche Angebote seit mehr als zwei Wochen unbeantwortet sind."

Beim zweiten kann Claude selbst entscheiden, dass ein farbiger Hinweis mehr hilft als eine dritte Spalte. Beim ersten baut es genau die Tabelle, die du dir ausgedacht hast, auch wenn sie das Problem nicht löst.

**Sag, woher die Information kommt.**

> Schlecht: „Fass zusammen, was diese Woche bei den Kunden lief."
> Gut: „Nimm die Journal-Einträge dieser Woche und die Projektstände. Wenn etwas fehlt, schreib das hin, statt es zu ergänzen."

Ohne Quelle rät Claude im Zweifel. Mit Quelle weiß es, was es nicht weiß.

**Sag, wie das Ergebnis aussehen soll.**

> Schlecht: „Schreib mir einen Wochenbericht."
> Gut: „Eine halbe Seite. Pro Projekt drei Zeilen: was passiert ist, was hängt, was ich von jemandem brauche. Am Ende nichts, keine Zusammenfassung der Zusammenfassung."

Länge, Aufbau und Ende sind die drei Angaben, die am meisten Nacharbeit sparen.

**Sag, was nicht passieren darf.**

> „Keine Zahlen, die nicht in den Unterlagen stehen."
> „Keine Namen von Mitarbeitern in dem Dokument."
> „Nicht mein Postfach anfassen, ich will nur die Projektdateien."

Ein Verbot ist oft wertvoller als drei Wünsche, weil es genau die Sache abstellt, die dich beim letzten Versuch gestört hat.

**Ein Beispiel schlägt jede Beschreibung.**

Wenn du irgendwo einen Bericht, eine Mail oder eine Übersicht liegen hast, die dir gefällt, leg sie in `inbox/` und sag: „So soll es aussehen, nur mit den Zahlen von diesem Monat." Das ist der schnellste Weg von allen. Fünf Minuten Beschreiben ersetzt eine einzige Datei nicht.

---

## 2. Wann sich ein eigener Befehl lohnt

Ein Befehl ist ein Ablauf, den du im Chat aufrufst, so wie `/morning`. Claude weiß dann, welche Dateien es lesen, in welcher Reihenfolge es vorgehen und wie das Ergebnis aussehen soll, ohne dass du es jedes Mal erklärst.

**Die Faustregel: beim dritten Mal.** Wenn du dieselbe Sache zum dritten Mal in ähnlicher Form machst und der Ablauf jedes Mal gleich ist, lohnt es sich. Vorher nicht. Zwei Mal von Hand kostet weniger als einmal aufsetzen.

**Wie du danach fragst:**

> „Ich schreibe jeden Freitag einen Statusbericht für meinen Chef. Immer dieselben Projekte, immer dieselbe Struktur: Fortschritt, Risiken, was ich brauche. Bau mir einen Befehl dafür."

Claude fragt dann zurück, was es wissen muss: Welche Projekte, wie lang, wer liest das, was soll nie drinstehen. Antworte kurz. Danach existiert der Befehl und du benutzt ihn.

**Beim ersten schlechten Ergebnis korrigierst du, du baust nicht neu.** „Der Abschnitt Risiken ist zu lang, zwei Sätze reichen" genügt. Der Befehl wird angepasst und ist beim nächsten Freitag richtig. Ein neuer Befehl für dasselbe Thema ist fast immer ein Fehler, dann hast du zwei, die sich leicht unterscheiden, und weißt nach vier Wochen nicht mehr, welcher der richtige ist.

**Wofür sich kein Befehl lohnt:**

- Alles, was du einmal im Quartal tust. Bis dahin hast du vergessen, dass es ihn gibt.
- Alles, was jedes Mal anders läuft. Ein Kundengespräch vorbereiten ist bei jedem Kunden eine andere Aufgabe. Das sagst du besser jedes Mal frisch, dann bekommst du auch jedes Mal die passende Antwort.
- Alles, was in zwei Sätzen gesagt ist. Der Befehl spart dann nichts.

---

## 3. Wann sich ein eigenes Tool lohnt

Der Unterschied in einem Satz: **Ein Befehl ist etwas, das du sagst. Ein Tool ist etwas, das du anklickst.**

Ein Tool lohnt sich, wenn etwas gerechnet, dargestellt oder von mehreren Leuten benutzt wird. Ein Rechner für die Auslastung deines Teams. Eine Übersicht, die dein Kollege aufmachen können soll, ohne dich zu fragen. Ein Formular, das du in jedem Erstgespräch ausfüllst.

**So beschreibst du es:**

> „Ich brauche eine Seite, auf der ich für jedes Projekt die geplanten Stunden pro Woche eintrage. Unten steht die Summe pro Person, und wenn jemand über 40 kommt, sehe ich das sofort. Nur ich benutze das, es muss nichts speichern."

Was Claude wissen will: Was geht rein, was soll rauskommen, wer benutzt es, muss es sich etwas merken. Mehr nicht.

**Zwei Dinge gehören dazu, damit es nicht verloren geht:**

1. Sag: „Halt dich an `reference/design.md`." Dann sieht das Tool aus wie der Rest des Systems und nicht wie ein fremdes Programm.
2. Das fertige Tool wird in `context/config.yaml` unter `own_tools` eingetragen, mit Name, Zweck und Adresse. Danach steht es im Dashboard im Tab „Start Here" und du findest es in vier Wochen wieder. Claude macht diesen Eintrag selbst, wenn du es baust. Passiert es nicht, sag „trag das bei den eigenen Tools ein".

---

## 4. Korrigieren statt neu bauen

Wenn ein Ergebnis nicht stimmt, sag es. **„Das stimmt nicht" genügt.** Du schuldest keine Begründung und keinen Vorschlag, wie es besser ginge. Claude fragt nach, wenn es nicht klar ist.

Der wichtigste Satz dieser ganzen Anleitung ist aber ein anderer:

**Wenn du „immer", „nie" oder „ab jetzt" sagst, bekommst du eine dauerhafte Änderung statt einer einmaligen Korrektur.**

Das ist keine Höflichkeitsfloskel, sondern der Mechanismus, mit dem das System besser wird. Vergleich:

| Du sagst | Was passiert |
|---|---|
| „Der Bericht ist zu lang." | Dieser eine Bericht wird kürzer. |
| „Berichte an den Vorstand sind ab jetzt immer maximal eine Seite." | Jeder künftige Bericht ist eine Seite. |
| „Der Sportkurs am Dienstag muss nicht ins Briefing." | Morgen steht er wieder drin. |
| „Private Termine tauchen nie im Briefing auf." | Sie tauchen nie wieder auf. |
| „Schreib nicht so förmlich." | Diese eine Mail wird lockerer. |
| „Ich duze meine Kunden, ab jetzt immer." | Alle Entwürfe sind ab sofort in Du-Form. |

Claude bestätigt dir dann in einer Zeile, wo es das festgehalten hat. Wenn diese Bestätigung ausbleibt, ist es vermutlich nur für diesmal gemerkt, dann hak nach.

Faustregel: Wenn dich derselbe Fehler zum zweiten Mal stört, korrigier ihn nicht noch einmal. Sag „ab jetzt".

---

## 5. Die Bremse

Mehr Befehle sind nicht besser.

Ein System mit fünf Befehlen, die alle benutzt werden, ist deutlich mehr wert als eines mit zwanzig, von denen niemand mehr weiß, was sie tun. Jeder Befehl, den du nicht benutzt, macht die Liste unübersichtlicher und die Entscheidung schwerer, welchen du in diesem Moment eigentlich brauchst.

Deshalb: Im Zweifel nichts anlegen. Sag es weiter von Hand im Chat. Wenn es dich das dritte Mal nervt, dass du es erklären musst, ist der Moment gekommen, und dann weißt du auch schon ziemlich genau, wie der Befehl aussehen muss.
