// Target practice, the rules. This is the file to change: how long a round lasts, how many targets there are, how
// fast you and they move, how big the room is, and the colours. The game that uses these is lib/games/fps/game.js,
// and the page around it is app/games/fps/.

export const rules = {
  timeLimit: 30, // seconds in a round
  targets: 6, // how many targets are in the room at once; a target you hit reappears somewhere else
  pointsPerHit: 1,

  moveSpeed: 7, // your walking speed, in metres per second
  jumpSpeed: 5, // how hard you jump (Space), in metres per second upward: 5 is about a metre high
  gravity: 12, // how fast you fall back, in metres per second, per second (Earth is 9.8)
  lookSpeed: 0.0022, // how far the view turns for each pixel the mouse moves
  roomSize: 40, // the room is a square this many metres across; you can't walk out of it

  targetSize: 0.7, // the radius of a target, in metres: smaller is harder
  targetBob: 0.8, // how far a target floats up and down, in metres (0 keeps them still)
  targetDrift: 1.5, // how fast a target slides sideways, in metres per second (0 keeps them in place)

  colours: {
    sky: "#2b3640",
    floor: "#3a3d39",
    grid: "#7d8279",
    target: "#ffc933",
    hit: "#ffffff",
  },
};
