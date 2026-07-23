# Inbox — drop zone

Put everything in here that Claude should file: meeting transcripts, notes, PDFs, decks, mail exports. Then in the chat: `/ingest <filename>`.

**Claude clears old briefings away itself** (to `archive/`, older than 14 days).

**The documents you drop stay put until you say something** — nothing happens here on its own. After being read in, the source moves to where you would look for it: if it belongs to a project, to `projects/<slug>/inputs/`, otherwise to `processed/`.
