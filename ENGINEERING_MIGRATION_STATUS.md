# game.js Migration Status - Batch 15 + Live DevBridge Fix

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
- Created `src/dev/devBridge.js` (ES module) exporting the `createDevBridge(context)` factory function.
- `src/main.js` imports and installs `window.RuneFrontierDevBridge` in DEV_MODE, with full maintenance actions (migrate, clear-log, clear-recent-loot, render, save).
- Removed 74 lines of DevBridge definition from `game.js`.
- `selfCheck.js` and `debugPanel.js` continue to access `window.RuneFrontierDevBridge` with unchanged API contract.

### DevBridge Live-State Fix
- Added `window.RuneFrontierLegacyDevContext()` as the only diagnostics adapter into the current classic runtime state.
- `createDevBridge(context)` now calls dynamic getters for every snapshot and maintenance action; it no longer captures `window.state || {}`.
- Restored full self-check snapshot inputs: maps, drop tables, material names/database, inventory limit, VIP progress, player critical-rate cap, and API presence.
- `src/main.js` now installs the DevBridge before importing the debug panel, preventing the panel from silently skipping mount due to load ordering.
- Diagnostic maintenance remains development-only and operates on the currently loaded state object after login, load, or reset.

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
| `game.js` current | 13,697 lines | (includes live diagnostics adapter; was 13,780 before Batch 15) |

## Next Migration Order

The offline reward runtime already owns offline calculation, reward category rolls, claim settlement, and pending-equipment handling in `src/systems/offline.js`. Do not repeat that migration.

Next recommended batch:
1. Establish a real `RuneFrontierRenderRuntime` installation path.
2. Migrate the loot/offline modal renderer first, because it has stable normalized data and previously caused blank-content regressions.
3. Then migrate compact pages in order: VIP, Shop, Codex, Character, Equipment/Smithy.
