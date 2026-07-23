---
name: adopt
description: "Baut einen BESTEHENDEN Ordner in die Workspace-Struktur um, ohne etwas zu verlieren. Nimmt einen gewachsenen Ordner (eigene Dateien, fremde Struktur, vielleicht schon eine CLAUDE.md), schlägt in Klartext vor was wohin soll, fragt bei allem Unklaren nach, führt die Bewegungen mit Rückweg aus und prüft am Ende gegen den Zustand, den ein frisches Setup erzeugt hätte. Nutze diesen Skill, wenn jemand sagt 'bau meinen Ordner um', 'übernimm diesen Workspace', 'bring das in die richtige Struktur', 'kann ich das auf einen bestehenden Ordner anwenden', 'setup auf vorhandenem Workspace', 'migrier das', oder wenn ein Kunde einen gewachsenen Ordner mitbringt statt bei null anzufangen. Nicht zu verwechseln mit /setup — das richtet einen FRISCH kopierten, leeren Workspace ein und setzt voraus, dass nichts Eigenes drin liegt."
---

# /adopt

Bringt einen gewachsenen Ordner in die Workspace-Struktur. **Fertig ist es, wenn der Ordner nicht mehr davon zu unterscheiden ist, als wäre er frisch aufgesetzt worden** — plus die vorhandenen Inhalte an ihrem richtigen Platz.

**Der Unterschied zu `/setup`:** `/setup` richtet einen frisch kopierten, leeren Workspace ein und darf alles anlegen. `/adopt` trifft auf fremde Arbeit und darf fast nichts anfassen, ohne zu fragen. Das ist kein Detailunterschied, das ist die ganze Schwierigkeit.

## Warum das der heikelste Ablauf im ganzen System ist

Ein Umbau ist unumkehrbar, wenn man ihn nicht umkehrbar baut. Drei Wege in den Schaden, alle drei real erlebt:

1. **Eine bestehende `CLAUDE.md` wird überschrieben.** Darin steckt oft Monate an Feinschliff, und der Verlust fällt erst Wochen später auf, wenn Claude sich anders verhält und niemand weiß warum.
2. **Ein Ordner wird verschoben, auf den etwas zeigt.** Am 22.07.2026 hat genau das den Morning-Digest getötet: ein launchd-Job zeigte auf den alten Pfad, startete täglich, starb mit Exit 127, und **niemand bekam eine Meldung**. Vier Monate hätte das so laufen können.
3. **Etwas wird einsortiert, das bewusst woanders lag.** Ordnung nach fremdem Schema ist keine Ordnung.

Daraus folgen die Regeln unten. Sie sind nicht Vorsicht um der Vorsicht willen, jede steht für einen konkreten Schaden.

## Schritt 1 — Plan erstellen (fasst nichts an)

```
node reference/scripts/adopt-plan.js --root <pfad>
```

Liest den Ordner und teilt jeden Eintrag in vier Gruppen: **passt schon** · **zusammenführen** · **Vorschlag zum Verschieben** · **braucht Auskunft**. Maschinerie (alles mit Punkt am Anfang, Konfigurationsdateien) wird nie zum Verschieben vorgeschlagen — sie zu bewegen macht den Ordner kaputt.

Bei jedem Verschiebe-Vorschlag steht dabei, **wer auf diesen Pfad zeigt**: Dokumente, Scripts, und besonders Jobs außerhalb des Ordners (`~/Library/LaunchAgents`). Ein Vorschlag mit externem Verweis wird **nie ohne Nachziehen ausgeführt**.

## Schritt 2 — Den Plan zeigen und die Lücken klären

Den Plan in Klartext vorlesen, nicht die JSON. Struktur: was schon passt (eine Zeile, nicht aufzählen), was verschoben würde und warum, und dann die Fragen.

**Eine Frage stellt das Script nie, sie gehört aber immer dazu: liegt hier Material von mehr als einem Kunden?** Wenn ja, entscheidet der Nutzer VOR dem Umbau, ob jeder Kunde einen eigenen Ordner bekommt. Danach zu fragen ist zu spät, dann liegt alles schon beieinander und muss ein zweites Mal angefasst werden.

**Die Fragen sind der wichtigste Teil.** Das Script rät bewusst nicht. Typische Fälle: ein Ordner mit gemischtem Inhalt, ein Dokument in der Wurzel, ein leeres Verzeichnis. Frage je Fall in einem Satz, mit einem Vorschlag als Default — Auswählen ist schneller als Erklären.

