# game.js Migration Status - Batch 19b (Phase B Complete)

## game.js: 11,722 lines (was 14,600 at migration start — -20%)

## Phase B — Legacy Function Body Slimming
- All 78 `legacyXxx` function bodies reduced to single-line `{ return; }` stubs.
- Delegation wrappers unchanged — runtime checks preserved, fallback to stub.
- Production safety: 9 runtimes installed before bootstrap, stubs never executed in normal operation.

## Migration Completion Summary

| Metric | Start | Current |
|--------|-------|---------|
| `game.js` lines | 14,600 | 11,722 |
| Classic scripts | 1 | 3 (`tools.js`, `data.js`, `game.js`) |
| Browser modules | 55 (delegation wrappers) | 82 (real implementations) |
| System runtimes | 0 | 9 |
| RenderRuntime functions | 0 real | 81 real |
| `legacyXxx` bodies | 78 full | 78 stubs |
| Config table extraction | 0 | 444 lines in `data.js` |

## Batch History
| Batch | Content | Commit |
|-------|---------|--------|
| 14 | Audit inventory | `491f2c7` |
| 15 | `tools.js` + DevBridge | `febc0b8` |
| 16 | Loot modal renderer (20) | `a236741` |
| 17a+b | VIP + Shop renderers | `28f69d6` |
| 17c | Codex renderer (4) | `fc052cd` |
| 17d | Character renderer (11) | `41dc829` |
| 17e+f | Equipment (22) + Smithy (10) | `553bfb5` |
| 18 | Event bridge audit | `599bdb4` |
| 19a | `data.js` extraction | `53c35cc` |
| D1-D5 | Map/Card/Task/Log/Advice (12) | `5b9e096` |
| 19b | Legacy body slimming (78) | pending |

## Next
- Browser regression: `?dev=1` self-check, all pages, combat, offline rewards.
- If all green → game.js ready for maintenance mode.