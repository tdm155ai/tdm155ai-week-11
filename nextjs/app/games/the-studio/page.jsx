import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import TheStudio from "./TheStudio.jsx";
import "../games.css";

export const metadata = {
  title: "The Studio",
  description: "A text game that grows: write, hire help, and find 100 readers, with the story told a line at a time.",
};

// The page is a frame; the game is TheStudio.jsx, and the resources, actions and story are in lib/games/the-studio.js.
export default function TheStudioPage() {
  return (
    <>
      <SiteHeader current="games" />
      <main id="main" className="game-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Building games</Link><span>/</span><span>The Studio</span></nav>
        <header className="game-heading">
          <p className="eyebrow">Game · click, then automate, then unlock</p>
          <h1>The Studio</h1>
          <p className="lede">Get 100 people to read your work. Write words by hand, turn them into pages, hire scribes to write for you, and share pages to find readers. The story arrives a line at a time.</p>
        </header>
        <TheStudio />
        <aside className="game-notes">
          <h2>Where it comes from</h2>
          <p>Games like this are called incremental (or idle) games. Two well-known ones are text games: <a href="https://adarkroom.doublespeakgames.com/">A Dark Room</a> (Michael Townsend, Doublespeak Games, 2013), which starts with a single button to light a fire and slowly becomes a world, and <a href="https://www.decisionproblem.com/paperclips/">Universal Paperclips</a> (Frank Lantz, 2017), in which you play an AI told to make paperclips. Both are free to play in the browser. Neither needs pictures: numbers, buttons and a few well-timed sentences are enough.</p>
          <h2>Where AI would plug in</h2>
          <p>Every story line passes through one function, <code>narrate()</code> in <code>nextjs/lib/games/the-studio.js</code>. Today it returns the line written in the file, so the game runs with no key. To add AI, change <code>narrate()</code> to send the line and the current state to a model, through a server route that keeps the key off the page, and show the line the model writes back. The story would then be told differently each time, and could answer what you did.</p>
          <h2>Remake it</h2>
          <p>Everything else is in the same file: the goal, what you make, what each action costs and does, when each button unlocks, what happens on its own every second, and the story lines. Change what the studio makes (a lab&apos;s results, a podcast&apos;s episodes, a city&apos;s buildings), or add a step between pages and readers.</p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
