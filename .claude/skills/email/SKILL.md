---
name: email
description: "Hilft beim Schreiben von Business-E-Mails auf Deutsch und Englisch im persönlichen Stil des Users. Trigger: /email <kontext>, 'mail schreiben', 'draft mail', 'antwort formulieren', 'schick mal ne mail an', 'e-mail an <person>'. Nimmt Kontext (Empfänger, Betreff, Kernanliegen, Sprache), erzeugt Draft (kurz, direkt, Du-Form auf DE, kein Filler, Signatur aus config.yaml), zeigt Draft im Chat, nach OK legt es den Entwurf über den in config.yaml ermittelten Weg an (draft_method: MCP-Tool / COM / mailto / AppleScript, mit Fallback-Leiter) — der User klickt nur noch Senden. Kein automatisches Senden."
---

# Email Skill — Draft im persönlichen Stil

> **Config:** Vorname/Name/Rolle/Stadt für Signatur + Closer aus `context/config.yaml` (`user.*`, `location.home_city`). `{Vorname}` unten = `user.first_name`.
>
> **Stil-Quelle (Reihenfolge):** existiert `context/EMAIL_STYLE.md`, gilt DIE als Style-Reference — die Templates unten sind dann nur Struktur-Fallback. Ohne sie gilt der Beispiel-Stil unten (vom Original-Autor des Pakets, siehe Hinweis dort).
>
> **"Leite meinen Mail-Stil ab" — der Ablauf lebt hier** (`/setup` archiviert sich nach dem Setup, deshalb nicht dort nachschlagen): **Zuerst prüfen, ob es schon geschehen ist** — existiert `context/EMAIL_STYLE.md`, nicht blind neu ableiten, sondern in einem Satz sagen: _„Dein Stil ist schon abgeleitet (Stand: [Datei-Datum]). Trotzdem neu machen, z.B. weil er nicht mehr passt?"_ Nur bei Ja weitermachen. **Ablauf:** Erlaubnis holen → Haiku-Subagent (Prompt beginnt damit, das Mail-Such-Tool des verbundenen Connectors zu laden; bei Microsoft 365 `ToolSearch select:mcp__claude_ai_Microsoft_365__outlook_email_search`, bei einem anderen Connector den Namen per `ToolSearch query:mail` ermitteln) holt damit über `sender = user.email` die letzten ~6 Monate (limit ~50), fetcht Volltexte, gibt 15–25 typische Ausschnitte zurück (Opener, Closer, Sign-offs, Einzeiler), nach DE/EN getrennt, Sensibles (HR/Gehalt/Performance) übersprungen → daraus Opener/Ton/Länge/Closer/Signatur ableiten (Urteilsarbeit, Hauptmodell) → nach `context/EMAIL_STYLE.md` schreiben (Struktur wie die Style-Reference unten) → dem User in 5–8 Bullets zeigen und "passt das?" fragen, Korrekturen direkt einarbeiten.

## Purpose

Business-Mail-Drafts (DE + EN) im gelernten persönlichen Stil generieren. User gibt Kontext → Draft im Chat → nach OK Entwurf im Mailprogramm geöffnet.

## Trigger

- `/email <kontext>` — z.B. `/email antwort an nicole zum termin`
- `/email` leer → Prompt: "An wen, worum geht's, Sprache?"
- Chat: "mail schreiben an X", "draft mail für Y", "wie antworte ich X", "schreib ne mail dass Z"

## Style-Reference (aus Sent-Items extrahiert)

### Deutsch

**Opener:**
- `Hi <Vorname>,` — Standard, alle direkten Kollegen
- `Hallo <Vorname>,` — leicht formeller
- `Dear <X> Team,` — Teams, formelle Anfragen
- Inline OK: `Hi Vorname, gerne! Ich habe...`

