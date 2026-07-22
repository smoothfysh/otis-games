# Count & Drop — Game Spec

- **Age Group:** 2-3
- **File:** `count-drop/index.html`
- **Dependencies:** `../styles/main.css`, `../scripts/shared.js`

## Description

Drag animal emoji stickers from the tray into the meadow to match a target number. Each round shows a target count (e.g. 🐱 × 3). Kids drag animals from a tray of 6 into the meadow until the count matches. Tap a placed animal to send it back to the tray.

## Visual Design

- **Theme:** Teal/mint accent (`var(--teal)`), green-tinted gradient background
- **Target display:** Large emoji × number at the top (e.g. "🐱 × 3")
- **Meadow (drop zone):** Large dashed-border teal area in the center, shows count "N / target"
- **Tray:** Bottom white rounded container with 6 animal stickers
- **Placed animals:** Shown in the meadow as tappable items with bounce animation

## Layout Structure

```
.count-drop (100dvh, flex column, gradient background)
  .game-header (absolute, top)
  .cd-title-group (centered)
    .cd-title "Count & Drop"
    .cd-subtitle "Drag the animals into the meadow!"
  .cd-target (big emoji × number)
  .cd-play-area (flex:1, column)
    .cd-meadow (flex:1, dashed border, centered)
      .cd-meadow-label "Meadow"
      .cd-placed (flex wrap of placed animals)
      .cd-meadow-count "N / target"
      .cd-meadow-empty "Drop animals here!"
    .cd-tray (flex wrap, white rounded bg)
      .cd-animal × 6 (draggable stickers)
  .cd-round (bottom, centered)
  .game-footer
```

## CSS Breakpoints

| Breakpoint | Tray animal | Placed item | Tray gap |
|---|---|---|---|
| >480px | 56×56 | 52×52 | 10px |
| ≤480px | 48×48 | 44×44 | 8px |
| ≤360px | 42×42 | 38×38 | 6px |

## Key CSS Classes

- `.count-drop` — full screen flex column, green-tinted gradient background
- `.cd-target` — large emoji × number display, clamped sizing
- `.cd-meadow` — drop zone (dashed teal border, teal tint), `.hover` on drag-over
- `.cd-placed` — flex-wrap container for placed animals inside meadow
- `.cd-placed-item` — an animal placed in the meadow (tappable to remove)
- `.cd-tray` — bottom tray with white background, holds `.cd-animal` elements
- `.cd-animal` — draggable animal sticker in tray, `.dragging` when moved, `.hidden` when unavailable
- `.cd-animal.hidden` — hidden when tray runs out of available animals

## Game Logic

### Data

- **ANIMALS:** 8 emoji strings — 🐱 🐶 🐰 🐼 🐸 🐵 🐷 🦊
- **ROUNDS:** 8 rounds with targets — 1, 2, 3, 2, 4, 3, 5, 4
- **TRAY_COUNT:** 6 (fixed number of animals in tray)

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `round` | Number | 0–7, current round index |
| `currentAnimal` | String | Emoji for this round |
| `currentTarget` | Number | Target count for this round |
| `placedCount` | Number | How many animals are in the meadow |
| `dragState` | Object/null | Active drag state `{ el, offsetX, offsetY, inMeadow }` |

### Functions

- **`loadRound()`** — Sets target, builds tray with 6 draggable animals, resets meadow
- **`updateMeadow()`** — Re-renders placed animals, updates count display, toggles empty message, adjusts tray availability
- **`updateTrayAvailability()`** — Hides tray animals beyond the number still draggable (max 6 − placedCount)
- **`onPointerMove(e)`** — Moves dragged element, toggles meadow hover state
- **`onPointerUp(e)`** — On drop in meadow: add to count, chime, particles. On target reached: fanfare, advance after 900ms. On miss: return to flex layout.

### Interaction

- **Drag start:** `pointerdown` on `.cd-animal` — fixed position, record offsets
- **Drag move:** `pointermove` on document — follow pointer, detect meadow hover
- **Drop in meadow:** Animal removed from DOM, `placedCount++`, meadow re-rendered, tray slots freed up
- **Drop outside:** Animal returns to flex layout in tray
- **Remove from meadow:** Tap `.cd-placed-item` — `placedCount--`, pop sound, meadow + tray updated
- **Tray limit:** Tray shows exactly 6 animals; those already used are hidden (`.hidden`)

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Drop in meadow | `OtisAudio.playChime()` | Teal particle burst |
| Remove from meadow | `OtisAudio.playPop()` | Item removed with bounce |
| Target reached | `OtisAudio.playFanfare()` | Auto-advance after 900ms |
| All rounds done | — | `createCelebration()` with 🌟 |

## Shared Dependencies (from `shared.js`)

- `createCelebration()` — Win overlay
- `OtisAudio.playChime()`, `.playPop()`, `.playFanfare()`
- `OtisParticles.burst()`

## Breakage Prevention Notes

- Animals use pointer events (drag) and click (tap to remove) — these coexist because click fires after pointerup on the same element
- Tray shows a fixed set of elements; `.hidden` class controls availability (not DOM removal), so the flex layout stays stable
- `placedCount` is compared to `currentTarget` after each drop — advance happens automatically on match
- Adding new rounds: extend the `ROUNDS` array with `{ target: N }`
- Adding new animals: extend the `ANIMALS` array; animals cycle using `round % ANIMALS.length`
- The tray label "Animals" is recreated each round — all tray children are rebuilt in `loadRound()`
