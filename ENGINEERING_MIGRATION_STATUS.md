# game.js Migration Status - Batch 17 Complete

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js`.

## Batch 17 Summary — All 6 Pages Migrated

| Sub-batch | Page | Functions | Module |
|:--:|------|:--:|------|
| 17a | VIP | 1 | `vipPage.js` |
| 17b | Shop | 1 | `shopPage.js` |
| 17c | Codex | 4 | `codexPage.js` |
| 17d | Character | 11 | `characterPage.js` |
| 17e | Equipment | 22 | `equipmentPage.js` |
| 17f | Smithy | 10 | `smithyPage.js` |
| **17 Total** | | **49** | |

### Render Runtime Completion
`RuneFrontierRenderRuntime` now provides real implementations for:
- Loot (20) + VIP (1) + Shop (1) + Codex (4) + Character (11) + Equipment (22) + Smithy (10) = **69 functions**

Remaining ~31 render functions (Map 1, Card 2, Task 6, Log 1, Advice 2, presentation helpers ~19) still fall through to game.js legacy bodies.

## Next Migration Order

Per roadmap: Batch 18 — Event delegation & window bridge cleanup.
Per roadmap: Batch 19 — Delete fallback bodies & final entry-file slimming.