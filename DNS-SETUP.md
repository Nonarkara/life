# life.nonarkara.org — hosting

Hosting: Cloudflare Pages project `life` (production branch `main`), serving `out/`
from `npm run build`. Live at https://life-5wz.pages.dev (deployed 24 October 2026).
Custom domain `life.nonarkara.org` is attached to the Pages project (status
`initializing`). It needs one proxied DNS record in the nonarkara.org zone:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | life | life-5wz.pages.dev | on |

Wrangler's OAuth login cannot write DNS (it only offers `zone:read`), so this
record needs a DNS-edit API token or the owner.

Deploy:

    npm test && npm run build && wrangler pages deploy out --project-name life --branch main

The earlier OpenAI Sites binding (October 2026) never went live and was removed on
24 October 2026. No DNS records for it exist.
