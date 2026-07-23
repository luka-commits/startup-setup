# Where this leads

This file answers two questions: **why this package exists** and **how to work with AI so that it pays off.** Whoever just wants to get going reads `SETUP.md` and comes back here later.

## The problem most people have

Access to AI is solved. Almost every company now has access to good models, and almost everywhere people work with them.

Nevertheless three things happen at the same time:

**Every conversation starts from zero.** You explain again which project is meant, who is involved, what was decided last week. The assistant doesn't get smarter, it is born anew every morning.

**Costs grow with usage, not with the result.** Without order, an assistant reads everything it can find anew with every question, including what it has already read ten times. The bill goes up, the benefit not to the same degree.

**AI creates disorder itself.** It produces files, drafts and notes faster than a human can file them. After three months nobody can find anything any more, and the tool that was supposed to save time costs some.

What stands out: there is a lot of talk about **how** to deal with AI. Prompts, tools, connections. Hardly anyone talks about **what** it actually accesses. That is exactly where the leverage sits.

## What this package sets against that

Not another tool. A **basic order**.

One folder holding everything that makes up your work: your projects, your state, your decisions, your documents. The assistant works inside it, knows the structure and knows where what is. It doesn't have to search and doesn't have to guess.

Behind it sits a simple principle that makes the difference: **a short and a long memory.** A few files carry the current state and are maintained continuously. They are read on every start and stay small. Everything else sits alongside as reference material and is only read when it is really needed.

The consequence: **your body of knowledge grows over time. The effort per request does not.**

## The system carries the work, not you

The second principle matters just as much, and it is the one most assistants fail at: **the system has to know what it can do, and then do it.**

That sounds obvious and it is not. A workspace can have a database connection, a browser, web access and a dozen commands, and still leave its user standing there because it never looked at its own equipment. Then the person hears "I'm not sure whether you have access to that" about a tool that has been installed and working for weeks. From their side that is indistinguishable from not having it. **A capability nobody knows about is not a capability.**

So three things hold here, and they are enforced in `CLAUDE.md`, not left to good intentions:

- **It knows its equipment.** The list of what is connected and installed is read at the start of every session, not looked up when in doubt. Uncertainty about your own tools is not something the user should ever have to hear.
- **It does the work it can do.** Not an explanation of which command the user could run, not a walkthrough of a dashboard they should click through — it carries the thing out. What stays with the person is what genuinely belongs to them: sending, deciding, signing in. Nothing irreversible happens without a plain question first, and that limit is not negotiable in either direction.
- **It notices instead of waiting.** These users do not know what is possible, so they cannot ask for it. If the same manual step comes up twice, if something goes badly week after week, if they look for something that is not here — the system says so, once, in one sentence, at the moment it matters. Not a catalogue, not a reminder, and never twice for the same thing.

The measure is not how much the system can do. The measure is how little the person has to know in order to get it done.

## Where it grows

The package starts with a handful of commands and a dashboard. That is deliberately little, because a system you can understand in a morning actually gets used.

From there it grows in **your** direction, not in a predefined one:

- Recurring routines become commands of their own. You describe what you do every week and get a command for it.
- Small tools of your own emerge where clicking is better than describing, and appear in the dashboard.
- Connections come along when they are needed: mail, calendar, storage, CRM.
- Recurring runs can happen on a schedule, so that the day is already sorted before anyone asks for it.

How that works without programming is described in **[`reference/extending-the-system.md`](reference/extending-the-system.md)**.

The goal is not the biggest possible system. The goal is a system in which every part gets used.

---

# Working principles

These six points make the difference between AI that impresses and AI that delivers. They cost a little discipline at the start and save time permanently afterwards.

## 1. First check whether it already exists

The most expensive route to a solution is to build it even though it exists. Before something new comes into being, the question is always worth asking: is there a ready-made tool for this, an open project on GitHub, an existing file in our folder?

Just say it along with the request: *"First look whether something ready-made already exists for this before you build anything."* The assistant can search and show you the candidates with their pros and cons. Most of the time the answer is an existing tool, sometimes a file that someone already created last month.

## 2. Plan big undertakings first, then build

With a small task you just get going. With anything that has several steps, involves several people or takes longer than a day, the first step is a plan.

Say: *"Before you start, write down for me how you would proceed and where you are unsure."* The plan costs five minutes and you see immediately whether you are talking about the same thing. A misunderstanding in the plan is one sentence. The same misunderstanding in the finished result is a lost day.

## 3. Work against the first answer

The first answer is rarely the best, and it still sounds convincing. Three questions that reliably find something:

**Steelman:** *"What is the strongest argument against it? Formulate the opposing position as well as you can."* Especially valuable before you make a decision you have already made.

**Pre-mortem:** *"Assume this went wrong a week from now. What was the cause?"* Not "what could happen", but told in retrospect. That finds considerably more, because it forces explanation instead of enumeration.

**Several viewpoints:** *"How does the customer see this, how does sales, how does accounting?"* For decisions where two clever people would decide differently.

These three cost one sentence each and are the cheapest gain in quality there is.

## 4. Check results before they go out

Everything that leaves your own desk gets read beforehand. Not skimmed, read. AI occasionally invents numbers, names and sources, and it does so in exactly the same confident tone as with the rest.

It helps to have the assistant check itself: *"Go through that again and mark everything you can't back up."* It is more honest when checking than you would expect, but it only does it if you ask.

## 5. Structure beats phrasing

Most people try to rescue a bad result with a better prompt. Usually it isn't the prompt, it is that the necessary information isn't written down anywhere.

If an answer is persistently imprecise, the right question is not "how do I phrase this better" but "where is it supposed to know that from". Usually a line is missing in the project profile or a file in the right folder. Once it is there, the answer gets better without any prompt artistry.

## 6. Not everything has to be automated

Something that takes five minutes and comes up three times a year, you do by hand. Building, explaining and maintaining an automation costs more than the task itself.

The rule of thumb: automate what happens **often** and runs **the same way every time**. Everything else you simply say.

---

These principles are not theory. They are what is left over when you work with these tools daily for a year and write down what worked.
