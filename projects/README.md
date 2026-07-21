# Canonical Project Structure

Verbindliche Struktur für alle Projekte/Workstreams in `projects/`. Ein Ordner pro Initiative, immer gleiche Form — damit Claude jedes Projekt sofort navigieren kann.

```
projects/<projekt-name>/
├── README.md              # Kern-File: Zweck, Kontext, Stakeholder, Entscheidungen, Verlauf (siehe _template/)
├── inputs/                # Bekommen: Decks, Excel, Briefings, Transkripte (unverändert, wird nie archiviert)
├── work/                  # Werkbank: aktuelle Arbeitsstände — Notizen, Analysen, Entwürfe
├── outputs/               # Rausgegangen: datiert (YYYY-MM-DD_<name>) — die Liefer-Historie des Projekts
└── _archive/              # Ersetzte Arbeitsstände aus work/ (entsteht beim ersten Ersatz)
```

## Kern-Prinzipien

1. **README.md ist der Projekt-Einstieg** — wer nur dieses eine File liest, kennt Zweck, Stand und offene Punkte. PROJECTS.md (context/) hält den Kurz-Status aller Projekte, die Projekt-README das Detail.
2. **`inputs/` wird nie angefasst und nie archiviert** — was reinkommt, bleibt unverändert liegen (Herkunft nachvollziehbar). Inputs altern nicht: Der Ordner IST die Ablage, es gibt hier nichts wegzuräumen.
3. **Entscheidungen werden im README-Log festgehalten** (Datum + Entscheidung + wer) — das erspart das "warum haben wir das nochmal so gemacht?" drei Wochen später.
4. **Leere Ordner nicht vorab anlegen** — `inputs/`/`work/`/`outputs/`/`_archive/` entstehen beim ersten Inhalt.
5. **`work/` ist die Werkbank — aktuell und schlank gehalten durch drei Schreib-Regeln, nicht durch Aufräumen:** (a) Chat-Artefakte landen immer hier, nie lose im Root, nie in `inputs/`; (b) **Überlappungs-Check vor jeder neuen Datei** — deckt ein bestehendes Dokument denselben Inhalt ab, wird DAS aktualisiert statt ein zweites anzulegen; (c) lebende Arbeitsstände werden an Ort und Stelle aktualisiert — **wird eine Datei durch eine neue Version ersetzt, wandert die alte nach `_archive/`**. Mehr passiert nicht: Wer täglich so schreibt, muss nie ausmisten.
6. **`outputs/` wird durch ein Ereignis gefüllt, nicht durch ein Urteil:** Sagt der User „X ist raus" / „hab ich geschickt" / „ging heute an den Klienten", wandert die Datei aus `work/` hierher — mit `YYYY-MM-DD_`-Prefix. Bei Unsicherheit bleibt sie in `work/` liegen (kein Raten, keine Kopien). Was einmal hier liegt, ist Dokumentation: nie editieren, nie archivieren. So ist „welchen Stand hat der Klient gesehen" jederzeit in einem Blick beantwortbar.
7. **Living Documents leben zentral:** Tages-Fragen (Tasks, Stati, Tagebuch) stehen in `context/` und bleiben dort — das Projekt-README trägt mit `## Entscheidungen` und `## Verlauf` sein eigenes lebendes Gedächtnis. Keine Task- oder Journal-Dateien pro Projekt anlegen (zwei Wahrheiten).

## Neues Projekt anlegen

Wenn ein neuer Case, Workstream oder eine Initiative dazukommt (der User erwähnt es im Chat — CLAUDE.md Regel 1), läuft **immer** dieser Ablauf. Nicht improvisieren: `/morning` liest `projects/<slug>/README.md` für die Projekt-Karten, `/ingest` ordnet Dokumente gegen die Ordner zu — eine halbe Struktur bricht beides.

1. **Fragen, was du nicht weißt** — in EINER Nachricht, nicht nacheinander: Name des Projekts/Case · worum geht es in einem Satz · wer sind die wichtigsten Leute (Klient, Projektleitung, Team) · was ist dein Teil davon · gibt es schon einen Termin oder Meilenstein. Was der User im Chat schon gesagt hat, nicht nochmal fragen.
2. **Slug bilden:** kebab-case, kurz, ohne Klientennamen wenn vertraulich (`pricing-diagnostik`, nicht `Projekt Pricing Diagnostik GmbH`).
3. **Ordner + README:** `projects/<slug>/README.md` aus `_template/` befüllen mit dem, was bekannt ist. Lücken ehrlich als `[noch offen]` lassen — nie plausibel klingende Details erfinden.
4. **Block in `context/PROJECTS.md`** anlegen (Zweck · Status · Phase · Stakeholder · Timeline · ggf. Blocker) — **keine To-dos**, "Letzte Aktualisierung" stempeln.
5. **Erste Tasks nach `context/STATUS.md`**, falls schon welche genannt wurden — unter dem Projekt, Headline + eingerückte Kontext-Zeile (Format: STATUS.md-Kopf).
6. **Dashboard mitziehen** (Regel 1). Danach in einem Satz sagen, was angelegt wurde.

Unterordner (`inputs/`, `work/`, `outputs/`, `_archive/`) entstehen beim ersten Inhalt — nicht auf Vorrat anlegen.

## Aktive vs. archivierte Projekte

**Aktiv:** alles mit eigenem Block in `context/PROJECTS.md`.

**Archiviert:** `projects/_archive/` — beendete/dormante Projekte.

**Neue Projekt-Vorlage:** `projects/_template/`

## Projekt archivieren

Sagt der User „Projekt X ist durch" / „der Case ist vorbei" / „das liegt auf Eis" — das Gegenstück zur Anlage, gleicher Ablauf-Zwang. **Ein Projekt, das fertig ist, aber im Dashboard steht, macht jede Ansicht schlechter** — nach zwei Monaten sind das die Hälfte der Karten.

1. **Offene Tasks des Projekts zuerst klären** — in EINER Nachricht, kompakt: _„Drei Aufgaben stehen noch offen: [Liste]. Erledigt, hinfällig, oder soll was mit?"_ Erledigt → „Frisch erledigt". Hinfällig → raus. Muss mit → bleibt als Task, Projekt auf `allgemein` umhängen. **Nie stillschweigend Tasks mit-archivieren** — so verschwindet Arbeit, an die sich niemand erinnert.
2. **Ordner verschieben:** `projects/<slug>/` → `projects/_archive/<slug>/`. Verschieben, nie löschen (CLAUDE.md Safeguard 2).
3. **Block aus `context/PROJECTS.md` entfernen** und in dessen History-Section EINE Zeile ergänzen: `YYYY-MM-DD — <Projekt> archiviert (<Ein-Satz-Ergebnis>)`.
4. **Journal-Eintrag** (ein Bullet) + **Dashboard mitziehen** (Regel 1). Danach ein Satz, was passiert ist.

**Von selbst anbieten — aber genau einmal:** Fällt bei `/morning` ein Projekt auf, das **seit über 30 Tagen keinerlei Bewegung** hat (keine Task-Änderung, kein Journal-Eintrag, keine Mail), beiläufig am Ende des Briefings fragen: _„[Projekt] war seit einem Monat still — noch aktuell, oder archivieren?"_ Winkt der User ab oder antwortet nicht, ist das die Antwort: **nicht in der nächsten Woche erneut fragen.** Ein Projekt kann legitim ruhen (Klient meldet sich nicht, Phase pausiert) — die Frage ist ein Angebot, keine Mahnung.
