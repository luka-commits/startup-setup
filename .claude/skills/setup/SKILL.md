---
name: setup
description: "One-time first-run personalization of a freshly copied workspace. Runs AUTOMATICALLY on first start (the CLAUDE.md rule detects the unfilled context/config.yaml) — or manually via /setup, 'set this up for me', 'first-run setup', 'new user', 'richte das für mich ein', 'ersteinrichtung', 'neuer nutzer'. Asks first which language to work in (English or German), then in one go: name, email, role, location/office days, ALL running projects, the tools they work with every day, and their Claude plan. Asks first whether this is a fresh start or an existing folder to take over. Writes the answers into context/config.yaml (the single config source — skill files are never edited), fills the empty context/ templates, creates one folder per project, files any documents the user brought along, and on request derives their personal mail style from their own Sent Items. Archives itself afterwards. NOT for daily use — runs once."
---

# Setup Skill — One-Time Workspace Personalization

## Core Principle

**Detect state, pick the language, ask once, write ONE config file, fill templates, archive itself.**

**And: the user must never wait into the void.** After their answers you work for several minutes straight. Before every longer block, one short line in the chat — `⚙️ Creating your project folders …`, `📄 Filing your documents …`, `✉️ Looking through your sent mail …`. One line, not a status report.

## Say what is happening, and why it matters

The person in front of you has never seen this system and cannot tell a necessary step from a decorative one. So **before every step that asks something of them — a question, a sign-in, a decision — one sentence saying what happens now and what it buys them.** Not what you are technically doing. What it changes for them.

> Not: *"Now I'm going through the six connector slots."*
> But: *"Next we hook up your mailbox and calendar. That is what turns the morning briefing from a to-do list into something that actually knows your day."*

Three things make the difference between explaining and lecturing:

- **The benefit, not the mechanism.** "So that drafts sound like you and not like a template" beats "deriving your writing style from your Sent folder".
- **One sentence, then act.** A second sentence of justification turns into a lecture, and a lecture is what makes people click away.
- **Only where something is being asked of them.** Steps that run by themselves need the one-line progress note above, nothing more. Explaining something the user does not have to decide costs their attention for the moment when they really do.

**Why this is a rule and not a matter of style:** someone who does not understand why a step matters skips it — and the steps that get skipped are the equipment ones at the end, the ones that decide whether this stays a folder of notes or becomes a system that reaches into the tools they actually work in.

Personal values live only in `context/config.yaml` — skills read them from there at runtime. This skill never edits skill files.

## Step 0: Detect Package State

Read `context/config.yaml`.

- **Contains `[YOUR NAME]`** → fresh, unpersonalized package. Proceed straight to Step 0.5 — nothing to lose here.
- **A real name is already filled in** → **an earlier run was interrupted.** No "already set up": Step 8 archives this skill away when it finishes, so the fact that you are running at all means the last run broke off somewhere between Step 3 (writes the name) and Step 8. Say that honestly and continue where things are missing instead of overwriting everything: check what still carries placeholders (`context/PROJECTS.md` → `[First project`, `context/STATUS.md` → `[YYYY-MM-DD]`, project folders in `projects/`, is `context/EMAIL_STYLE.md` there?) and only make up the gap. Pattern: *"Your setup didn't run all the way through last time — name and location are in, but your projects are still missing. I'll catch that up, takes 5 minutes."* Only overwrite everything if the user explicitly wants to start over.
- **File missing entirely** → the copy is incomplete and cannot be reconstructed: `config.yaml` is the only place that knows the expected schema, and `/morning` reads exact keys from it. Don't invent anything, say it: the folder has to be copied fresh (contact person in `VERSION.md`).

## Step 0.5: Ask the Working Language (FIRST — before anything else)

Before the greeting and the intake questions, ask exactly one bilingual line — because everything the skill says from here on has to already be in the chosen language:

> **Which language should I work in? / In welcher Sprache soll ich arbeiten?**
> **English** or **Deutsch** — just hit enter for English. / **Englisch** oder **Deutsch** — mit Enter nimmst du Englisch.

Nothing else in this message: no greeting, no explanation, no questions. The real greeting comes in Step 1, in their language.

**From the answer onwards, the ENTIRE rest of the setup runs in that language.** That means every word the user sees: the fresh-start question (Step 0.6), the greeting and the six intake questions (Step 1), the model question (Step 3.5), the project and task proposals (Step 4), the document question (Step 6), the mail-style question and the derived profile (Step 7), every question in the equipment steps (7.1–7.4), and the whole closing summary including the mini-briefing (Step 8). No mixing, no "just this one line in English".

**The step contents in this SKILL.md stay English regardless** — they are instructions for you, not user output. The example wordings quoted in the steps below are English because this file is English; if the user picked German, you translate them as you speak them. Never paste an English example verbatim into a German conversation.

Store the answer as `"en"` or `"de"` and write it to `config.yaml → language` in Step 3. Anything other than a clear German choice (empty answer, enter, unclear) means `"en"`.

## Step 0.6: Fresh Start, or Is There Already Something? (one question, right after the language)

Before any intake question, ask this one — because the answer decides which of two different jobs this is:

> *"One thing before we start: is this a fresh start, or do you already have a folder where your work lives — notes, project folders, maybe a CLAUDE.md from an earlier attempt? If so, I don't set up a second system next to it, I take that one over."*

