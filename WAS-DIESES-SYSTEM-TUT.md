# Was dieses System tut — und was nicht

Eine Seite Klartext, damit du (und jeder, der dich fragt) genau weiß, was hier passiert. Wenn du unsicher bist, ob du das nutzen darfst: lies das hier, und frag im Zweifel die Stelle, die bei euch über Tools und Daten entscheidet (Geschäftsführung, IT, Datenschutz). Lieber vorher fragen als hinterher erklären.

## Was es ist

Ein **persönlicher Arbeits-Ordner für Claude Code**: Textdateien mit deinen Projekten, Aufgaben und Notizen, plus ein paar Anleitungen (Skills), die Claude sagen, wie es dir morgens ein Briefing baut und Dinge einsortiert.

**Es ist kein fertiges Produkt und kein Dienst, den jemand für dich betreibt.** Es ist ein Setup, das du bekommen hast und selbst in der Hand hast. Die Verantwortung dafür, welche Firmendaten du mit AI verwendest, bleibt bei dir und bei euren eigenen Regeln, genau wie bei jeder anderen Claude-Nutzung. Gibt es bei euch eine Richtlinie dazu, gilt sie; dieses Dokument ersetzt sie nicht.

## Wo deine Daten verarbeitet werden

**Über deinen eigenen Claude-Zugang — sonst nirgends.** Dieses Paket schickt nichts an eigene Server, hat keine eigene Datenbank, keinen Cloud-Sync und keine externen Dienste. Alles, was du hier siehst, sind lokale Dateien auf deinem Rechner plus die Claude-Verbindung, die du ohnehin schon nutzt.

**Alles läuft lokal.** Der Ordner liegt auf deinem eigenen Rechner, deine Projekte, Aufgaben und Notizen sind normale Textdateien darin. Auch das Dashboard ist nur eine Datei (`context/today.html`), die dein Browser von der Festplatte öffnet. Es gibt keinen Server, keine Anmeldung, keine gehostete Adresse und niemanden, der von außen hineinschauen könnte. Nimmst du den Ordner mit, nimmst du alles mit; löschst du ihn, ist alles weg.

Das heißt konkret: **Wenn deine Claude-Code-Nutzung in Ordnung ist, ändert dieses Paket an der Datenlage nichts** — es strukturiert nur, was du Claude ohnehin zeigen würdest. Was hier trotzdem neu ist: Claude greift routinemäßig auf dein Postfach zu, statt nur auf das, was du einzeln hineinkopierst. Genau deshalb steht der nächste Abschnitt hier.

## Was es liest

