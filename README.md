# Life / A world grows around you

A dependency-free playable life-course prototype. Current version: `dist/course/`.

Begin with a close family view. Childhood runs without choices until 10 at 2×, 3×, 10× or 20×. At 10 allocate ten fictional starting-attribute points. Revisit ten effort points and personal goals every five years. Adult habits and relationship values unlock at 20. Physical condition, wellbeing and cash histories persist. An early end is possible; surviving to 80 is not guaranteed. Replay the same scenario to compare paths.

The world has persistent geometry. Its camera widens with age; institutions form a metaphorical neighborhood. Original attributes retain modest mechanical effects after effort changes. Religion and intimacy are labeled expressive choices, recorded in the recap without a universal morality bonus.

All numbers and probabilities are authored game rules, not validated Thai statistics, psychological tests, health advice or financial forecasts. Historic crises, investments, detailed relationships, clinical disease models and finished art are outside this prototype. Two household backgrounds and a small event set demonstrate the structure; they do not represent Thai population distributions.

## Run

`npm run dev`, then visit `http://localhost:4187/course/`. Run `npm test` for simulation and geometry checks.

## Layout

- `sim.js`: deterministic state transitions, ten-point conservation, age locks and validation.
- `layout.js`: shared furniture bounds and parent walk routes.
- `world.js`: projected world, infancy framing and symbolic course map.
- `game.js`: one time controller, keyboard-operable profile controls, radar and resource charts.
- `review/course/`: visual evidence and independent review, including unresolved verification limits.

The rejected first prototype remains in `dist/` for preservation. The build copies the current course to `out/`; hosting serves that output, not the rejected screen. No AI-generated artwork, copied game assets, paid API or backend service is used. Jost loads from Google Fonts.
