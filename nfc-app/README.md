# nfc-app

Where the NFC tags land. A Next.js app that runs on the laptop and reaches phones through a Cloudflare tunnel.

```bash
pnpm install
pnpm dev      # http://localhost:3112
pnpm tunnel   # in a second terminal: prints a https://….trycloudflare.com URL
```

Six sub-apps, one per colour, live in `app/<colour>/` and are served at `/<colour>`. Each one's `APP.md` says what it is. `CLAUDE.md` tells Claude Code where things go when you work on one of them. Write a card with `../nfc-tools/write_url.py 'https://<host>/red/start'`.

A quick tunnel's URL changes every time `pnpm tunnel` restarts, so a tag written with it stops working. For tags that last, use a named tunnel on a domain in Cloudflare (`cloudflared tunnel login`, then `cloudflared tunnel create` and `route dns`), and add its hostname to `allowedDevOrigins` in `next.config.ts`.

Needs `brew install cloudflared`.
