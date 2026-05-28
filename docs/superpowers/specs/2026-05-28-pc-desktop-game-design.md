# Rune Frontier Idle PC Desktop Game Design

Date: 2026-05-28

## Decision

Rune Frontier Idle will pursue a complete Windows PC desktop edition first.

The target is not a simple browser wrapper. The desktop edition should feel like a full PC idle RPG client: downloadable, playable offline, visually upgraded for desktop screens, and ready for later distribution through channels such as itch.io or Steam.

## Goals

- Ship a Windows-first desktop game build.
- Preserve the current idle RPG core: combat, progression, equipment, drops, offline rewards, quests, and long-term character growth.
- Support dual-track saves: local offline play first, optional login-based cloud sync second.
- Upgrade the experience for PC: desktop layout, richer information density, keyboard shortcuts, better window behavior, and stronger combat presentation.
- Keep the existing Web version working while the PC edition is built.

## Non-Goals

- No Godot, Unity, or full engine rewrite for the first PC edition.
- No macOS or Linux support in the first release.
- No mandatory always-online requirement.
- No Steamworks-specific features in the first implementation. Achievements, cloud saves, and trading cards can be designed later.
- No full combat art overhaul before the desktop shell and save system are stable.

## Recommended Approach

Use Electron for the first Windows desktop edition.

Electron gives the project the highest reuse of the existing HTML, CSS, JavaScript, Canvas, Node-based tooling, and current server API shape. Its larger package size is acceptable for a PC idle RPG, and it avoids the large migration cost of rewriting all UI and runtime logic into a traditional game engine.

Tauri remains a possible later optimization if package size and runtime footprint become a major concern. Godot or Unity should be treated as a future 2.0 direction only if the game evolves toward map movement, heavy animation, entity physics, or a much more traditional RPG presentation.

## Architecture

The PC edition should add a desktop shell while preserving the existing game runtime.

```text
desktop/
  electron main process
  preload bridge
  desktop filesystem save adapter
  window/menu/tray/update hooks

src/platform/
  browser adapter
  desktop adapter
  shared platform contract

existing web runtime
  game UI
  Canvas combat scene
  systems and data modules

server.js / future backend
  optional cloud save
  account login
  sync endpoints
```

The platform layer should stay narrow. It should abstract storage, HTTP, dialogs/toasts, lifecycle events, filesystem access for desktop saves, and environment detection. It should not try to abstract all rendering.

## Save Model

The desktop edition uses local save as the primary authority.

Local saves should be stored as versioned JSON files in the user data directory through the desktop platform adapter. The game should autosave regularly and also save on quit. A visible manual export/import path should remain available for safety.

When the player logs in, the client can sync with the existing or upgraded server. The first sync implementation should avoid clever merging. If local and cloud saves differ, show a conflict choice:

- keep local save and upload it
- use cloud save and replace local
- keep both by exporting one backup before replacing

Later versions can add smarter merge behavior for offline rewards or account-bound progression.

## Desktop Experience

The first desktop layout should be designed around a landscape window, not a mobile-style stacked page.

Recommended default layout:

- left navigation rail for major systems
- center area for combat/adventure and the currently active workflow
- right side panel for character summary, rewards, timers, and logs
- bottom or compact toolbar for quick actions, save/sync status, settings, and build/version info

The client should support common PC expectations:

- remembered window size
- fullscreen or borderless fullscreen option
- keyboard shortcuts for major tabs and common actions
- readable dense panels for long sessions
- clear save/sync indicators
- audio and performance settings

## Visual Upgrade Plan

Visual work should be split into two phases.

Phase A: UI clientization.

Refresh the current pixel-style Web UI into a desktop client interface. This includes layout, panels, buttons, typography scale, hover/active feedback, modal behavior, tab navigation, and information density. The existing art direction can remain, but the game should stop feeling like a responsive web page.

Phase B: combat presentation.

Upgrade the Canvas battle scene after the desktop shell is stable. Improvements should focus on layered backgrounds, player and monster presentation, attack timing, skill effects, damage numbers, status feedback, and smoother idle/combat animation. This phase should reuse the existing combat logic and only improve presentation.

## Data Flow

At runtime:

1. The Electron main process owns desktop-only capabilities such as filesystem paths, native menus, and window lifecycle.
2. The preload bridge exposes a minimal safe API to the game runtime.
3. The game runtime calls the platform adapter for storage, dialogs, lifecycle, and HTTP.
4. The desktop storage adapter reads/writes local save files.
5. If the player logs in, the HTTP adapter syncs saves with the backend.

The game systems should continue moving toward pure modules with no direct DOM, browser, Electron, or server dependencies.

## Backend Direction

The first PC version can reuse the current backend API shape where practical, but the long-term target should be stronger persistence than `users.json`.

Recommended path:

- keep Web compatibility
- add desktop-aware login and save sync flows
- migrate persistence to SQLite or PostgreSQL before public distribution
- keep account sync optional so the game remains playable offline

## Testing And Verification

Each implementation phase should preserve:

- `npm run check`
- `npm test`
- manual Web smoke test
- manual desktop smoke test once Electron exists

Desktop-specific checks should include:

- first launch creates a local save location
- autosave survives app restart
- save import/export works
- offline progress settles correctly after app close and reopen
- login sync can upload and download saves
- conflict handling never silently overwrites a newer local save
- window resize and fullscreen do not break the main layout

## Milestones

1. Desktop shell prototype: Electron launches the current game in a Windows window.
2. Platform adapter split: browser and desktop storage paths are separated.
3. Local desktop save: local JSON save, autosave, import/export, restart recovery.
4. Cloud sync: optional login, upload/download, conflict flow.
5. PC UI refresh: desktop layout for core gameplay pages.
6. Combat visual upgrade: richer Canvas presentation without changing combat rules.
7. Windows release package: icon, versioning, installer or portable build, release checklist.

## Risks

- The monolithic `game.js` and heavy `window` usage can slow platform separation.
- Save sync can damage player trust if conflict handling is unclear.
- Visual refresh can expand endlessly unless it is split into UI first and combat second.
- Electron package size is larger than native alternatives, but acceptable for first release.
- Public distribution will require better persistence, backup, and release discipline than the current hobby server setup.

## First Implementation Slice

The first build slice should be small:

1. Add an Electron shell that can open the existing game locally.
2. Add a desktop platform adapter skeleton.
3. Route save loading/saving through the adapter without changing game behavior.
4. Verify Web still works.
5. Verify Windows desktop restart preserves progress.

This creates a playable foundation before any large visual redesign begins.
