import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import Fps from "./Fps.jsx";
import "../games.css";
import "./fps.css";

export const metadata = {
  title: "Target practice",
  description: "A tiny first-person shooter made with three.js and no game engine: walk, look, and hit as many targets as you can before the clock runs out.",
};

// The page is a frame; the game is lib/games/fps/game.js, and the numbers to change are in lib/games/fps/rules.js.
export default function FpsPage() {
  return (
    <>
      <SiteHeader current="games" />
      <main id="main" className="game-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><span>Target practice</span></nav>
        <header className="game-heading">
          <p className="eyebrow">Game · first person, made without a game engine</p>
          <h1>Target practice</h1>
          <p className="lede">Walk around a room and hit the floating targets before the clock runs out. Click Start, then use the mouse to look, W A S D to move, Space to jump, and click to shoot.</p>
        </header>
        <Fps />
        <aside className="game-notes">
          <h2>What to change</h2>
          <p>All the numbers are in one short file, <code>nextjs/lib/games/fps/rules.js</code>: the time limit, how many targets there are, how big they are, how fast you walk, how high you jump, how fast the targets float and drift, how big the room is, and the colours. Change one, save, and play again.</p>
          <h2>No game engine</h2>
          <p>Unity, Unreal, and Godot give you a game loop, controls, physics, and collisions ready-made. This game has none of that. It uses three.js, a library that only draws 3D shapes in the browser, and the rest is written out in <code>nextjs/lib/games/fps/game.js</code>, about 200 lines with a comment on each part: the loop that runs about sixty times a second, walking and looking, the invisible line that decides whether a shot hits, the score, and the clock.</p>
          <p>To go further, ask Claude to add one thing at a time: walls to hide behind, targets that run away, a sound when you hit, a second level. Each one is a mechanic.</p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
