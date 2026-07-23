# Version

**v1.5-open** · as of 2026-07-22

Open variant. Built on the same skeleton as the restricted corporate edition, but without plugin and connector restrictions.

**Questions, bugs, improvement requests:** Luka Knieling · luka@flouence.com · GitHub account `luka-commits`

## What that means

This package comes as a **repo** that you clone. During the setup Claude creates **your own private repo** out of it: it belongs to your GitHub account, nobody else gets in, and the end of day backs up your state there every evening.

Your copy stays the way you received it: it does not update itself, and it is not quietly changed either. You fetch new versions deliberately, when you need them — one sentence in the chat is enough ("fetch the new version"), technically it is a `git pull upstream main`.

If something doesn't work: **get in touch with the version number above.** It may already be fixed in a newer version.

**This belongs to you and stays untouched by an update:**

| Folder | What's in it |
|---|---|
| `context/` | Your projects, tasks, notes, config, mail style |
| `projects/` | One folder per case, including the filed original documents |
| `inbox/` | Sources read in without a project link and your previous briefings — these are **originals, not copies** |
| `reference/` | Only if you have added something yourself (e.g. your own links, your own triage rules) |

Everything else (`.claude/`, `CLAUDE.md`, the documentation) is interchangeable and comes fresh from the new version. So this holds: your own changes belong in these four folders, not in the machinery.

## Changes

**v1.5-open** — The setup now starts by asking whether this is a fresh start or a folder you already have. An existing one is taken over instead of a second system being set up next to it. It also asks early which tools you work with every day and what for, and connects those by name instead of walking six abstract categories fifteen minutes later. If a system is not in the Cowork catalogue, that is no longer the end of it: its own MCP server gets added directly, and Claude runs that step, you only fetch a token. Every step that asks something of you now says in one sentence what happens and why it is worth it.

Alongside that, a full test pass on the package itself: the setup was run end to end on a fresh copy, a grown folder was really taken over and rolled back again, and the delivery was simulated. That found and fixed, among others: a run result that would have shipped with the package and shown you someone else's system state as your own; a self-check for "no mailbox, no calendar" that could never fire because two files spelled the same key differently; a setup tile that reported your mailbox as connected when a private server on the same machine happened to answer; a reference check inside `/adopt` that reported "nothing points here" for every folder on Windows because it relied on a Unix command; and an audit that mixed the examiner's machine into a report about someone else's folder. New commands in the overview that existed but were never announced: `/audit` and `/adopt`.

**v1.4-open** — The workspace tab now shows what is actually wired up here, as KPI tiles: skills, MCP servers, CLIs, repos, plugins, routines, API keys — plus a progress tile that says in percent how much of the startup setup stands, opening into the checklist behind it (capability-aware: a disconnected Google connector does not count as open while the gws CLI covers it, and anything you installed yourself never counts as a missing setup step). New advanced route for Google Workspace: the gws CLI with a Cloud Console guide in `reference/gws-cli.md`; the Cowork connector stays the simple recommended way. It is read off your machine on every render instead of being maintained by hand, so it cannot quietly go out of date: skills come from your skills folder, connections from the registered MCP servers plus your config, tools from a real check whether the command exists, the repo from git. `config.yaml` still supplies what each thing is FOR. On top of that a second look for the dashboard: the button at the top right switches between the normal and a pixel look, the choice is remembered by your browser. It is purely visual, both looks show exactly the same content.

**v1.3-open** — The package's source language is now English: all files (documentation, skills, templates) are written in English. Your working language is a separate setting — `/setup` asks for it once, as its very first question, and stores it in `context/config.yaml → language` (`"en"` or `"de"`). Everything the system says to you follows that setting: briefing, dashboard, entries in your files, mail drafts. Mail drafts are the one exception, they follow the language of the thread they answer. Renamed alongside this: `ORDNERKARTE.html` → `FOLDER-MAP.html`, `WAS-DIESES-SYSTEM-TUT.md` → `WHAT-THIS-SYSTEM-DOES.md`, `reference/selbsttest.md` → `reference/self-test.md`, `reference/system-erweitern.md` → `reference/extending-the-system.md`, `reference/uebungen.md` → `reference/exercises.md`, `reference/routinen.md` → `reference/routines.md`, and the delivery folder `_claude-vorlage` → `_claude-template` (which is renamed to `.claude` before delivery).

