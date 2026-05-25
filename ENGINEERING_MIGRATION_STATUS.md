# game.js Migration Status - Batch 3

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime in this batch. Startup ownership is now held by `src/main.js`: it installs module-owned read calculations and then invokes the guarded classic-runtime bootstrap exactly once. The classic fallback can still start the page if the module bootstrap is unavailable.

Equipment display naming, effective item stats, multi-axis equipment scores, online equipment creation/acceptance, and recent-loot recording now have formal implementations in `src/systems`. Existing global calls in `game.js` forward to module runtimes once installed, while legacy bodies are retained as startup-safety and offline-settlement fallbacks during the staged migration.

## Formalized In This Batch

- Module-controlled one-shot startup via `window.bootstrapLegacyRuntime()`.
- Read-only equipment module runtime via `window.RuneFrontierEquipmentRuntime`.
- Equipment calculation parity fixtures covering refine/empower, abyss bonuses, mechanic affixes, socket bonuses, and safe display naming.
- Stateful online equipment generation, inventory acceptance and auto-salvage protection through `RuneFrontierEquipmentRuntime`.
- Online equipment table drops and recent-loot record management through `RuneFrontierDropsRuntime`.
- Module status metadata now distinguishes migrated online equipment handling from deferred offline settlement.

## Deliberately Retained In game.js

- Offline equipment settlement and its direct salvage checks.
- Refine/star-refine/socket state changes and legacy manual/batch dismantle entry points.
- Legacy equipment read bodies as guarded fallback implementations until stateful equipment migration is complete.
- Material/card/special drop rolls and offline reward calculation.
- Combat, skills, Boss/abyss handling, main loop.
- Character/equipment/smithy/VIP/codex/shop/battle renderers.
- Save/auth implementation and all `window` action interfaces still consumed by pages or diagnostics.

## Deferred Because It Is Unsafe In This Batch

- Data tables are not promoted as runtime authority yet. Some split table files contain historical display-text encoding damage or may differ from currently running tables.
- Display/configuration tables are not promoted as authority because split copies still require a separate encoding and behavior audit.
- No build pipeline is introduced. The repository currently has a Node server and browser ES modules, but no existing bundler configuration.

## Next Migration Order

1. Move offline equipment settlement after the online equipment acceptance path is stable.
2. Move remaining material/card/special drop categories once offline settlement no longer shares legacy mutation paths.
3. Move combat after drop dependencies are module-owned.
4. Move page renderers, VIP, codex, and shop behavior, then retire legacy fallbacks.
