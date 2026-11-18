import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import Semantle from "./Semantle.jsx";
import "../games.css";

export const metadata = {
  title: "Semantle",
  description: "Guess the hidden word by meaning: every guess is scored by how close its word vector sits to the hidden word's.",
};

// The page is a frame; the game is Semantle.jsx, and the hidden words and scoring are in lib/games/semantle.js.
export default function SemantlePage() {
  return (
    <>
      <SiteHeader current="games" />
      <main id="main" className="game-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Building games</Link><span>/</span><span>Semantle</span></nav>
        <header className="game-heading">
          <p className="eyebrow">Game · a similarity score instead of letters</p>
          <h1>Semantle</h1>
          <p className="lede">Find the hidden word. Spelling doesn&apos;t help here: each guess gets a score for how close it is in meaning, and the guesses closest in meaning get a rank out of 1,000.</p>
        </header>
        <Semantle />
        <aside className="game-notes">
          <h2>What the score means</h2>
          <p>Each word is a list of 100 numbers (a word vector), learned from which words appear near each other in billions of words of text, so words used in similar places end up pointing in similar directions. The score is the cosine similarity of your guess&apos;s vector and the hidden word&apos;s, times 100: 100 is the word itself, and anything near 0 is unrelated.</p>
          <p>The model doesn&apos;t look things up in a dictionary. It knows words only from where they turn up, which is why some of its &quot;close&quot; words feel odd. Language models work with vectors much like these, so the game gives you a feel for how a computer handles meaning.</p>
          <h2>Remake it</h2>
          <p>The hidden words, what counts as close, and the scoring are in <code>nextjs/lib/games/semantle.js</code>. The vectors are GloVe (Stanford NLP, 6 billion words, 100 dimensions, public domain), cut to the 15,000 most common words by <code>nextjs/lib/games/build-word-files.mjs</code>, so the game runs with no API key. The original <em>Semantle</em> is David Turner&apos;s (2022), which uses word2vec vectors; its scores run differently from these.</p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
