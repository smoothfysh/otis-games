# ABC Animal Stickers — Game Spec

- **Age Group:** 3-5
- **Entry point:** `alphabook/index.html`
- **Styles:** `alphabook/styles/game.css` (all game-specific styles)
- **JS modules:** `alphabook/js/*.js` (split by concern)
- **Shared deps:** `../styles/main.css`, `../scripts/shared.js`
- **Assets:** `alphabook/assets/*.png` — real animal images; falls back to emoji if missing

## Architecture (Modular, not Monolithic)

The game was refactored from a single `index.html` with inline CSS/JS into separate files:

| File | Responsibility |
|---|---|
| `index.html` | Thin HTML shell — view templates, shared styles/script loading, no inline logic |
| `styles/game.css` | All game-specific styles (theme, home, book grid, modal, match game, image preview, responsive) |
| `js/animals.js` | Data: `ANIMALS` object, `LETTERS`, `ANIMAL_TO_LETTER` lookup, utility functions (`getRandomAnimal`, `getAnimalName`, `getAnimalEmoji`, `getAnimalImageHtml`) |
| `js/state.js` | State management: `state` object (collected, game progress, modal position), `localStorage` persistence |
| `js/book.js` | Sticker Book view: grid rendering, modal open/close/navigation, animal rotation within a letter |
| `js/game.js` | Match Game logic: `startGame`, `continueGame`, `loadRound`, `handleChoice`, `gameComplete`, `showAllComplete`, image preview |
| `js/app.js` | App orchestration: view switching, modal backdrop click, keyboard shortcuts |

## Description

A dual-mode alphabet learning game. Each letter A–Z is linked to multiple rotating animal choices, so every play session feels fresh. Children learn letter-animal associations through a free-browse **Sticker Book** and an interactive **Match Game**.

### Mode 1: Sticker Book (Learn)

- A standalone animal catalog — **not linked to game progress**
- Scrollable 5-column grid of all 26 letter cards
- Every card always shows an animal image (real PNG from `assets/`, or emoji fallback) with the animal name below
- Tap any card → full-screen modal with:
  - Giant letter at top
  - **Large animal image** (real PNG from `assets/`, or emoji fallback) as the sticker in the center
  - Animal name below the sticker
  - Counter showing "N / M" animals for this letter
  - "Listen" button to hear letter + animal name spoken
  - Prev/Next arrows to cycle through all animals for the current letter
- The animal shown is random each time you visit the book (refreshes on re-render)
- Tap outside or the × button to close

### Mode 2: Match Game (Play)

- **5 rounds** per session with letters shuffled
- **Two entry paths:**
  - **Start Game** (from main menu) — resets progress, starts a fresh cycle
  - **Play Again** (from round-end overlay) — continues cumulative progress, picks only from letters not yet completed
- Each round: a giant letter appears at top with a "?" arrow
- **3 animal choices** are shown below (real PNG from `assets/`, or emoji fallback) — 1 correct, 2 random distractors from any letter
- Correct tap → sparkle particle burst + chime, letter marked as completed, auto-advance after ~900ms
- Wrong tap → wobble animation + "Try again" message, try again
- After all 5 rounds → celebration overlay showing cumulative progress (N / 26), with "Play Again" (continues) and "Quit" buttons
- When all 26 letters are completed via **Play Again** → grand "🏆 Amazing!" celebration with a message that you know all the animals
- `collected` state persists in `localStorage` across sessions within a cumulative cycle

## Animal Lineup (26 letters, rotating pools)

Each letter has a pool of 2–6 animals.

