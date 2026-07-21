---
name: checkup
description: "Prüft auf Zuruf, ob mit dem Workspace selbst alles in Ordnung ist. Use when the user asks 'ist alles in Ordnung', 'läuft alles', 'check mal das System', 'checkup', 'irgendwas stimmt nicht', 'warum geht das nicht', or when a support contact asked them to run it. Prüft nur lokale Dateien (Einstellungen, Kern-Dateien, Einrichtungsstand) und meldet in Alltagssprache, was läuft und was offen ist. Ändert nichts ohne Ansage, ruft weder Mail noch Kalender ab."
---

# /checkup

Der Nebeneingang zum Selbsttest. Im Alltag läuft die Prüfung ohnehin still bei jedem `/morning` mit und meldet sich nur bei Befund. Dieser Befehl ist für zwei Momente: **„bei mir spinnt was"** und **„lass mal /checkup laufen und schick mir das Ergebnis"** (Support).

## Was du tust

1. **`reference/selbsttest.md` lesen** — dort steht die vollständige Prüfliste. Nichts davon hier duplizieren, nichts dazuerfinden.
2. **Jeden Punkt prüfen.** Ausschließlich lokale Dateien. **Weder Mail noch Kalender abrufen** — auch nicht, um „mal eben" die Anbindung zu testen. Ob sie erreichbar ist, sieht der Nutzer beim nächsten Briefing.
3. **Antworten wie ein Mensch**, nicht wie ein Prüfprotokoll:
   - Zuerst EIN Satz Gesamturteil: alles in Ordnung, oder was fehlt.
   - Dann, nur wenn es etwas gibt, die offenen Punkte als kurze Liste. Pro Punkt: was es für ihn bedeutet und was er sagen kann, damit es weggeht.
   - Anders als im Briefing wird hier **auch das Gute genannt** — er hat ja gefragt. Aber knapp: eine Zeile für alles, was läuft, keine Aufzählung jeder geprüften Datei.
4. **Nie Systemjargon.** Keine Dateinamen, Pfade, Feldnamen, Fehlertexte. Ausnahme: Der Nutzer sagt ausdrücklich, er braucht es für einen Problembericht — dann darf die technische Fassung dazu, klar abgesetzt.
5. **Reparieren ja, heimlich nein.** Was sich gefahrlos selbst beheben lässt (fehlende abgeleitete Datei aus den Quellen regenerieren, Safeguard 4), machst du sofort und sagst in einem Satz, was du repariert hast. Alles, was eine Entscheidung braucht (fehlende Angabe, verworfene Datei, Neu-Einrichtung), wird nur vorgeschlagen.

## Nachrüsten — der Weg, den es sonst nicht mehr gäbe

Der Einrichtungs-Skill archiviert sich nach dem Setup selbst weg. Ohne diesen Abschnitt hätte der Nutzer für alles, was er später ergänzen will, **keinen geführten Weg mehr** — nur noch eine Meldung, dass etwas fehlt.

Deshalb: Sagt der Nutzer zu einem gemeldeten Punkt „mach das" (oder direkt „verbinde mein CRM", „ich brauche einen Firecrawl-Zugang", „häng das Repo dazu"), **führst du ihn durch**, statt ihn auf eine Anleitung zu verweisen. Die Abläufe stehen in der Einrichtung und gelten unverändert:

| Was fehlt | Was du tust |
|---|---|
| Ein Anschluss (Mail, Kalender, Ablage, Chat, CRM, Entwicklung) | Durch Claude Cowork führen: Einstellungen → Connectors → System wählen → mit dem Arbeits-Account anmelden. Danach **per ToolSearch prüfen**, ob die Werkzeuge jetzt da sind, und `inventory.connectors` mit `slot:` schreiben. Kategorien und Nutzen: `reference/mcp.md` |
| Ein Werkzeug (firecrawl, playwright) | `npm install -g <name>`, bei playwright zusätzlich `playwright install chromium`. Danach Version prüfen, `inventory.clis` schreiben. Details: `reference/tools.md` |
| Ein Zugang (Firecrawl, OpenRouter, Supabase, Vercel) | Registrierungsseite öffnen, er legt an und erzeugt den Schlüssel, du hängst ihn an `~/.config/credentials.env` (Rechte `600`). Dann `inventory.accounts` mit `key_env`. **Den Schlüsselwert nie in den Chat schreiben und nie wiederholen.** |
| Ein Projekt-Repo | `git clone <url> projects/<slug>/code`, danach `inventory.repos` mit `path`. Warum getrennt: `projects/README.md` |

**Die eine harte Grenze:** Befehle, die eine Anmeldung oder Eingabe verlangen (`gh auth login`, `firecrawl login`, jeder OAuth-Fluss), bleiben in deiner Bash hängen — dort ist kein Terminal, das antworten könnte. Solche Befehle **nie selbst ausführen**: die Zeile zum Einfügen geben, sagen was danach passiert, auf seine Rückmeldung warten.

Und die Umkehrung gilt auch: Ein offener Anschluss ist **kein Mangel**. Fragt der Nutzer nicht danach, bleibt es bei der einen Zeile im Befund. Nichts wird zweimal angeboten.

## Ton

Ein Handwerker, der kurz unter die Haube schaut und dann sagt, was Sache ist. Nicht: „Diagnose abgeschlossen, 7 von 9 Prüfungen bestanden."

Beispiel bei sauberem Stand:

> Sieht gut aus. Deine Angaben sind vollständig, alle Arbeitsdateien sind da, das Dashboard ist von heute früh.
>
> Eine Kleinigkeit: Ich schreibe Mail-Entwürfe noch im Standardton, weil ich deinen Stil nie gelernt habe. Sag „leite meinen Mail-Stil ab", dann klingen sie nach dir.

Beispiel mit echtem Befund:

> Zwei Dinge stimmen nicht.
>
> Deine Einrichtung ist damals nicht ganz fertig geworden, mir fehlt die Mail-Domain deiner Firma. Deshalb behandle ich Mails von Kollegen wie Mails von außen und sortiere dein Briefing falsch. Sag mir eure Domain, dann ist es in zehn Sekunden erledigt.
>
> Und dein Dashboard ist von Freitag. Sag „guten Morgen", dann baue ich es neu.

## Nicht zuständig

Fachliche Fragen („stimmt der Projektstatus?"), Inhalte, Mail- oder Kalender-Probleme. Der Selbsttest prüft die **Mechanik** des Workspace, nichts sonst. Ist das Problem woanders, sag das klar und verweise auf den Problembericht (CLAUDE.md Safeguard 1) — der geht an die Person, von der der Nutzer das Paket hat.
