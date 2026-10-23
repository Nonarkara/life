# Independent expansion review

Inspected i18n, translations, event extraction, event graphic paths, settings CSS, game/world integration, manual source and build script. Visually inspected manual390,1440, settings-ko and game-zh-390 captures.

Manual composition succeeds as a two-page illustrated instruction spread: ordered steps, restrained line drawings, compact time controls and explicit inspiration credits. Phone stacks pages coherently. Korean settings labels/dialog and Chinese game controls fit in the inspected captures. This establishes visible fit and partial coverage, not native-speaker certification of all five languages.

Event markers are derived from history and have keyboard activation plus text ledger alternatives. Unsupported marriage/pregnancy/dengue events are not inserted into life history. The Chinese flood marker and selected detail are readable. Mood colours affect world chords rather than replacing chart values.

Two corrections requested:

1. “Chart scales stay fixed” is false for cash: charts() recomputes the cash min/max from history each render. Correct claim or make that scale fixed.
2. Selected event detail is assigned pretranslated strings. localise() then remembers that translated string as its source. A later language change rebuilds charts/ledger but does not rebuild selected event-detail, leaving it in the old language. Preserve a selected-event source and rerender on preference change, or feed English source consistently through localisation.

Text size scales reading text and many controls but canvas/chart/radar labels retain fixed sizes; do not claim universal text enlargement. Live interactive language switching and expanded-size overflow have not been independently exercised. No unconditional multilingual release approval is given before the two concrete findings close.

## Targeted corrective review

Both concrete source findings are closed: mood note now says recorded values do not change, avoiding a false fixed-scale promise; marker and ledger callbacks assign English source text, leaving localisation responsible for language changes. Parent reports a browser reproduction selecting Chinese flood detail then switching to Thai; independent review confirms the corrected source path but did not separately replay that interaction.

Inspected game-th-extra-390.png and game-ja-1024.png. Enlarged Thai text wraps within the editor and event detail without horizontal clipping; creativity wraps to two lines and its adjustment remains aligned. Thai selected flood detail is fully translated in the capture. Japanese tablet layout preserves clear rows and event ledger. The larger chart labels are legible; revised source separates value baseline76 and age labels106 in114-high viewBoxes. Health/cash zeros are close but distinguishable in the supplied Thai image.

Verdict: targeted fixes and inspected multilingual layouts pass for the bounded prototype. No native-speaker certification is claimed. Universal enlargement of all canvas labels and independent live interaction across every language remain outside verified evidence. Mood plate provenance is documented by the implementation; this review does not authenticate historical colour matching.