A: Alligator🐊, Ant🐜, Antelope🦌, Ape🦧, Armadillo🦔
B: Bear🐻, Bat🦇, Bee🐝, Butterfly🦋, Beaver🦫, Buffalo🐃
C: Cat🐱, Cow🐄, Cheetah🐆, Camel🐫, Crab🦀, Caterpillar🐛
D: Dog🐶, Dolphin🐬, Duck🦆, Donkey🫏, Deer🦌, Dragonfly🦗
E: Elephant🐘, Eagle🦅, Eel🐟, Emu🦃, Elk🦌
F: Fox🦊, Frog🐸, Flamingo🦩, Fish🐟, Ferret🐹, Falcon🦅
G: Giraffe🦒, Gorilla🦍, Goat🐐, Goldfish🐟, Grasshopper🦗, Guinea Pig🐹
H: Hippo🦛, Horse🐴, Hedgehog🦔, Hamster🐹, Hyena🐺, Hawk🦅
I: Iguana🦎, Impala🦌, Ibis🦩, Insect🐛
J: Jaguar🐆, Jellyfish🪼, Blue Jay🐦, Jackal🐺
K: Kangaroo🦘, Koala🐨, Kingfisher🐦, Kiwi🐦
L: Lion🦁, Leopard🐆, Llama🦙, Lemur🐒, Lobster🦞, Ladybug🐞
M: Monkey🐵, Mouse🐭, Meerkat🐹, Moose🦌, Mole🐹
N: Newt🦎, Narwhal🐋, Nightingale🐦, Numbat🐹
O: Owl🦉, Octopus🐙, Otter🦦, Ostrich🦃, Orangutan🦧
P: Penguin🐧, Panda🐼, Pig🐷, Parrot🦜, Polar Bear🐻‍❄️, Peacock🦚
Q: Quail🐦, Quokka🦘, Quoll🐱
R: Rabbit🐰, Rhino🦏, Raccoon🦝, Rat🐀, Reindeer🦌
S: Sloth🦥, Shark🦈, Snake🐍, Sheep🐑, Squirrel🐿️, Seal🦭
T: Tiger🐯, Turtle🐢, Toucan🐦, Turkey🦃, Toad🐸
U: Urchin🪸, Umbrellabird🐦, Urial🐐
V: Vulture🦅, Viper🐍, Vicuña🦙
W: Whale🐋, Wolf🐺, Walrus🦭, Wombat🐹, Weasel🐹
X: X-ray Tetra🐟, Xenops🐦
Y: Yak🐃, Yellowjacket🐝
Z: Zebra🦓, Zebu🐃

## Visual Design

- **Theme:** Warm golden/peach gradient background, sticker-book aesthetic
- **Stickers:** Real animal PNG images from `assets/` rendered with `max-width`/`max-height: 100%` + `object-fit: contain`; falls back to emoji via `onerror` handler
- **Naming convention:** `{Letter} {Name}.png` (e.g. `A Alligator.png`)
- **Cards:** Rounded white cards with soft shadows; all cards always show an animal image (no empty/collected states)
- **Match choices:** 3 vertically stacked cards (full width on all screen sizes), each with a 🔍 expand button for full-size preview
- **Modal:** Full-screen overlay with centered content, pastel gradient backdrop, slide-up animation
- **Animations:** Float (logo/modal sticker), bounce (correct), wobble (wrong), slide-up (modal), fadeIn (overlays)

## Layout Structure

```
.ab-wrapper (100dvh, flex column)
  .game-header (absolute top, hidden on home)

  .ab-view > .ab-home (flex column, centered)
    .ab-logo (title with animal emoji)
    .ab-title / .ab-subtitle
    .ab-home-buttons (2 large CTA buttons)
      [🎯 Start Game]
      [📖 Sticker Book]

  .ab-view > .ab-book (flex column, full height)
    .ab-book-header (title + back button)
    .ab-book-grid (5-column grid of 26 letter cards)
      .ab-card × 26
        .ab-card-letter
        .ab-card-sticker (animal image)
        .ab-card-name

  .ab-modal (fixed overlay, hidden until .open)
    .ab-modal-inner
      .ab-modal-close ×
      .ab-modal-letter
      (nav wrapper)
        .ab-modal-nav .prev / .next
        .ab-modal-sticker
      .ab-modal-name
      .ab-modal-counter "N / M"
      .ab-modal-listen [🔊 Listen]

  .ab-view > .ab-game (flex column, full height)
    .ab-game-header (round count + quit button)
    .ab-game-prompt
      .ab-game-letter (giant letter)
      .ab-game-arrow ▼
    .ab-game-choices (3 cards, stacked)
      .ab-choice × 3
        .ab-choice-expand 🔍
        .ab-choice-sticker (image)
        .ab-choice-label (name)
    .ab-game-message

  .ab-preview-overlay (dynamic, full-screen image preview)
    .ab-preview-content
      .ab-preview-close ×
      .ab-preview-image (sized to viewport - 60px)
      .ab-preview-name

  .game-footer
```

