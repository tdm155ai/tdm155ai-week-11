// The Studio, the rules: a text game that grows, in the vein of A Dark Room and Universal Paperclips. This is the file
// to change: the goal, what you make (the resources), what you can do (the actions, their costs, when each unlocks),
// what happens on its own every second, and the story lines. The board that draws it is app/games/the-studio/TheStudio.jsx.

// What you are trying to reach. The game ends when you have this many of this resource.
export const goal = { resource: "readers", amount: 100, label: "Get 100 readers" };

// What you have at the start, and how each resource is named on screen, in this order.
export const start = { words: 0, pages: 0, scribes: 0, readers: 0 };
export const resources = [
  { id: "words", label: "words" },
  { id: "pages", label: "pages" },
  { id: "scribes", label: "scribes" },
  { id: "readers", label: "readers" },
];

// What you can do. `does` is shown on the button. `cost` is taken and `gives` is added; `grows` multiplies the cost
// for each one you already own (1.5: each scribe costs half again as much as the last). Until `unlocked` is true the
// button is greyed out and shows `unlocks` instead.
export const actions = [
  { id: "write", label: "Write a word", does: "+1 word", gives: { words: 1 } },
  { id: "page", label: "Fill a page", does: "10 words make 1 page", cost: { words: 10 }, gives: { pages: 1 } },
  {
    id: "scribe", label: "Hire a scribe", does: "a scribe writes 2 words every second, for good",
    cost: { pages: 2 }, gives: { scribes: 1 }, grows: 1.5,
    unlocked: (s, ever) => ever.pages >= 1, unlocks: "after your first page",
  },
  {
    id: "share", label: "Share a page", does: "1 page finds 5 readers",
    cost: { pages: 1 }, gives: { readers: 5 },
    unlocked: (s, ever) => ever.scribes >= 1, unlocks: "once you have a scribe",
  },
];

// What happens on its own each second: every scribe writes two words.
export function everySecond(s) {
  return { words: s.scribes * 2 };
}

// The story: each line shows once, the first time `when` is true.
export const story = [
  { id: "open", when: () => true, text: "A dark studio. A desk, a pencil, a blank sheet. Somewhere out there are readers." },
  { id: "page", when: (s) => s.pages >= 1, text: "A page. It isn't good yet, but it is a page." },
  { id: "scribe", when: (s) => s.scribes >= 1, text: "Someone else is writing now. Their handwriting is better than yours." },
  { id: "reader", when: (s) => s.readers >= 1, text: "Somebody read it. They want to know what happens next." },
  { id: "half", when: (s) => s.readers >= 50, text: "Fifty readers. They talk to each other about it." },
  { id: "won", when: (s) => s.readers >= 100, text: "A hundred readers. This is an audience. What do you owe them?" },
];

// Every story line passes through here on its way to the screen. Today it returns the line written above. This is
// where AI would plug in: send the line and the state to a model through a server route that holds the key (as
// lib/keys.mjs does for the site's other routes) and show what comes back, so the story is told differently each time.
export async function narrate(line, state) {
  return line.text;
}

// What an action costs now, after `grows` for each one already owned.
export function costOf(action, s) {
  const owned = action.grows ? s[Object.keys(action.gives)[0]] : 0;
  return Object.fromEntries(Object.entries(action.cost || {}).map(([id, n]) => [id, Math.ceil(n * (action.grows || 1) ** owned)]));
}
