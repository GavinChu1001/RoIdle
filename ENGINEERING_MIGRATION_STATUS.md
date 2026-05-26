# game.js Migration Status - Batch 18

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime.

## Formalized In This Batch

### Event Bridge — bindEvents() Audit (~40 handlers)

All handlers categorized:

**Direct function references (inline callbacks):** 17
`challengeBoss`, `setAutoBossEnabled`, `openOfflineRewardModal`, `closeOfflineRewardModal`, `claimOffline`, `closeRefineResultModal`, `resetSave`, `submitAuth`, `logout`, `renderAll`, `addLog`, `trainBase`, `equipBest`, `salvageAllUnequipped`, `refineItem`, `showToast`, `punchCardSlot`, `canContinueRefine`

**data-action delegation (already correct pattern):** 23
`data-equip-item`, `data-salvage-item`, `data-refine-item`, `data-empower-item`, `data-lock-item`, `data-collect-zodiac`, `data-zodiac-salvage`, `data-punch-card-slot`, `data-socket-card`, `data-remove-socket-card`, `data-equipment-filter`, `data-equipment-sort`, `data-auto-salvage-*`, `data-map`, `data-claim-codex`, `data-buy-shop`, `data-shop-tab`, `data-codex-tab`, `data-smithy-tab`, `data-craft-set`, `data-darkgold-exchange`, `data-synthesize-boss-card`, `data-awaken-card`

### Window Bridge Inventory

**Required (runtime bootstrap):**
| Symbol | Purpose |
|--------|--------|
| `window.bootstrapLegacyRuntime` | Classic runtime init gate |
| `window.RuneFrontierDevBridge` | Dev diagnostics (selfCheck.js, debugPanel.js) |
| `window.RuneFrontierEquipmentRuntime` | Equipment module runtime |
| `window.RuneFrontierDropsRuntime` | Drops module runtime |
| `window.RuneFrontierOfflineRuntime` | Offline module runtime |
| `window.RuneFrontierCombatRuntime` | Combat module runtime |
| `window.RuneFrontierVipRuntime` | VIP module runtime |
| `window.RuneFrontierCodexRuntime` | Codex module runtime |
| `window.RuneFrontierShopRuntime` | Shop module runtime |
| `window.RuneFrontierStateRuntime` | State persistence bridge |
| `window.RuneFrontierRenderRuntime` | Render module runtime |
| `window.RuneFrontierLegacyEquipmentContext` | Equipment data-table bridge |
| `window.RuneFrontierLegacyDropsContext` | Drops data-table bridge |
| `window.RuneFrontierLegacyOfflineContext` | Offline data-table bridge |
| `window.RuneFrontierLegacyCombatContext` | Combat data-table bridge |
| `window.RuneFrontierLegacyVipContext` | VIP data-table bridge |
| `window.RuneFrontierLegacyCodexContext` | Codex data-table bridge |
| `window.RuneFrontierLegacyShopContext` | Shop data-table bridge |
| `window.RuneFrontierLegacyStateContext` | State data-table bridge |
| `window.RuneFrontierModuleStatus` | Module migration metadata |

**Tools (from tools.js, loaded before game.js):**
| Symbol | Purpose |
|--------|--------|
| `window.formatNumber` etc. (13 functions) | Authoritative utility functions |

**No explicit window.xxx assignments removed.** Game.js uses classic script global scope — all top-level functions are implicitly global. Explicit assignments only for bridge objects.

## Deliberately Retained

- All bindEvents() handlers kept as-is (changing to data-action delegation would risk button breakage without browser verification).
- Direct function references continue to work because game.js is a classic script.
- No function bodies removed from game.js (deferred to Batch 19).

## Batch 18 Completion

Event audit complete. Confirmed: all runtime bridges properly exposed, no unused window.xxx assignments to clean up. The next meaningful work is Batch 19 — deleting legacy bodies and slimming game.js.