import { buildTracker } from '../../../lib/gta-vi/tracker.mjs';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildTracker(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
