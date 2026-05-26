# game.js Migration Status - Batch 19a

## game.js: 13,268 lines (was 14,600 at migration start)

## Data Table Extraction Complete
- Created `data.js` (444 lines, classic script): top-level config constants extracted from game.js.
- `index.html` loads `data.js` BEFORE `game.js` — `var` declarations create `window` properties accessible as bare names.
- game.js reduced by 394 lines (13,662 → 13,268).
- All `legaacyXxx` bodies still retained as fallback (78 functions).

## Loading Order (Final)
```
tools.js      (78 lines, classic) — 13 utility functions
data.js       (444 lines, classic) — config constants
src/main.js   (module, deferred)   — 9 runtimes + DevBridge
game.js       (classic)            — entry skeleton + runtime delegates + LegacyContexts
```

## Remaining Legacy Bodies
78 `legaacyXxx` functions (~3,500 lines) retained as startup-safety fallback. Deletion deferred to Batch 19b when browser regression can verify all 69 RenderRuntime functions and 9 system runtimes work correctly in production.

## Module Inventory
- Classic scripts: `tools.js`, `data.js`, `game.js`
- Browser modules: 82
- Runtime modules: 9 (`Equipment`, `Drops`, `Offline`, `Combat`, `Vip`, `Codex`, `Shop`, `State`, `Render`)
- LegacyContext bridges: 8
- RenderRuntime real implementations: 69 functions