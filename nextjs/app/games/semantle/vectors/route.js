import { readFile } from "node:fs/promises";
import path from "node:path";

// Semantle's vocabulary and word vectors, from the files lib/games/build-word-files.mjs wrote. The browser fetches this
// once and does all the scoring itself; the vectors (100 signed bytes per word) travel as base64.
export async function GET() {
  const dir = path.join(/* turbopackIgnore: true */ process.cwd(), "lib", "games");
  const [words, vectors] = await Promise.all([
    readFile(path.join(dir, "semantle-words.json"), "utf8"),
    readFile(path.join(dir, "semantle-vectors.bin")),
  ]);
  return Response.json({ ...JSON.parse(words), vectors: vectors.toString("base64") }, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
