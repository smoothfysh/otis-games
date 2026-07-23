function startGame() {
  state.collected = new Set();
  saveCollected();
  const letters = shuffleArray([...LETTERS]).slice(0, GAME_ROUNDS);
  resetGameState(letters);
  showView('game');
  loadRound();
}

function continueGame() {
  if (state.collected.size >= 26) {
    showAllComplete();
    return;
  }
  const remaining = shuffleArray(LETTERS.filter(l => !state.collected.has(l)));
  const letters = remaining.slice(0, Math.min(GAME_ROUNDS, remaining.length));
  resetGameState(letters);
  showView('game');
  loadRound();
}

function quitGame() {
  showView('home');
}

function loadRound() {
  if (state.gameIndex >= state.gameLetters.length) {
    gameComplete();
    return;
  }
  state.isAdvancing = false;
  const letter = state.gameLetters[state.gameIndex];
  document.getElementById('gameLetter').textContent = letter;
  document.getElementById('gameRound').textContent = `${state.gameIndex + 1} / ${state.gameLetters.length}`;
  document.getElementById('gameMessage').textContent = '';

  state.gameCorrect = getRandomAnimal(letter);

  const distractorLetters = LETTERS.filter(l => l !== letter);
  const distractors = [];
  const used = new Set();
  while (distractors.length < 2) {
    const dl = distractorLetters[Math.floor(Math.random() * distractorLetters.length)];
    const da = getRandomAnimal(dl);
    const key = dl + da;
    if (!used.has(key)) {
      used.add(key);
      distractors.push(da);
    }
  }

  state.gameChoices = shuffleArray([state.gameCorrect, ...distractors]);

  const container = document.getElementById('gameChoices');
  container.innerHTML = '';
  state.gameChoices.forEach(animal => {
    const el = document.createElement('div');
    el.className = 'ab-choice';
    el.dataset.animal = animal;
    const name = getAnimalName(animal);
    const choiceLetter = ANIMAL_TO_LETTER[animal];
    const display = getAnimalImageHtml(choiceLetter, name, getAnimalEmoji(animal));
    el.innerHTML = `
      <button class="ab-choice-expand" aria-label="See full size">🔍</button>
      <div class="ab-choice-sticker">${display}</div>
      <div class="ab-choice-label">${name}</div>
    `;
    el.querySelector('.ab-choice-expand').addEventListener('click', (e) => {
      e.stopPropagation();
      showImagePreview(animal);
    });
    el.addEventListener('click', () => handleChoice(el, animal));
    container.appendChild(el);
  });
}

function handleChoice(el, animal) {
  if (state.isAdvancing) return;
  const letter = state.gameLetters[state.gameIndex];

  if (animal === state.gameCorrect) {
    state.isAdvancing = true;
    el.classList.add('correct');
    state.collected.add(letter);
    saveCollected();
    document.getElementById('gameMessage').textContent = '✅ Correct!';
    try {
      OtisAudio.playSparkle();
      OtisSpeech.speak(`${letter} is for ${getAnimalName(animal)}`);
    } catch(e) {}
    const rect = el.getBoundingClientRect();
    try { OtisParticles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#FFD700', 16); } catch(e) {}

    document.querySelectorAll('.ab-choice').forEach(c => c.classList.add('disabled'));

    setTimeout(() => {
      state.gameIndex++;
      loadRound();
    }, 900);
  } else {
    el.classList.add('wrong');
    document.getElementById('gameMessage').textContent = '❌ Try again!';
    try { OtisAudio.playWobble(); } catch(e) {}
    setTimeout(() => {
      el.classList.remove('wrong');
      if (!state.isAdvancing) document.getElementById('gameMessage').textContent = '';
    }, 500);
  }
}

function closeImagePreview() {
  const overlay = document.querySelector('.ab-preview-overlay');
  if (overlay) overlay.remove();
}

function showImagePreview(animal) {
  const name = getAnimalName(animal);
  const letter = ANIMAL_TO_LETTER[animal];
  const display = getAnimalImageHtml(letter, name, getAnimalEmoji(animal));

  const overlay = document.createElement('div');
  overlay.className = 'ab-preview-overlay';
  overlay.innerHTML = `
    <div class="ab-preview-content" id="previewContent">
      <button class="ab-preview-close">✕</button>
      <div class="ab-preview-image" id="previewImage"></div>
      <div class="ab-preview-name">${name}</div>
    </div>
  `;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const imgContainer = overlay.querySelector('#previewImage');
  const pad = 60;
  imgContainer.style.width = (vw - pad) + 'px';
  imgContainer.style.height = (vh - pad) + 'px';
  imgContainer.innerHTML = display;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeImagePreview();
  });
  overlay.querySelector('.ab-preview-close').addEventListener('click', closeImagePreview);
  document.addEventListener('keydown', previewKeyHandler);
  document.getElementById('app').appendChild(overlay);
}

