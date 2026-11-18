---
title: What is a game engine?
description: The software big games are built in, Unity and Unreal above all, what it does for you, and where AI comes in.
order: 1
---

A **game engine** is the software a game is built in and runs on. It takes care of everything most games need, so a team can spend its time on what makes their game different. An engine usually gives you:

- **Rendering:** drawing a 2D or 3D world on the screen many times a second, with lights, shadows, materials and cameras.
- **Physics:** gravity, collisions, things that fall, bounce and break.
- **Input:** keyboard, mouse, controller, touch, VR headsets.
- **Audio:** sound placed in the world, music, mixing.
- **An editor:** a window where you build scenes by placing objects, rather than writing every position in code.
- **Scripting:** code attached to objects to give them behaviour ("when the player touches this door, open it").
- **Building for platforms:** one project exported to Windows, Mac, phones, consoles or the web.

## The two big ones

**[Unity](https://unity.com/)** (Unity Technologies, first released in 2005) is scripted in C#. It is widely used for mobile and independent games, 2D as well as 3D. Games made in it include *Pokémon Go*, *Hollow Knight* and *Among Us*. ([Wikipedia: Unity](https://en.wikipedia.org/wiki/Unity_(game_engine)))

**[Unreal Engine](https://www.unrealengine.com/)** (Epic Games, first used for the game *Unreal* in 1998; Unreal Engine 5 came out in 2022) is scripted in C++, or with **Blueprints**, a visual system of boxes and wires that needs no typed code. It is known for high-end 3D graphics and is used for *Fortnite*, as well as beyond games: in architecture, and in film and TV, where it renders the backgrounds on LED walls behind actors (as on *The Mandalorian*). ([Wikipedia: Unreal Engine](https://en.wikipedia.org/wiki/Unreal_Engine))

A third is worth knowing: **[Godot](https://godotengine.org/)**, which is free and open source.

## Every tool is shaped by what it was made for

An engine is very good at the games it grew up with. Ask for a first-person 3D world and you'll be at home in Unreal or Unity. Ask for something unlike those games and the engine can get in your way. Architects sometimes load a building into a game engine for the lighting, and end up walking through it with W-A-S-D like a shooter, when a model you can turn in your hands might show the design better. The question to ask is whether the tool fits what you are making.

## Building without an engine

Small games often don't need one. Everything else in this section runs in a web page, written in JavaScript with Claude's help: [Wordle](/games/wordle) and [Semantle](/games/semantle) need only text and boxes, and even the 3D [first-person game](/games/fps) uses three.js, a library that draws 3D scenes in the browser, without the rest of an engine.

## Where AI comes in

There are two ways to use AI with games:

1. **Inside the engine.** An AI agent that can see the screen and use the mouse and keyboard ("computer use") can work in Unity's or Unreal's own editor: placing objects, changing settings, much as you would.
2. **Around it, or without it.** An agent like Claude Code writes the code itself: C# scripts for Unity, or a whole small game for the web, like the ones here.