- **Fresh start** (the normal case) → carry on with Step 1, everything below applies unchanged.
- **There is an existing folder** → this is an **adoption**, not a setup. Ask for the path, then:
  1. **Measure it silently first:** `node reference/scripts/workspace-audit.js --root <path> --json`. Seconds, local files only, costs nothing. It gives you the lay of the land the takeover plan needs: what is there, what points at what, what is already dead.
  2. **Do not put the findings in front of the user.** Someone who has just arrived does not want a verdict on how they have been working before anything works at all. The measurement feeds your plan, not a report. The full assessment with recommendations is offered later, once the system runs, via `/audit`.
  3. **Hand over to the `adopt` skill** — it owns the takeover (plan, questions, moving with a way back, acceptance). Come back here for the intake questions and the equipment steps 7.1 to 7.4; those are the same in both cases.

**Why this question comes first and not later:** without it, someone with a grown folder runs straight through this setup and ends up with two systems side by side, neither of them complete. That is the most expensive outcome the whole package can produce, and one sentence at the start prevents it.

## Step 1: Ask Onboarding Questions

**First, open the page that shows what is coming.** Before the greeting, open `START-HERE.html` in the browser — OS-dependent (`os` from Step 2.5; unknown → detect with `uname`): **Mac** `open START-HERE.html`, **Windows** `cmd //c start "" START-HERE.html`, fallback `explorer.exe START-HERE.html`. Fails on both → name the file in the chat and carry on, it is never a blocker.

Then one sentence about it, not a lecture: _"I've opened a page for you that shows what happens in the next twenty minutes — you can read it while we go, or ignore it."_

**Why this comes before the questions and not after:** the person is about to answer six questions and hand over access to their mailbox, without any picture of what for. That page carries the eight-minute walkthrough and the whole run step by step. Someone who has seen it says yes to the equipment steps at the end; someone who has not, quits at question four. It is also the only version of this that works before the setup, because the dashboard it normally lives in does not exist yet.

Greet briefly and **say honestly what's coming** — the user just typed "hello" and has no idea what they're in for. Three sentences, no more, along these lines (in their language):

> *"This is going to be your personal work folder: morning briefing, project overview, mail drafts in your style. I'm setting it up for you now — I'll ask you six questions at once, then I'll create the folders. Expect 10 to 20 minutes, depending on how many projects and documents you bring along."*

Never promise "2 minutes". Whoever starts with the wrong expectation quits in minute four. Then ask these together in ONE message — like a short intake form, not one-by-one back-and-forth:

1. **Name + work email address**
2. **Position/role + area** (e.g. "Consultant, PIPE" or "Project Leader, TMT")
3. **Location:** home city, office abbreviation (e.g. "MUN", "FRA", "BER"), and which weekdays they typically go into the office (rest = remote by default)
4. **Running projects/workstreams — ALL of them:** per project the name, a one-sentence purpose, the key stakeholders, the current state/next milestone (as far as known). This is the most important question of the setup — the system is only as good as this initial state. Bullet points are enough, the details come out of the documents in Step 6.
5. **Which tools do you work with every day, and what for each one?** Mailbox, calendar, where files live, where customer contact happens, what you bill with. Bullet points are enough: _"Outlook for mail, HubSpot for customers, WhatsApp for enquiries"_. **The "what for" is the point of the question**, not the list of names.
6. **Which Claude plan do you have?** — Pro (€20), Max 5x (€100), Max 20x (€200), or Team/Enterprise through the company. One sentence on why that matters: _"It determines how generously I can work without your quota being empty by lunchtime."_

**Why the tools are asked about this early:** Step 7.2 connects the systems, and it does that fifteen minutes later. Without this answer it has to ask abstractly, slot by slot, _"do you have a CRM?"_ — a question with no context, which people answer with "no" out of uncertainty far more often than it is actually true. With the answer in hand it stops asking and starts working: it knows the systems by name, checks what can be reached and how, and only comes back with the bits that need the user's hands. The list also goes into `config.yaml`, so `/checkup` and `/audit` never ask it again.

**Why the plan is asked about and not the model:** the user knows their plan, it's on their invoice. Which language model fits their work is something they cannot know — and they only notice the wrong answer once the quota is empty or the results stay thin. A question the user cannot answer is not a choice, it's a trap. The model decision is derived from it in Step 3.

Don't over-explain each question.

## Step 2: Compute the Workspace Root