**v1.2-open** — The main model is no longer prescribed. The setup asks about your Claude subscription and derives from it how generously it works: on the 20-euro subscription briskly and sparingly, because the quota would otherwise be empty by midday; from Max upwards you have the choice between fast and deep. You can switch this at any time with one sentence in the chat. From now on the subscription is stored in your settings, so that you get a warning before large runs instead of after them.

**v1.1-open** — The setup now leads all the way to a working system instead of stopping at the personalization. New in it: tools are installed instead of merely checked, your six ports (mailbox, calendar, storage, team chat, CRM, development) are gone through one by one and connected on request, access keys like Firecrawl and OpenRouter are created together with you, and if a project has a repository, it is attached right away. Supabase and Vercel only come up if you build applications. On top of that **17 bundled skills**: web research, browser control, Word, PDF, PowerPoint, text polishing, building your own commands, databases. A new routing table in `CLAUDE.md` makes sure this equipment actually gets used in everyday work instead of just sitting there. The dashboard checks the real state instead of copying out the settings, and shows in a section of its own what is still open. Adding things later works at any time via `/checkup` or one sentence in the chat. New thinking tools (several viewpoints, pre-mortem, steelman) for decisions with an open outcome. The package thereby grows to around 4 MB, which does not noticeably slow down a one-off clone.

**v1.0-open** — First version of the open variant. Delivery as a repo instead of a folder copy. Mail and calendar run through freely chosen connectors that you connect in Claude Cowork (`reference/mcp.md`), instead of through a fixed connection. `firecrawl` and `playwright` are standard (`reference/tools.md`). Plugins are allowed (`reference/plugins.md`). New: `SETUP.md` with the complete installation route, and a directory of your own tools (`own_tools` in `context/config.yaml`) that appears as tiles in the dashboard.

### Prehistory of the shared skeleton

**v1.2** — Mac support: now runs on Windows and Mac (OS detection during setup; opening the dashboard via `open`). Drafts now with automatic route selection per machine (`draft_method` in config.yaml): MCP draft tool if available, otherwise COM on Windows or `mailto:` on Mac — `mailto:` needs no permissions and no MDM sign-off; AppleScript is opt-in only. Dashboard fill runs on Node.js instead of Python (comes with Claude Code, nothing to install). VS Code is now the recommended entry point in the README. The setup now ends with proof instead of a promise: the dashboard is rendered and opened directly, on request there is a test draft to yourself, and everyday use is explained in five chat lines. Project structure with mechanisms instead of filing discipline: `inputs/` (received, unchanged) + `work/` (workbench, overlap check before new files) + `outputs/` (went out, dated — gets filled when you say "X is out") + `_archive/` (superseded work states, Claude clears them away itself). Dashboard: Help tab with chat entry point, updated start routes and a new "Consumption under control" section; the Tools tab is now **Start Here** — with space for an explainer video at the top (`reference/quickstart.mp4`) and the cards Mail Style, New Case, Problem Report. The setup now also inventories other connected connectors, and CLAUDE.md has rules for new situations and unfamiliar tools. New: `_tmp/` folder for ephemeral scripts (fixed file names, overwrites itself), protection against embedded instructions in mails/documents (prompt injection), backup now also for the task list and journal, first mail scan clearly fixed at 24 hours.

**v1.1** — Windows fixes: the dashboard now actually opens (`cmd //c start`), PowerShell drafts also run with a locked execution policy, the Python call is determined during setup instead of guessed. On top of that, a more precise account of what happens to your mails (`WHAT-THIS-SYSTEM-DOES.md`). New: `FOLDER-MAP.html` (visual folder overview), fewer follow-up clicks in everyday use, polish after a full audit.

**v1.0** — First version: `/setup`, `/morning`, `/eod`, `/ingest`, `/email` + dashboard.
