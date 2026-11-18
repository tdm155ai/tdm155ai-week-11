"use client";

import { useEffect, useMemo, useState } from "react";
import { cosine, pickTarget, rules, toScore } from "../../../lib/games/semantle.js";

// The board: a guess box and the guesses so far, best first. The rules are in lib/games/semantle.js; the vectors come
// from /games/semantle/vectors once, and every score after that is worked out here in the browser.
export default function Semantle() {
  const [data, setData] = useState(null); // { words, dims, bytes, index }
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState([]); // { word, score, rank, order }
  const [typing, setTyping] = useState("");
  const [message, setMessage] = useState("");
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    fetch("/games/semantle/vectors").then((response) => response.json()).then(({ words, dims, vectors }) => {
      const bytes = new Int8Array(Uint8Array.from(atob(vectors), (c) => c.charCodeAt(0)).buffer);
      setData({ words, dims, bytes, index: new Map(words.map((word, i) => [word, i])) });
      setTarget(pickTarget());
    }).catch(() => setMessage("Couldn't load the word vectors."));
  }, []);

  const vector = (i) => data.bytes.subarray(i * data.dims, (i + 1) * data.dims);

  // Every word's similarity to the hidden word, ranked: the nearest few set the hints, the top `rules.close` give ranks.
  const nearest = useMemo(() => {
    if (!data || !target) return null;
    const goal = vector(data.index.get(target));
    const ranked = data.words.map((word, i) => [word, cosine(goal, vector(i))]).sort((a, b) => b[1] - a[1]);
    const rank = new Map(ranked.slice(0, rules.close + 1).map(([word], i) => [word, i]));
    return { ranked, rank };
  }, [data, target]);

  const found = guesses.some((guess) => guess.word === target);

  function guess(event) {
    event.preventDefault();
    const word = typing.trim().toLowerCase();
    setTyping("");
    setMessage("");
    if (!word || !nearest) return;
    if (guesses.some((g) => g.word === word)) return setMessage(`Already guessed ${word}.`);
    const i = data.index.get(word);
    if (i === undefined) return setMessage(`${word} isn't one of the ${data.words.length.toLocaleString()} words this game knows.`);
    const similarity = cosine(vector(data.index.get(target)), vector(i));
    setGuesses((done) => [...done, { word, score: toScore(similarity), rank: nearest.rank.get(word), order: done.length + 1 }]);
  }

  function restart() {
    setTarget(pickTarget());
    setGuesses([]);
    setMessage("");
    setGaveUp(false);
  }

  if (!nearest) return <p className="game-message">{message || "Loading the word vectors…"}</p>;

  const hint = (n) => toScore(nearest.ranked[n][1]);
  const sorted = [...guesses].sort((a, b) => b.score - a.score);
  const latest = guesses[guesses.length - 1];

  return (
    <div className="game-board semantle">
      <p className="semantle-hints">
        The nearest word to the hidden one scores <strong>{hint(1)}</strong>, the tenth nearest <strong>{hint(10)}</strong>, and the {rules.close.toLocaleString()}th nearest <strong>{hint(rules.close)}</strong>.
      </p>

      {found || gaveUp ? (
        <p className="game-message">{found ? `Got it: ${target}, in ${guesses.length} guesses.` : `The word was ${target}.`} Its nearest words: {nearest.ranked.slice(1, 11).map(([word]) => word).join(", ")}.</p>
      ) : (
        <form className="semantle-form" onSubmit={guess}>
          <input value={typing} onChange={(event) => setTyping(event.target.value)} placeholder="Type a word" autoComplete="off" autoCapitalize="off" spellCheck="false" autoFocus aria-label="Your guess" />
          <button type="submit" className="game-button">Guess</button>
        </form>
      )}
      <p className="game-message" role="status">{message || " "}</p>

      {guesses.length > 0 && (
        <table className="semantle-table">
          <thead><tr><th>#</th><th>Guess</th><th>Score</th><th>Close?</th></tr></thead>
          <tbody>
            {latest && <Row guess={latest} latest />}
            {sorted.map((g) => <Row guess={g} key={g.word} />)}
          </tbody>
        </table>
      )}

      <div className="game-actions">
        {!found && !gaveUp && guesses.length > 0 && <button type="button" className="game-button quiet" onClick={() => setGaveUp(true)}>Give up</button>}
        <button type="button" className="game-button quiet" onClick={restart}>New word</button>
      </div>
    </div>
  );
}

function Row({ guess, latest = false }) {
  const close = guess.rank === undefined ? "cold" : guess.rank === 0 ? "found it" : `${rules.close + 1 - guess.rank}/${rules.close}`;
  const width = guess.rank === undefined ? 0 : (rules.close + 1 - guess.rank) / rules.close;
  return (
    <tr className={latest ? "latest" : undefined}>
      <td>{guess.order}</td>
      <td>{guess.word}</td>
      <td>{guess.score.toFixed(2)}</td>
      <td><span className="semantle-bar" style={{ "--fill": width }} />{close}</td>
    </tr>
  );
}
