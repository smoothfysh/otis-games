# Color Splash — Game Spec

- **Age Group:** 2-3
- **File:** `color-splash/index.html`
- **Dependencies:** `../styles/main.css`, `../scripts/shared.js`

## Description

Tap the correct color button to match a colored character. 6 rounds, one per color. The character (a Monument Valley-style triangular friend) changes color each round.

## Visual Design

- **Theme:** Violet accent (`var(--violet)`)
- **Character:** SVG triangular figure with circle head, eyes, and smile — built per-round in the color being taught
- **Buttons:** 3 large circular color buttons (100×100px), one correct + two random distractors
- **Progress:** Bottom-center text "N / 6"

## Layout Structure

```
.color-splash (100dvh, flex column, centered)
  .game-header (absolute, top)
  .cs-character (160×180px, float animation, center)
  .cs-prompt (clamp-sized, centered, below character)
  .cs-colors (flex wrap row, centered, gap 16px)
    .cs-color-btn × 3 (100×100px circle, border, shadow)
  .cs-progress (absolute bottom)
```

## CSS Breakpoints

| Breakpoint | Character | Button | Prompt |
|---|---|---|---|
| >768px | 160×180 | 100×100 | — |
| ≤768px | 140×158 | 90×90 | — |
| ≤480px | 120×135 | 80×80 | clamp(1.2rem, 5vw, 1.8rem) |

## Key CSS Classes

- `.color-splash` — full-screen centered flex column, background `var(--bg)`
- `.cs-character` — animated floating SVG, transitions on `.happy` (bounce)
- `.cs-prompt` — text prompt, fade-in animation per round
- `.cs-colors` — flex-wrap row of color buttons
- `.cs-color-btn` — circular button (50% border-radius), white border, shadow
- `.cs-color-btn.wrong` — wobble animation on wrong tap
- `.cs-character.happy` — bounce animation on correct tap
- `.cs-progress` — absolute bottom, centered, low opacity

## Game Logic

### Data

- **COLORS:** 11 objects `{ name, hex }` — Red, Blue, Yellow, Green, Orange, Purple, Pink, Brown, Black, White, Grey

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `currentRound` | Number | 0–5, index into COLORS |
| `currentColor` | Object | The target color for this round |
| `canTap` | Boolean | Guards against double-taps |

### Functions

- **`buildCharacter(color)`** — Returns SVG string: triangular body, circle head, eyes, smile, all filled with the color
- **`loadRound()`** — Builds character, generates 3 color options (1 correct + 2 random), resets state, handles end condition
- **`handleTap(btn, opt)`** — On correct: chime, happy animation, particles, advance round after 1s. On wrong: wobble animation

### Interaction

- **Tap correct:** Character bounces, gold particles burst from button, chime sound, auto-advance after 1s
- **Tap wrong:** Button wobbles, wobble sound
- **End:** All 6 colors completed → `createCelebration()` with palette emoji

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Correct | `OtisAudio.playChime()` | Bounce character, burst particles in color hex |
| Wrong | `OtisAudio.playWobble()` | Wobble animation on button |
| All done | — | `createCelebration()` with 🎨 |

## Shared Dependencies (from `shared.js`)

- `shuffleArray()` — for selecting random distractor colors
- `createCelebration()` — Win overlay
- `OtisAudio.playChime()`, `.playWobble()`
- `OtisParticles.burst()`
- `OtisSpeech.speak()` — reads the prompt aloud

## Breakage Prevention Notes

- Buttons are rebuilt every round — event listeners on dynamically created elements
- 3 options: 1 correct + 2 random from shuffled COLORS (excluding current)
- `canTap` guard prevents double-taps during the 1s delay before next round
- Character SVG color is `currentColor.hex` applied to `fill` and `stroke`
- Adding new colors: add entries to `COLORS` array (automatically adds rounds)
- The `cs-colors` container empties via `innerHTML = ''` each round — keep event listeners attached to individual buttons, not delegated
