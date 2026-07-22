# Shape Sorter — Game Spec

- **Age Group:** 2-3
- **File:** `shape-sorter/index.html`
- **Dependencies:** `../styles/main.css`, `../scripts/shared.js`

## Description

Drag-and-drop colored shapes onto matching gray shadow outlines. 3 rounds of increasing difficulty (4, 5, then 6 shapes).

## Visual Design

- **Theme:** Coral/pink accent (`var(--coral)`)
- **Shapes:** 6 SVG shapes (circle, square, triangle, star, diamond, hexagon) with 6 pastel colors
- **Slots:** Dashed-border gray outlines at 50% opacity, highlight coral on hover
- **Divider:** Vertical `border-right` between shapes + slots on desktop; horizontal `border-bottom` on mobile

## Layout Structure

```
.shape-sorter (100dvh, flex column)
  .game-header (absolute, top)
  .ss-title (coral, centered, clamp-sized)
  .ss-play-area (flex:1, row → column ≤768px)
    .ss-shapes (flex wrap, left/top) — draggable shapes
    .ss-slots (flex wrap, right/bottom) — drop targets
  .ss-score (bottom, centered)
```

## CSS Breakpoints

| Breakpoint | Shape size | Slot size | Padding | Gap |
|---|---|---|---|---|
| >768px | 64×64 | 72×72 | 24px 32px | 20px |
| ≤768px | 56×56 | 64×64 | 16px | 12px |
| ≤480px | 48×48 | 56×56 | 12px | 10px |
| ≤360px | 42×42 | 48×48 | 8px | 8px |

## Key CSS Classes

- `.ss-shape` — draggable shape div (pointer cursor, white bg, rounded, shadow, float animation)
- `.ss-shape.dragging` — fixed position during drag (scale 1.25, elevated shadow, z-index 100)
- `.ss-slot` — drop target (dashed border, 50% opacity, centered SVG)
- `.ss-slot.hover` — hover/active slot (full opacity, coral border, scale 1.1)
- `.ss-slot.filled` — matched slot (opacity 0, pointer-events none)
- `.ss-zone-label` — "Shapes" / "Shadow" labels (absolute positioned, uppercase)

## Game Logic

### Data

- **SHAPES:** 6 objects `{ id, path }` with inline SVG path data (all `viewBox="0 0 100 100"`)
- **COLORS:** 6 hex strings
- **ROUNDS:** 3 rounds `[{ count: 4 }, { count: 5 }, { count: 6 }]`

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `round` | Number | Current round index (0–2) |
| `matched` | Number | Matched count in current round |
| `totalShapes` | Array | Shapes selected for current round |
| `dragState` | Object/null | Active drag: `{ el, shapeId, offsetX, offsetY }` |
| `isDragging` | Boolean | Whether pointer is down (not actively used as guard) |

### Functions

- **`shapeToSVG(shape, color, size)`** — Renders shape path into inline SVG string
- **`startRound()`** — Sets up shapes and slots for current round; resets DOM; handles end condition (`createCelebration`)
- **`onPointerMove(e)`** — Updates dragged element position; toggles `.hover` on slots under pointer
- **`onPointerUp(e)`** — Checks drop target; on match: add `.filled`, remove shape, chime sound, particle burst; on miss: wobble sound, reset to flex layout

### Interaction

- **Drag initiation:** `pointerdown` on `.ss-shape` — switches to `position: fixed`, records offset, sets `.dragging`
- **Drag tracking:** `pointermove` on `document` — follows pointer
- **Drop:** `pointerup` on `document` — checks collision with unfilled slots by bounding rect
- **Wrong drop:** Shape returns to flex layout (clears inline fixed styles), float animation resumes
- **Correct drop:** Shape element removed, slot gets `.filled`, advance `matched`, when `matched >= totalShapes.length` → advance round

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Correct match | `OtisAudio.playChime()` | Gold particle burst at drop point |
| Wrong match | `OtisAudio.playWobble()` | Shape snaps back |
| Round complete | `OtisAudio.playFanfare()` | Auto-advance after 800ms |
| All rounds done | — | `createCelebration()` with rainbow emoji |

## Shared Dependencies (from `shared.js`)

- `shuffleArray()` — Fisher-Yates shuffle
- `createCelebration()` — Win overlay (takes container, message, emoji, restart callback)
- `OtisAudio.playChime()`, `.playWobble()`, `.playFanfare()`
- `OtisParticles.burst(x, y, color, count)`

## Breakage Prevention Notes

- SVG path strings in SHAPES array **must** be properly closed with single quotes (`'.../>'`)
- Each shape **must** have matching `data-shape-id` on both the draggable element and the slot
- Slots are shuffled independently from shapes each round — matching relies on `shapeId`, not index
- Flex layout handles shape positioning when drag ends outside any slot — the `position: ''` clear is critical
- On pointerdown, the shape is set to `position: fixed` — on pointerup it must be cleared back to `position: ''` (not `position: static`)
- Adding new shapes: add entry to `SHAPES` array + optionally extend `COLORS` array
- Adding new rounds: add entry to `ROUNDS` array with desired `count`
