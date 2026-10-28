# Art handoff disposition · 28 October 2026

Later integration correction (232e589): a frame named in the allowlist was
still clipped by rule detection. The elder-x walking face/hand/cane is repaired
from the approved source; its three sibling poses remain byte-identical. Missing
catalogue approval metadata now aborts before decoding or batch writes. Approval
listing alone is not proof of visual quality. See
[the integration review](../review/integration-oct28/REVIEW.md).

The local FLUX model is an offline authoring tool, not a dependency of the web
game. It needed the illustration LoRA named explicitly, because in this build
`--lora-style` is inert on FLUX.1-schnell and `--negative-prompt` is ignored:

    mflux-generate --model schnell --steps 4 \
      --lora "ali-vilab/In-Context-LoRA:portrait-illustration.safetensors" \
      --width 2016 --height 864 --prompt-file <file>.txt --output <file>.png

At 4 steps with that LoRA a plate takes about 110 seconds and reaches the
published standard: 21:9, no lettering, no signature, no people. The driver is
`scripts/generate-missing-art.sh`; it writes only into `scratch/anime/candidates`,
atomically, and skips a file that is already a valid image.

The 46-request catalogue is now a batch, not a wish list. The MiniMax connector
made eighteen character sheets, and the local model made the plates. Every sheet
was reviewed before promotion and every promoted frame is named in
`art/frame-approvals.json`, which is the publication allowlist: a frame that is
not listed is not written, so a rejected frame cannot reactivate on a rebuild.

Three things had to be taught to the cutter, each one measured in the drawings
rather than guessed:

- A sheet the model drew as one row of four has neighbours leaning into each
  panel, so the panel keeps only the figure that owns it. The grandmother's
  pot, which is her own, is kept with her.
- A walk cycle the model drew with the second stride facing the other way is
  turned, so the character never turns mid-step.
- The grandmother sheet holds a fifth figure, a child, under her third pose.
  Her crouching pose is withheld: the rule-removal pass mangles it. She is
  published with the three poses that cut cleanly, and a life that needs the
  fourth keeps its 3D fallback.

The grandmother's sheet and the rival's sheet were both reviewed frame by frame;
the rival's panels originally carried a neighbour's forearm, which the
figure-only cut removed.

Reproduce a single sheet: `python3 scripts/prepare-anime-assets.py player-m`.
Reproduce the plates: `python3 scripts/prepare-anime-assets.py plates`.
A successful model download is not an art-quality approval; a candidate is only
promoted after it has been looked at.
