import { writeFile } from 'node:fs/promises';
import { sources } from './data.mjs';

const checks = [];
for (let start = 0; start < sources.length; start += 5) {
  checks.push(...await Promise.all(sources.slice(start, start + 5).map(async ({ id, url }) => {
    const checkedAt = new Date().toISOString();
    try {
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(18000), headers: { 'User-Agent': 'TDM155AI educational source link check (no authentication)' } });
      await response.body?.cancel();
      return { id, url, status: response.status, finalUrl: response.url, checkedAt };
    } catch (error) {
      return { id, url, status: null, error: String(error.cause?.code || error.message), checkedAt };
    }
  })));
}
await writeFile(new URL('./source-status.json', import.meta.url), JSON.stringify(checks, null, 2) + '\n');
console.log(checks.map(({ id, status, error }) => `${id}: ${status ?? error}`).join('\n'));
