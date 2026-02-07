Hono starter — run notes

- Install dependencies: `npm install`
- Cloudflare Wrangler required for the provided scripts.
  - Install: `npm install -g wrangler`
  - Authenticate: `wrangler login`
- Run in development (Cloudflare Workers local dev):
  - `npm run dev`  # runs `wrangler dev`

If you don't want to use Wrangler, run a local server using Cloudflare Workers runtime alternatives or add a Node adapter. The `wrangler.toml` file is present to help `wrangler dev` pick the correct entry file.
