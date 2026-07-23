# ONBOARDING

How to work with this workspace. `CLAUDE.md` is the instruction set for Claude Code itself — this document is for the human: what is this, what does everyday use look like, where do I start.

## What this is

A personal "operating system" for your work, built on Claude Code: slash-command skills for recurring routines (morning briefing, end of day), a live dashboard, and a structure of markdown files that serves as memory between sessions. The first time, just write "hello": Claude recognizes that the workspace doesn't belong to anyone yet and walks you through the setup (questions about you + your ongoing projects, optionally sorting in documents and deriving your mail style). This document assumes everything is installed. If it isn't yet, go through [`SETUP.md`](SETUP.md) first.

The setup also asks once which working language you want; it is stored in `context/config.yaml → language`. The package's own files stay English, but everything the system says to you — briefings, dashboard, entries in `context/`, mail drafts — follows that setting.

## How the workspace is organized

```
your-workspace/
├── context/                 The memory. Read on every run.
│   ├── config.yaml          Your values: name, location, office days, mail settings
│   ├── PROJECTS.md          HOW the projects stand: purpose, status, blockers, timeline
│   ├── STATUS.md            WHAT is to be done: tasks, day plan, inbox, recently done
│   ├── JOURNAL.md           WHAT HAPPENED: history, decisions, insights
│   ├── PERSONAL.md          Who you are: role, area, important people
│   └── EMAIL_STYLE.md       Your writing style, derived from your own mails
│
├── projects/<case>/         One folder per case or workstream
│   ├── README.md            Purpose, stakeholders, decision log
│   ├── inputs/              What you RECEIVE: decks, Excel, transcripts (unchanged)
│   ├── work/                Workbench: what you are currently WORKING on
│   ├── outputs/             What WENT OUT (dated)
│   └── _archive/            Superseded work states (Claude clears these away itself)
│
├── inbox/                   Drop zone: put here whatever should be read in
├── _tmp/                    Volatile: short scripts from Claude (drafts, dashboard) — overwrites itself
└── reference/               Reference works: connectors, tools, triage rules
```

The same thing as a visual map with color coding (what belongs to you vs. what arrives fresh with updates): [`FOLDER-MAP.html`](FOLDER-MAP.html) — double-click, opens in the browser. What sits in `reference/`: [`mcp.md`](reference/mcp.md) (mail and calendar connectors, including the IMAP fallback route), [`tools.md`](reference/tools.md) (firecrawl and playwright), [`mail-triage-rules.md`](reference/mail-triage-rules.md) (how `/morning` sorts), [`plugins.md`](reference/plugins.md) (optional extensions, explicitly allowed here), [`routines.md`](reference/routines.md) (pre-built automated runs), [`exercises.md`](reference/exercises.md) (the first week, for practice) and [`links.md`](reference/links.md) (all links in one place).

### Why three files for projects, and not one

`PROJECTS.md` says **how it stands**. `STATUS.md` says **what is to be done**. `JOURNAL.md` says **what happened**. That looks like one separation too many, until you know the alternative: if the same task sits in two places, someone has to keep them in sync. In the beginning someone does. After three weeks nobody does, and from then on you no longer know which version is right.

That is why this holds hard: **tasks live exclusively in `STATUS.md`.** Nowhere else. What isn't there doesn't exist for the system.

**What you get out of it:** you can trust every file on its own. The task list is complete because it is the only one.

### The folders of a project — and why you don't have to look after them

Four folders, four clear jobs: `inputs/` is what you **received**, and it stays there unchanged — so that in four weeks you still know what was the client's state and what was your interpretation. `work/` is the **workbench**: what you (or Claude on your behalf) are currently working on. `outputs/` is what **went out**, dated — the answer to "which version did the client see?" at a glance. `_archive/` catches superseded work states.

You don't file anything in there yourself and you don't tidy up: Claude writes new work into the workbench (and would rather update an existing document than create a second one with the same content), moves things dated into `outputs/` when you say something went out, and moves superseded states into `_archive/` itself.

**What you get out of it:** the project folder always shows the current state and stays complete in itself — whoever opens it has the case. That is also what makes archiving at the end meaningful in the first place, and handing over to someone else.

The subfolders come into being with the first content. Nobody creates empty folders in advance.

**And where does the everyday live?** Tasks, project states and journal stay central in `context/` — they answer day-to-day questions ("what's on?") and are read on every run. The project README keeps its own memory with a decision log and history. That way every piece of information has exactly one home.

### Why Claude doesn't prioritize

It doesn't know your real business priority. A rank it claims anyway is guessed, and guessed looks like known. That is why you get everything open, tagged and filterable. The sorting you do.

## How this plays together

You don't file anything yourself and you don't maintain folders. You say what is, and things move where they belong. Three typical routes:

**A document comes in.** You put the deck in `inbox/` and say "read this in".

| What becomes of it | Where |
|---|---|
| The to-dos from it | `context/STATUS.md`, under the project |
| The new project state | `context/PROJECTS.md` |
| The decisions | `context/JOURNAL.md` + the project's decision log |
| The document itself | `projects/<case>/inputs/`, unchanged |