**Ton:**
- **Du/Sie nach Empfänger:** Kollegen (Adresse auf einer Domain aus `company_domains`) und erkennbar vertraute Kontakte (bestehender Du-Thread) → **Du**. Externe, Erstkontakte und alles Unklare → **Sie** mit `Hallo Herr/Frau <Name>,` oder `Guten Tag <Name>,`. Im Zweifel Sie — ein Sie an einen Du-Kontakt ist eine Kleinigkeit, ein Du an den falschen Empfänger ist peinlich. (Sobald `EMAIL_STYLE.md` existiert, gilt deren Regelung.)
- Kurz, oft 1-3 Sätze, sonst max. 1 Absatz
- Direkte Verben statt Konjunktiv-Ketten
- Sympathie durch `!` sparsam einsetzen (`gerne!`, `alles klar!`, `super, vielen Dank!`)
- Bei Verspätung ehrliche Meta-Info: `sorry für die späte Rückmeldung`, `sorry ich war noch an anderen Blockern dran`
- Kontext-Sätze für Verfügbarkeit: `Freitag bin ich beim Klienten`
- Emojis rar, nur 🙂 gelegentlich

**Verbotene Filler-Phrasen (nie verwenden):**
- "Ich hoffe, diese E-Mail erreicht dich gut"
- "Ich melde mich hiermit bezüglich..."
- "Vielen Dank im Voraus für deine Bemühungen"
- "Zögere nicht mich zu kontaktieren"
- Em-Dashes (`—`)

**Closer:**
- `LG {Vorname}` — Standard 90% der Zeit
- `LG\n{Vorname}` (auf 2 Zeilen)
- `Vielen Dank\n{Vorname}` bei expliziter Bitte
- `Beste Grüße\n{Vorname}` selten, nur bei formellen Anfragen

### Englisch

**Opener:**
- `Hi <Firstname>,` — Standard
- `Hello <Firstname>,` — leicht formeller (IT-Tickets, Externe)
- `Dear <X> Team,` — Teams, RAI, DPO, etc.

**Ton:**
- Kurz und direkt wie DE
- Contractions ok: `I'd`, `don't`, `we'll`
- `Thank you very much!` / `Thanks!` für Sympathie
- `My apologies for the inconvenience` bei eigenem Fehler
- Bei Unsicherheit: `I would say X in general` (abwägend)

**Verbotene Filler-Phrasen:**
- "I hope this email finds you well"
- "Please don't hesitate to reach out"
- "Kindly find attached"
- "As per my previous email"
- Em-Dashes (`—`)

**Closer:**
- `Best regards\n{Vorname}` — Standard
- `Best Regards\n{Vorname}` (Groß-Variante ok)
- `Thanks!\n{Vorname}` bei kurzer Dank-Mail

### Signatur (immer, nach Closer)

```
__

{user.name}
{user.role}
```

Optional Zeile hinter der Rolle: `{location.home_city}, Germany` (nur bei erstem Kontakt mit Externen).

## Mail-Type-Templates (Common Patterns)

### 1. Kurze Bestätigung / Danke
```
Hi <Name>, super vielen Dank!
LG {Vorname}
```
Deutsch — 1 Satz reicht.

### 2. Follow-up mit Frage
```
Hi <Name>,

kurze Nachricht — <ein Satz Kontext>. <Ein Satz Frage>?

LG {Vorname}
```

### 3. Meeting-Vorschlag
```
Hi <Name>, gerne! Ich habe mal einen Vorschlag für <Wochentag> geschickt, <alternativer Tag> habe ich leider <Grund>.
LG {Vorname}
```

### 4. Status-Info an Stakeholder
```
Hi <Name>,

kurze Nachricht und vorab schon mal sorry für die lange Funkstille, die letzten Wochen waren mit dem <Projekt>-Projekt ziemlich voll.

Ich habe jetzt <Was> gemacht, <Handlungsempfehlung / Bitte um Feedback>.

LG {Vorname}
```

