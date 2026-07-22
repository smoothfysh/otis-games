# Shape Pop — Game Spec

- **Age Group:** 2-3
- **File:** `shape-pop/index.html`
- **Dependencies:** `../styles/main.css`, `../scripts/shared.js`

## Description

Pop the matching shape! A target shape is shown — tap it among 6–8 shapes on screen. 10 rounds. Rounds 6+ include color in the prompt ("Pop the red circle!").

## Visual Design

- **Theme:** Sky blue accent (`var(--sky)`)
- **Shapes:** 5 SVG shapes (circle, square, triangle, star, diamond) with 5 vibrant colors
- **Prompt:** Centered text, changes per round
- **Grid:** CSS Grid layout (`auto-fit, minmax(70px, 1fr)`) — responsive by default
- **Animation:** All shapes have floating animation with random delays

## Layout Structure

```
.shape-pop (100dvh, flex column, gradient background)
  .game-header (absolute, top)
  .sp-prompt (centered, clamp-sized, fade-in)
  .sp-area (flex:1, CSS Grid, overflow hidden)
    .sp-shape × 6-8 (grid cells, float animation)
  .sp-hint (absolute bottom, hidden, appears on wrong tap)
  .sp-score (absolute bottom)
```

## CSS Breakpoints

| Breakpoint | Grid columns | Shape size |
|---|---|---|
| >480px | `minmax(70px, 1fr)` | 64–80px |
| ≤480px | `minmax(60px, 1fr)` | 56–70px |

## Key CSS Classes

- `.shape-pop` — full-screen flex column, gradient background
- `.sp-prompt` — text prompt with fade-in animation
- `.sp-area` — CSS Grid container, shapes in auto-fit cells
- `.sp-shape` — shape in grid cell, float animation, pointer cursor
- `.sp-shape.popped` — correct shape: scale(0) + opacity 0
- `.sp-shape.wrong` — incorrect tap: wobble animation
- `.sp-score` — absolute bottom, low opacity
- `.sp-hint` — hint text, `.visible` toggles opacity

## Game Logic

### Data

- **SHAPES:** 5 objects `{ id, svg }` (circle, square, triangle, star, diamond)
- **COLORS:** 5 objects `{ name, hex }` (red, blue, yellow, green, purple)
- **TOTAL_ROUNDS:** 10 (hardcoded)

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `round` | Number | 0–9, current round |
| `canPlay` | Boolean | Guards input during animations |
| `currentTarget` | Object | `{ id, svg, color }` — the shape to pop this round |
| `activeShapes` | Array | DOM elements currently on screen |

### Functions

- **`createShapeElement(shape, color)`** — Creates `.sp-shape` div with inline SVG, random animation delay
- **`loadRound()`** — Picks random target shape + color; generates 6–8 shapes (1 target + distractors); shuffles; renders; sets prompt text
- **`handlePop(el, isTarget)`** — On correct: pop animation, particles, advance after 800ms. On wrong: wobble, show hint

### Interaction

- **Round generation:** Target appears exactly once; distractors are other shape IDs (not same shape with wrong color — keeps it simpler for age 2-3)
- **Rounds 1–5:** "Pop the [shape]!" (no color name)
- **Rounds 6–10:** "Pop the [color] [shape]!" (adds color name for extra difficulty)
- **Correct:** Target pops (scale→0), all others fade, chime, particles, auto-advance
- **Wrong:** Wobble animation, hint appears briefly

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Correct pop | `OtisAudio.playPop()` | Scale→0 + particles |
| Wrong tap | `OtisAudio.playWobble()` | Wobble + hint text |
| All done | — | `createCelebration()` with 💥 |

## Shared Dependencies (from `shared.js`)

- `shuffleArray()`, `getRandomItem()`
- `createCelebration()`
- `OtisAudio.playPop()`, `.playWobble()`
- `OtisParticles.burst()`
- `OtisSpeech.speak()`

## Breakage Prevention Notes

- Target shape appears **exactly once** — other shape IDs used for distractors
- Shape SVG paths use `viewBox="0 0 64 64"` (different from Shape Sorter's 100×100)
- Event listeners use `click`, not pointer events (simpler for tap-only game)
- `canPlay` guard prevents interaction during round transitions
- Adding new shapes: add to `SHAPES` array; adding new colors: add to `COLORS` array
- The `sp-area` uses CSS Grid — new shapes auto-fit into the grid layout