The last point is the one that counts later: if a transcript refers next week to "that deck from the other day", Claude finds it there again. If project material lands in the general filing bin, it searches there in vain and only understands half of it.

**A mail needs you.** `/morning` reads your mailbox and puts every finding that needs a decision from you as an **inbox line** into `STATUS.md`. Not as a task: only once you say "take 1 into project X" does it become a task. The reason is deliberate. Mails that have already been read are not scanned again, so a finding you leave lying today would vanish without a trace tomorrow. In the inbox it stays until you decide.

**You say something in the chat.** "Chapter 3 is done", "waiting on IT", "the meeting went well". No command, no file. Claude routes it itself: status to `PROJECTS.md`, tasks to `STATUS.md`, events to `JOURNAL.md`, and the dashboard follows. And what can't be classified yet — the loose thought, the idea, the "someday" — lands in the inbox until you say what should become of it. That is the actual operating mode. The commands are only shortcuts for the cases where more should happen.

## Daily/weekly loop

1. **In the morning:** `/morning` — calendar + mail + open tasks as a briefing in the chat + full dashboard (`context/today.html`, 5 tabs: Today / Calendar / Projects & Notes / Workspace / Start Here — the Workspace tab shows at any time what is connected, what is still open and what last ran). New mail findings land in the inbox zone (take over or discard — nothing disappears quietly). At the end, optionally: quickly plan the day — your plan lands in the dashboard with a progress bar. Mails that have already been triaged are not read twice (tag in the mailbox + internal ledger).
2. **During the day:** work with Claude normally. Just mention status changes, blockers and decisions in the chat — the workspace updates itself.
3. **In the evening:** `/eod` — short check-in: plan versus reality, what stays open, what was decided.
4. **The calendar tab deliberately shows only today:** your appointments as a timeline with the free blocks in between, and for appointments with a project link an expandable briefing. What is coming up in the next few days you ask in the chat ("what's on this week?").

## Core rules

- **No top 3/prioritization by Claude.** You see the complete, tagged view of everything open — you filter and prioritize.
- **Always confirmation before mail drafts** — never automatic sending.
- **Never mail/calendar without explicit permission** (confirmed anew each session).
- **No sensitive data** (HR, salary, performance) in the dashboard or chat output.
- **Token-efficient by design:** routine work (mail fetch, classification) runs on a cheap model; judgment and text on the main model.

## Reality: this forgives gaps

You will forget `/morning`. You will be at the client for two weeks and not look in here. **That is planned for, not a problem:**

- The system **never pretends to be up to date.** The dashboard shows its real age, and after a few days Claude tells you once when you come in that your state is old — once, without nagging.
- **Getting back in costs ONE message:** say "good morning", you'll be asked what happened in the meantime — two or three bullet points are enough, Claude clears up the rest (including the tasks that were done long ago).
- **There is no expiry.** Whoever works in the chat keeps the system current on the side, entirely without commands.

## Voicing a wish costs one sentence

If something is missing for you ("can this track quotes too?", "I'd like a command for the weekly report") — just say it in the chat. Whatever can be built right away gets built. Whatever would have to be developed in the package itself, Claude packages on request as a finished mail to the person you got the system from — you read it over and click send. That way your needs flow back without you having to write a ticket anywhere.

## When something is off

- **Just say in the chat what looks odd** ("the dashboard is showing old data", "the task is duplicated") — the system repairs derived files itself and backs up the last project state before every change.
- **If a statement is wrong** ("I answered that long ago", "that doesn't belong to that project") — say so. It gets corrected without justification; if the same mistake repeats, the cause gets fixed, not just the single case. Mail assessments are assessments: Claude sees your mailbox, not your phone call.
- **"Undo that"** works for the last change to the project state.
- **No briefing even though you said "good morning"?** Claude Code is probably running in the wrong folder — see [`SETUP.md`](SETUP.md), step 2.
- Nothing here can accidentally send mails or change appointments — you always have to send drafts yourself in your mail program.

## Quick start (after the setup)

1. Run `/morning` (permission for mail/calendar is asked once per session). The first run takes a few minutes (initial mailbox intake), after that it goes faster.
2. If calendar noise turns up in the briefing (private blocks, gym, …): enter the subject in `config.yaml → calendar.noise_subjects` — or just say in the chat that the appointment doesn't belong in the briefing.
3. **Dictating beats typing.** The system lives on you telling it things — and a status update is faster spoken than typed. Windows: `Win + H` starts the built-in dictation in any text field, including the Claude window. Mac: activate dictation once under System Settings → Keyboard, after that pressing `Ctrl` twice is enough.
4. From here the system largely maintains itself — the more consistently you mention status changes in the chat (or dictate them), the better the briefings.

**One more thing:** [`WHAT-THIS-SYSTEM-DOES.md`](WHAT-THIS-SYSTEM-DOES.md) — one page on what is read and what never happens. Also the answer if someone asks you whether you are allowed to use this.