### 5. IT-Ticket-Antwort (EN)
```
Hello <Name>,

Thank you for your message! <Konkrete Antwort/Frage>.

Best regards
{Vorname}
```

### 6. Formelle Anfrage an Team (EN)
```
Dear <X> Team,

I am currently working on <Kontext-Satz>. <Konkrete Bitte / Frage>.

Best regards
{Vorname}
```

### 7. Sensitive/Diplomatisch (Terminverschiebung, Absage)
```
Hi <Name>, alles klar!
<Kurzer Kontext / Vorschlag>.
LG {Vorname}
```

## Workflow

### Step 1 — Kontext einholen

**Sprache wird automatisch erkannt, nicht abgefragt:**
- Antwort auf eine existierende Mail → Sprache der Original-Mail übernehmen (DE Mail → DE Antwort, EN → EN), gleiche Regel wie in `/morning`'s Draft-Erstellung (Step 5b).
- Frische Mail ohne Original (neue Anfrage, kein Reply) → Sprache aus dem User-Prompt selbst ableiten (deutscher Prompt → DE, englischer Prompt → EN). Nur nachfragen wenn wirklich beides möglich ist (z.B. Empfänger ist erkennbar nicht-deutschsprachig, aber Prompt ist DE) — dann kurz bestätigen lassen, nicht als Standard-Frage.

Wenn User nur `/email` tippt (ohne Kontext) → strukturiert nachfragen:
```
Kurz die Basics:
1. An wen? (Name / E-Mail)
2. Worum geht's? (1-2 Sätze reichen)
3. Ist das eine Antwort auf eine Mail? (Ja → welche / URL — Sprache wird daraus übernommen)
4. Mail-Typ? (Bestätigung / Follow-up / Meeting-Vorschlag / Status / Anfrage / andere)
```

Wenn Kontext teilweise im Trigger steht (z.B. `/email antwort an nicole zum termin`) → nur fehlende Punkte nachfragen.

### Step 2 — Draft generieren

Regeln:
1. **Match den passenden Mail-Type-Template** oben, nicht stumpf drüberkopieren
2. **Empfänger-Vorname** in Opener (nie Nachname, außer explizit gewünscht)
3. **Länge:** so kurz wie möglich. Faustregel: <100 Wörter außer für formale Anfragen
4. **Emojis nur wenn passt** — 🙂 max. einmal, bei entspannter Kollegen-Kommunikation
5. **Ausrufezeichen** sparsam, nur wo Sympathie klar dazugehört
6. **KEINE Em-Dashes** (`—`). Stattdessen `,`, `.`, `:`
7. **Signatur immer** (siehe oben)
8. **Sensitive Themen** (Gehalt, HR, Performance, Feedback über Dritte): WARNUNG ausgeben, User bestätigen dass er wirklich per Mail und nicht persönlich diskutieren will

### Step 3 — Draft im Chat zeigen

Format:
```
📧 Draft-Vorschlag

An: <recipient>
Betreff: <subject>
Sprache: <DE|EN>

——————
<Body inkl. Opener, Content, Closer, Signatur>
——————

OK zum Entwurf-Erstellen? [ja / edit / cancel]
```

User-Antworten:
- `ja` / `ok` / `passt` → Step 4
- `cancel` / `nein` → Abbrechen, nichts tun
- Freier Text (z.B. `mach kürzer`, `ton lockerer`, `Betreff präziser`, `füg X hinzu`) → anwenden, Draft neu zeigen

### Step 4 — Entwurf erstellen (Weg via `draft_method` aus config.yaml)

