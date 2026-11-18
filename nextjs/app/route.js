import { buildTracker } from "../lib/gta-vi/tracker.mjs";

// The home page is this week's live map, the GTA VI launch tracker (also at /gta-vi/tracker), with the site's
// sections linked below it. It is a whole HTML document built in lib/gta-vi/, so it is served as is.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildTracker(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
