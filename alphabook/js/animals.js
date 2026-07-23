const ANIMALS = {
  A: ['Alligator🐊', 'Ant🐜', 'Antelope🦌', 'Ape🦧', 'Armadillo🦔'],
  B: ['Bear🐻', 'Bat🦇', 'Bee🐝', 'Butterfly🦋', 'Beaver🦫', 'Buffalo🐃'],
  C: ['Cat🐱', 'Cow🐄', 'Cheetah🐆', 'Camel🐫', 'Crab🦀', 'Caterpillar🐛'],
  D: ['Dog🐶', 'Dolphin🐬', 'Duck🦆', 'Donkey🫏', 'Deer🦌', 'Dragonfly🦗'],
  E: ['Elephant🐘', 'Eagle🦅', 'Eel🐟', 'Emu🦃', 'Elk🦌'],
  F: ['Fox🦊', 'Frog🐸', 'Flamingo🦩', 'Fish🐟', 'Ferret🐹', 'Falcon🦅'],
  G: ['Giraffe🦒', 'Gorilla🦍', 'Goat🐐', 'Goldfish🐟', 'Grasshopper🦗', 'Guinea Pig🐹'],
  H: ['Hippo🦛', 'Horse🐴', 'Hedgehog🦔', 'Hamster🐹', 'Hyena🐺', 'Hawk🦅'],
  I: ['Iguana🦎', 'Impala🦌', 'Ibis🦩', 'Insect🐛'],
  J: ['Jaguar🐆', 'Jellyfish🪼', 'Blue Jay🐦', 'Jackal🐺'],
  K: ['Kangaroo🦘', 'Koala🐨', 'Kingfisher🐦', 'Kiwi🐦'],
  L: ['Lion🦁', 'Leopard🐆', 'Llama🦙', 'Lemur🐒', 'Lobster🦞', 'Ladybug🐞'],
  M: ['Monkey🐵', 'Mouse🐭', 'Meerkat🐹', 'Moose🦌', 'Mole🐹'],
  N: ['Newt🦎', 'Narwhal🐋', 'Nightingale🐦', 'Numbat🐹'],
  O: ['Owl🦉', 'Octopus🐙', 'Otter🦦', 'Ostrich🦃', 'Orangutan🦧'],
  P: ['Penguin🐧', 'Panda🐼', 'Pig🐷', 'Parrot🦜', 'Polar Bear🐻‍❄️', 'Peacock🦚'],
  Q: ['Quail🐦', 'Quokka🦘', 'Quoll🐱'],
  R: ['Rabbit🐰', 'Rhino🦏', 'Raccoon🦝', 'Rat🐀', 'Reindeer🦌'],
  S: ['Sloth🦥', 'Shark🦈', 'Snake🐍', 'Sheep🐑', 'Squirrel🐿️', 'Seal🦭'],
  T: ['Tiger🐯', 'Turtle🐢', 'Toucan🐦', 'Turkey🦃', 'Toad🐸'],
  U: ['Urchin🪸', 'Umbrellabird🐦', 'Urial🐐'],
  V: ['Vulture🦅', 'Viper🐍', 'Vicuña🦙'],
  W: ['Whale🐋', 'Wolf🐺', 'Walrus🦭', 'Wombat🐹', 'Weasel🐹'],
  X: ['X-ray Tetra🐟', 'Xenops🐦'],
  Y: ['Yak🐃', 'Yellowjacket🐝'],
  Z: ['Zebra🦓', 'Zebu🐃']
};
const LETTERS = Object.keys(ANIMALS);

const ANIMAL_TO_LETTER = {};
LETTERS.forEach(letter => {
  ANIMALS[letter].forEach(animal => {
    ANIMAL_TO_LETTER[animal] = letter;
  });
});

function getRandomAnimal(letter) {
  const pool = ANIMALS[letter];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getAnimalEmoji(str) {
  const match = str.match(/\p{Extended_Pictographic}/u);
  return match ? match[0] : '🐾';
}

function getAnimalName(str) {
  return str.replace(/[^\p{L}\p{N}\s'-]/gu, '').trim();
}

function getAnimalImageHtml(letter, name, emoji) {
  const path = `assets/${letter} ${name}.png`;
  return `<img src="${encodeURI(path)}" alt="${name}" onerror="this.outerHTML='${emoji}'">`;
}