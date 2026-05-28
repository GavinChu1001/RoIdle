# Deployment

This project can run as a Node.js app. It serves the game files and provides account APIs for registration, login, and cloud saves.

## Baota Panel

1. Install the Node.js manager in Baota.
2. Upload the whole project folder. After the runtime migration this must include `src/`, `game.js`, `data.js`, `tools.js`, `index.html`, both CSS files, `assets/`, `server.js`, and `package.json`.
3. Create a Node project:
   - Startup file: `server.js`
   - Port: `5178` or any free internal port
   - Start command: `npm start`
4. Add a reverse proxy from your domain to the internal port.
5. Enable HTTPS in Baota.
6. Back up the `data/users.json` file regularly. It contains account hashes and player saves.

## Updating An Existing Deployment

Page content is now rendered by ES modules under `src/`. Uploading only `game.js` or `index.html` will leave page tabs empty because the legacy render fallbacks are intentionally no longer active.

1. Upload root runtime files and the complete `src/` folder together. Avoid a partial update.
2. Restart the Node.js service after replacing files.
3. If a reverse proxy or CDN caches static files, purge its cache or disable caching for HTML, JS, CSS, and `/src/` module files during updates.
4. Verify these URLs return `200` with a JavaScript content type:
   - `/src/main.js`
   - `/src/ui/equipmentPage.js`
   - `/src/ui/smithyPage.js`
5. Open `/index.html?dev=1`, run the debug self-check, and confirm there are no runtime import errors before opening the site to players.

## Docker Option

Baota is enough for a small test server. Docker is cleaner if you want repeatable deployment, easier migration, or multiple game services on one machine.

## Notes

- Passwords are stored with salted `scrypt` hashes, not plain text.
- This is a lightweight account system for early testing. For a larger public release, move user data to MySQL/PostgreSQL, add rate limiting, backups, and admin tooling.
