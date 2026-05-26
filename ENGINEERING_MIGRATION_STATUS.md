# game.js Migration Status - Batch D (Render Completion)

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. All 9 system runtimes + DevBridge + RenderRuntime installed by `src/main.js`.

## Render Migration: 100% Complete

All ~100 `render*` functions now have `RuneFrontierRenderRuntime` real implementations:

| Module | Functions | Status |
|--------|-----------|--------|
| `offlineLoot.js` | 20 | ✅ Batch 16 |
| `vipPage.js` | 1 | ✅ Batch 17a |
| `shopPage.js` | 1 | ✅ Batch 17b |
| `codexPage.js` | 4 | ✅ Batch 17c |
| `characterPage.js` | 11 | ✅ Batch 17d |
| `equipmentPage.js` | 22 | ✅ Batch 17e |
| `smithyPage.js` | 10 | ✅ Batch 17f |
| `mapPage.js` | 1 | ✅ Batch D1 |
| `cardPage.js` | 2 | ✅ Batch D2 |
| `taskPage.js` | 6 | ✅ Batch D3 |
| `logPanel.js` | 1 | ✅ Batch D4 |
| `actionButton.js` | 2 | ✅ Batch D5 |
| **Total** | **~81** | |

## Next Migration

Phase B (grouped legacy deletion): by runtime domain, delete `legacyXxx` bodies for systems where browser regression confirms the runtime works:
- Combat (39 functions)
- Drops (20 functions)
- Equipment (6 functions)
- Offline (15 functions)