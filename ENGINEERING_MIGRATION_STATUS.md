# game.js Migration Status - Batch 13

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js` which installs 8 module runtimes and boots the classic runtime.

## Formalized In This Batch

### State Persistence Delegation
- `load()`, `save()`, `mergeState()`, `sanitizeProgression()`, `createDefaultState()`, `resetSave()` now delegate to `RuneFrontierStateRuntime`. Legacy bodies retained as fallback.
- `RuneFrontierLegacyStateContext` created — exposes state, save/load, auth helpers for future module migration.

### Configuration Table Authority Annotations
All 7 `RuneFrontierLegacy*Context` objects annotated with `[AUTHORITY]` comments listing:
- **Module-owned** config tables (runtime has real implementation)
- **Deferred** config tables (still authoritative in game.js data section, lines 1-3162)

See `game.js` lines ~13972-14547 for complete authority inventory.

### Event Bridge Audit
`bindEvents()` (line 3291) annotated with `[BRIDGE]` comment cataloging all 40+ event listeners:
- **Delegated callbacks** (18): challengeBoss, claimOffline, refineItem, renderAll, salvageItem, enhanceItem, buyShopItem, claimCodexReward, etc.
- **Non-delegated callbacks** (12): openOfflineRewardModal, closeRefineResultModal, showToast, punchCardSlot, setAutoBossEnabled, etc. — all presentation/DOM-bound.

## Deliberately Retained In game.js

- All legacy function bodies (77 `legacyXxx` + ~310 non-delegated) — deferred to Batch 14.
- All data/config tables (lines 1-3162) — module-owned but not yet extracted to classic data script.
- All battle presentation callbacks (DOM/canvas-bound).
- The main loop (`loop()`).
- `bindEvents()` and all DOM-dependent event handlers.

## Next Migration Order

1. **Batch 14**: Delete legacy fallback bodies. Remove 77 `legacyXxx` functions. Replace inline fallback code with minimal stubs. Reduce game.js from 14,600+ to target entry-file size.
2. **Batch 14b**: Extract data/config tables to classic `data.js` script (loads before game.js in index.html). Save ~3,000 additional lines.
3. **Batch 14c**: Full regression testing, `npm run check`, `npm run test`, browser validation.