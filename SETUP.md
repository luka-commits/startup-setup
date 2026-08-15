# Setup

Once per person, about 20 to 30 minutes. After that, all you do each day is start Claude Code in this folder.

This guide covers everything that has to happen **before** the first chat: install the tools, fetch the repo, start Claude Code in the right place, establish the connections. The same steps exist as a visual map to tick off: **`SETUP-ROADMAP.html`** (double-click, opens in the browser, remembers your progress). The actual personalization (your name, your projects, your mail style) is something Claude asks about itself in the first chat. You don't have to enter anything about yourself here.

**Order matters.** Step 2 is the point where most setups fail. Take it seriously, even though it looks trivial.

---

## Let yourself be walked through it (recommended)

As soon as step 0 is done, Claude Code itself is there and can walk you through the rest. Start `claude` and say:

> "Walk me through the SETUP.md from step 1. Give me one command at a time, wait until I have run it, and check the result before we move on."

Browser logins (OAuth, connectors) you do yourself, the rest Claude can take over. Whoever prefers to read and type simply works through the steps from top to bottom.

---

## 0. Requirements

Five building blocks, once per machine:

- **git** fetches the repo and keeps it up to date.
- **GitHub account + GitHub CLI (`gh`)** — your workspace lives in a private GitHub repo: that is where you fetch it from, and that is where the end of day backs up your state (your account, your access). The CLI handles the login once, after that nothing ever asks for a password again.
- **Node.js** runs the additional tools and renders the dashboard. Without Node everything except the dashboard file works.
- **Claude Code** is the assistant itself.
- **Claude Cowork** is where you connect your mailbox and calendar, and it is the one item on this list people miss. Nothing on your machine reaches your mail on its own: the connection is made once in Cowork (Settings → Connectors, sign in with your work account), and Claude Code then uses the same connection. Without it the morning briefing still runs, but it knows neither your appointments nor your inbox, which is most of what makes it worth having. It comes with the same subscription as Claude Code, there is nothing extra to buy. **The setup walks you through it in step 7.2** — you do not have to prepare anything, you only have to know that this step is coming and that it needs your sign-in.

**No GitHub account yet?** Create one at [github.com/signup](https://github.com/signup) (free, use your company mail). You'll need the username in a moment; tell it once to the person you got the package from — they will unlock the repo for you.

**Mac:**

```bash
# Homebrew, if not already present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node git gh
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows:**

1. Install Node.js LTS from [nodejs.org](https://nodejs.org) (standard installer, accept all defaults).
2. Install Git for Windows from [git-scm.com/downloads/win](https://git-scm.com/downloads/win). Claude Code uses the Git Bash that comes with it as its shell, so this is not an optional step.
3. GitHub CLI in **PowerShell**: `winget install GitHub.cli`
4. Install Claude Code in **PowerShell**:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Alternatively via WinGet: `winget install Anthropic.ClaudeCode` (which then does not update automatically).

**Log in to GitHub once** (Mac: Terminal, Windows: Git Bash — reopen the window once afterwards so that `gh` is found):

```bash
gh auth login
```

Answer the questions like this: `GitHub.com` → `HTTPS` → `Login with a web browser`, then enter the displayed code in the browser. That's it — this login is permanent, and it also covers the daily backup.

**Check** (Mac: Terminal, Windows: Git Bash or PowerShell):

```bash
node --version
git --version
gh auth status
claude --version
```

Three version numbers plus a "Logged in to github.com" and you're good. On the first `claude` start you log in once in the browser. Claude Code needs a Pro, Max, Team or Enterprise account.

---

## 1. Clone the repo

This is the address:

```
https://github.com/luka-commits/startup-setup
```

The repo is private. To be able to see it, you have to be unlocked once — that is what you passed on your GitHub username for in step 0. If you get "repository not found" when cloning, that is usually exactly the reason, not a typo.

**Route A, in VS Code (no terminal needed):**

1. Open VS Code.
2. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`), type `Git: Clone`, Enter.
3. Paste the address above, Enter.
4. Pick a folder of its own as the destination, for example `code` in your user directory.
5. Click "Open" when VS Code asks whether it should open the cloned folder.

The first time, VS Code asks for your GitHub login and sends you to the browser. That is normal, and never happens again afterwards.

**Route B, in the terminal:**

```bash
mkdir -p ~/code && cd ~/code
gh repo clone luka-commits/startup-setup
cd startup-setup
```

**Whichever route: do not** clone into `Desktop` or `Documents` if those folders are synced with iCloud or OneDrive. The sync services create conflict copies on fast writes (`STATUS 2.md`), and at some point the system reads the wrong file. A folder of its own like `~/code` is the safe place.

**Check:** in the VS Code explorer on the left you see `CLAUDE.md`, `context/`, `projects/` and the folder `.claude`. In the terminal `ls -a` shows the same. If `.claude` is missing, the clone is incomplete and nothing further works.

**This folder does not stay mine.** During the setup in step 3, Claude creates your own private repo from it under your GitHub account — belonging to you, visible to nobody else. From then on the end of day backs up there, and you deliberately fetch updates from me with one sentence in the chat.

