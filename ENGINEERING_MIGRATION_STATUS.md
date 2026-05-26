# game.js Migration Status - Batch 17c

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js`.

## Formalized In This Batch

### Codex Page Renderer
- `src/ui/codexPage.js` rewritten from delegation wrapper to real implementation (143 lines).
- `renderCodex`, `renderMonsterCodex`, `renderCardCodex`, `renderCodexBonusesSummary` now execute through `RuneFrontierRenderRuntime`.
- Full context injection for: codex data tables (milestones, rewards, thresholds), calculation functions (bonuses, mastery, research), lookup functions (name map, source map, card drop map), and format helpers.

### Render Runtime Progress
| Module | Functions | Status |
|--------|-----------|--------|
| `offlineLoot.js` | 20 | ✅ Batch 16 |
| `vipPage.js` | 1 | ✅ Batch 17a |
| `shopPage.js` | 1 | ✅ Batch 17b |
| `codexPage.js` | 4 | ✅ Batch 17c |
| **Total** | **26** | of ~100 render functions |

## Deliberately Retained In game.js

- Character (11), Equipment (20), Smithy (16), Map (1), Card (2), Task (6), Log (1), Advice (2) — ~59 renderers.
- `renderOfflineRewardModal` (DOM-dependent modal toggle).
- 78 `legacyXxx` fallback bodies.

## Next

Batch 17d: Character page (11 functions).