Erst wenn keine Frage mehr offen ist, geht es weiter. **Ein „ich weiß nicht" heißt: der Eintrag bleibt liegen.** Liegenlassen ist immer richtig, Raten nie.

## Schritt 2b — Innerhalb der Projekte

Ein Ordner, dessen Wurzel schon stimmt, ist nicht übernommen. Genau das war der Befund vom 22.07.: der Plan meldete „11 passt schon, 0 Vorschläge", während elf von sechzehn Projekten `docs/` statt `work/` führten. **Wer nur die oberste Ebene prüft, ist blind für den Normalfall** — jemand hat schon eine Ordnung, sie ist nur eine andere.

Der Plan zeigt dazu vier Dinge. Aus jedem wird eine Frage, nie eine Bewegung:

| Was der Plan zeigt | Die Frage dazu |
|---|---|
| **Ein Ordnername in vielen Projekten**, den das Schema nicht kennt (`docs/`, `notizen/`) | Ist das dasselbe wie `work/`? Wenn ja: einmal umbenennen, überall gleich — oder den Namen behalten und im Schema als gleichwertig führen. Beides ist richtig, gemischt ist falsch. **Nur nicht projektweise verschieden.** |
| **Ein Projekt ohne Änderung seit über 90 Tagen** | Ruht es oder ist es zu Ende? Antwort „zu Ende" → der Ablauf aus `projects/README.md` § „Projekt archivieren", **mit** der Frage nach den offenen Aufgaben. Ein Projekt still wegzuräumen und seine Tasks stehen zu lassen ist die schlimmere Unordnung. |
| **Lose Dateien direkt im Projektordner** | Ist das eigene Arbeit (`work/`) oder etwas Erhaltenes (`inputs/`)? Bei mehr als fünf Dateien nicht einzeln fragen, sondern einmal pro Projekt. |
| **Versionsspuren im Dateinamen** (`final`, `v2`, `Kopie`, ` 2.`) | Welche gilt? Der Umbau ist die eine Gelegenheit, das zu klären, danach fragt es nie wieder jemand. Antwort → die geltende bleibt in `work/`, die anderen nach `_archive/` im Projekt. **Nie raten, nie stillschweigend löschen.** |

**Was hier nie angefasst wird:** ein Unterordner mit eigenem `.git`. Das ist Kundencode, ein Produkt-Repo oder ein geklonter Fremdstand — eigene Historie, oft ein anderer Eigentümer. Der Plan listet solche Ordner getrennt als „unberührt" auf, und dabei bleibt es. Auch nicht „nur die README verschieben".

### Erhaltenes von Eigenem trennen

Ein `work/`, in dem alles zusammenliegt, ist der Normalfall bei gewachsenen Ordnern. Die Trennung lohnt sich, weil `inputs/` beantwortet, **was der Kunde geschickt hat** — die Frage, die drei Monate später kommt und dann niemand mehr belegen kann.

```
node reference/scripts/adopt-plan.js --root <pfad> --herkunft projects/<gruppe>/<projekt>/work
```

**Geurteilt wird auf der ERSTEN Ebene unter `work/`, nie tiefer.** Das ist der ganze Trick, und er wurde teuer gelernt: pro Datei entstehen Hunderte Rückfragen, pro Blattordner immer noch dutzende und lauter Unsinn — jede fremde CSS-Datei einer geklonten Website galt als „selbst geschrieben". Auf der ersten Ebene sind es zwei Fragen, und die Urteile stimmen. Ein Mensch denkt genauso: „der website-Ordner ist eine Kopie, ernaehrung ist ein Vorhaben."

**Was NICHT funktioniert, damit es niemand noch einmal baut:**