---

## 2. Open Claude Code IN this folder

**This is the most important step of the whole guide.**

Claude Code has no program icon and no window that tells you where it currently is. It always reads the folder it was started in. If you start it somewhere else, it doesn't know this system: no commands, no projects, no briefing. It then answers like a perfectly ordinary chat, without an error message. That is exactly why the mistake often only becomes apparent after twenty minutes.

Two routes, both lead to the same result:

**Route A, VS Code (the most convenient for most people):**
If you cloned via VS Code in step 1, the folder is already open — otherwise "File → Open Folder" and choose the cloned folder. Then open the Claude panel (Claude icon in the sidebar; if it's missing, search for "Claude Code" in the extensions and install it). On the left in the explorer you see `CLAUDE.md` and `context/`. That is your proof that the right folder is open.

**Route B, terminal:**

```bash
cd ~/code/startup-setup
claude
```

On Windows there is a faster way too: open the folder in Explorer, click into the address bar at the top, type `cmd`, Enter, then enter `claude`.

### How you know you are in the right place

After the start, Claude Code shows the current working folder. If the name of your cloned folder is there, you're good.

The more reliable test comes in step 3: **if Claude answers your first message with the guided setup and asks you for your name and projects, you are in the right place.** If it answers like a normal chat instead, you are in the wrong folder. Then quit Claude Code (`/exit`), `cd` into the right folder and start again.

---

## 3. First start

Type `hello` and press Enter. Nothing more.

Claude recognizes by itself that this folder doesn't belong to anyone yet, and starts the setup: a few questions about your name, role, location, your working language and your ongoing projects, after which it creates your folders and files. Optionally you can have documents sorted in during this and derive your mail style from your own sent mails.

Reckon with 10 to 20 minutes, depending on how many projects and documents you bring along. Both can be added later.

**Two questions at the end are important, don't skim over them.** Claude offers to create your own private repo for you — that is your daily backup, and it belongs to your account. Say yes here, otherwise the end of day has nowhere to back up to. After that it asks separately whether the contact person from `VERSION.md` should get access to this repo so they can help you with problems. That is a genuine choice: with access they can also read everything that lands in there over time. No is a perfectly normal answer, and you can change it later at any time.

**Claude always waits for your first message.** An empty input field after the start is not a fault.

**Still in the same window, one command:** unlock Anthropic's official plugin catalog —

```
/plugin marketplace add anthropics/claude-plugins-official
```

This installs nothing. It makes the catalog known, so that Claude can recommend the fitting tool from it in everyday use when a task needs one — installation only happens if you say yes. What actually counts from the catalog is described in `reference/plugins.md`.

---

## 4. Equipment: tools, connections, access keys

**You don't do this by hand.** The setup from step 3 goes through it with you, in this order:

1. **Install the tools** — `firecrawl` (fetches web content) and `playwright` (drives a real browser). Claude installs both itself. Reference: [`reference/tools.md`](reference/tools.md)
2. **Establish the connections** — Claude starts from the tools you named in question 5 and connects those, rather than asking abstractly about six categories. Connecting happens in **Claude Cowork under Settings → Connectors**; Claude Code then accesses the same connection. Anything you did not mention gets one short question, so nothing stays open just because it never came up. And if a system is not in the catalogue, that is not the end of it: Claude adds its MCP server directly, you only fetch a token. What each connection unlocks, and the full route: [`reference/mcp.md`](reference/mcp.md)
3. **Create the access keys** — Firecrawl and OpenRouter (images and special models). Whoever builds applications is additionally offered Supabase and Vercel, otherwise it doesn't even come up. The keys land in `~/.config/credentials.env`, **never in the repo**: that gets cloned and versioned, and a key checked in once stays in the history forever.
4. **Attach project repos** — if one of your projects has a repository, it gets cloned to `projects/<project>/code/`. Its own history, in the same field of view. Why separate: [`projects/README.md`](projects/README.md)

The browser logins are always done by **you**, Claude can't take those off your hands. Everything else it takes over.

**Without a connection the rest still works:** projects, tasks, dashboard and sorting in documents need no connection. All that's missing then is the mail and calendar part.

**Want to add something later?** One sentence in the chat is enough, for example "connect my CRM" or "set up the Firecrawl access for me". Or say `/checkup`, then Claude shows what is still open and sets it up on request.

---

## 5. Smoke test

Check everything once, so that nothing stays half configured.

In the terminal:

```bash
claude --version                    # Claude Code installed
node --version                      # dashboard runtime present
firecrawl --version                 # from step 4
ls context/config.yaml              # setup has written
```

In the chat (Claude Code started in the folder):

```
/morning
```

**The expected result:**

- Claude greets you by your name, not generically.
- It shows your projects and tasks from the setup.
- It opens `context/today.html` in the browser, your dashboard.
- With a connector connected, calendar and mail come on top; otherwise it says in one sentence that this part is missing.

If that runs through, the setup is done. From tomorrow on, `/morning` is your daily entry point.

---

## If something is missing or fails

| Symptom | Cause and solution |
|---|---|
| Claude answers `hello` like a normal chat, asks nothing | Wrong folder. Back to step 2. By far the most common case. |
| `claude: command not found` | Terminal not reopened after the installation. Close the window, open it again. If that doesn't help: `claude doctor` in a terminal that knows it, otherwise repeat step 0. |
| `ls -a` shows no `.claude` | Clone incomplete, or folder copied by hand instead of cloned. Clone again, step 1. |
| `ls -a` shows a folder `_claude-template` instead of `.claude` | The package was shipped in the development state. Rename `_claude-template` to `.claude` (in Explorer/Finder: right-click → Rename), restart Claude Code. Not your fault. |
| When cloning: "repository not found" | You are not unlocked yet, or `gh auth login` is missing. Pass on your username and check step 0. A typo in the address is the rarer case. |
| In the evening: "push fails" or "nothing backed up" | No repo of your own was created during the setup. Say "create my own repo for me" in the chat, then it gets done. |
| Dashboard doesn't appear | Node.js is missing or not on the PATH. Check `node --version`, otherwise step 0. The briefing in the chat runs anyway. |
| No calendar, no mail in the briefing | Connector not connected. Say "connect my mailbox" in the chat, then Claude sets it up. Background: `reference/mcp.md`. |
| Files with ` 2.` in the name turn up | The folder sits in a sync directory. Delete the conflict copies, move the repo to `~/code`, step 1. |
| `npm install -g` fails with a permissions error | Do not repeat it with `sudo`. On Mac a Homebrew Node installation helps, otherwise set the npm prefix to a folder in your home directory. |

If you get stuck somewhere: report the failing line plus the complete output, the contact person is in `VERSION.md`. Don't guess your way around it, half-configured setups otherwise only surface weeks later.

---

## Optional: run the briefing automatically

Whoever has to type `/morning` in the morning will eventually forget it. There is a remedy: **routines**. Claude Code runs a task on a schedule without anyone sitting in front of it.

**Important to understand before you switch this on:** a routine does **not run on your machine**, it runs in Anthropic's cloud, with a fresh clone of your repo. It sees no local files and no locally stored credentials. It works in the clone, commits and pushes. On your machine the result only appears after a `git pull`.

Three conditions follow from that:

1. The workspace has to be a repo the cloud can access. With this delivery it is one anyway.
2. The mail and calendar connector has to be attached **to the routine**, not just connected locally. The assistant asks about that when creating it.
3. Your working state therefore sits on GitHub and is processed in Anthropic's cloud. That is a deliberate deviation from the otherwise purely local way of working, see `WHAT-THIS-SYSTEM-DOES.md`. If you don't want that, leave routines out and type `/morning` yourself.

Setting it up happens in conversation, right in this folder:

```
/schedule every weekday at 8:00: create the morning briefing, commit and push
```

Claude asks about the repo, environment, model and connectors and creates the routine. Managing them: `/schedule list`, `/schedule update`, `/schedule run`. Overview in the browser: [claude.ai/code/routines](https://claude.ai/code/routines) (login required).

**Check:** `/schedule list` shows the routine. On the detail page, "Run now" starts a test run.

**Requirement:** a subscription login with Claude Code activated on the web. The shortest possible interval between two runs is one hour.

**More ready-made routines** (weekly review, Monday outlook) are in [`reference/routines.md`](reference/routines.md), with sentences to copy.

---

## Recommended: the working style, once per machine

Everything above configures **this workspace**. One thing belongs a level higher, in your own
`~/.claude/CLAUDE.md`: **how the agent works** — when it asks and when it just does it, how it
checks its own output before saying done, when it argues back instead of agreeing, which thinking
tool a decision earns.

That block is in [`reference/working-style.md`](reference/working-style.md). Copy it into your
global file once and it applies to every project on your machine, including repos that know nothing
about this package. It deliberately does not live in a repo: rules in a repo mean one copy per
repo, all drifting apart.

**Check:** `bash tools/check-working-style.sh` says whether your copy is installed and current.

---

## Optional: dictate instead of typing

This system runs on text in the chat. That is exactly where the brake sits: whoever has to type out the context for a project eventually types less, and then the system knows less.

**Wispr Flow** turns speech into clean text, in any input field, in German too. Instead of typing three sentences, you say them. For longer prompts, meeting notes and mail drafts the difference is noticeable.

- Download: [wisprflow.ai](https://wisprflow.ai/r?LUKA20150)
- The first month is free.

Purely optional. Whoever prefers typing leaves it out.

---

## Afterwards

Every day: open VS Code with this folder, or `cd` into the folder in the terminal and start `claude`. A "good morning" is enough, the system knows the rest.

How the folder is built is described in `ONBOARDING.md` and in the `FOLDER-MAP.html` (double-click, opens in the browser). What the system reads and what it never does is in `WHAT-THIS-SYSTEM-DOES.md`. **For the first week:** the exercises in `reference/exercises.md` — one scenario per day, which teaches you working with the system faster than reading does. All links and guides in one place: `reference/links.md`.
