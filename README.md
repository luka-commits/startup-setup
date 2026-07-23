# Your Claude Code workspace for everyday work

This package turns Claude Code into your personal work system: a daily briefing (calendar + mail triage), project tracking with a live dashboard, and ready-made mail drafts in your own writing style.

> ### ⚠️ Claude isn't asking you for your name and projects?
> **Type something first** ("hello" is enough). Claude always waits for your first message, it never starts talking on its own. So an empty input field is not a fault.
>
> **Does Claude answer that perfectly normally, without asking for your name and your projects?** Then it is running in the wrong folder. This is by far the most common stumbling block: Claude Code has to be opened **in this folder**, otherwise it knows nothing about this system and behaves like an ordinary chat. The safe route is in [`SETUP.md`](SETUP.md), step 2. Not your fault, you simply can't tell by looking at the program.

## What this is (and what it isn't)

This does **not replace your mail program** and it is not a team tool either. It is your **private chief of staff**: it reads along, remembers, and briefs you. Whatever your team needs to see, you keep maintaining where your team sees it — what lands here is what would otherwise only live in your head.

What the system reads, what it never does, and what you answer when someone asks whether you are allowed to use this: **[`WHAT-THIS-SYSTEM-DOES.md`](WHAT-THIS-SYSTEM-DOES.md)** — one page, worth reading before the first start.

## Requirements

- **Claude Code** on **Windows or Mac**, plus **git** (fetches and updates the repo) and **Node.js** (renders the dashboard; if it is missing, everything else still runs)
- **A GitHub account and the GitHub CLI (`gh`)** — the workspace is fetched from a private repo, and that is also where the end of the day backs up your state. Without it nothing is backed up. Details: [`SETUP.md`](SETUP.md)
- **A connector for mail and calendar.** Nothing here is hard-wired to one mail program: in **Claude Cowork** under Settings you connect whatever you use (Microsoft 365, Google Workspace or something else), and Claude Code accesses the same connection. Without a connector everything works except the mail and calendar part of the briefing. Which connector unlocks what: [`reference/mcp.md`](reference/mcp.md)
- **firecrawl and playwright** are part of the standard equipment here and are installed during the setup: fetching web content and driving a real browser. What for exactly: [`reference/tools.md`](reference/tools.md)

Whatever is missing, the setup tells you itself, in one sentence. You don't have to look anything up beforehand.

## Getting started

The complete installation route is in **[`SETUP.md`](SETUP.md)**: from an empty machine through cloning the repo and the first chat to the smoke test. Reckon with 20 to 30 minutes, once per person. Claude Code can walk you through it step by step itself, that's explained at the top there.

**The one step that really counts** (step 2 there): Claude Code has to be started **in this folder**. It has no program icon and doesn't tell you where it currently is. In the wrong folder it doesn't know this system and answers like an ordinary chat, without an error message. That is exactly where most setups fail, and it often only becomes apparent after twenty minutes.

**This is also your daily entry point:** open VS Code with this folder, or switch into the folder in the terminal and start `claude`.

**One note on language:** during `/setup` you pick your working language once, and it is stored in `context/config.yaml → language`. The package's own files are English, but everything the system says to you — briefings, dashboard, entries, mail drafts — follows that setting.

**Before you answer anything:** double-click **`START-HERE.html`** — it opens in the browser and shows what the setup does with you, step by step, plus an eight-minute walkthrough. Claude opens it for you on the first message anyway.

After the setup: read `ONBOARDING.md` and try `/morning`. How the folder is built and what part of it belongs to you is shown by the **`FOLDER-MAP.html`** (double-click, opens in the browser).

## What you get

| Command | What it does |
|---|---|
| `/morning` | Daily briefing: calendar, mail triage (what needs an answer, where you're waiting), tasks, dashboard |
| `/eod` | End of day: plan versus reality, what stays open, what was decided |
| `/email` | Mail draft in your style, ready to send in your mail program |
| `/ingest` | Automatically sort documents, transcripts and notes into your projects |
| _(no command)_ | Just talk in the chat: "worked 2h on X", "waiting for Y" — lands in the right place automatically |

**You don't have to memorize these commands.** "What's on today?" does the same as `/morning`. Write in your own words what you want — the commands are a shortcut, not a password.

**In a hurry?** "Good morning, quick" skips the mailbox analysis and gives you calendar and tasks in ~30 seconds.

Core principles: Claude does not prioritize for you (you see everything open, tagged — you decide), never sends automatically, and only touches mail/calendar with your permission. Sensitive topics (HR, salary, performance) stay out entirely.

## Using this, and contributing back

You have **read access**: clone it, use it, update it whenever you want (`git pull`, or just say "fetch the latest version" in the chat). Your own workspace lives in your own private repo — the setup creates it for you — so nothing you write ever lands here.

**Spotted a bug, or built something worth sharing?** Fork this repo, make the change there, and open a pull request. Nothing reaches this repo without being merged deliberately, so a proposal costs you nothing and risks nothing.

**Not a GitHub person?** Say "write a problem report" or "write a wish" in the chat — that produces a finished mail draft to the contact in [`VERSION.md`](VERSION.md), and you only press send.

**One thing to know before you rely on it:** this package is delivered as-is, for use inside your own business. Passing it on to third parties is not covered — if that is what you need, ask.

## When something is wrong

Just say so: "that's not right", "I answered that long ago", "that doesn't belong to that project". It gets corrected, no discussion — and if the same mistake keeps coming, the cause gets fixed, not just the single case. **Pushing back is how the system gets better**, not a sign that it is broken.

## A note on cost

Usage runs through your own Claude account and is billed by AI consumption. For scale: **one morning briefing is roughly equivalent to one detailed chat conversation** — the routine work (going through mails, sorting) deliberately runs on the cheapest model, and the reports are kept short. Daily operation therefore barely registers. It only becomes noticeable if you read in very large volumes of documents — and Claude announces that beforehand.

---

_Version + contact: [`VERSION.md`](VERSION.md) · What is borrowed and from whom: [`reference/ATTRIBUTION.md`](reference/ATTRIBUTION.md)_
