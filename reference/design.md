# Design-System

Die Farben, Abstände und Muster, aus denen das Dashboard gebaut ist. Zwei Gründe, warum das hier steht:

1. **Wenn ihr eigene Tools baut**, könnt ihr sie mit diesen Werten gestalten. Dann sehen sie aus wie ein Teil desselben Systems und nicht wie fünf verschiedene Programme.
2. **Wenn Claude etwas für euch gestaltet**, sagt ihr einfach „halt dich an `reference/design.md`" und bekommt einen konsistenten Stand statt einer neuen Optik pro Anlauf.

Alle Werte sind im Dashboard als CSS-Variablen definiert (`context/today_template.html`, ganz oben). Ändert ihr sie dort, ändert sich das ganze Dashboard mit.

## Haltung

Ruhig, sachlich, wenig Farbe. Farbe bedeutet hier immer etwas: Grün ist das System selbst, Amber und Rot sind Warnstufen. Alles andere ist neutral. Wer Farbe zur Dekoration einsetzt, nimmt ihr die Aussagekraft.

## Farben

**Akzent (das System selbst)**

| Token | Wert | Wofür |
|---|---|---|
| `--brand` | `#177B57` | Aktive Elemente, Akzentlinien, der laufende Tab |
| `--brand-deep` | `#0B3F2D` | Text auf hellen Grün-Flächen |
| `--brand-soft` | `#E8F1ED` | Grün hinterlegte Flächen |

**Flächen und Text**

| Token | Wert | Wofür |
|---|---|---|
| `--bg` | `#F7F8F7` | Seitenhintergrund, leicht warm statt reinweiß |
| `--card` | `#FFFFFF` | Karten und Panels |
| `--text` | `#0D1F1A` | Überschriften, wichtige Werte |
| `--text-2` | `#3F4D47` | Fließtext |
| `--text-3` | `#7A857F` | Beschriftungen, Nebensächliches |
| `--border` | `#E2E6E3` | Normale Trennlinien |
| `--border-strong` | `#C8CFCB` | Wenn eine Kante deutlicher sein muss |

**Warnstufen**

| Token | Wert | Wofür |
|---|---|---|
| `--sev-amber` / `--amber-soft` / `--amber-border` / `--amber-deep` | `#B54708` · `#FEF3E2` · `#F8D5A4` · `#92400E` | Achtung, aber nicht dringend |
| `--sev-red` / `--red-soft` / `--red-border` / `--red-deep` | `#B42318` · `#FBE8E5` · `#F5C5BE` · `#911C13` | Überfällig, fehlgeschlagen, blockiert |

Mehr Farben gibt es nicht. Braucht ihr eine weitere Bedeutung, prüft zuerst, ob eine der vorhandenen sie schon trägt.

## Abstände, Ecken, Schatten

| Token | Wert | Wofür |
|---|---|---|
| `--pad` | `20px` | Innenabstand von Karten |
| `--gap` | `14px` | Abstand zwischen Karten |
| `--shadow-1` | `0 1px 2px rgba(13,31,26,.04)` | Ruhende Flächen |
| `--shadow-2` | `0 4px 16px rgba(13,31,26,.06)` | Hervorgehobene Flächen |
| `--ease` | `cubic-bezier(.2,0,0,1)` | Jede Bewegung, damit nichts hektisch wirkt |

**Radien:** `999px` für Chips und Pillen, `10px` für Karten und Panels, `6px` für kleine Flächen wie Code-Chips. Mehr Stufen braucht es nicht.

**Schrift:** `Inter`, falls auf dem Rechner vorhanden, sonst die Systemschrift. Bewusst nicht nachgeladen, damit die Datei offline funktioniert.

## Muster

**Karte:** weiße Fläche, `--border`, `--shadow-1`, `--pad` innen. Überschrift in `--text`, Inhalt in `--text-2`, Beschriftungen klein in `--text-3`.

**Status auf einen Blick:** ein farbiger Punkt oder eine farbige Kante, nie ein farbiger Block. Eingerichtet ist grün, nicht eingerichtet ist grau, nicht rot. Rot ist für kaputt reserviert, nicht für unfertig.

**Technische Werte** (Befehle, Pfade, Schlüssel) immer in Monospace und meist auf einer eigenen ruhigen Fläche. Der Nutzer soll sofort sehen, was er kopieren kann.

**Leere Bereiche** bekommen einen ruhigen Satz, was dort erscheinen wird und wie man es füllt. Nie ein leeres Feld und nie eine Fehlermeldung, wenn einfach noch nichts da ist. Ein frisch eingerichtetes System darf nicht wie ein defektes aussehen.

## Grenzen

Das Dashboard ist eine einzelne HTML-Datei, die per Doppelklick funktioniert. Deshalb: **keine externen Schriften, keine Icon-Bibliotheken, kein CDN, kein Build-Schritt.** Icons sind eingebettete SVG, Schriften sind Systemschriften. Wer eine externe Abhängigkeit einbaut, macht die Datei offline unbrauchbar.
