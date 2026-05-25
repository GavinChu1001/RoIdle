# game.js Migration Status - Batch 2

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime in this batch. Startup ownership is now held by `src/main.js`: it installs module-owned read calculations and then invokes the guarded classic-runtime bootstrap exactly once. The classic fallback can still start the page if the module bootstrap is unavailable.

Equipment display naming, effective item stats, and multi-axis equipment scores now have formal read-only implementations in `src/systems/equipment`. Existing global calls in `game.js` forward to the module runtime once installed, while legacy bodies are retained as startup-safety fallbacks during the staged migration.

## Formalized In This Batch

- Module-controlled one-shot startup via `window.bootstrapLegacyRuntime()`.
- Read-only equipment module runtime via `window.RuneFrontierEquipmentRuntime`.
- Equipment calculation parity fixtures covering refine/empower, abyss bonuses, mechanic affixes, socket bonuses, and safe display naming.
- Module status metadata now distinguishes migrated equipment reads from still-bridged equipment actions.

## Deliberately Retained In game.js

- Equipment creation, normalization/migration writes, refine/star-refine/socket/dismantle actions.
- Legacy equipment read bodies as guarded fallback implementations until stateful equipment migration is complete.
- Drop rolls, recent loot, offline settlement, auto dismantle.
- Combat, skills, Boss/abyss handling, main loop.
- Character/equipment/smithy/VIP/codex/shop/battle renderers.
- Save/auth implementation and all `window` action interfaces still consumed by pages or diagnostics.

## Deferred Because It Is Unsafe In Batch 1

- Data tables are not promoted as runtime authority yet. Some split table files contain historical display-text encoding damage or may differ from currently running tables.
- Display/configuration tables are not promoted as authority because split copies still require a separate encoding and behavior audit.
- No build pipeline is introduced. The repository currently has a Node server and browser ES modules, but no existing bundler configuration.

## Next Migration Order

1. Move stateful equipment creation, inventory insertion, salvage protection, and online equipment drops together, with regression coverage for auto dismantle and recent loot.
2. Move offline equipment settlement after inventory and drop mutation ownership is stable.
3. Move combat and remaining drop categories after item/drop dependencies are module-owned.
4. Move page renderers, VIP, codex, and shop behavior, then retire legacy fallbacks.