## CSS Breakpoints

| Breakpoint | Grid columns | Notes |
|---|---|---|
| >600px | 5 | max-width 600px centred |
| 480–600px | 5 | — |
| ≤480px | 4 | tighter gap, smaller home buttons |
| ≤360px | 3 | tightest layout |

## Key CSS Classes

- `.ab-wrapper` — full-screen flex container, golden gradient background
- `.ab-view` — generic view container (hidden by default, `.active` to show)
- `.ab-home` — landing view, centered, animated entrance
- `.ab-book` — scrollable sticker book view
- `.ab-card` — individual letter card in grid, always shows animal image
- `.ab-card-sticker` — sticker display area
- `.ab-modal` — fixed overlay for sticker detail, `.open` to show
- `.ab-modal-sticker` — large sticker display with float animation
- `.ab-game` — match game view
- `.ab-game-prompt` — giant letter with "?" arrow, centered
- `.ab-choice` — choice card, `.correct` (green glow, bounce) and `.wrong` (red wobble) states, `position: relative` for expand button
- `.ab-choice-expand` — small 🔍 button top-right of choice, calls `showImagePreview`
- `.ab-choice.disabled` — pointer-events none during advance delay
- `.ab-preview-overlay` — fixed full-screen overlay with blurred backdrop
- `.ab-preview-content` — white card containing the full-size image
- `.ab-preview-image` — image container, sized dynamically to viewport via JS

## Game Logic

### State (`js/state.js`)

| Variable | Type | Purpose |
|---|---|---|
| `state.collected` | Set | Letters the child has matched (A–Z), persisted to `localStorage` — accumulates across Play Again sessions, reset on Start Game from menu |
| `state.gameLetters` | Array | Shuffled subset of letters for current play-through (up to 5 rounds) |
| `state.gameIndex` | Number | Current round index |
| `state.gameCorrect` | String | The correct animal string for current round |
| `state.gameChoices` | Array | 3 animal strings (1 correct + 2 distractors) |
| `state.currentModalLetter` | String | Letter currently shown in modal |
| `state.currentAnimalIndex` | Number | Index into the letter's animal pool shown in modal |
| `state.isAdvancing` | Boolean | Prevents double-taps during round transition |

### Functions