Es gibt mehrere Wege, einen Entwurf anzulegen; welcher passt, hängt davon ab, was auf diesem Rechner verbunden und installiert ist. Welcher hier funktioniert, hat `/setup` ermittelt und als `draft_method:` in `context/config.yaml` festgehalten (`mcp` · `com` · `mailto` · `applescript` · `manual`). Steht dort nichts: Leiter selbst prüfen — Draft-Tool des verbundenen Connectors via ToolSearch suchen, sonst OS-Default (Windows: `com`, Mac: `mailto`). In allen Fällen gilt: nur anlegen/öffnen, NIE senden. Skripte landen in `_tmp/` mit **festem Dateinamen** — jeder Lauf überschreibt, es bleibt nie mehr als ein Skript liegen.

**Fällt die gewählte Methode aus** (Policy hat sich geändert, Mailprogramm-Modus gewechselt, Connector abgemeldet): eine Stufe tiefer fallen — `mcp` → `com` (Windows) bzw. `applescript` (Mac) → `mailto` → `manual` — und dem User in einem Satz sagen, was stattdessen passiert ist. Bleibt der Wechsel dauerhaft, `draft_method` in der Config nachziehen.

#### `mcp`: Draft-Tool des Connectors

Nur falls `/setup` eines gefunden hat. Tool per `ToolSearch` laden, Entwurf damit anlegen. Beim allerersten Mal fragt Claude Code einmal um Erlaubnis für das Tool — dem User vorweg sagen: „einmal ,immer erlauben' klicken, dann fragt es nie wieder." **Nur das Draft-Tool, niemals ein Send-Tool** — auch wenn der Connector eins anbietet. Gesendet wird hier nicht, das Senden bleibt bewusst beim User (Klick im Mailprogramm).

#### `com`: PowerShell COM (Windows-Default, klassisches Outlook lokal installiert)

Draft wird via **Outlook COM in `_tmp/draft.ps1`** erstellt (UTF-8 für Umlaute) und ausgeführt mit:
```
powershell.exe -NoProfile -ExecutionPolicy Bypass -File _tmp/draft.ps1
```
`-ExecutionPolicy Bypass` ist Pflicht: auf verwalteten Laptops sind unsignierte `.ps1` sonst blockiert. Kommt trotzdem ein Policy- oder Blocked-Fehler zurück, ist das kein COM-Problem — eine Stufe tiefer fallen (`mailto`).

Script-Inhalt:
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'
$outlook = New-Object -ComObject Outlook.Application
$mail = $outlook.CreateItem(0)
$mail.To      = '<Recipient-Adresse>'
$mail.Subject = '<Betreff>'
$mail.HTMLBody = '<Body als HTML — Absätze via <br><br>, Signatur mit <br>>'
$mail.Display()   # NIE .Send()
Write-Host 'Draft erstellt und in Outlook geoeffnet.'
```

#### `mailto`: Link öffnen (Mac-Default, universeller Fallback)

Kein Skript, keine Rechte nötig, unabhängig vom Anbieter — öffnet das Verfassen-Fenster des Standard-Mailprogramms (was immer der User dort eingestellt hat), technisch dasselbe wie ein Klick auf einen Mail-Link:
- **Mac:** `open "mailto:<adresse>?subject=<Betreff>&body=<Body>"`
- **Windows:** `cmd //c start "" "mailto:<adresse>?subject=<Betreff>&body=<Body>"`

Betreff und Body URL-encodieren (Leerzeichen `%20`, Zeilenumbrüche `%0A`, Umlaute als UTF-8-Prozent-Encoding). Nur Plaintext, keine Anhänge; Faustregel Body < ~1.500 Zeichen — längere Mails eine Stufe höher versuchen (`com`/`applescript`) oder `manual`.

