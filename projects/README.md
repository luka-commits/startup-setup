# Canonical Project Structure

Binding structure for all projects/workstreams in `projects/`. One folder per initiative, always the same form — so that Claude can navigate every project immediately.

```
projects/<project-name>/
├── README.md              # Core file: purpose, context, stakeholders, decisions, history (see _template/)
├── inputs/                # Received: decks, Excel, briefings, transcripts (unchanged, never archived)
├── work/                  # Workbench: current work states — notes, analyses, drafts
├── outputs/               # Went out: dated (YYYY-MM-DD_<name>) — the project's delivery history
├── code/                  # The project's code — cloned from the remote, own git history (see principle 7)
└── _archive/              # Superseded work states from work/ (created on the first replacement)
```

## Does the project have a git repo?

If the user works on a project with its own repo (product code, website, company repo), that repo is **cloned into the project, not mixed into the workspace**:

```bash
git clone <repo-url> projects/<slug>/code
```

That way Claude sees both in one session: the project context (README, tasks, decisions) and the actual code. The two git histories stay separate — `.gitignore` excludes `projects/*/code/`, so the end-of-day never commits foreign code into the personal workspace repo.

**Why separate and not everything in one repo:** the workspace holds tasks, notes and mail summaries — personal working material. If that sat in the company repo, every colleague would read along. Conversely, company code has no business in a private backup repo. Both only become apparent once it is too late.

**Register it** in `context/config.yaml → inventory.repos` (name + URL), then it shows up as a card in the dashboard.

## Core principles

1. **README.md is the entry point to the project** — whoever reads only this one file knows the purpose, the state and the open items. PROJECTS.md (context/) holds the short status of all projects, the project README the detail.
2. **`inputs/` is never touched and never archived** — what comes in stays there unchanged (origin traceable). Inputs don't age: the folder IS the filing, there is nothing to clear away here.
3. **Decisions are recorded in the README log** (date + decision + who) — that saves you the "why did we do it that way again?" three weeks later.
4. **Don't create empty folders in advance** — `inputs/`/`work/`/`outputs/`/`_archive/` come into being with the first content.
5. **`work/` is the workbench — kept current and lean by three writing rules, not by tidying up:** (a) chat artifacts always land here, never loose in the root, never in `inputs/`; (b) **overlap check before every new file** — if an existing document covers the same content, THAT one gets updated instead of creating a second one; (c) living work states are updated in place — **if a file is replaced by a new version, the old one moves to `_archive/`**. Nothing more happens: whoever writes like this daily never has to clear out.
6. **`outputs/` is filled by an event, not by a judgment:** if the user says "X is out" / "I sent it" / "went to the client today", the file moves from `work/` to here — with a `YYYY-MM-DD_` prefix. In case of doubt it stays in `work/` (no guessing, no copies). What lies here once is documentation: never edit, never archive. That way "which version did the client see" can be answered at a glance at any time.
7. **Code: clone it in, keep the weight out.** Code belongs in `projects/<slug>/code/`, and it gets there the way the section above describes: **as a fresh clone from the remote — never your existing working copy moved in.** A working copy carries uncommitted changes, stashes and local branches, and moving it is how those get lost; a clone costs a minute and is reproducible. If a repository genuinely cannot be cloned (no remote, too large, foreign machine), it stays where it is and the project README references it by path under `## Files & Links` — half a repository in the workspace is worse than none. **What never travels along:** `.venv`, `node_modules`, `__pycache__`, `build`/`dist`, data dumps. Inside `code/` they are the repo's business and `.gitignore` keeps them out of the workspace history — but they are never copied into `work/` or `inputs/`, and never end up in a backup. They are regenerable by definition, and they are what turns a readable workspace into a haystack.
8. **Living documents live centrally:** day-to-day questions (tasks, statuses, journal) are in `context/` and stay there — the project README carries its own living memory with `## Decisions` and `## History`. Do not create task or journal files per project (two truths).

## Creating a new project

When a new case, workstream or initiative comes along (the user mentions it in the chat — CLAUDE.md Rule 1), **always** run this procedure. Do not improvise: `/morning` reads `projects/<slug>/README.md` for the project cards, `/ingest` assigns documents against the folders — half a structure breaks both.

1. **Ask what you don't know** — in ONE message, not one after the other: name of the project/case · what it is about in one sentence · who the most important people are (client, project leadership, team) · what your part in it is · is there already a date or milestone. Don't ask again about what the user has already said in the chat.
2. **Form the slug:** kebab-case, short, without the client name if confidential (`pricing-diagnostic`, not `Project Pricing Diagnostic Ltd`).
3. **Folder + README:** fill `projects/<slug>/README.md` from `_template/` with what is known. Leave gaps honestly as `[open]` — never invent plausible-sounding details.
4. **Create a block in `context/PROJECTS.md`** (Purpose · Status · Phase · Stakeholder · Timeline · Blocker if any) — **no to-dos**, stamp "Last updated:".
5. **First tasks into `context/STATUS.md`**, if any have already been named — under the project, headline + indented context line (format: STATUS.md header).
6. **Pull the dashboard along** (Rule 1). Then say in one sentence what was created.

Subfolders (`inputs/`, `work/`, `outputs/`, `code/`, `_archive/`) come into being with the first content — don't create them in advance.

## Active vs. archived projects

**Active:** everything with its own block in `context/PROJECTS.md`.

**Archived:** `projects/_archive/` — finished/dormant projects.

**Template for new projects:** `projects/_template/`

## Archiving a project

If the user says "project X is done" / "the case is over" / "that's on ice" — the counterpart to creation, same procedural obligation. **A project that is finished but still sits in the dashboard makes every view worse** — after two months those are half the cards.

1. **Clear the project's open tasks first** — in ONE message, compact: _"Three tasks are still open: [list]. Done, obsolete, or should something come along?"_ Done → "Recently Done". Obsolete → out. Has to come along → stays as a task, reassign the project to `general` (`general` is the standing task group in STATUS.md for things without a project — it needs no folder and no PROJECTS.md block). **Never archive tasks along quietly** — that is how work disappears that nobody remembers.
2. **Move the folder:** `projects/<slug>/` → `projects/_archive/<slug>/`. Move, never delete (CLAUDE.md Safeguard 2).
3. **Remove the block from `context/PROJECTS.md`** and add ONE line in its history section: `YYYY-MM-DD — <project> archived (<one-sentence outcome>)`.
4. **Journal entry** (one bullet) + **pull the dashboard along** (Rule 1). Then one sentence on what happened.

**Offer it on your own — but exactly once:** if `/morning` notices a project that has had **no movement at all for over 30 days** (no task change, no journal entry, no mail), ask casually at the end of the briefing: _"[Project] has been quiet for a month — still current, or archive it?"_ If the user waves it off or doesn't answer, that is the answer: **don't ask again next week.** A project can legitimately rest (client not getting in touch, phase paused) — the question is an offer, not a reminder.
