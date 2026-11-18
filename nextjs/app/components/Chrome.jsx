import Link from "next/link";
import { getRoot, site } from "../../lib/content.mjs";

// The site's sections, in order. Each is a folder in content/; the header links the ones that have something in them.
// The home page (app/route.js) is the GTA VI launch tracker, which links the same four below the map.
export const sections = [
  { slug: "why", title: "Why?", copy: "Why games, and why this week" },
  { slug: "elements", title: "Elements", copy: "What a game is made of: the tetrad, the mechanics, the technology" },
  { slug: "games", title: "Building games", copy: "What a game engine is, and small games you can build without one" },
  { slug: "final-project-and-portfolio", title: "Final project", copy: "The project, the portfolio & the dates" },
];

export async function SiteHeader({ current = "" }) {
  const ready = new Set((await getRoot()).folders.map((folder) => folder.slug));
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        {sections.filter(({ slug }) => ready.has(slug)).map(({ slug, title }) => <Link key={slug} href={`/${slug}`} aria-current={current === slug ? "page" : undefined}>{title}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span>{site.term}</span>
    </footer>
  );
}
