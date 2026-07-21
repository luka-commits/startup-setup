# Wohin das hier führt

Diese Datei beantwortet zwei Fragen: **warum es dieses Paket gibt** und **wie man mit KI arbeitet, damit sie sich rechnet.** Wer nur loslegen will, liest `SETUP.md` und kommt später hierher zurück.

## Das Problem, das die meisten haben

Der Zugang zu KI ist gelöst. Fast jede Firma hat inzwischen Zugriff auf gute Modelle, und fast überall wird damit gearbeitet.

Trotzdem passieren drei Dinge gleichzeitig:

**Jedes Gespräch fängt bei null an.** Man erklärt wieder, welches Projekt gemeint ist, wer beteiligt ist, was letzte Woche entschieden wurde. Der Assistent wird nicht klüger, er wird jeden Morgen neu geboren.

**Die Kosten wachsen mit der Nutzung, nicht mit dem Ergebnis.** Ohne Ordnung liest ein Assistent bei jeder Frage alles neu, was er finden kann, auch das, was er schon zehnmal gelesen hat. Die Rechnung steigt, der Nutzen nicht im gleichen Maß.

**KI erzeugt selbst Unordnung.** Sie produziert schneller Dateien, Entwürfe und Notizen, als ein Mensch sie einsortieren kann. Nach drei Monaten findet niemand mehr etwas, und das Werkzeug, das Zeit sparen sollte, kostet welche.

Auffällig ist: Es wird viel darüber gesprochen, **wie** man mit KI umgeht. Prompts, Werkzeuge, Verknüpfungen. Kaum jemand spricht darüber, **worauf** sie eigentlich zugreift. Genau dort liegt der Hebel.

## Was dieses Paket dagegen setzt

Kein weiteres Werkzeug. Eine **Grundordnung**.

Ein Ordner, in dem alles liegt, was deine Arbeit ausmacht: deine Projekte, dein Stand, deine Entscheidungen, deine Dokumente. Der Assistent arbeitet darin, kennt die Struktur und weiß, wo was steht. Er muss nicht suchen und nicht raten.

Dahinter steckt ein einfaches Prinzip, das den Unterschied macht: **ein kurzes und ein langes Gedächtnis.** Wenige Dateien tragen den aktuellen Stand und werden laufend gepflegt. Sie werden bei jedem Start gelesen und bleiben klein. Alles andere liegt als Nachschlagematerial daneben und wird nur gelesen, wenn es wirklich gebraucht wird.

Die Folge: **Dein Wissensstand wächst mit der Zeit. Der Aufwand pro Anfrage nicht.**

## Wohin es wächst

Das Paket startet mit fünf Befehlen und einem Dashboard. Das ist absichtlich wenig, denn ein System, das man an einem Vormittag versteht, wird auch benutzt.

Von dort wächst es in **deine** Richtung, nicht in eine vorgegebene:

- Wiederkehrende Abläufe werden zu eigenen Befehlen. Du beschreibst, was du jede Woche tust, und bekommst einen Befehl dafür.
- Eigene kleine Werkzeuge entstehen dort, wo Anklicken besser ist als Beschreiben, und erscheinen im Dashboard.
- Verbindungen kommen dazu, wenn sie gebraucht werden: Mail, Kalender, Ablage, CRM.
- Wiederkehrende Läufe können zeitgesteuert passieren, sodass der Tag schon sortiert ist, bevor jemand danach fragt.

Wie das geht, ohne zu programmieren, steht in **[`reference/system-erweitern.md`](reference/system-erweitern.md)**.

Das Ziel ist nicht ein möglichst großes System. Das Ziel ist ein System, in dem jeder Teil benutzt wird.

---

# Arbeitsprinzipien

Diese sechs Punkte machen den Unterschied zwischen KI, die beeindruckt, und KI, die etwas bringt. Sie kosten am Anfang etwas Disziplin und sparen danach dauerhaft Zeit.

## 1. Erst nachsehen, ob es das schon gibt

