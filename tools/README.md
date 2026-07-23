# Your own tools

This is where the small tools you build yourselves live: a calculator, an overview, a form. Anything where clicking beats describing.

## The rule

**One folder per tool**, named after what it does:

```
tools/
├── utilization/       # e.g. an index.html plus whatever belongs to it
└── quote-calculator/
```

In the simplest case a tool is **a single HTML file** that you double-click. That gets you surprisingly far and has the advantage that nothing has to be running and nothing can break.

## To make it show up in the dashboard

Register it in `context/config.yaml` under `own_tools`: name, purpose, address. The address can be a path in this folder, a `localhost` address, or a real URL if the tool runs somewhere.

After that it stands in the dashboard in the "Start Here" tab and is reachable from there. The dashboard only **links**, it does not execute anything.

## To make it look like the rest

Say so when building: *"stick to `reference/design.md`"*. Then the tool uses the same colors, spacings and patterns as the dashboard, and your system looks like one system instead of five different programs.

## When a tool is worth it and when it is not

That is in [`reference/extending-the-system.md`](../reference/extending-the-system.md). Short version: a command is something you say in the chat. A tool is something you click, because it calculates, displays something, or is used by several people.
