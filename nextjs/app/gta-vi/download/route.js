import { buildDocument } from '../../../lib/gta-vi/document.mjs';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildDocument(), { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Disposition': 'attachment; filename="where-gta-fits.html"',
  } });
}
