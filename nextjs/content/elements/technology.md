---
title: "Technology"
description: "The corner of the tetrad that makes a mechanic possible."
order: 3
---

In Schell's tetrad, **technology** is whatever the game is made with: paper and pencil, dice, a deck of cards, a controller, a phone, a camera, a language model. It decides which mechanics are possible at all. A die gives you chance; a clock gives you a timer; a phone that knows where it is gives you a map you walk around in.

So when a new technology arrives, new mechanics follow, and someone makes the games that show them off. A few you can check:

- **Motion controllers:** the Wii Remote (2006) made swinging your arm the input, and *Wii Sports* came in the box to prove it.
- **Phones with GPS and a camera:** *Pokémon Go* (2016) put the map under your feet and the creatures in the camera view.
- **Word vectors:** language models place words in a space of meaning, and *Semantle* turns the distance between two words into a score. Play [our version](/games/semantle).

## Two minutes

Pick a technology you have in your pocket or on the table. What can it sense, count, or show? Name one mechanic it makes possible that paper couldn't. That's a game, or a part of one.

## In this repo: NFC cards

An NFC card or sticker holds a short piece of data that a phone reads when you tap it. In practice it holds **a link**, so a tap says "this card, here, now", and the page it opens can be anything: the same video for everyone, or a page that changes with how many people have tapped, what time it is, or what happened before.

- [**nfc-tools**](https://github.com/tdm155ai/tdm155ai-week-11/blob/main/nfc-tools/README.md): a script that writes a link onto a card (and reads one back), with a USB reader.
- [**nfc-app**](https://github.com/tdm155ai/tdm155ai-week-11/blob/main/nfc-app/README.md): the app the cards point to, where each tap lands and gets counted.
- [**The cards' mechanics**](https://github.com/tdm155ai/tdm155ai-week-11/blob/main/nfc-app/MECHANICS.md): three ways to describe any card mechanic: the scale (one person and one card, up to many people on a trail of cards), the direction (the card is always one-way; the system behind it can answer back), and what a card can carry.

These live outside the site, in the repo, because they run on a laptop with the reader plugged in.
