"use client";

import { useCallback, useEffect, useState } from "react";
import { check, pickAnswer, rules, score } from "../../../lib/games/wordle.js";

const KEYS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const RANK = { absent: 1, present: 2, correct: 3 };

// The board: a grid of rows, an on-screen keyboard, and the physical one. The rules are all in lib/games/wordle.js.
export default function Wordle() {
  const [answer, setAnswer] = useState("");
  const [rows, setRows] = useState([]); // { word, marks } for each guess made
  const [typing, setTyping] = useState("");
  const [message, setMessage] = useState("");

  const won = rows.some((row) => row.word === answer);
  const over = won || rows.length >= rules.guesses;

  // Chosen after the page loads, so the server and the browser don't pick different words.
  useEffect(() => { setAnswer(pickAnswer()); }, []);

  const press = useCallback((key) => {
    if (over || !answer) return;
    setMessage("");
    if (key === "enter") {
      const problem = check(typing);
      if (problem) return setMessage(problem);
      setRows((done) => [...done, { word: typing, marks: score(typing, answer) }]);
      setTyping("");
    } else if (key === "back") {
      setTyping((word) => word.slice(0, -1));
    } else if (/^[a-z]$/.test(key)) {
      setTyping((word) => (word.length < rules.length ? word + key : word));
    }
  }, [answer, over, typing]);

  useEffect(() => {
    function onKey(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Enter") press("enter");
      else if (event.key === "Backspace") press("back");
      else press(event.key.toLowerCase());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  function restart() {
    setAnswer(pickAnswer());
    setRows([]);
    setTyping("");
    setMessage("");
  }

  // The keyboard shows the best thing learned about each letter so far.
  const known = {};
  for (const { word, marks } of rows) {
    [...word].forEach((letter, i) => {
      if (!known[letter] || RANK[marks[i]] > RANK[known[letter]]) known[letter] = marks[i];
    });
  }

  const grid = Array.from({ length: rules.guesses }, (_, i) => {
    if (rows[i]) return rows[i];
    if (i === rows.length && !over) return { word: typing, marks: [] };
    return { word: "", marks: [] };
  });

  return (
    <div className="game-board">
      <div className="wordle-grid" style={{ "--letters": rules.length }} aria-label="Guesses">
        {grid.map((row, r) => (
          <div className="wordle-row" key={r}>
            {Array.from({ length: rules.length }, (_, c) => (
              <span className={`wordle-cell ${row.marks[c] || (row.word[c] ? "typed" : "")}`} key={c}>{row.word[c] || ""}</span>
            ))}
          </div>
        ))}
      </div>

      <p className="game-message" role="status">
        {won ? `Got it in ${rows.length}.` : over ? `The word was ${answer.toUpperCase()}.` : message || " "}
      </p>

      <div className="wordle-keys" aria-label="Keyboard">
        {KEYS.map((line, i) => (
          <div className="wordle-key-row" key={line}>
            {i === 2 && <button type="button" className="wordle-key wide" onClick={() => press("enter")}>Enter</button>}
            {[...line].map((letter) => (
              <button type="button" className={`wordle-key ${known[letter] || ""}`} key={letter} onClick={() => press(letter)}>{letter}</button>
            ))}
            {i === 2 && <button type="button" className="wordle-key wide" onClick={() => press("back")} aria-label="Delete">⌫</button>}
          </div>
        ))}
      </div>

      <button type="button" className="game-button" onClick={restart}>{over ? "Play again" : "New word"}</button>
    </div>
  );
}
