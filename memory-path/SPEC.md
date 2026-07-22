# Memory Path — Game Spec

- **Age Group:** 4-5
- **File:** `memory-path/index.html`
- **Dependencies:** `../scripts/shared.js` (no shared CSS import — self-contained styles)

## Description

Simon Says-style memory game. Watch a sequence of gems light up, then repeat it. 5 levels with increasing gem count and sequence length.

## Visual Design

- **Theme:** Gold accent (`var(--gold)`), blue gradient background
- **Gems:** Diamond-shaped SVG gems in 7 pastel colors, skewed for isometric perspective (`skewX(-10deg) rotateX(20deg)`)
- **Layout:** Gems centered in an isometric row, progress dots below
- **Replay Button:** Coral button appears when player makes a mistake

## Layout Structure

```
.memory-path (100dvh, flex column, gradient background)
  .game-header (absolute, top)
  .mp-info (absolute, top 60px)
    .mp-level ("Level N")
    .mp-phase ("Watch the pattern..." / "Your turn!")
  .mp-path (flex:1, centered)
    .mp-gems-container (isometric skew, flex row)
      .mp-gem × 3-5 (64×64px diamond SVG)
  .mp-replay-btn (absolute bottom 80px, hidden until mistake)
  .mp-progress-dots (absolute bottom 40px)
    .mp-dot × 5 (small circles, teal when completed)
```

## CSS Breakpoints

| Breakpoint | Gem size | Container gap |
|---|---|---|
| >480px | 64×64 | 16px |
| ≤480px | 48×48 | 10px |

## Key CSS Classes

- `.memory-path` — full-screen flex column, gradient background
- `.mp-info` — absolute top, level + phase text
- `.mp-phase` — phase indicator, fade-in animation
- `.mp-path` — flex container centering the gem row
- `.mp-gems-container` — isometric transform (`skewX(-10deg) rotateX(20deg)`), flex row
- `.mp-gem` — diamond SVG in white bg box, rounded corners, pointer cursor
- `.mp-gem.lit` — gold glow + scale(1.1) when pattern is shown
- `.mp-gem.wrong` — wobble on incorrect tap
- `.mp-gem.correct-tap` — quick scale(0.85) on tap
- `.mp-replay-btn` — "Watch Again" button, `.visible` toggles display
- `.mp-progress-dots` — flex row of dots
- `.mp-dot` — small gray circles, `.done` → teal

## Game Logic

### Data

- **GEM_COLORS:** 7 hex strings for gem fills
- **LEVELS:** 5 levels `{ gemCount, seqLength }` — 3→3, 3→3, 4→4, 4→4, 5→5

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `level` | Number | 0–4, current level |
| `sequence` | Array | Array of gem indices (the pattern) |
| `playerSeq` | Array | Player's input so far this turn |
| `isShowing` | Boolean | Whether the pattern is currently being displayed |
| `canTap` | Boolean | Whether player input is accepted |
| `gemElements` | Array | DOM elements for current gems |

### Functions

- **`gemSVG(color)`** — Builds diamond SVG string (3 layered polygons for 3D effect)
- **`loadLevel()`** — Creates gems, generates random sequence, resets state, handles end condition
- **`showSequence()`** — Animates gems lighting up in sequence order (700ms interval), chime per gem
- **`handleGemTap(idx)`** — Records tap, checks against sequence, handles wrong/complete

### Interaction

- **Pattern show:** Gems light up one by one with 700ms interval, each plays a chime
- **Player turn:** Tap gems in the same order
- **Mistake:** Wobble animation, "Not quite..." message, "Watch Again" button appears
- **Correct sequence:** All gems get staggered particle bursts, fanfare, auto-advance after 1.5s
- **Replay button:** Shows the sequence again without resetting progress

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Gem lights up | `OtisAudio.playChime()` | gold glow + scale |
| Correct tap | `OtisAudio.playPop()` | quick scale down |
| Wrong tap | `OtisAudio.playWobble()` | wobble, replay button |
| Level complete | `OtisAudio.playFanfare()` | particle bursts per gem |
| All levels done | — | `createCelebration()` with 🧠 |

## Shared Dependencies (from `shared.js`)

- `shuffleArray()` — for randomizing gem colors per level
- `createCelebration()` — Win overlay
- `OtisAudio.playChime()`, `.playPop()`, `.playWobble()`, `.playFanfare()`
- `OtisParticles.burst()`

## Breakage Prevention Notes

- Sequence is generated fresh each level using `Math.floor(Math.random() * gemCount)` — pattern indices are always valid for the current gem count
- `isShowing` and `canTap` guards prevent input during pattern display
- Replay button calls `showSequence()` which resets `playerSeq` and re-shows the same `sequence`
- Progress dots: `level` tracks completed levels; dot at index `level` is the current/next level
- Gem positions are shuffled per level (from GEM_COLORS) — sequence indices are independent of visual order
- The `mp-path` container empties via `innerHTML = ''` each level — gem elements are rebuilt
- Adding levels: add entries to `LEVELS` array; progress dots auto-generate from `LEVELS.length`
- `gemCount` must always be ≥ 2 for sequences to have variety
