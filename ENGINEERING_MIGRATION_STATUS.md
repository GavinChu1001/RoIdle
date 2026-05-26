# game.js Migration Status - Batch 16

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js` which installs 9 module runtimes, the DevBridge, the loot render runtime, and boots the classic runtime.

## Formalized In This Batch

### Offline Orchestration Verification
- `calculateOfflineRewards` in `src/systems/offline.js` confirmed as real runtime-owned implementation (completed in Batch 8).
- All offline material/card/zodiac/transition/mythic/mutation drop roll functions confirmed as real runtime implementations.
- `buildOfflineMonsterStats` and `estimateMapAverageMonsterHp` confirmed as real runtime implementations.

### Loot Modal Rendering Migration
- Created `src/ui/offlineLoot.js` (203 lines) with real HTML-generating implementations of 20 loot modal render functions.
- `installLootRenderRuntime(context)` installs these onto `RuneFrontierRenderRuntime`, merging with existing entries if any.
- `src/main.js` imports and installs the loot render runtime with a context providing `formatNumber`, `formatDuration`, `escapeHtml`, `renderItemName`, `rarityName`, material DB access, and helper functions.
- All 20 loot render functions in `game.js` now find their runtime implementations via existing `RuneFrontierRenderRuntime` delegation bridges — no game.js changes needed for these functions.
- `renderOfflineRewardModal` retained in game.js as DOM-dependent modal visibility toggle.

### Module Count
- 82 browser modules (was 81 — new `offlineLoot.js`).

## Deliberately Retained In game.js

- `renderOfflineRewardModal` (DOM-dependent modal toggle).
- Legacy `legacyXxx` function bodies (78 remaining).
- All other page renderers (Character/Equipment/Smithy/Codex/VIP/Shop/Map/Card/Task/Log).
- Battle presentation callbacks (DOM/canvas-bound).
- The main loop (`loop()`).
- Save/auth implementation and `window` action interfaces.

## Next Migration Order

Per roadmap: Batch 17 — Page renderers (VIP → Shop → Codex → Character → Equipment → Smithy).