# game.js Migration Status — Final

## game.js: 11,844 lines (was 14,600 — -19%)

## Phase B Complete + Fix

- 78 legacy bodies slimmed, `legacyCreateItem` restored (called by `createDefaultState()` during top-level init before runtime installation).
- 77 remaining stubs confirmed safe — init chain does not call them before runtimes are installed.
- `?dev=1` self-check verified: 0 errors, 1 warning (compat save version).

## Completion Summary

| Item | Status |
|------|--------|
| 9 system runtimes | ✅ Installed |
| 81 render functions | ✅ True implementations |
| `tools.js` | ✅ 13 utilities |
| `data.js` | ✅ 444 configs |
| DevBridge | ✅ Extracted |
| 78 legacy bodies | ✅ 77 stubs + 1 restored |
| Browser self-check | ✅ 0 errors |
| `npm run check` | ✅ |
| `npm run test` | ✅ |

## Init-Path Safety Audit

The only legacy function called before runtime install: `legacyCreateItem` (restored). All 77 other stubs are safe:

- `bootstrapLegacyRuntime` → `init()` runs AFTER `main.js` installs 9 runtimes
- All other `legacyXxx` stubs are called only via delegation wrappers that hit runtime first

## Remaining (Optional)

| Item | Priority |
|------|----------|
| Extract maps/pools to `data.js` | Low (~2,700 lines savable) |
| Config authority unification | Low |
| Module test expansion | Low |
| Boss name panel BUG | Low (独立 BUG) |