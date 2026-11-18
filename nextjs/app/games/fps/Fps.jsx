"use client";

import { useEffect, useRef, useState } from "react";
import { createGame } from "../../../lib/games/fps/game.js";
import { rules } from "../../../lib/games/fps/rules.js";

const BUTTON = { ready: "Start", paused: "Carry on", over: "Play again" };

// The screen: a canvas for three.js, the score and the clock on top, and a button to start. The game itself is
// lib/games/fps/game.js; the numbers are in lib/games/fps/rules.js.
export default function Fps() {
  const canvas = useRef(null);
  const game = useRef(null);
  const [status, setStatus] = useState({ state: "ready", score: 0, timeLeft: rules.timeLimit });

  useEffect(() => {
    game.current = createGame(canvas.current, setStatus);
    return () => game.current.dispose();
  }, []);

  const { state, score, timeLeft } = status;
  return (
    <section className="game-board fps-board">
      <div className="fps-stage">
        <canvas ref={canvas} className="fps-canvas" aria-label="Target practice, a first-person game" />
        <div className="fps-hud" aria-live="polite">
          <span>Score <strong>{score}</strong></span>
          <span>Time <strong>{timeLeft}</strong></span>
        </div>
        {state === "playing" ? (
          <div className="fps-crosshair" aria-hidden="true" />
        ) : (
          <div className="fps-overlay">
            {state === "over" && <p className="fps-result">Time&apos;s up. You hit {score} {score === 1 ? "target" : "targets"}.</p>}
            {state === "paused" && <p className="fps-result">Paused.</p>}
            <button className="game-button" type="button" onClick={() => game.current?.start()}>{BUTTON[state]}</button>
            <p className="fps-help">Mouse to look · W A S D to move · Space to jump · click to shoot · Esc to pause</p>
          </div>
        )}
      </div>
      <p className="game-message">Needs a keyboard and a mouse or trackpad. Hit as many targets as you can in {rules.timeLimit} seconds.</p>
    </section>
  );
}