Der teuerste Weg zu einer Lösung ist, sie zu bauen, obwohl es sie gibt. Bevor etwas Neues entsteht, lohnt sich immer die Frage: Gibt es dafür ein fertiges Werkzeug, ein offenes Projekt auf GitHub, eine bestehende Datei bei uns im Ordner?

Sag es einfach mit: *„Schau erst, ob es dafür schon etwas Fertiges gibt, bevor du etwas baust."* Der Assistent kann suchen und dir die Kandidaten mit Vor- und Nachteilen zeigen. Meistens ist die Antwort ein bestehendes Werkzeug, manchmal eine Datei, die letzten Monat schon jemand angelegt hat.

## 2. Große Vorhaben erst planen, dann bauen

Bei einer kleinen Aufgabe legt man los. Bei allem, was mehrere Schritte hat, mehrere Personen betrifft oder länger als einen Tag dauert, ist der erste Schritt ein Plan.

Sag: *„Bevor du anfängst, schreib mir auf, wie du vorgehen würdest, und wo du dir unsicher bist."* Der Plan kostet fünf Minuten und du siehst sofort, ob ihr vom Gleichen redet. Ein Missverständnis im Plan ist ein Satz. Dasselbe Missverständnis im fertigen Ergebnis ist ein verlorener Tag.

## 3. Gegen die erste Antwort arbeiten

Die erste Antwort ist selten die beste, und sie klingt trotzdem überzeugend. Drei Fragen, die zuverlässig etwas finden:

**Steelman:** *„Was spricht am stärksten dagegen? Formulier die Gegenposition so gut du kannst."* Besonders wertvoll, bevor man eine Entscheidung trifft, die man schon getroffen hat.

**Pre-Mortem:** *„Angenommen, das ist in einer Woche schiefgegangen. Was war die Ursache?"* Nicht „was könnte passieren", sondern rückblickend erzählt. Das findet deutlich mehr, weil es zum Erklären zwingt statt zum Aufzählen.

**Mehrere Sichtweisen:** *„Wie sieht das der Kunde, wie der Vertrieb, wie die Buchhaltung?"* Bei Entscheidungen, bei denen zwei kluge Leute unterschiedlich entscheiden würden.

Diese drei kosten je einen Satz und sind der billigste Qualitätsgewinn, den es gibt.

## 4. Ergebnisse prüfen, bevor sie rausgehen

Alles, was den eigenen Schreibtisch verlässt, wird vorher gelesen. Nicht überflogen, gelesen. KI erfindet gelegentlich Zahlen, Namen und Quellen, und sie tut es in genau demselben souveränen Ton wie beim Rest.

Hilfreich ist, den Assistenten selbst prüfen zu lassen: *„Geh das nochmal durch und markier alles, was du nicht belegen kannst."* Er ist beim Prüfen ehrlicher, als man erwartet, aber er tut es nur, wenn man ihn darum bittet.

## 5. Struktur schlägt Formulierung

Die meisten versuchen, ein schlechtes Ergebnis mit einem besseren Prompt zu retten. Meistens liegt es nicht am Prompt, sondern daran, dass die nötige Information nirgends steht.

Wenn eine Antwort dauerhaft ungenau ist, ist die richtige Frage nicht „wie formuliere ich das besser", sondern „woher soll er das eigentlich wissen". Meist fehlt eine Zeile im Projekt-Steckbrief oder eine Datei im richtigen Ordner. Ist sie da, wird die Antwort ohne jede Prompt-Kunst besser.

## 6. Nicht alles muss automatisiert werden

Etwas, das fünf Minuten dauert und dreimal im Jahr vorkommt, macht man von Hand. Der Aufbau, die Erklärung und die Pflege einer Automatisierung kosten mehr als die Aufgabe selbst.

Die Faustregel: Automatisiert wird, was **oft** vorkommt und **jedes Mal gleich** läuft. Alles andere sagt man einfach.

---

Diese Prinzipien sind keine Theorie. Sie sind das, was übrig bleibt, wenn man ein Jahr lang täglich mit diesen Werkzeugen arbeitet und aufschreibt, was funktioniert hat.
