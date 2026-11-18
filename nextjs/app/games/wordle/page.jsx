import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import Wordle from "./Wordle.jsx";
import "../games.css";

export const metadata = {
  title: "Wordle",
  description: "A plain Wordle to play and remake: guess the word in six tries, with coloured feedback on every letter.",
};

// The page is a frame; the game is Wordle.jsx, and the rules and words are in lib/games/wordle.js.
export default function WordlePage() {
  return (
    <>
      <SiteHeader current="games" />
      <main id="main" className="game-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Building games</Link><span>/</span><span>Wordle</span></nav>
        <header className="game-heading">
          <p className="eyebrow">Game · constrained guesses and coloured feedback</p>
          <h1>Wordle</h1>
          <p className="lede">Guess the five-letter word in six tries. Green: right letter, right place. Yellow: in the word, somewhere else. Grey: not in it.</p>
        </header>
        <Wordle />
        <aside className="game-notes">
          <h2>Remake it</h2>
          <p>Everything that makes this Wordle is in one file, <code>nextjs/lib/games/wordle.js</code>: the word length, the number of guesses, the words it picks from, whether a guess must be a real word, and how a guess is scored. Change one thing and play again.</p>
          <p>The original is Josh Wardle&apos;s <em>Wordle</em> (2021), now published by The New York Times. This copy is for study.</p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
