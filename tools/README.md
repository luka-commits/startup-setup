# Eigene Tools

Hier liegen die kleinen Werkzeuge, die ihr euch selbst baut: ein Rechner, eine Übersicht, ein Formular. Alles, wo Anklicken besser ist als Beschreiben.

## Die Regel

**Ein Ordner pro Tool**, benannt nach dem, was es tut:

```
tools/
├── auslastung/       # z.B. eine index.html plus was dazugehoert
└── angebots-rechner/
```

Ein Tool ist im einfachsten Fall **eine einzige HTML-Datei**, die man doppelklickt. Das reicht überraschend weit und hat den Vorteil, dass nichts laufen muss und nichts kaputtgehen kann.

## Damit es im Dashboard erscheint

Trag es in `context/config.yaml` unter `own_tools` ein: Name, Zweck, Adresse. Die Adresse kann ein Pfad in diesem Ordner sein, eine `localhost`-Adresse oder eine echte URL, falls das Tool irgendwo läuft.

Danach steht es im Dashboard im Tab „Start Here" und ist von dort aus erreichbar. Das Dashboard **verlinkt** nur, es führt nichts aus.

## Damit es aussieht wie der Rest

Sag beim Bauen dazu: *„halt dich an `reference/design.md`"*. Dann nutzt das Tool dieselben Farben, Abstände und Muster wie das Dashboard, und euer System sieht aus wie ein System und nicht wie fünf verschiedene Programme.

## Wann sich ein Tool lohnt und wann nicht

Steht in [`reference/system-erweitern.md`](../reference/system-erweitern.md). Kurzfassung: Ein Befehl ist etwas, das du im Chat sagst. Ein Tool ist etwas, das du anklickst, weil es rechnet, etwas anzeigt oder von mehreren Leuten benutzt wird.
