# Console height release review · 28 October 2026

The first expansion was the Set points tail: a direct channel strip plus another
previous/next selector, then transfer prose and a method link. Grid stretching
made every sibling that tall. A separate saved/action footer added a second band.

The direct channel strip now owns selection. Its current label, unit, value and
result remain together. Full transfer, projection, runway, chart precision and
Ikigai qualifications are available from named header help buttons in native
reading dialogs. No source qualification was abbreviated. Ikigai labels, bar and
value share one row. Text sizes are preserved. One real advance action moves into
the last instrument on wide Priorities views; it returns to the permanent footer
for Profile, Questions, phone, non-review states or a save error. Its identity,
handler and keyboard focus survive redraw and breakpoint changes.

## Evidence

The before files come from the previously verified release b02dbd45afdc, retained
age-55 life at 1440×900. Current captures use the same life and final build
 d62ccb2bf959. No period was advanced in that save.

| Measurement | Before | After |
|---|---:|---:|
| Instrument row | 237.77px | 184.73px |
| Combined lower region | 367.77px | 221.23px |
| World height | 483.73px | 630.27px |
| Separate action footer | 43.5px | 0px |

The bar ends at viewport y=900; the single advance action ends at894 with inner
padding. At1280×720, the bar ends at720 and the active value/result/action fit.
Tablet1024×768 and phone390×844 retain a visible fallback action; the initial
edit and result fit. Native Thai enlarged text and Japanese phone captures retain
full reading access. Profile returns the action to its permanent footer.

`current.html` and `restored.html` are inert DOM snapshots with scripts removed.
The restored case reinstates the redundant selector/prose and separate footer;
it is a controlled restoration, not a byte-identical old release. It expands
the bar to255.42px and fails the same20%-reduction budget that the184.73px current
case passes. `restored-proof.json` records both measurements.

228 tests pass. `check-console-height.mjs` passes six viewport/text cases,
Profile fallback, one-action identity and focus evidence plus restored-failure
proof. The new unit test protects reparenting before dynamic root replacement
and fallback on save failure. Diff whitespace checks pass. Live publication
receipts will be recorded separately. Hardware performance and player testing
are outside this layout correction.

Independent review: manga_audit cleared final text-preserving captures for
d62ccb2bf959: 22.3% shorter row,146.55px world gain, readable unchanged text,
visible integrated/fallback actions and full help access. Independently reran
the six-case geometry gate and restored-failure rejection. No scope blocker.
