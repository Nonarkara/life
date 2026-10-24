# life.nonarkara.org — hosting

Hosting: Cloudflare Pages project `life` (production branch `main`), serving `out/`
from `npm run build`. Custom domain `life.nonarkara.org` is attached to that Pages
project; the nonarkara.org zone is in the same Cloudflare account, so Pages adds the
CNAME itself.

Deploy:

    npm test && npm run build && wrangler pages deploy out --project-name life --branch main

The earlier OpenAI Sites binding (October 2026) never went live and was removed on
24 October 2026. No DNS records for it exist.