Derive the absolute path from the actual current working directory Claude Code is running in — **do not ask the user to type this**. (This package may have been moved/renamed after being received — compute fresh, never assume from any file's existing content.)

## Step 2.5: System Check (silently, while the user answers the questions)

Four checks. **Do NOT report the results individually** — they flow into ONE line in the closing summary (Step 8). The user should not be the audience of a self-test.

| Check | How | If it's missing |
|---|---|---|
| **Skills there?** | does `.claude/skills/morning/SKILL.md` exist? | **Critical.** The `.claude` folder is hidden and tends to get lost when copying/zipping. Say it plainly: _"A hidden part of the folder got lost during copying — without it the commands don't work. Please get a fresh copy (see VERSION.md) and copy it as a whole, not the individual files inside it."_ Then abort the setup — without skills everything else is pointless. |
| **Which OS?** | `uname -s` → `Darwin` = mac, `MINGW*/MSYS*` = windows | Don't guess. Controls the draft mechanics (PowerShell vs. AppleScript) and how the dashboard is opened — record it in Step 3 as `os:`. |
| **Mail/calendar connector?** | First find out what is connected at all: broad `ToolSearch query:mail` and `ToolSearch query:calendar`. With Microsoft 365 you get back `mcp__claude_ai_Microsoft_365__outlook_email_search` and `mcp__claude_ai_Microsoft_365__outlook_calendar_search`; with another provider take the tool names actually returned, never guess a name. | Not a blocker. **If the search finds nothing, ask ONCE: "Do you work with Microsoft 365 (Outlook) or with Google Workspace?"** (third option: something else). Remember the answer for Step 8, so the offer of help there names the right connector instead of staying generic. Don't keep digging if the user doesn't know: then it stays with the generic path. Remember for Step 8: the mail part is missing, the rest runs. |
| **Script runtime?** | `node --version` (default — ships with Claude Code), then `uv run python -c "print(1)"`, `python3`, `python` | Not a blocker. Record the working variant in Step 3 as `script_command:`. If none works: dashboard rendering falls away, the briefing in the chat still runs. |
| **Draft path?** | `ToolSearch query:draft` — does the connected connector return a draft tool? (nothing found → try `ToolSearch query:create` as well) | **Yes → `mcp`** (platform- and provider-independent, best path). **No → OS default:** Windows `com` (assumes classic Outlook installed locally), Mac `mailto` (needs no permissions, no MDM risk, works with any mail program). Record it in Step 3 as `draft_method:`. Don't create test drafts — nothing may pop up in the mail program during setup. **Only the DRAFT tool counts:** if the connector also offers a send tool, it is NOT used and NOT mentioned — nothing is ever sent here. Note for Step 8: the first draft via MCP asks for permission once — click "always allow" once and it's quiet after that. |
| **Other MCPs connected?** | Broad `ToolSearch` queries (e.g. `query:people`, `query:transcript`, `query:search`) — what answers besides the mail connector? | Not a blocker, not mandatory. Remember for Step 8: ONE line _"Also connected: [names] — I can use those too, just say what you need."_ Nothing found → don't mention it. |
| **Sync duplicates?** | Files with ` 2.` in the name (`STATUS 2.md`) — OneDrive conflict copies | Remember for Step 8: _"OneDrive created duplicates while syncing ([names]) — I'll leave them alone, but delete them in Explorer, otherwise I'll read the wrong one at some point."_ Never delete them yourself (Safeguard 2). |

## Step 3: Write `context/config.yaml`

Fill every section of `context/config.yaml` from Step 0.5 + Step 1 + Step 2:

**Every section of the template stays in place** — only fill in values, never delete blocks (the skills read all of them):

- `language:` result from Step 0.5 (`en` or `de`) — controls everything the user sees from now on: briefings, dashboard text, mail drafts, entries written into `context/` files, chat.
- `user:` name, first_name (from the name), email, role
- `location:` home_city, office_abbreviation, office_room_patterns (the abbreviation plus "Office"), other_office_patterns (only if mentioned), office_days, timezone (default Europe/Berlin)
- `calendar:` `noise_subjects` stays empty (it fills up once the user notices calendar noise — mention it in the Step 8 summary)
- `mail:` leave unchanged (`tag_processed: true`, `processed_categories: ["AI-Triaged"]`) — only touch it if the user rejects the category tag in their mailbox. On Mac feel free to leave `tag_processed` on `true` — `/morning` skips the tag there by itself.
- `company_domains:` **derive it from the email address in Step 1** — enter the domain behind the `@`, e.g. `anna@examplecompany.com` → `["examplecompany.com"]`. NEVER leave the placeholder standing: the internal/external prioritization in the briefing depends on it. Only with private providers (gmail.com, web.de, outlook.com, gmx…) ask ONE short question instead: _"Do you have a company mail domain? Then I'll sort mail from colleagues and from outsiders differently."_ — no answer/no domain → `[]` (empty is honest, a placeholder is a silent error).
- `workspace_root:` Step 2's computed path
- `tools_in_use:` the answer from Step 1, question 5 — one entry per tool with `name` and `purpose` in the user's own words. **Write it down even for systems that never get connected**, because the reason matters later: a tool nobody could reach is a known gap, not a blank. `/checkup` and `/audit` read this instead of asking again.
- `plan:` the answer from Step 1, question 6 (`pro`, `max5`, `max20`, `team` or empty). Needed later when it comes to parallel sub-agents or large runs — whoever is on Pro should know BEFORE a five-agent run that it will eat their quota, not afterwards.
- `os:` result from Step 2.5 (`windows` or `mac`)
- `script_command:` result from Step 2.5 (`node`, `uv run python`, `python3` or `python`) — `/morning` uses exactly that for the dashboard fill. Leave empty if no runtime was found.
- `draft_method:` result from Step 2.5 (`mcp`, `com` or `mailto`) — `/email` and `/morning` use exactly that for mail drafts.
- `inventory:` **record only what Step 2.5 found here, don't guess.** The block is filled later by Steps 7.1 to 7.4, when the equipment is actually set up. Enter now what Step 2.5 really saw:
  - `inventory.connectors:` one entry per connector found, with `name`, `purpose` in plain language, `slot:` and `status: true`. A system the user only mentioned but that doesn't answer gets `status: false`. Step 7.2 adds to and corrects this.
  - `inventory.clis:` `firecrawl` and `playwright` with the result of their version command. Step 7.1 installs what's missing and updates this.
  - `inventory.accounts:` leave empty, Step 7.3 does that.
  - `inventory.repos:` Step 8 enters the workspace's own repo, Step 7.4 the project repos.
  - `inventory.plugins:` and `inventory.routines:` stay empty. Neither is something the setup sets up. In the closing summary (Step 8) ONE short question: _"Do you have any Claude Code plugins installed, or should something run on a schedule?"_ Whatever the user doesn't name stays empty. The empty state in the dashboard explains by itself how to add things later.
- **Permanently, not just during setup:** if something is added later (a connector, a plugin, a repo, a routine), it belongs in the `inventory` in `context/config.yaml` immediately, without the user having to ask. That's the same order-to-persist as with "from now on / always" (Safeguard 10): said once, anchored permanently, confirmed in one line.

No other file rewrites. If an answer is missing, leave the field empty — never invent a plausible value.

**No script runtime found (Step 2.5):** say ONE sentence in the Step 8 summary: *"For the dashboard I need a small runtime (Node.js) — everything else works without it, only the dashboard file won't be created. Say the word and we'll set it up together, takes a few minutes."* No unsolicited installation guide — but if the user takes the offer, walk them through the installation step by step and repeat the check afterwards. Never write the dashboard HTML yourself (see CLAUDE.md).

## Step 3.5: Set the Main Model

The plan answer (Step 1, question 6) determines which model is written as the session default into `.claude/settings.json`. The shipped file deliberately contains **no** `model` — only this step sets it. Without an answer: `sonnet`.

**Pro (€20) → `sonnet`, no choice.** Opus burns through this plan's quota in one to two hours, after which the user is stuck until the reset. That's not a matter of taste, it's a limit, and limits are stated, not put to a vote. One line in plain language, then move on:

> *"On your plan I work briskly and economically, otherwise your quota is empty by lunchtime. For individual heavy tasks you can switch up any time in the chat."*

**Max or Team/Enterprise → offer the choice.** Two options, in their language, not in model names:

> Two ways of working. Which fits better?
>
> **a) Brisk and cheap** (recommended) — for briefings, mail, filing, the normal day.
> **b) Slower, but deeper** — if you analyze a lot, build concepts or think through large documents. Uses considerably more of your quota.
>
> You can switch this any time in the chat, even mid-work.