| Was | Wann | Wie |
|---|---|---|
| **Deine Mails** | nur bei `/morning` oder wenn du es bittest | Inhalte werden nur gelesen. Das Einzige, was zurückgeschrieben wird, ist eine Markierung („KI-Triagiert") auf den bereits durchgesehenen Mails, damit sie morgen nicht erneut gelesen werden. Wie diese Markierung heißt, hängt vom Mailprogramm ab (in Outlook eine Kategorie, anderswo ein Label). Nichts wird verschoben, gelöscht, beantwortet oder als gelesen markiert. Abschaltbar über `mail.tag_processed: false` in `context/config.yaml`. Fragt in jeder neuen Session erneut um Erlaubnis — du kannst jedes Mal Nein sagen. |
| **Dein Kalender** | wie oben | Lesend. Nur Termine, keine Änderungen. |
| **Dokumente** | nur die, die DU aktiv hineinlegst | z.B. Transkripte, Protokolle, Papiere in `inbox/` |
| **Die Dateien in diesem Ordner** | immer | Deine Projekte, Aufgaben, Notizen — das ist sein Gedächtnis. |

**Sensible Themen werden erkannt und ausgelassen — die typischen Fälle.** Erkennt das System eine Mail als HR-, Gehalts-, Bonus- oder Performance-Thema (an Stichworten und an bekannten HR-Absendern), landet sie nie im Briefing, nie im Dashboard und wird nie als Entwurf verarbeitet. Es zählt sie nur ("3 sensible Mails — schau selbst rein") und lässt die Finger davon.

**Eine Garantie ist das nicht.** Die Erkennung läuft über eine Stichwort- und Absenderliste, nicht über Verständnis: Ein Betreff wie "Zu deinem Gespräch nächste Woche" trifft keins der Stichworte und wird ganz normal behandelt. Wenn ein Thema für dich sensibel ist, verlass dich nicht auf die Automatik — die Liste in `reference/mail-triage-rules.md` kannst du jederzeit ergänzen (oder Claude sagen, dass es das tun soll).

## Was es NIE tut

- **Nie Mails senden.** Es schreibt Entwürfe, die in deinem Mailprogramm liegen. Auf "Senden" drückst immer du.
- **Nie Termine anlegen, ändern oder absagen.** Der Kalender wird ausschließlich gelesen.
- **Nie Dateien anfassen, die nichts mit diesem Ordner zu tun haben.** Geschrieben wird an vier Stellen: in diesen Ordner, in deinen **Entwurfsordner im Mailprogramm** (der Entwurf, den du prüfst), als **Markierung auf durchgesehene Mails** (siehe Tabelle oben, abschaltbar), und für den Entwurfs-Mechanismus selbst in den Unterordner **`_tmp/`** — dort legt Claude das kurze Skript ab, das den Entwurf im Mailprogramm öffnet. Immer derselbe Dateiname, bei jedem Entwurf überschrieben: Es bleibt nie mehr als ein solches Skript liegen. Alles darüber hinaus fragt Claude vorher.
- **Nie Dateien löschen.** "Weg" heißt hier immer "ins Archiv verschoben".
- **Nie Daten an fremde Dienste hochladen.** Kein Export, keine eigene Datenbank, kein Dienst des Paket-Autors. Die EINE Ausnahme, die du selbst einrichtest: Beim Tagesabschluss sichert das System den Stand dieses Ordners in **dein eigenes privates GitHub-Repo** — beim Einrichten angelegt, unter deinem Konto, dein Zugriff, jederzeit abschaltbar (Repo-Verbindung entfernen). Sonst nirgendwohin.
- **Nie ungefragt in dein Postfach schauen.** Ohne dein Ja in dieser Session passiert dort nichts.

## Was du beachten solltest

- **Wer außer dir in dein Repo darf:** Beim Einrichten wirst du gefragt, ob der Ansprechpartner aus `VERSION.md` Zugriff auf dein Sicherungs-Repo bekommen soll, damit er dir bei Problemen helfen und Verbesserungen einspielen kann. Sagst du Ja, kann er auch lesen, was mit der Zeit darin landet: deine Projekte, Notizen und Mail-Zusammenfassungen. Sagst du Nein, funktioniert alles genauso, nur muss er dir bei Problemen über die Schulter schauen statt selbst hineinzugreifen. Nachsehen und ändern kannst du das jederzeit: Repo auf GitHub → Settings → Collaborators.
- **Kunden-Daten:** In diesem Ordner landen Projektnotizen und Mail-Zusammenfassungen — je nach Projekt sind das Kunden-Informationen. Behandle den Ordner wie jeden anderen Ordner mit Projekt-Material: auf dem Rechner, den du für die Arbeit nutzt, an einem Ort, den eure Regeln vorsehen, nicht auf fremden Geräten oder in privaten Clouds.
- **Mehrere Kunden in einem Ordner:** Das Briefing stellt nebeneinander dar, was zu verschiedenen Projekten gehört. Alles bleibt dabei auf deinem Rechner und in deiner eigenen Claude-Session; für die allermeisten Arbeiten ist das unproblematisch. Hat ein Projekt strengere Vertraulichkeits-Vorgaben, oder verlangt es der Kunde oder eure Projektleitung: einen separaten Ordner nur für dieses Projekt führen (frische Kopie des Pakets).
- **Nach Projekt-Ende:** Was bleiben darf, archiviert das System (`projects/_archive/`). Was laut Vereinbarung gelöscht werden muss, löschst du selbst im Explorer bzw. Finder — das System löscht grundsätzlich nichts von allein.
- **Weitergabe:** Wenn du den Ordner an jemanden weitergibst, gib die leere Version weiter — nicht deine. Sonst verteilst du deine Projektnotizen mit.
- **Der Ordner ist unverschlüsselt.** Es sind normale Textdateien. Wer Zugriff auf deinen Rechner hat, kann sie lesen (wie deine Word-Dokumente auch).

## Die kurze Version, wenn dich jemand fragt

> „Das ist ein Ordner mit Textdateien, der meinem Claude sagt, wie er mir morgens meinen Kalender und mein Postfach zusammenfasst. Er liest nur, verschickt nichts und ändert keine Termine. Der Ordner selbst hat keinen Server und keine Datenbank: Alles liegt auf meinem Rechner, und was Claude liest, geht denselben Weg wie bei jeder anderen Claude-Nutzung auch, über meinen eigenen Zugang und sonst nirgendwohin."

## Wen du fragst

| Frage | Wohin |
|---|---|
| Dürfen wir das so einsetzen? | die Stelle, die bei euch über Tools entscheidet (Geschäftsführung, IT) |
| Was ist mit personenbezogenen Daten? | eure Datenschutz-Verantwortlichen, intern oder extern |
| Welche Verbindungen zu Mail und Kalender es gibt und was sie dürfen | [`reference/mcp.md`](reference/mcp.md) |
| Claude Code klemmt technisch | eure IT, plus die offizielle Claude-Code-Dokumentation |
| Fragen zu diesem Paket selbst | siehe [`VERSION.md`](VERSION.md) |

_Welche Connectors es gibt, wie du sie verbindest und was sie dürfen, steht in [`reference/mcp.md`](reference/mcp.md)._