**Grenze bei Antworten:** `mailto` erzeugt immer eine NEUE Mail — es kann nicht in einen bestehenden Verlauf antworten. Ist der Draft eine Antwort, den User in einem Halbsatz darauf hinweisen (_„Der Entwurf öffnet sich als neue Mail — häng ihn am besten per Antworten an den Verlauf, Text ist ja kopierbar."_) oder gleich `manual` anbieten (Text im Chat, User klickt selbst auf Antworten). Nicht so tun, als wäre es eine Thread-Antwort.

#### `applescript`: osascript (Mac, opt-in)

Nur wenn `mailto` nicht reicht (z.B. HTML gewünscht) **und** das klassische Outlook läuft. Draft als `_tmp/draft.applescript` schreiben, ausführen mit `osascript _tmp/draft.applescript`:

```applescript
tell application "Microsoft Outlook"
	set newMail to make new outgoing message with properties {subject:"<Betreff>", content:"<Body als Plaintext — Zeilenumbrüche als return>"}
	make new recipient at newMail with properties {email address:{address:"<Recipient-Adresse>"}}
	open newMail
end tell
```

Der "New Outlook"-Modus unterstützt AppleScript nicht zuverlässig, und eine zentrale Geräteverwaltung kann die Steuerung per MDM-Profil sperren — scheitert der Aufruf ("not authorized"), eine Stufe fallen (`mailto`).

#### `manual`: Text im Chat

Der Draft-Text steht ohnehin schon im Chat (Step 3) — dann ein Satz: "Automatisch geht es auf diesem Rechner nicht — Text oben kopieren und in deinem Mailprogramm einfügen."

#### Nach dem Erstellen (alle Wege außer `manual`)

```
✓ Entwurf erstellt und geöffnet.
Empfänger: <name> · Betreff: <subject>
Im Mailprogramm prüfen → Senden.
```

## Regeln

- **NIE automatisch senden.** Skill erstellt nur Drafts. Auch bei "send it" vom User → Draft erstellen, dann Hinweis "prüf bitte im Mailprogramm + Senden".
- **NIE mehrere Drafts parallel** ohne User-OK zwischen jedem.
- **NIE Sensitive Content** (Gehalt/HR/Performance/Konflikt über Dritte) ungefragt drafte — erst warnen und bestätigen lassen.
- **Empfänger-Vorname** immer aus Kontext ableiten. Wenn unklar → nachfragen, nicht raten.
- **Bei Antwort-Mails** — wenn User die Original-Mail nicht liefert, nachfragen ob relevanter Kontext fehlt. Nie erfundene Rückbezüge einbauen.

## Beispiel-Runs

**Run 1: Kurzer Trigger mit vollem Kontext**
```
Input: /email danke an [Kollege] für die Daten
→ Draft:
   An: [name.kollege@firma.com]
   Betreff: RE: [Thema]
   Body:
     Hi [Vorname], super vielen Dank!
     LG [Dein Name]
     [+ Signatur]
→ User: "ok"
→ draft_method: com → .ps1 via Outlook COM (.Display())
→ ✓ Entwurf geöffnet
```

**Run 2: Follow-up mit unklarem Kontext**
```
Input: /email
→ Prompt: 5 Fragen
→ User: "an [Kollegin], deutsch, wollte status pushen, ist noch kein reply da"
→ Draft:
   An: [name.kollegin@firma.com]
   Betreff: Projekt X — kurzes Update?
   Body:
     Hi [Vorname],
     kurze Nachricht — wollte kurz nachfragen ob du schon weitergekommen bist? Falls ich noch was aufbereiten soll, sag Bescheid.
     LG [Dein Name]
     [+ Signatur]
→ User: "mach ton lockerer"
→ Draft-2 mit Anpassungen
→ User: "ok"
→ Entwurf erstellt
```

**Run 3: Formelle EN-Anfrage**
```
Input: /email
→ Kontext-Fragen
→ User: "RAI Team, English, brauche freigabe für eine neue Analyse die auf employee-level analytics macht, formell"
→ Draft:
   An: ResponsibleAI@firma.com
   Subject: RAI Approval Request — <Analyse-Name>
   Body:
     Dear Responsible AI Team,
     I am currently working on <Kontext>. The check would <konkret>. Could you please review and confirm this is compliant with RAI guidelines?
     Best regards
     {Vorname}
     [+ Signatur]
```