- **`getRandomAnimal(letter)`** (`animals.js`) — Returns a random animal string from the letter's pool
- **`getAnimalName(str)`** (`animals.js`) — Strips emoji from animal string, returns the name
- **`getAnimalEmoji(str)`** (`animals.js`) — Extracts the emoji character from animal string
- **`getAnimalImageHtml(letter, name, emoji)`** (`animals.js`) — Returns `<img>` tag pointing to `assets/{Letter} {Name}.png`, with `onerror` fallback to emoji
- **`ANIMAL_TO_LETTER`** (`animals.js`) — Reverse lookup map from animal string → letter key (built once at init)
- **`showView(v)`** (`app.js`) — Switches between `'home'`, `'book'`, `'game'`
- **`closeModal()`** (`book.js`) — Closes the sticker modal
- **`renderBook()`** (`book.js`) — Builds the 26-card grid, each card showing a random animal image + name (no collected state)
- **`openModal(letter, animal)`** (`book.js`) — Opens the sticker detail modal for a letter
- **`navAnimal(dir)`** (`book.js`) — Cycles through animals for the current letter (prev/next)
- **`renderModal()`** (`book.js`) — Renders modal content (letter, sticker, name, counter, listen button)
- **`startGame()`** (`game.js`) — Resets `collected` to empty, shuffles 26 letters, picks 5 random, starts fresh cycle
- **`continueGame()`** (`game.js`) — Picks up to 5 unplayed letters from `state.collected`, starts next round in cumulative cycle. If all 26 done, calls `showAllComplete()`
- **`loadRound()`** (`game.js`) — Picks current letter, picks a random animal, generates 3 choices, renders
- **`handleChoice(el, animal)`** (`game.js`) — Checks answer, triggers correct/wrong animation, saves collected
- **`gameComplete()`** (`game.js`) — If all 26 collected, calls `showAllComplete()`; otherwise shows round-end overlay with "Play Again" (→ `continueGame()`) and "Quit" buttons
- **`showAllComplete()`** (`game.js`) — Grand celebration overlay: "Amazing! You know all 26 letters and their animals!" with "Play Again" (→ `startGame()`, fresh) and "Quit" buttons
- **`quitGame()`** (`game.js`) — Returns to home view
- **`showImagePreview(animal)`** (`game.js`) — Opens full-screen image preview overlay sized to `(viewport - 60px) × (viewport - 60px)`
- **`closeImagePreview()`** (`game.js`) — Closes the image preview overlay
- **`resetGameState()`** (`state.js`) — Initialises game state for a new round (does NOT reset `collected`)

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Open modal | `OtisAudio.playPop()` | Slide-up animation |
| Open image preview | — | FadeIn overlay, slide-up card |
| Tap match choice | — | Scale bounce |
| Correct answer | `OtisAudio.playSparkle()` + `OtisSpeech.speak(...)` | Gold particle burst, green glow, auto-advance |
| Wrong answer | `OtisAudio.playWobble()` | Red wobble shake, "Try again" message |
| Round complete | `OtisAudio.playFanfare()` | Celebration overlay |
| All 26 complete | `OtisAudio.playFanfare()` | "🏆 Amazing!" grand celebration overlay |

### Game Flow (Match Game)

1. **Start Game** (from main menu): `startGame()` → resets `state.collected`, shuffles all 26, picks 5 random
2. **Play Again** (from overlay): `continueGame()` → picks up to 5 letters not yet in `state.collected`
3. Per round (up to 5): show letter + 3 choices (1 correct, 2 distractors)
4. Correct → add to `state.collected`, save to localStorage, advance after ~900ms
5. Wrong → shake, let user try again
6. After rounds complete:
   - If all 26 collected → `showAllComplete()` (grand celebration)
   - Otherwise → round-end overlay with cumulative progress (N / 26), "Play Again" continues cycle

## Breakage Prevention Notes

- The match game shows up to 5 rounds (not 26) so sessions stay short for young children
- **Start Game** (main menu) always starts a fresh cycle (resets collected)
- **Play Again** continues the cumulative cycle, picking only unplayed letters
- When all 26 letters are completed via Play Again, a grand celebration fires before resetting
- Distractor animals guaranteed to be from different letters than the correct answer
- Choices are shuffled so the correct answer is not always in the same position
- The sticker book shows all letters with animal images regardless of game progress (decoupled)
- `collected` state persists in `localStorage` (survives page reload)
- Adding new animals: extend the arrays in `ANIMALS` object
- Adding new letters: add new key to `ANIMALS` object; will auto-integrate
- Adding animal images: drop a PNG named `{Letter} {Name}.png` into `assets/`; auto-detected at runtime via `onerror` — no code change needed
- Image fallback: if PNG is missing, the `onerror` handler replaces the `<img>` with the emoji character
