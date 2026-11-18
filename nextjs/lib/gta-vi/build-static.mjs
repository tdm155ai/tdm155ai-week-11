import { writeFile } from 'node:fs/promises';
import { buildDocument } from './document.mjs';

const html = buildDocument();
await writeFile(new URL('../../app/gta-vi/where-gta-fits.html', import.meta.url), html);
console.log(`Saved where-gta-fits.html (${Buffer.byteLength(html)} bytes)`);
