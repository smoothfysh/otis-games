const STORAGE_KEY = 'abc_animal_stickers';
const GAME_ROUNDS = 5;

const state = {
  collected: loadCollected(),
  gameLetters: [],
  gameIndex: 0,
  gameCorrect: '',
  gameChoices: [],
  currentModalLetter: 'A',
  currentAnimalIndex: 0,
  isAdvancing: false
};

function loadCollected() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch(e) { return new Set(); }
}

function saveCollected() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.collected])); } catch(e) {}
}

function resetGameState(letters) {
  state.gameLetters = letters;
  state.gameIndex = 0;
  state.isAdvancing = false;
}