a → `sonnet`, b → `opus`, no answer → `sonnet`.

**Writing it:** add `"model": "<value>"` as the first field in `.claude/settings.json`. The file is JSON — insert only this field, leave the rest unchanged, then check it for validity once. If it's broken after the edit, permissions and hooks stop working.

**It stays a starting line, not a commitment.** The model check rule (CLAUDE.md, token economy) reports by itself in everyday use when task and model don't match. That's exactly why the question is defensible here at all: a wrong initial choice corrects itself in operation instead of costing money or quality for a year.

## Step 4: Fill In the Blank Context Templates

These ship blank with placeholder tokens (`[YOUR NAME]`, `[YYYY-MM-DD]`):

- **`context/PERSONAL.md`** — name, email, position, **area of expertise**, location from Step 1; leave the stakeholder table empty (it fills in as real projects/people show up).
- **`context/PROJECTS.md`** — ONE block per project from Step 1 #4 (Purpose/Status/Phase/Stakeholder/Timeline/Blocker — gaps honestly as `[open]`, never invented). **No to-dos here** — those belong in STATUS.md. Stamp "Last updated". **Writing rules (the template shows the example):** short, concrete sentences in the user's language — purpose = one sentence on why the project exists, the way you'd say it to a colleague ("The client suspects money is sitting in their pricing — we're checking where and how much"), never abstractions without the concrete thing behind them ("potential identification"). Status = what happened last + what's coming next. These blocks later feed the project cards in the dashboard — form-speak here becomes form-speak there.
- **`context/STATUS.md`** — this is where the first tasks land, but **not unasked and not all of them.** Two steps, no direct writing:
  1. **Filter yourself before you show anything.** From the answers, only what passes the Rule 4 intake filter comes along (CLAUDE.md): nothing under 15 minutes, no pure FYI chunks, no milestones/deadlines — **those belong as `Timeline:` in the project block in PROJECTS.md, not as a task** (a date is not work). What should be left: 1–3 real, concretely actionable next steps per project.
  2. **Show the proposal, only write after the OK** (same principle as /ingest — otherwise on day one the user experiences the system writing things into the system behind their back):

     > "From what you've told me, I'd create these tasks:
     > - **[Project]:** [headline] — [one sentence on why it's due]
     > - …
     > Does that fit — anything to drop, anything missing?"

     Work in corrections, then write: headline + indented context line + `#category` (format: STATUS.md header). **The context line is mandatory and must be understandable without you** — in two weeks the user only reads it in the dashboard expander; a task like "finalize segmentation" without the why is worthless by then.
  **Less is more here:** the list fills itself from tomorrow on (mail findings, chat). A setup that starts with 15 tasks teaches the user to ignore the list from day one — exactly what must not happen. **Without this step (with the proposal), the first `/morning` shows zero tasks** — after a setup in which the user named all their projects. Day Plan/Inbox/Recently Done stay empty (correct). Stamp "Last updated" with today's date — that also replaces the `[YYYY-MM-DD]` marker that Step 0 checks as the "not yet filled" signal.
- **`context/JOURNAL.md`** — stamp today's date, one entry "Workspace set up" with the projects created.

## Step 5: Scaffold Their Projects

Create `projects/<slug>/README.md` from `projects/_template/README.md` for EVERY project from Step 1 #4, filled in with what's known so far.

## Step 6: Collect + File Existing Documents

Ask: *"Do you have documents on these projects that I should file — project plans, meeting notes, decks, org charts? Drop them into the `inbox/` folder (or paste them here), I'll sort them in."*

- For each provided document, run the **`/ingest` flow** (that skill's preview + OK loop applies): extract decisions/actions/stakeholders/facts → update the matching project's PROJECTS.md block + `projects/<name>/README.md` → **the filing is done by the `/ingest` flow according to its own rule table** (project material → `projects/<slug>/inputs/`, only homeless things → `inbox/processed/`). **Don't prescribe your own destination here** — what the user brings along during setup is almost always project material, and that's exactly what `/ingest` looks for in `inputs/` later.
- **A whole folder instead of loose documents** — "my old workspace is on the desktop", a case folder, a notes folder with its own logic: that is `/ingest`'s **folder mode**, use it as written there instead of improvising a survey. The rules that matter here: file by content, never mirror the foreign structure, and leave code/data folders where they are. Everything else in this step stays the same.
- Reference material that isn't project state (guides, standards, org charts) → `reference/` instead of ingest, briefly say where it is.
- Delegate bulk extraction of large documents (transcripts, long PDFs) to a **Haiku sub-agent** (structured return), the filing judgment stays here.
- Nothing provided → skip, remind in the summary that `/ingest` files documents any time.

After this step PROJECTS.md should reflect the person's real current workload — that's the bar for "setup done".

## Step 7: Derive the Personal Mail Style (a regular step, needs permission)

**This step is part of the setup, not an extra.** It is the difference between drafts that sound like the user and drafts that sound like the package author. It may be declined (permission for the mailbox is always the user's call), but it is **never quietly passed over**: whatever the outcome, it appears in the Step 8 summary in one line, so nobody discovers three weeks later that their drafts read like a stranger and never learns why.

**Pre-check:** if Step 2.5 found NO mail connector → don't ask (the fetch would fail anyway), and say so plainly in the Step 8 summary: the style is not derived yet, it takes two minutes as soon as the connection is in place, and the sentence for it is "derive my mail style from my sent mail".

Ask ONE question: *"Should I go through your sent mail from the last few months once and derive your writing style? Then all mail drafts (/email, /morning) sound like you from the start. (Read only, nothing gets sent.)"*

- **Yes:**
  1. Delegate the fetch to a **Haiku sub-agent** (self-contained prompt — it must load the mail search tool determined in Step 2.5 via `ToolSearch` FIRST, sub-agents don't inherit tools; with Microsoft 365 that is `ToolSearch select:mcp__claude_ai_Microsoft_365__outlook_email_search`): search with it **by naming the sent FOLDER** — Microsoft 365 `folderName="Sent Items"` (German mailbox: "Gesendete Elemente"), Google Workspace `query="in:sent"` —, last ~6 months, limit ~50; fetch full bodies; return 15–25 representative excerpts (openers, closers, sign-offs, one-liners), grouped DE/EN, skipping sensitive threads (HR/salary/performance).
     > **Not `sender = user.email`** (verified 2026-07-21 against a real Microsoft 365 mailbox): the mail search covers the inbox only, so a sender filter returns zero of the user's own mail and the derivation would silently produce nothing. Same trap as `/morning` Step 3a. **If the fetch comes back empty, say so** and fall back to the package's example style — never write an EMAIL_STYLE.md derived from nothing.
  2. From the excerpts, derive (main model, judgment work): typical openers, formal vs. informal address, tone markers, typical length, closers + signature block, DE vs EN habits, filler phrases the user never uses.
  3. Write the profile to **`context/EMAIL_STYLE.md`** (structure mirrors `/email`'s Style Reference section). `/email` and `/morning` read this file first and fall back to their built-in example templates only if it doesn't exist.
  4. Show the derived profile in 5–8 bullets and ask for a quick sanity-check ("does that fit?") — apply corrections directly to EMAIL_STYLE.md.
- **No / too little history:** accept it without pushing, but **do not pass over it silently** — one line in the Step 8 summary: drafts use the package's example style for now, and the sentence "derive my mail style from my sent mail" starts the same flow any time.

## Steps 7.1–7.4: The Equipment (the part that otherwise never happens)

These four steps run **before** the archiving, because afterwards there is no guided path any more. They are the difference between "set up" and "ready to work".

**One rule applies in all four of them, without exception:** commands that require an input or a login (`gh auth login`, `firecrawl login`, any OAuth flow) **hang in your Bash** — there is no terminal there that could answer them. NEVER run such commands yourself. Instead: give the user the line to paste, say what happens afterwards, and wait for their response. Everything non-interactive (`npm install -g`, `command -v`, `git clone` on public repos) you do yourself.

**Tone in all four:** ONE question per step, plain language, no technical term without an explanation. A "no" is always a complete answer and is never renegotiated. Whatever the user declines is written into the `inventory` with `status: false` — not left out, otherwise it never shows up anywhere later as a possibility.

### Step 7.1: Install the Tools

**Playwright first**, deliberately: once it's there, you can open interfaces yourself in the following steps instead of describing from memory where the user should click.

```bash
npm install -g playwright firecrawl-cli
playwright install chromium
```

Non-interactive, so you do it yourself. Check `command -v npm` beforehand: if npm is missing, that's no disaster — say that the two tools are missing and what still runs without them (everything except web research and browser tasks), then move on. If the installation fails on permissions: **never suggest `sudo`**, name the contact person from `VERSION.md` instead.

**Then the three plugins that belong to the setup**, the same way — non-interactive, no question:

```bash
claude plugin marketplace add DietrichGebert/ponytail
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add obra/superpowers-marketplace

claude plugin install skill-creator@claude-plugins-official
claude plugin install claude-code-setup@claude-plugins-official
claude plugin install code-review@claude-plugins-official
claude plugin install claude-md-management@claude-plugins-official
claude plugin install ponytail@ponytail
claude plugin install impeccable@impeccable
claude plugin install superpowers@superpowers-marketplace
```

**Why the setup does this instead of recommending it:** new plugins appear almost daily, and telling this week's real thing from the noise is a job of its own. That selection is the actual product here. Handing the user a list to install themselves gives them back exactly the work they were meant to be spared. What each one is for: `reference/plugins.md`.

**One of them gets a sentence before it is installed, and only one.** `claude-mem` remembers across sessions and makes it searchable — genuinely useful. It also brings a **daemon** (a program that keeps running in the background, with no window) and a database of its own, and it logs the project content it reads into that database. Say that in one sentence and install it only on a yes:

> *"One more: claude-mem remembers things across sessions, so you don't have to repeat yourself in a new chat. Two things about it: it runs quietly in the background all the time, and it writes down what it reads — including client documents — into its own local file. Want it?"*

```bash
claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem@thedotmack
```

A no here is a full answer and costs nothing else; everything in the system works without it. **Not asking would be the mistake** — anyone working with client data has to be able to make that call themselves.

**Two more exist but install differently**, so they stay a one-liner in the summary rather than a step: `codeburn` needs no installation at all (`npx codeburn` shows what the usage costs), and `find-skills` comes through the skill registry (`npx skills add vercel-labs/skills --skill find-skills`).

If an install fails (marketplace unreachable, no network): name which one is missing and what it would have done, then carry on. The system runs without every single one of them.

Check the result per tool with `<name> --version` and write it into `inventory.clis`. Plugins are read live from the machine, so nothing has to be written into `inventory.plugins` by hand. The bundled skills (`playwright-cli`, the `firecrawl-*` family) are already in the package, there's nothing to download — ONE sentence in the summary that they're there.

### Step 7.2: Connect the Systems They Named

Connections to mail, calendar and the rest run via **Claude Cowork → Settings → Connectors**. The package brings no connection of its own; Claude Code accesses the same connection. Details and categories: `reference/mcp.md`.

**Start from `tools_in_use` (Step 1, question 5), not from the six slots.** The user already told you what they work with and what for. Map those names onto the slots yourself and say what you found, in their words:

> *"You said Outlook for mail, HubSpot for customers and WhatsApp for enquiries. Mail and calendar I can connect right now. For HubSpot there is a connector too, I'll show you. WhatsApp there is no way into, so that one stays by hand."*

That sentence does two jobs: it proves you listened, and it turns six abstract questions into a short list of concrete steps. Only slots that **nothing** in `tools_in_use` maps to still get asked — in one sentence each, so CRM and chat do not stay empty forever just because they never came up.

Then connect **only what the user says yes to**. Not on spec, that would contradict `reference/mcp.md`.

**Never end at "there is no connector".** The route out is in `reference/mcp.md` under "If your system is not in the catalogue", and it is short: catalogue first, then the system's own MCP server added directly in Claude Code, and only then the honest no. **You run the command, the user only fetches the token** — and you open that settings page for them with Playwright from Step 7.1 instead of describing where to click. A system that stays disconnected because the easy path was missing is the single most expensive outcome of this step: it is exactly the daily tab-switch the whole folder exists to remove.

The one thing that must not happen is guessing a route. Check that it exists before you offer it — the catalogue moves fast in both directions.

| Slot | How you handle it |
|---|---|
| `mail` + `calendar` | **Not optional.** Without them `/morning` is an empty shell. Don't ask whether, ask which system: Microsoft 365 or Google Workspace. From Step 2.5 you often already know what's there. |
| `storage` | Ask. With Microsoft 365, SharePoint/OneDrive usually comes along, then it's one checkbox. |
| `chat` | Ask. Teams with Microsoft 365, otherwise Slack. The benefit in half a sentence: reading along with messages that would otherwise get lost. |
| `crm` | Ask — **with the honest limitation from `reference/mcp.md`** that `/morning` does not pull CRM data into the briefing today. The benefit is targeted look-ups during a conversation, not the briefing. That belongs said before anyone connects. |
| `dev` | Only bring it up if Step 7.3 produced a "yes". Otherwise skip it, without comment. |

Per slot the user says yes to: guide them through Cowork (Settings → Connectors → select the system → sign in with the work account). The sign-in is done by **them**, in the browser. Afterwards **verify via ToolSearch** whether the tools are there now — that's the reliable proof, not their self-report and not a look in the browser either. Only then write it into `inventory.connectors`, with `slot:`.

If it doesn't work after two attempts: don't get stuck on it. Note it with `status: false`, say what still works without this connection, and move on. The rest of the setup must not fail over it.

### Step 7.3: Accounts and Keys

Keys never belong **in the repo** (it gets cloned and versioned; a key checked in once stays in the history). They all live in `~/.config/credentials.env`, permissions `600`.

**You always offer two accounts**, because the tools from 7.1 are half dead without them:

- **Firecrawl** — without a key the tool can't read web pages. Their own account on firecrawl.dev, the free entry tier is enough to try it out. The account belongs to **them**, not to the service provider: that way billing and usage sit with them, and nobody shares a limit.
- **OpenRouter** — needed for images and for models that don't come from Anthropic. Without it, the system says honestly on "make me an image" that it lacks the access.

**Don't offer this by yourself, only on request:** an **Anthropic API key**. That is needed exclusively by the `managed-agents` skill (your own agents that run permanently in the cloud). Important and honest to say when it comes up: **that is a second invoice next to the subscription** and is billed per use. Everyday work never needs it — everything this system does runs through the subscription. Scheduled routines (`/schedule`) incidentally do **not** need it, they run through the subscription access.

**One more question, only once:** _"Do you also build applications, or do you work with databases?"_

- **No** (the normal case) → skip without comment. Not a word about Supabase or Vercel, that's tooling for other roles.
- **Yes** → walk them through **Supabase** (database) and **Vercel** (publishing). Both skills are in the package. Afterwards catch up slot `dev` in 7.2.

Setting one up always works the same way: open the sign-up page (with Playwright from 7.1 you can open it for them directly), they register and generate the key, then **you** append it:

```bash
mkdir -p ~/.config && touch ~/.config/credentials.env && chmod 600 ~/.config/credentials.env
echo 'FIRECRAWL_API_KEY=<their-key>' >> ~/.config/credentials.env
```

Write every account you set up into `inventory.accounts` (`name`, `purpose`, `key_env`). **Never write the key value into the chat, never into a file in the repo, never repeat it.** Don't type `status`, derive it from the existence of the entry in `credentials.env`.

### Step 7.4: Connect Project Repos

If one of the projects from Step 5 has a Git repo (product code, website, company repo), it is cloned **into the project**, not mixed into the workspace:

```bash
git clone <repo-url> projects/<slug>/code
```

That way Claude sees both in one session: the project context and the real code. The histories stay separate, `.gitignore` excludes `projects/*/code/` — so the end-of-day never commits someone else's code into the private workspace repo. Full reasoning: `projects/README.md`.

If the repo is private, it needs a login you can't perform → give them the line, let them do it. Afterwards enter it in `inventory.repos` (`name`, `url`, `path`).

Ask **at most once** per project, and only where it's plausible. For a project called "quarterly close", don't ask about a repo.

## Step 8: Archive This Skill + Confirm

1. Move `.claude/skills/setup/` to `.claude/skills-deprecated/setup/` (its job is done — archival pattern, not deletion).
2. **Create their own repo** — only if the workspace is a Git clone (`git rev-parse --is-inside-work-tree`) AND `gh auth status` reports a login. If either is missing: skip silently, not a word about it (`/eod` then skips its backup as well).

   **Why this is not optional:** the cloned folder still points at the repo of whoever sent the package. Without this step, `/eod` pushes the user's work there every evening — or fails every evening. Both only surface after days.

   ONE question, in plain language: _"I'll create your own private repo on GitHub. That's your daily backup, it belongs to you, and none of it is public. Shall I?"_ If yes:

   ```bash
   git remote rename origin upstream
   gh repo create <foldername> --private --source=. --remote=origin --push
   ```

   `gh` creates the repo under the **user's logged-in account** — they own it from the start, there is no transfer. `upstream` stays in place as the source, updates come through it later (`git pull upstream main`).

   Then the **second question, asked separately and never pre-selected** (contact person's name and GitHub account from `VERSION.md`): _"Should <contact person> get access to this repo? Then they can help you directly with problems and push in improvements. But it also lets them read everything that ends up here over time — your projects, notes and mail summaries. You can withdraw the access any time."_

   - Yes → `gh api -X PUT repos/<user>/<repo>/collaborators/<github-account> -f permission=push`, then ONE confirming sentence including a note on where to take it back (repo → Settings → Collaborators).
   - No → move on without comment. That is exactly as correct an answer, and it is never renegotiated.

   Enter the created repo in `context/config.yaml → inventory.repos`. If a command fails: don't dramatize it, ONE sentence in the summary plus an offer of help — the workspace runs fully without a repo, only the backup is missing.
3. Output a summary: what was written to config.yaml, what was filled in (context/ files), which projects were scaffolded, which documents were filed, whether EMAIL_STYLE.md was derived (Step 7), plus these follow-ups:
   - **`/email` style — this line is mandatory, in every outcome.** Derived → say so with the date. Declined, no history, or no mail connector → say that drafts use the package's example style for now, name the reason in half a sentence, and give the sentence that starts it later ("derive my mail style from my sent mail"). Never leave it out: an undiscovered gap here means weeks of drafts that don't sound like the user.
   - **Calendar noise:** put recurring private calendar blocks (gym, study slots, …) into `config.yaml → calendar.noise_subjects` so briefings ignore them.
   - **Dictate instead of typing (ONE sentence, friendly):** the system lives off being told things — dictating status updates is faster than typing. Windows: `Win + H` starts native dictation in any text field, including the Claude Code window. Mac: enable dictation under System Settings → Keyboard, after that pressing `Ctrl` twice starts the microphone.
4. **System-check line (Step 2.5), ONE line, friendly:**
   - All green → _"Everything's ready."_ Nothing more — no checkmark report about things that work.
   - Something missing → what's missing, what works anyway, and a CONCRETE offer of help — never just a pointer to someone else. Mail pattern, **with the system named in Step 2.5 concretely filled in** (Microsoft 365 or Google Workspace) instead of staying generic: _"I can't find a mail connection yet — tasks, projects and dashboard still work, only the mail part of the briefing is missing. You can set it up in Claude Cowork: Settings → Connectors → connect <the named system> with your work account; I'll then use that same connection. Say 'check the mail connection again' once you've done it — or 'help me with it' and we'll go through it step by step."_ If the user takes the offer: walk them through the setup, then test the connection again via ToolSearch and confirm the result in one sentence. (Which connectors exist and what they're allowed to do: `reference/mcp.md`.)
5. **First dashboard render (if a `script_command` was found):** render the dashboard once from the fresh data — following `reference/dashboard-render.md` (the render contract; do NOT load the `/morning` skill for this, it costs a multiple), with `mail_checked: false` (mail fields honestly empty, calendar starting tomorrow) — and open it. **Write `context/.mail_cache.json` with today's date and `mail_checked: false` while you are at it.** Without that stamp every mid-day update for the rest of the first day silently skips (the render contract refuses to render without a cache from today), and the dashboard the user was just shown freezes at the moment they start working. Two birds: the user immediately sees a visible success ("that's your dashboard, from tomorrow it'll be filled"), and the render path is proven on THIS machine while you're still sitting next to them. If it fails: don't dramatize — one sentence in the summary (the briefing in the chat still works) + offer of help. No `script_command` → skip.
6. **Opt-in test draft (only if a `draft_method` is available):** ONE question: _"Should I open a test draft to yourself, so you can see what that looks like later?"_ If yes: a short welcome draft to `user.email` (subject something like "Your workspace is set up ✓", 2–3 sentences), via the `draft_method` from the config — that's the end-to-end proof of the draft path; if it fails, it fails HERE and gets fixed right away, not alone on the first morning. If no: skip without comment. The principle stands: drafts never pop up unasked — this one is explicitly invited, goes only to the user themselves, and nothing is ever sent.
7. **The mini-briefing — how daily life works from now on.** Output it directly in the chat (this is the moment the user is guaranteed to read — they'll never open a documentation file). Exactly these five lines, no more:

   > **How you use this from now on:**
   > - **In the morning:** say "good morning" — I'll pull calendar and mail, brief you and build your dashboard.
   > - **During the day:** just tell me what's up — "chapter 3 is done", "waiting on IT". I'll file it in the right place.
   > - **Documents:** drop them into the `inbox/` folder and say "read this in".
   > - **In the evening:** say "end of day" — two minutes to close out.
   >
   > You don't have to memorize commands — write what you want in your own words.

   Then ONE pointer sentence: "There's more in `ONBOARDING.md` and in the Start Here tab of your dashboard — but the above is all you need." Suggest `/morning` as the first real run (tomorrow morning or right now).
8. **Point at `WHAT-THIS-SYSTEM-DOES.md` once** — one sentence: _"What the system reads and what it never does (send, change appointments, touch HR topics) is in `WHAT-THIS-SYSTEM-DOES.md` — that page is also the answer if anyone asks whether you're allowed to use this."_ Don't walk through it, just show that it exists.

## Quality Guidelines

- **No silent fabrication:** if an answer leaves a gap, say so in the summary — don't invent a plausible default.
- **Re-runs ask first:** never overwrite an already-personalized config silently.
- **One language, from the first answer on:** once Step 0.5 is answered, nothing the user sees switches back. If you catch yourself writing a proposal, a summary or a briefing line in the other language, rewrite it before sending.

## Test Drive

1. First session in a fresh copy → CLAUDE.md's first-run rule triggers this skill automatically, straight to the Step 0.5 language line — one bilingual line, nothing else.
1b. Answer "Deutsch" → everything from the greeting on is German: the six questions, the model question, the task proposal, the closing mini-briefing. Answer with enter/"English" → everything is English. `context/config.yaml` carries `language: "de"` resp. `"en"` at the top.
2. Answer the questions → config.yaml written, context files filled, every named project scaffolded. **Tasks do NOT appear in STATUS.md immediately** — first comes the proposal in the chat (1–3 real actions per project, milestones as `Timeline:` in PROJECTS.md), only after the OK is anything written, every task with a self-explanatory context line.
3. Grep `context/` for `[YOUR NAME]` → zero hits. **Only `context/`**: the documentation and the skills quote the placeholder as text (`CLAUDE.md`, `reference/self-test.md`, `email/SKILL.md`), so a workspace-wide grep fails on a perfectly good run and makes the acceptance test lie.
4. `context/PROJECTS.md` shows exactly the new user's real projects, dated today; ingested documents are reflected there and filed in the owning project's `projects/<slug>/inputs/` (only project-less material lands in `inbox/processed/`).
5. `.claude/skills/setup/` no longer exists; `.claude/skills-deprecated/setup/` does.
5b. `git remote -v` shows **`origin` pointing at the user's repo** and `upstream` at the source — never the other way round. The first push is through, `gh repo view` reports `private`. If the user said no to access, nobody but them is listed under Collaborators.
5c. **Equipment (Steps 7.1–7.4):** `inventory.clis` mirrors what `command -v` really finds. Every system the user named in question 5 is in `inventory.connectors`, with `status: true` or `status: false` and a `slot:`. Slots nobody named and nobody asked about are legitimately absent — the check is "nothing the user mentioned got lost", not "all six appear". No key value is in the chat or in a file in the repo; `~/.config/credentials.env` has permissions `600`. If a project repo was cloned, it sits under `projects/<slug>/code/` and `git status` in the workspace does NOT show it as pending commit.
6. Run `/setup` again → Step 0 detects the real name in config.yaml and asks before doing anything.
7. If a script runtime was found, a rendered `context/today.html` exists at the end (without the mail part); if a `draft_method` is available and the user said yes, a test draft to their own address is waiting — never sent, never to anyone else.
