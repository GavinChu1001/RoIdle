# game.js Migration Status - Batch 15

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js` which installs 9 module runtimes, the DevBridge, and boots the classic runtime.

## Formalized In This Batch

### Tool Function Unification
- Created `tools.js` (classic script, 78 lines) containing 13 authoritative utility functions (`formatNumber`, `formatDuration`, `percent`, `formatSignedPercent`, `formatDropRate`, `clampNumber`, `escapeAttr`, `escapeHtml`, `randomFloat`, `randomInt`, `randomPick`, `weightedChoice`, `lerpRange`).
- `tools.js` loads before `game.js` in `index.html`, ensuring all scripts share one authoritative source.
- Removed 12 duplicate function bodies from `game.js` bottom (56 lines eliminated).
- `src/utils/format.js` and `src/utils/math.js` converted from authoritative implementations to read-only window delegates — they now read from the canonical `window.*` versions set by `tools.js`.
- `formatDuration` behavioral difference resolved: unified to game.js original (分钟以上不显示秒).

### DevBridge Extraction
- Created `src/dev/devBridge.js` (ES module) exporting `createDevBridge({ state, ... })` factory function.
- `src/main.js` imports and installs `window.RuneFrontierDevBridge` in DEV_MODE, with full maintenance actions (migrate, clear-log, clear-recent-loot, render, save).
- Removed 74 lines of DevBridge definition from `game.js`.
- `selfCheck.js` and `debugPanel.js` continue to access `window.RuneFrontierDevBridge` with unchanged API contract.

### Loading Order (index.html)
```
tools.js      (classic, immediate — authoritative utility functions)
src/main.js   (module, deferred  — installs runtimes + DevBridge)
game.js       (classic, immediate — references window.* from tools.js)
```

### File Summary
| File | Change | Lines |
|------|--------|-------|
| `tools.js` | NEW | 78 |
| `src/dev/devBridge.js` | NEW | 56 |
| `index.html` | modified | +1 script tag |
| `game.js` | modified | -130 lines (tools 56 + DevBridge 74) |
| `src/utils/format.js` | rewritten | 47→16 |
| `src/utils/math.js` | rewritten | 42→16 |
| `src/main.js` | modified | +10 |
| `scripts/test.mjs` | modified | 1 assertion updated |
| `game.js` current | 13,662 lines | (was 13,780) |

## Next Migration Order

Per roadmap: Batch 16 — Offline orchestration & loot UI migration.