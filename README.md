# Vonnegut Universe

An interactive graph that maps characters across Kurt Vonnegut's novels, visualizing direct interactions and cross-book appearances.

Built with React + Vite, using `react-force-graph-2d` for the physics-based graph.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Features

- **Force-directed graph** — nodes repel and links attract, settling into a natural layout
- **Node size** scales with the number of books a character appears in — Kilgore Trout is hard to miss
- **Node color** represents each character's primary book
- **Book filter** (left sidebar) — click one or more books to highlight only their characters and connections
- **Character panel** (right sidebar) — click any node to see the character's description, book appearances, and a detailed list of every interaction; click a character's name in the panel to navigate to them
- **Click background** to deselect

## Project Structure

```
src/
├── data/
│   └── vonnegut.json       # All characters, books, and interactions
├── components/
│   ├── Graph.jsx            # Force graph, node rendering, link styling
│   ├── BookFilter.jsx       # Left sidebar filter
│   ├── BookFilter.module.css
│   ├── CharacterPanel.jsx   # Right sidebar detail panel
│   └── CharacterPanel.module.css
├── App.jsx                  # State management, layout
├── App.css
└── index.css
```

## Data

All data lives in `src/data/vonnegut.json` with three top-level arrays:

### `books`

```json
{
  "id": "slaughterhouse-five",
  "title": "Slaughterhouse-Five",
  "year": 1969,
  "color": "#4299E1"
}
```

### `characters`

```json
{
  "id": "kilgore-trout",
  "name": "Kilgore Trout",
  "primaryBook": "breakfast-of-champions",
  "books": ["god-bless-you", "slaughterhouse-five", "breakfast-of-champions", "..."],
  "description": "A prolific but largely unread science fiction writer..."
}
```

- `primaryBook` — determines the node's color; should be the book where the character is most central
- `books` — all books the character appears in; drives node size and filter behavior

### `interactions`

```json
{
  "source": "billy-pilgrim",
  "target": "kilgore-trout",
  "book": "slaughterhouse-five",
  "description": "Billy discovers Trout's novels and becomes a devoted fan..."
}
```

- `source` and `target` are character `id` values
- `book` is a book `id` — used to color the edge and display the book tag in the panel
- Interactions represent direct contact between characters, not just co-appearance in the same novel

## Adding Data

### Add a book

Append to the `books` array with a unique `id`, `title`, `year`, and a hex `color`.

### Add a character

Append to the `characters` array. Set `primaryBook` to the book where they matter most. List every book they appear in under `books`.

### Add an interaction

Append to the `interactions` array. Use existing character `id` values for `source` and `target`, and a book `id` for `book`. Keep `description` to one or two sentences describing the specific nature of the interaction.

## Books Covered

| Title | Year |
|---|---|
| Player Piano | 1952 |
| The Sirens of Titan | 1959 |
| Mother Night | 1962 |
| Cat's Cradle | 1963 |
| God Bless You, Mr. Rosewater | 1965 |
| Slaughterhouse-Five | 1969 |
| Breakfast of Champions | 1973 |
| Jailbird | 1979 |
| Deadeye Dick | 1982 |
| Galápagos | 1985 |
| Timequake | 1997 |

## Planned

- Book list page
- Character detail page
