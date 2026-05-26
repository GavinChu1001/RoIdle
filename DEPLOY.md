# Deployment

This project can run as a Node.js app. It serves the game files and provides account APIs for registration, login, and cloud saves.

## Baota Panel

1. Install the Node.js manager in Baota.
2. Upload the whole project folder.
3. Create a Node project:
   - Startup file: `server.js`
   - Port: `5178` or any free internal port
   - Start command: `npm start`
4. Add a reverse proxy from your domain to the internal port.
5. Enable HTTPS in Baota.
6. Back up the `data/users.json` file regularly. It contains account hashes and player saves.

## Docker Option

Baota is enough for a small test server. Docker is cleaner if you want repeatable deployment, easier migration, or multiple game services on one machine.

## Notes

- Passwords are stored with salted `scrypt` hashes, not plain text.
- This is a lightweight account system for early testing. For a larger public release, move user data to MySQL/PostgreSQL, add rate limiting, backups, and admin tooling.