- **Zeitstempel** („nie bearbeitet, also erhalten"). Ein einziger Ordner-Umzug setzt Erstell- und Änderungszeit gleich, danach sieht jede Datei unbearbeitet aus. An echten Daten geprüft und verworfen.
- **Die git-Historie** („einmal hinzugefügt, also erhalten"). Struktur-Commits fassen alle Dateien gleichzeitig an; die Zahl ist danach für jede Datei dieselbe. Ebenfalls geprüft und verworfen.

Was trägt, ist unspektakulär: **Format und Name**. PDF, DOCX, Sprachnachrichten und Kamerabilder bekommt man; Markdown, HTML und Code schreibt man. Ein Ordner mit `wp-content`, `node_modules` oder `vendor` irgendwo darin ist eine heruntergeladene Fremdsache, ganz gleich was sonst darin liegt.

**Und die Regel, die über allem steht: was gemischt ist, wird gefragt, nicht geraten.** Bei einem Testlauf blieben zwei von zwölf Einträgen offen — genau die zwei, die wirklich gemischt waren. Beide Male ist die Rückfrage die richtige Antwort, nicht ein Fehler des Werkzeugs.

**Reihenfolge:** diese Fragen kommen zusammen mit denen aus Schritt 2, in EINER Runde. Zweimal nachzufragen ist der sicherste Weg, den Nutzer mitten im Umbau zu verlieren.

## Schritt 3 — Ausführen, mit Rückweg

**Vor der ersten Bewegung** ein Manifest anlegen: `context/.adopt-manifest.json` mit Zeitstempel und einer Zeile je geplanter Bewegung (`von`, `nach`, `methode`). Das ist der Rückweg — ohne ihn ist der Umbau ein Sprung ohne Netz.

**Das Gerüst gehört mit ins Manifest.** In einem gewachsenen Ordner gibt es `context/` noch gar nicht, das Anlegen der vier Ordner ist also selbst schon eine Veränderung. Sie zuerst eintragen, sonst deckt der Rückweg genau den Anfang nicht ab (im Testlauf am 22.07. aufgefallen).

**Läuft ein Cloud-Sync mit (OneDrive, Dropbox, iCloud), erst pausieren lassen.** Verschieben während einer laufenden Synchronisierung erzeugt Konfliktkopien (`STATUS 2.md`), und die tauchen erst Tage später auf. Ein Satz an den Nutzer genügt. Bereits vorhandene Konfliktkopien **nie selbst auflösen**: welche Fassung gilt, weiß nur er.

Dann der Reihe nach:

- **Verschieben mit `git mv`, wenn der Ordner ein Repo ist**, sonst mit `mv`. Nie `cp` und danach löschen: das erzeugt einen Moment, in dem beides existiert, und einen zweiten, in dem nichts stimmt.
- **Ein verschachteltes Repo zieht als Ganzes um.** Nie in seine Historie eingreifen, nie neu initialisieren.
- **`CLAUDE.md` zusammenführen, nie ersetzen.** Der bestehende Inhalt bleibt vollständig; unsere Abschnitte kommen dazu, klar getrennt. Bei einem Widerspruch gewinnt der bestehende Text, und der Widerspruch wird genannt statt still aufgelöst.
- **Nichts löschen.** „Weg" heißt `inbox/archive/YYYY-MM-<thema>/`.
- **Nach jeder Bewegung die Verweise nachziehen**, die Schritt 1 gemeldet hat. Erst dann die nächste. Sammelt man das auf, vergisst man die Hälfte.

**Drei Regeln fürs Archivieren, alle drei am 22.07. im ersten echten Lauf gelernt, jede auf die harte Tour:**

1. **Beim Archivieren den Pfad mitnehmen, nie nur den Dateinamen.** Flach nach `inbox/archive/` verschieben heißt: zwei Dateien mit demselben Namen überschreiben sich gegenseitig, lautlos. Von 13 Dateien kamen 10 an. Richtig ist `inbox/archive/YYYY-MM-<thema>/<originalpfad>/<datei>`.
2. **Ein Muster im Dateinamen ist kein Beweis.** „Enthält 2" traf `Seedance 2.0`, einen Produktnamen. Eine Sync-Konfliktkopie erkennt man daran, dass **die Datei ohne die 2 danebenliegt** — sonst ist es einfach ein Name mit einer Zahl darin. Das Script prüft das inzwischen, aber die Regel gilt für jede Mustersuche, die du selbst schreibst.
3. **Suchläufe halten an der Repo-Grenze.** Ein `find` über den ganzen Ordner läuft in `code/` hinein und damit in fremde Historie. Beim ersten Lauf wurde so ein Verzeichnis aus einem Kunden-Repo herausgezogen — genau die Grenze, die zwei Absätze weiter oben als hart bezeichnet wird. Jede Suche schließt Ordner mit eigenem `.git` aus, nicht nur die Bewegung.

**Und eine fürs Manifest:** es wird **je Schritt** geschrieben, gegen die Pfade, die in diesem Moment gelten. Ein Manifest, das am Anfang alle Bewegungen auf einmal festhält, zeigt nach der ersten Umbenennung auf Pfade, die es nicht mehr gibt — und der Rückweg legt die Dateien dann in einen neu erfundenen Ordner statt zurück.

Bricht etwas mittendrin ab: das Manifest sagt, was schon passiert ist. Rückbau heißt, die Liste rückwärts abzuarbeiten.

## Schritt 3b — Die Ausstattung nachziehen

Struktur allein ist nicht übernommen. Ein frisch aufgesetzter Workspace hat auch **Werkzeuge**: installierte Plugins, vorhandene CLIs, verbundene Connectoren, hinterlegte Zugänge. Ein Ordner mit perfekter Ordnerlogik und ohne Werkzeuge ist ein halber Umbau.

Den Ist-Stand liefert das Inventar, ohne Raten:

```
node reference/scripts/inventory.js
```

Dagegen halten, was dieses Paket vorsieht: `reference/plugins.md` (welche Plugins wofür), `reference/tools.md` (`firecrawl`, `playwright`), `reference/mcp.md` (die sechs Verbindungen). Was fehlt, **einzeln anbieten mit einem Satz wozu es gut ist** — nicht stumm nachinstallieren. Ein Werkzeug, dessen Zweck der Nutzer nicht kennt, wird nie benutzt und ist dann genau der Ballast, den `/audit` später meldet.

**Das eigentliche Einrichten nicht hier nachbauen.** Die Schritte 7.1 bis 7.4 des `/setup`-Skills machen genau das (Werkzeuge installieren, die sechs Verbindungen durchgehen, Zugänge anlegen, Projekt-Repos anhängen). Von hier aus dorthin verweisen und sie ausführen, statt eine zweite, schlechtere Fassung zu schreiben.

## Schritt 4 — Abnahme gegen den Soll-Zustand

Der Umbau ist fertig, wenn der Ordner aussieht wie nach einem frischen Setup. Das ist prüfbar, nicht Geschmackssache:

```
node reference/scripts/workspace-audit.js --root <pfad>
node reference/scripts/inventory.js
```

**Die Abnahme, beide Hälften:**

1. **Struktur** — das Audit darf keine `act`-Dimension melden, die durch den Umbau entstanden ist. Besonders `Erreichbarkeit`: tote Verweise sind die typische Umbau-Narbe.
2. **Ausstattung** — die Setup-Kachel im Dashboard zeigt die Pflichtschritte auf 100 %.

Erst wenn beides steht, ist der Ordner ununterscheidbar von einem frisch aufgesetzten. Bleibt etwas offen, gehört es benannt statt weggelächelt: welcher Punkt, warum er offen ist, und was ihn schließen würde.

## Schritt 5 — Berichten

Kurz: was verschoben wurde (Zahl, nicht Liste), was liegen blieb und warum, was der Nutzer noch entscheiden muss. Dazu der Satz, wie man alles rückgängig macht, und wo das Manifest liegt.

**Nicht loben, was selbstverständlich ist.** „Alle 40 Dateien erfolgreich verschoben" ist keine Nachricht. Interessant ist, was nicht ging und was jetzt anders ist.

## Selbstverbesserung

Zwei Signale: eine Zuordnung wird korrigiert („das gehört woanders hin"), oder ein Vorschlag wird gelobt.

- **Falsche oder fehlende Zuordnungsregel** → nach `reference/scripts/adopt-plan.js`, in `classify()`. Eine zählbare Regel gehört ins Script, sonst ist sie Deko.
- **Eine Datei- oder Ordner-Art, die als „braucht Auskunft" landet, obwohl sie eindeutig ist** → ebenfalls ins Script, als neue Regel. Jede Frage, die das Script selbst beantworten kann, spart dem nächsten Menschen eine Minute.
- **Ton oder Aufbau des Berichts** → in diesen Skill, Schritt 5.

Und die Regel, die über allem steht: **wird geraten und liegt es falsch, wird nicht die Zuordnung nachgebessert, sondern das Raten abgeschafft.** Der Eintrag gehört dann auf die Fragen-Liste.
