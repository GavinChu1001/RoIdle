# game.js Migration Status - Batch 17a+17b

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js` which installs 9 module runtimes, the DevBridge, loot/VIP/shop render runtimes, and boots the classic runtime.

## Formalized In This Batch

### VIP Page Renderer
- `src/ui/vipPage.js` rewritten from delegation wrapper to real implementation (77 lines).
- `renderVip` generates full HTML string using context-injected VIP calculation functions, format helpers, and state access.
- Installed as `RuneFrontierRenderRuntime.renderVip` — game.js delegation bridge automatically picks it up.
- DOM write (`els.vipPanel.innerHTML`) handled by the module via context-injected state.

### Shop Page Renderer
- `src/ui/shopPage.js` rewritten from delegation wrapper to real implementation (45 lines).
- `renderShop` generates full HTML string + writes to `els.shopContent.innerHTML` via context-injected DOM elements.
- Installed as `RuneFrontierRenderRuntime.renderShop`.

### Render Runtime Status
- `RuneFrontierRenderRuntime` now provides real implementations for: 20 loot functions + `renderVip` + `renderShop` = 22 functions total.
- Remaining ~73 render functions still fall through to game.js legacy bodies.

## Deliberately Retained

- Codex (4), Character (11), Equipment (20), Smithy (16), Map (1), Card (2), Task (6), Log (1), Advice (2) renderers still in game.js.
- `renderOfflineRewardModal` (DOM-dependent modal toggle) in game.js.
- 78 `legacyXxx` fallback bodies.

## Next

Batch 17c: Codex page renderer (4 functions).