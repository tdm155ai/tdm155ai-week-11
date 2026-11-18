// Wordle, the rules. This is the file to change: the word length, the number of guesses, the words it can pick,
// whether a guess has to be a real word, and how a guess is scored. The board that draws it is app/games/wordle/Wordle.jsx.
import { DICTIONARY } from "./wordle-dictionary.js";

export const rules = {
  length: 5, // letters per word; every word in ANSWERS must have this many
  guesses: 6, // tries before you lose
  realWordsOnly: true, // true: a guess must be in ANSWERS or the dictionary (Wordle's rule); false: any letters will do
};

// The words the game can choose as the answer. Add your own (themed lists make good remixes: a course's terms, a
// lab's equipment, a city's streets), keeping them all `rules.length` letters long.
export const ANSWERS = [
  "about", "above", "actor", "adapt", "after", "agent", "alarm", "album", "alive", "angle",
  "apple", "arena", "audio", "award", "beach", "bench", "black", "blend", "board", "brain",
  "bread", "brick", "brush", "build", "cabin", "camel", "candy", "chair", "chalk", "chart",
  "chess", "cloud", "coast", "color", "comic", "coral", "craft", "crane", "crowd", "dance",
  "delta", "draft", "drama", "dream", "earth", "email", "essay", "field", "flame", "focus",
  "frame", "fresh", "fruit", "ghost", "giant", "glass", "globe", "grain", "graph", "grass",
  "guide", "heart", "honey", "horse", "house", "image", "input", "jelly", "judge", "label",
  "laser", "layer", "lemon", "level", "light", "logic", "lunch", "magic", "maker", "maple", "match",
  "metal", "model", "money", "mouse", "movie", "music", "night", "noise", "novel", "ocean",
  "orbit", "paint", "panel", "paper", "party", "piano", "pixel", "pilot", "plant", "plate",
  "point", "power", "press", "prize", "quest", "quiet", "radio", "river", "robot", "round",
  "scene", "score", "shape", "skill", "smile", "sound", "space", "spark", "stage", "stone",
  "story", "sugar", "table", "teach", "theme", "tiger", "token", "tower", "track", "train",
  "trick", "video", "voice", "water", "whale", "world", "write", "youth", "zebra", "piece",
];

// How one guess is scored against the answer: "correct" (right letter, right place), "present" (in the word, somewhere
// else) or "absent". Greens are counted first, so a repeated letter is only yellow as many times as the answer still
// has it: guessing "geese" against "eagle" gives one green and one yellow e, and the third e is grey.
export function score(guess, answer) {
  const result = Array(guess.length).fill("absent");
  const left = {};
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else left[answer[i]] = (left[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct" || !left[guess[i]]) continue;
    result[i] = "present";
    left[guess[i]] -= 1;
  }
  return result;
}

// Is this guess allowed? Returns a message to show when it isn't.
export function check(guess) {
  if (guess.length !== rules.length) return `Guesses are ${rules.length} letters.`;
  if (rules.realWordsOnly && !ANSWERS.includes(guess) && !DICTIONARY.has(guess)) return "Not in the word list.";
  return "";
}

export function pickAnswer() {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}
