# Otis Bird — Game Spec

- **Age Group:** 4-5
- **File:** `otisbird/index.html`
- **Dependencies:** None (fully self-contained — no shared CSS or JS)

## Description

Flappy Bird-style arcade game. Tap/click/space to make Otis the bird fly through gaps in pipes. Score increases per pipe cleared. Game over on collision.

## Visual Design

- **Theme:** Night sky gradient, neon accent colors
- **Bird:** Pink oval body drawn on Canvas with radial gradient, beak, eyes, rotation based on velocity
- **Pipes:** Green gradient pipes with lighter rim at opening, speed increases with score
- **Background:** Sky gradient (blue → green), white cloud rectangles, grass line at top of ground
- **Ground:** Dark layered ground with grass tufts scrolling left
- **UI:** Score overlay (top), high score display, menu + game over panels drawn on canvas
- **Canvas sizing:** Fills container with `aspect-ratio: 9/16`, max-width 500px, device-pixel-ratio scaling

## Layout Structure

```
#gameContainer (relative, 9:16 ratio, max-width 500px, centered)
  canvas#gameCanvas (fills container, DP-scaled)
  #ui-overlay (absolute, pointer-events: none)
    #score-display (top, white, large font)
    #high-score (bottom, white, smaller font)
```

## States

Three game states: `'menu'` (title screen), `'play'` (active), `'over'` (collision).

### Menu State
- Dark overlay, "OTIS THE BIRD" title
- Animated bird bobbing in center
- Instructions text, "Tap or Click to Fly"
- Tap/click/space → transitions to play

### Play State
- Gravity + flap physics, pipe spawning
- Score increments when bird passes a pipe
- Collision detection (pipe walls, ground, ceiling)
- Collision → die() → transitions to over

### Over State
- Flash effect, particle burst on death
- Game over panel with score + best score
- "PLAY AGAIN" button → transitions to menu

## Game Logic

### Constants

| Constant | Value | Purpose |
|---|---|---|
| `GRAVITY` | 0.55 | Downward acceleration per tick |
| `FLAP` | -7.5 | Upward velocity on tap |
| `PIPE_SPEED` | 2.2 | Horizontal scroll speed |
| `MAX_PARTICLES` | 40 | Particle cap |

### State Object `S`

| Property | Type | Purpose |
|---|---|---|
| `bx, by` | Number | Bird position (x fixed at 25%, y variable) |
| `bvy` | Number | Bird vertical velocity |
| `br` | Number | Bird radius (6% of width) |
| `rot` | Number | Bird rotation angle |
| `pipes` | Array | Active pipes `{ x, top, bottom, scored }` |
| `score, high` | Number | Current and high score |
| `state` | String | `'menu'` / `'play'` / `'over'` |
| `frame` | Number | Frame counter |
| `pn` | Number | Particle count |
| `btn` | Object/null | "Play Again" button `{ x, y, w, h }` for hit detection |

### Key Functions

- **`resize()`** — Recalculates all dimensions, gradients, and cloud positions on window resize
- **`drawSky()` / `drawGround()`** — Background layers
- **`drawPipe(x, top, bottom)`** — Single pipe pair
- **`drawBird(x, y, r, rot)`** — Otis the bird (ellipse body + gradients + eye + beak)
- **`spawnParticles(x, y, n)`** — Allocates particle data (typed arrays, max 40)
- **`tick()`** — Main game loop: physics, pipe spawning/scrolling, collision, score, render
- **`render()`** — Draws all layers + HUD + menu/gameover overlays
- **`handle(cx, cy)`** — Input handler (state-dependent)
- **`collides()`** — Hit test against pipes, ground, ceiling
- **`loop(time)`** — requestAnimationFrame with 60fps accumulator

### Physics

- Bird velocity increased by GRAVITY each tick, reset to FLAP on input
- Rotation lerps toward velocity-based target (`-0.4` to `1.2` radians)
- Pipe speed increases 0.8% per point (`1 + score * 0.008`)
- Pipe spawn interval decreases with score (`max(60, 95 - score * 1.5)` ticks)

### Particle System

- Typed arrays for performance (no GC during gameplay)
- Max 40 particles, reusable slots
- Particles have position, velocity, lifetime, max lifetime, radius, color
- Spawned on: flap (3), score (8), death (15)

### Audio

- **No audio** — this game is fully silent (no Web Audio API usage)

## High Score

- Persisted in `localStorage` key `'fluxbird_high'`
- Displayed as "BEST: N" on the UI overlay
- Updated in real-time when score exceeds high

## Breakage Prevention Notes

- Canvas resolution uses `devicePixelRatio` (capped at 2) — ensures sharp rendering on Retina/HiDPI
- `resize()` must be called on window resize and at init — recalculates ALL dimensions and gradients
- Frame rate capped at 60fps via accumulator pattern — prevents physics explosion on high-refresh displays
- `dt > 200ms` guard prevents spiral-of-death when tab is backgrounded
- Game loop uses `requestAnimationFrame` — not `setInterval`
- Pipe `scored` flag prevents double-counting
- Ground collision check: `S.by + r > GY` — adjusts bird to `GY - BR` then calls `die()`
- "Play Again" button hit detection uses canvas coordinates scaled from screen coordinates
- Adding new features: modify `resize()` + `render()` + `tick()` as needed
- The canvas's `width`/`height` attributes are set in JS (not HTML) via `resize()` — do NOT hardcode
