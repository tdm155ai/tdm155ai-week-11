---
title: Building games and game-like experiences
description: "Three ways in, without a game engine: imitate a game, work with one mechanic, or start from a new technology."
---

Big games are built in a **game engine** like Unity or Unreal: [what is a game engine?](/games/what-is-a-game-engine) Everything here is built without one, in an ordinary web page, small enough that the code fits in your head. There are three ways in.

## 1. Imitate a game

Take a game you know, rebuild it small, and change one rule. Each of these keeps its rules in one file: play it, open that file, change one thing, and play again.

- **[Wordle](/games/wordle):** guesses limited to real words, with coloured feedback on every letter. Change `nextjs/lib/games/wordle.js`: the word length, the number of guesses, the words it picks from, whether guesses must be real words, how a guess is scored.
- **[Semantle](/games/semantle):** a score for closeness in meaning instead of letters; each word is a vector, and the score is how near your guess points to the hidden word. Change `nextjs/lib/games/semantle.js`: the hidden words, how many nearest words count as close, how the score is shown.
- Two text games worth playing before you imitate one: [A Dark Room](https://adarkroom.doublespeakgames.com/) and [Universal Paperclips](https://www.decisionproblem.com/paperclips/). Each starts with a single button and grows from there.

## 2. Work with a mechanic or a game element

Take one piece of a game and get it working on its own. Then ask where else it could go.

- **[First-person](/games/fps):** moving, looking and aiming in 3D, drawn with three.js. Change `nextjs/lib/games/fps/rules.js`: the time limit, the targets, how fast you move, how high you jump, the room, the colours.
- Where else could walking and looking around be the way in? A map of a place, a tour through a dataset, a presentation you step through instead of click through.

## 3. Start from a new technology

A new device makes new mechanics possible. Before you design a game for it, find out what it can actually do. This week's device is the **NFC card**: a phone tap opens a link. Work out what a tap can mean (one person to many cards, many people to one card, a one-time tap or one that changes) before you decide what the game is.

- [Technology](/elements/technology), in this week's elements.
- [The cards' base mechanics](https://github.com/tdm155ai/tdm155ai-week-11/blob/main/nfc-app/MECHANICS.md) and [writing your own cards](https://github.com/tdm155ai/tdm155ai-week-11/blob/main/nfc-tools/README.md).
- [Activity 4: Motivate the device](/activities/04): a game, or one mechanic, that needs the cards.

## This week's practice

When you have tried these, go on to [this week's practice](/practice): a simple game that really works, or one game mechanic of your own.
