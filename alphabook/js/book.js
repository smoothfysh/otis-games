function renderBook() {
  const grid = document.getElementById('bookGrid');
  grid.innerHTML = '';
  LETTERS.forEach(letter => {
    const animal = getRandomAnimal(letter);
    const name = getAnimalName(animal);
    const display = getAnimalImageHtml(letter, name, getAnimalEmoji(animal));
    const card = document.createElement('div');
    card.className = 'ab-card';
    card.innerHTML = `
      <div class="ab-card-letter">${letter}</div>
      <div class="ab-card-sticker">${display}</div>
      <div class="ab-card-name">${name}</div>
    `;
    card.dataset.animal = animal;
    card.addEventListener('click', () => openModal(letter, animal));
    grid.appendChild(card);
  });
}

function openModal(letter, animal) {
  const pool = ANIMALS[letter];
  let idx = animal ? pool.indexOf(animal) : 0;
  if (idx === -1) idx = 0;
  state.currentModalLetter = letter;
  state.currentAnimalIndex = idx;
  renderModal();
  document.getElementById('modal').classList.add('open');
  try { OtisAudio.playPop(); } catch(e) {}
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function navAnimal(dir) {
  const pool = ANIMALS[state.currentModalLetter];
  state.currentAnimalIndex = (state.currentAnimalIndex + dir + pool.length) % pool.length;
  renderModal();
}

function renderModal() {
  const pool = ANIMALS[state.currentModalLetter];
  const animal = pool[state.currentAnimalIndex];
  const name = getAnimalName(animal);
  document.getElementById('modalLetter').textContent = state.currentModalLetter;
  document.getElementById('modalSticker').innerHTML = getAnimalImageHtml(state.currentModalLetter, name, getAnimalEmoji(animal));
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalCounter').textContent = `${state.currentAnimalIndex + 1} / ${pool.length}`;

  const factsEl = document.getElementById('modalFacts');
  const facts = ANIMAL_FACTS && ANIMAL_FACTS[state.currentModalLetter];
  if (facts) {
    const entry = facts.find(f => f.name === name) ||
                  facts.find(f => f.name.toLowerCase().includes(name.toLowerCase()));
    if (entry) {
      factsEl.innerHTML = `
        <div class="fact-row"><span class="fact-label">Type</span><span class="fact-value">${entry.type || '—'}</span></div>
        <div class="fact-row"><span class="fact-label">Home</span><span class="fact-value">${entry.native_to || '—'}</span></div>
        <div class="fact-row"><span class="fact-label">Size</span><span class="fact-value">${entry.size || '—'}</span></div>
        <div class="fact-row"><span class="fact-label">Diet</span><span class="fact-value">${entry.diet || '—'}</span></div>
        <div class="fact-row"><span class="fact-label">Loves</span><span class="fact-value">${entry.favorite_food || '—'}</span></div>
        <div class="fact-fun">${entry.fun_fact || ''}</div>
      `;
    } else {
      factsEl.innerHTML = '';
    }
  } else {
    factsEl.innerHTML = '';
  }

  const listenBtn = document.getElementById('modalListen');
  listenBtn.onclick = () => {
    try { OtisSpeech.speak(`${state.currentModalLetter} is for ${name}`); } catch(e) {}
  };
}