function previewKeyHandler(e) {
  if (e.key === 'Escape') {
    closeImagePreview();
    document.removeEventListener('keydown', previewKeyHandler);
  }
}

function showAllComplete() {
  try { OtisAudio.playFanfare(); } catch(e) {}
  const overlay = document.createElement('div');
  overlay.className = 'celebration';
  overlay.style.cssText = 'z-index:100;background:rgba(0,0,0,0.3);';
  overlay.innerHTML = `
    <div class="celebration-card" style="display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;max-width:360px;">
      <div style="font-size:3rem;animation:bounce 0.6s ease infinite;">🏆</div>
      <h2 style="color:var(--gold);margin:0;">Amazing!</h2>
      <p style="margin:0;font-size:1.1rem;line-height:1.5;">You know all 26 letters and their animals!</p>
      <div style="display:flex;gap:12px;margin-top:8px;">
        <button class="btn" style="background:var(--coral);color:white;min-width:120px;" id="allDonePlayAgain">Play Again</button>
        <button class="btn" style="background:var(--lavender);color:var(--text);min-width:120px;" id="allDoneQuit">Quit</button>
      </div>
    </div>
  `;
  document.getElementById('app').appendChild(overlay);
  document.getElementById('allDonePlayAgain').addEventListener('click', () => {
    overlay.remove();
    startGame();
  });
  document.getElementById('allDoneQuit').addEventListener('click', () => {
    overlay.remove();
    showView('home');
  });
}

function gameComplete() {
  try { OtisAudio.playFanfare(); } catch(e) {}
  if (state.collected.size >= 26) {
    setTimeout(showAllComplete, 500);
    return;
  }
  document.getElementById('gameMessage').textContent = '🎉 Round complete!';
  setTimeout(() => {
    const overlay = document.createElement('div');
    overlay.className = 'celebration';
    overlay.style.cssText = 'z-index:100;background:rgba(0,0,0,0.3);';
    overlay.innerHTML = `
      <div class="celebration-card" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div class="star" style="font-size:3rem;animation:bounce 0.6s ease infinite;">🎉</div>
        <h2 style="color:var(--gold);margin:0;">Great job! ${state.collected.size} / 26 stickers!</h2>
        <div style="display:flex;gap:12px;margin-top:8px;">
          <button class="btn" style="background:var(--coral);color:white;min-width:120px;" id="celebContinue">Play Again</button>
          <button class="btn" style="background:var(--lavender);color:var(--text);min-width:120px;" id="celebQuit">Quit</button>
        </div>
      </div>
    `;
    document.getElementById('app').appendChild(overlay);
    document.getElementById('celebContinue').addEventListener('click', () => {
      overlay.remove();
      continueGame();
    });
    document.getElementById('celebQuit').addEventListener('click', () => {
      overlay.remove();
      showView('home');
    });
  }, 400);
}