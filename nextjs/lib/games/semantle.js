// Semantle, the rules. This is the file to change: the hidden words it can choose, how many nearest words count as
// "close", and how a guess is scored. The board is app/games/semantle/Semantle.jsx; the word vectors it scores with
// are built once by lib/games/build-word-files.mjs and served at /games/semantle/vectors, so nothing calls an API in play.

export const rules = {
  close: 1000, // a guess among the hidden word's nearest this-many words shows its rank ("412/1000")
};

// The words the game can hide. Concrete, everyday nouns play best: every one must be in the vocabulary (the build
// script checks), and abstract words have neighbours that are hard to reach.
export const TARGETS = [
  "apple", "bridge", "candle", "castle", "cloud", "coffee", "desert", "doctor", "dragon", "engine",
  "farmer", "forest", "garden", "guitar", "hammer", "island", "kitchen", "ladder", "library", "mirror",
  "mountain", "museum", "ocean", "orange", "painter", "piano", "planet", "pocket", "prison", "rabbit",
  "river", "rocket", "sailor", "school", "shadow", "silver", "soldier", "spider", "storm", "summer",
  "teacher", "theater", "thunder", "tiger", "train", "violin", "volcano", "wallet", "window", "winter",
];

// How alike two words are: the cosine of the angle between their vectors. 1 means the same direction, 0 unrelated.
export function cosine(a, b) {
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  return dot / Math.sqrt(aa * bb);
}

// The number shown for a guess, on Semantle's scale: the cosine times 100. The hidden word itself scores 100.
export function toScore(similarity) {
  return Math.round(similarity * 10000) / 100;
}

export function pickTarget() {
  return TARGETS[Math.floor(Math.random() * TARGETS.length)];
}
