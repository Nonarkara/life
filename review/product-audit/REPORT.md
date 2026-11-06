# Product audit · the Book's ship gate

Base: http://127.0.0.1:4219 · 2026-11-06T15:48:53.083Z

Verdict: **PASS** (0 high, 0 medium)

Auditor: the automated product audit (`scripts/audit-product.mjs`), run against the built page.
Builder ≠ auditor: the page was built by other agents; this gate walks it, and a human walk is still required.

## Measurements per viewport

| Viewport | Chrome cost | Task visibility | Geometry | Hierarchy | Preservation |
| --- | --- | --- | --- | --- | --- |
| 390 | see findings | see findings | see findings | see findings | product features intact |
| 1024 | see findings | see findings | see findings | see findings | product features intact |
| 1440 | see findings | see findings | see findings | see findings | product features intact |

## Findings

- **low** · performance · one view costs 19 requests and 2165 kB  
  {"nodes":995,"buttons":64}
- **low** · performance · frame pacing could not be measured in this browser  
  {"frames":0,"ms":3002}
- **low** · book · B1 first-screen task passes  
  [{"label":"Play","top":57},{"label":"Answer 2 questions →","top":847}]
- **low** · book · B2 chrome cost passes  
  [{"sel":"header","h":50},{"sel":".world-head","h":41},{"sel":".world-bottom","h":40},{"sel":".console-actions","h":44},{"sel":".console-nav","h":35}]
- **low** · book · B3 box fit passes  
  {"sel":"console-panel console-card","ratio":0.51,"boxH":86,"textH":168}
- **low** · book · B4 void passes  
  null
- **low** · book · B7 hierarchy passes  
  [11,12,14,16,22,24,64]
- **low** · book · B10 logos unboxed passes
- **low** · book · B13 ship basics passes  
  {"noAlt":0,"unlabelled":0,"lang":"en","viewport":"width=device-width,initial-scale=1","title":"Life choices"}

## Unverified

- The feel of motion on real hardware; only a live browser can judge it.
- Native-reader certification for Thai, Chinese, Japanese and Korean.
- Whether the history content is right: a wrong date is the real risk, and that is a human review.
- An independent human walk of B1–B18 on the built page.
