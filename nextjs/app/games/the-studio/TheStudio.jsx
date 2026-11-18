"use client";

import { useEffect, useRef, useState } from "react";
import { actions, costOf, everySecond, goal, narrate, resources, start, story } from "../../../lib/games/the-studio.js";

const TICK = 250; // milliseconds between updates; everySecond() is scaled to match

const plural = (n, id) => `${n} ${n === 1 ? id.replace(/s$/, "") : id}`;

// The board: the goal, what you have, what you can do, and the story so far, newest first. The rules are all in
// lib/games/the-studio.js.
export default function TheStudio() {
  const [state, setState] = useState(start);
  const [ever, setEver] = useState(start); // the most you have ever had of each thing, for unlocking
  const [lines, setLines] = useState([]); // { id, text }
  const [began, setBegan] = useState(null);
  const [took, setTook] = useState(null); // seconds to reach the goal
  const told = useRef(new Set());
  const won = took !== null;

  // Things that happen on their own, until the goal is reached.
  useEffect(() => {
    if (won) return;
    const timer = setInterval(() => {
      setState((s) => {
        const next = { ...s };
        for (const [id, n] of Object.entries(everySecond(s))) next[id] = Math.max(0, next[id] + (n * TICK) / 1000);
        return next;
      });
    }, TICK);
    return () => clearInterval(timer);
  }, [won]);

  // Whenever the state changes: remember the most of each thing, tell new story lines, check the goal.
  useEffect(() => {
    setEver((most) => (resources.some(({ id }) => state[id] > most[id])
      ? Object.fromEntries(resources.map(({ id }) => [id, Math.max(most[id], state[id])]))
      : most));
    for (const line of story) {
      if (told.current.has(line.id) || !line.when(state)) continue;
      told.current.add(line.id);
      narrate(line, state).then((text) => setLines((done) => [{ id: line.id, text }, ...done]));
    }
    if (!won && began && state[goal.resource] >= goal.amount) setTook(Math.round((Date.now() - began) / 1000));
  }, [state, won, began]);

  function act(action) {
    const cost = costOf(action, state);
    if (won || Object.entries(cost).some(([id, n]) => state[id] < n)) return;
    if (!began) setBegan(Date.now());
    setState((s) => {
      const next = { ...s };
      for (const [id, n] of Object.entries(cost)) next[id] -= n;
      for (const [id, n] of Object.entries(action.gives)) next[id] += n;
      return next;
    });
  }

  function restart() {
    setState(start);
    setEver(start);
    setLines([]);
    setBegan(null);
    setTook(null);
    told.current = new Set();
  }

  const rates = everySecond(state);
  const progress = Math.min(1, state[goal.resource] / goal.amount);

  return (
    <div className="game-board studio">
      <div className="studio-goal">
        <p><span className="eyebrow">Goal</span> {goal.label}</p>
        <div className="studio-progress" style={{ "--fill": progress }} aria-label={`${Math.floor(state[goal.resource])} of ${goal.amount}`} />
        {won && <p className="studio-won">Done in {took} seconds. <button type="button" className="game-button quiet" onClick={restart}>Play again</button></p>}
      </div>

      <div className="studio-columns">
        <section aria-label="What you have and what you can do">
          <ul className="studio-stock">
            {resources.map(({ id, label }) => (
              <li key={id}><span>{label}</span><strong>{Math.floor(state[id]).toLocaleString()}</strong><em>{rates[id] ? `+${rates[id]} a second` : ""}</em></li>
            ))}
          </ul>
          <div className="studio-actions">
            {actions.map((action) => {
              const open = !action.unlocked || action.unlocked(state, ever);
              const cost = costOf(action, state);
              const short = Object.entries(cost).some(([id, n]) => state[id] < n);
              const price = Object.entries(cost).map(([id, n]) => plural(n, id)).join(", ");
              return (
                <button type="button" className="studio-button" key={action.id} disabled={!open || short || won} onClick={() => act(action)}>
                  <strong>{action.label}</strong>
                  <span>{open ? action.does : `Unlocks ${action.unlocks}`}</span>
                  {open && price && <span className="studio-cost">costs {price}</span>}
                </button>
              );
            })}
          </div>
        </section>
        <section aria-label="The story" aria-live="polite">
          <p className="eyebrow">What happens</p>
          <ol className="studio-log">
            {lines.map((line, i) => <li key={line.id} style={{ opacity: Math.max(0.35, 1 - i * 0.15) }}>{line.text}</li>)}
          </ol>
        </section>
      </div>
      {!won && <div className="game-actions"><button type="button" className="game-button quiet" onClick={restart}>Start over</button></div>}
    </div>
  );
}
