# ABC Animal Stickers — Game Spec

- **Age Group:** 3-5
- **File:** `alphabook/index.html`
- **Dependencies:** `../styles/main.css`, `../scripts/shared.js`

## Description

A dual-mode alphabet learning game. Each letter A–Z is linked to multiple rotating animal choices, so every play session feels fresh. Children learn letter-animal associations through a free-browse **Sticker Book** and an interactive **Match Game**.

### Mode 1: Sticker Book (Learn)

- Scrollable 5-column grid of all 26 letter cards
- Collected letters show the animal emoji sticker; uncollected show a "?" silhouette
- Tap any card → full-screen modal with:
  - Giant letter at top
  - **Huge animal emoji** (~30vh) as the sticker in the center
  - Animal name below the sticker
  - "Listen" button to hear letter + animal name spoken
  - Prev/Next arrows to flip through the alphabet
- The animal displayed is randomly chosen from the letter's pool each time you open it
- Tap outside or the × button to close

### Mode 2: Match Game (Play)

- 26 rounds with letters shuffled randomly
- Each round: a giant letter appears at top with a "?" arrow
- **3 giant animal stickers** are shown below as choices (1 correct, 2 random distractors from any letter)
- Correct tap → sparkle particle burst + chime, letter "collected", auto-advance after 700ms
- Wrong tap → wobble animation, try again
- After all 26 → grand celebration with all stickers revealed + fanfare

## Animal Lineup (26 letters, rotating pools)

Each letter has a pool of 2–6 animals. The game picks a random one each time.

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
- **Stickers:** Emojis rendered at 30–40vh in the modal, 5–8rem in the grid
- **Cards:** Rounded white cards with soft shadows, colored accent borders per letter
- **Progress:** Top bar showing "N / 26 Stickers Collected" with a horizontal progress bar
- **Modal:** Full-screen overlay with centered content, pastel gradient backdrop
- **Match choices:** 3 equally-sized cards side by side (or stacked on narrow screens)

## Layout Structure

```
.ab-wrapper (100dvh, flex column)
  .game-header (absolute top)

  .ab-home (flex column, centered)
    .ab-logo (title with animal emoji)
    .ab-progress-bar
    .ab-progress-text "N / 26 Stickers Collected"
    .ab-home-buttons (2 large CTA buttons)
      [📖 Sticker Book]
      [🎯 Match Game]

  .ab-book (flex column, full height)
    .ab-book-header (title + back button)
    .ab-book-grid (5-column grid of 26 cards)

  .ab-modal (fixed overlay, hidden)
    .ab-modal-inner
      .ab-modal-close ×
      .ab-modal-nav .prev / .next
      .ab-modal-sticker-area (giant emoji)
      .ab-modal-letter
      .ab-modal-name
      .ab-modal-listen [🔊 Listen]

  .ab-game (flex column, full height)
    .ab-game-header (round count + back button)
    .ab-game-prompt (giant letter)
    .ab-game-choices (3 cards)
      .ab-choice × 3 (giant emoji sticker)
    .ab-game-feedback (correct/wrong indicator)

  .game-footer
```

## CSS Breakpoints

| Breakpoint | Grid card | Game choice | Modal emoji |
|---|---|---|---|
| >600px | 90×90 | 28vw max 220px | 30vh |
| 401–600px | 70×70 | 32vw | 25vh |
| ≤400px | 60×60 | 40vw | 20vh |

## Key CSS Classes

- `.ab-wrapper` — full-screen flex container, golden gradient background
- `.ab-home` — landing view, centered, animated entrance
- `.ab-progress-bar` — horizontal bar, filled with teal gradient, rounded
- `.ab-book` — scrollable sticker book view
- `.ab-book-card` — individual letter card in grid, `.collected` state has golden border
- `.ab-modal` — fixed overlay for sticker detail, `.open` to show
- `.ab-modal-sticker` — giant emoji display with float animation
- `.ab-game` — match game view
- `.ab-game-prompt` — giant letter with "?" arrow, centered
- `.ab-choice` — choice card with giant emoji, `.correct` and `.wrong` states
- `.ab-choice.correct` — green glow, bounce
- `.ab-choice.wrong` — red wobble

## Game Logic

### State Variables

| Variable | Type | Purpose |
|---|---|---|
| `view` | String | `'home'`, `'book'`, `'game'` or `'modal'` |
| `collected` | Set | Letters the child has matched (A–Z) |
| `gameLetters` | Array | Shuffled 26 letters for current play-through |
| `gameIndex` | Number | Current round index (0–25) |
| `gameCorrect` | String | The correct animal string for current round |
| `gameChoices` | Array | 3 animal strings (1 correct + 2 distractors) |

### Functions

- **`getRandomAnimal(letter)`** — Returns a random animal string from the letter's pool
- **`getRandomLetters(count, exclude)`** — Returns `count` random letter keys excluding `exclude`
- **`showView(v)`** — Switches between `'home'`, `'book'`, `'game'`
- **`renderBook()`** — Builds the 26-card grid, filling in collected stickers
- **`openModal(letter)`** — Opens the sticker detail modal for a letter
- **`closeModal()`** — Closes the sticker modal
- **`startGame()`** — Shuffles letters, resets index, loads first round
- **`loadRound()`** — Picks current letter, picks a random animal, generates 3 choices, renders
- **`handleChoice(el, animal)`** — Checks answer, triggers correct/wrong animation
- **`advanceRound()`** — Increments index, checks for game completion, loads next round
- **`gameComplete()`** — Shows celebration overlay

### Audio & Feedback

| Event | Sound | Visual |
|---|---|---|
| Open modal | `OtisAudio.playPop()` | Slide-up animation |
| Tap match choice | — | Scale bounce |
| Correct answer | `OtisAudio.playSparkle()` | Gold particle burst, green glow, auto-advance |
| Wrong answer | `OtisAudio.playWobble()` | Red wobble shake |
| All 26 complete | `OtisAudio.playFanfare()` | `createCelebration()` with 🎉 |

## Shared Dependencies (from `shared.js`)

- `createCelebration()` — Win overlay
- `OtisAudio.playPop()`, `.playSparkle()`, `.playWobble()`, `.playFanfare()`
- `OtisParticles.burst()`
- `OtisSpeech.speak()` — For "Listen" button
- `shuffleArray()`

## Breakage Prevention Notes

- The match game shuffles letters so the order is different each play-through
- Distractor animals are guaranteed to be from different letters than the correct answer
- Choices are shuffled so the correct answer is not always in the same position
- The sticker book shows all letters regardless of collection status (explorable)
- The animal display in the modal re-rolls randomly each time you open it (fresh discovery)
- `collected` state persists in-memory during the session only (refreshes on page reload)
- Adding new animals: extend the arrays in `ANIMALS` object
- Adding new letters: add new key to `ANIMALS` object; will auto-integrate
