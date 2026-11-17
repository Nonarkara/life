# Product audit · the Book's ship gate

Base: http://127.0.0.1:4222 · 2026-11-17T10:11:55.700Z

Verdict: **REVISE** (0 high, 1 medium)

Auditor: the automated product audit (`scripts/audit-product.mjs`), run against the built page.
Builder ≠ auditor: the page was built by other agents; this gate walks it, and a human walk is still required.

## Measurements per viewport

| Viewport | Chrome cost | Task visibility | Geometry | Hierarchy | Preservation |
| --- | --- | --- | --- | --- | --- |
| 390 | see findings | see findings | see findings | see findings | product features intact |
| 1024 | see findings | see findings | see findings | see findings | product features intact |
| 1440 | see findings | see findings | see findings | see findings | product features intact |

## Findings

- **medium** · performance · one view costs 23 requests and 12182 kB  
  {"nodes":1178,"buttons":110}
- **low** · performance · frame pacing could not be measured in this browser  
  {"frames":0,"ms":3002}
- **low** · book · B1 first-screen task passes  
  [{"label":"Play","top":4},{"label":"Answer 1 question →","top":732}]
- **low** · book · B2 chrome cost passes  
  [{"sel":"header","h":37},{"sel":".world-bottom","h":40},{"sel":".console-nav","h":35}]
- **low** · book · B3 box fit passes  
  {"sel":"console-panel console-card","ratio":0.12,"boxH":167,"textH":1365}
- **low** · book · B4 void passes  
  {"from":876,"to":888}
- **low** · book · B7 hierarchy passes  
  [11,12,14,15,16,24,64]
- **low** · book · B10 logos unboxed passes
- **low** · book · B13 ship basics passes  
  {"noAlt":0,"unlabelled":0,"lang":"en","viewport":"width=device-width,initial-scale=1","title":"Life choices"}

## Unverified

- The feel of motion on real hardware; only a live browser can judge it.
- Native-reader certification for Thai, Chinese, Japanese and Korean.
- Whether the history content is right: a wrong date is the real risk, and that is a human review.
- An independent human walk of B1–B18 on the built page.
