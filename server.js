const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 5178);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");
const MAX_BODY_BYTES = 1024 * 1024 * 2;
const SESSION_DAYS = 30;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

function getStaticCacheControl(ext) {
  // Keep runtime modules coherent across deployments; mixed JS versions blank migrated pages.
  if (ext === ".html" || ext === ".js" || ext === ".css" || ext === ".json") {
    return "no-store";
  }
  return "public, max-age=300";
}

function normalizeDb(db = {}) {
  const source = db && typeof db === "object" && !Array.isArray(db) ? db : {};
  return {
    ...source,
    users: source.users && typeof source.users === "object" && !Array.isArray(source.users) ? source.users : {},
    sessions: source.sessions && typeof source.sessions === "object" && !Array.isArray(source.sessions) ? source.sessions : {},
  };
}

function readDb() {
  try {
    return normalizeDb(JSON.parse(fs.readFileSync(DB_FILE, "utf8")));
  } catch {
    return normalizeDb();
  }
}

function writeDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = "";
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("请求内容过大"));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("请求格式错误"));
      }
    });
    req.on("error", reject);
  });
}

function validateCredentials(username, password) {
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username || "")) {
    return "用户名需要 3-20 位，只能包含英文、数字和下划线";
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 64) {
    return "密码需要 6-64 位";
  }
  return "";
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const attempt = hashPassword(password, user.salt).hash;
  return crypto.timingSafeEqual(Buffer.from(attempt, "hex"), Buffer.from(user.hash, "hex"));
}

function createSession(db, username) {
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions[token] = {
    username,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  return token;
}

function getSessionUser(req, db) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = token ? db.sessions[token] : null;
  if (!session || session.expiresAt < Date.now()) {
    if (token) delete db.sessions[token];
    return null;
  }
  return { token, username: session.username, user: db.users[session.username] };
}

async function handleApi(req, res) {
  const db = readDb();
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname === "/api/register" && req.method === "POST") {
      const { username = "", password = "" } = await readBody(req);
      const normalized = String(username).trim();
      const error = validateCredentials(normalized, password);
      if (error) return sendJson(res, 400, { error });
      if (db.users[normalized]) return sendJson(res, 409, { error: "用户名已存在" });
      const passwordData = hashPassword(password);
      db.users[normalized] = {
        username: normalized,
        salt: passwordData.salt,
        hash: passwordData.hash,
        state: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const token = createSession(db, normalized);
      writeDb(db);
      return sendJson(res, 201, { token, username: normalized });
    }

    if (url.pathname === "/api/login" && req.method === "POST") {
      const { username = "", password = "" } = await readBody(req);
      const normalized = String(username).trim();
      const user = db.users[normalized];
      if (!user || !verifyPassword(password, user)) {
        return sendJson(res, 401, { error: "用户名或密码错误" });
      }
      const token = createSession(db, normalized);
      writeDb(db);
      return sendJson(res, 200, { token, username: normalized });
    }

    if (url.pathname === "/api/logout" && req.method === "POST") {
      const session = getSessionUser(req, db);
      if (session) delete db.sessions[session.token];
      writeDb(db);
      return sendJson(res, 200, { ok: true });
    }

    if (url.pathname === "/api/me" && req.method === "GET") {
      const session = getSessionUser(req, db);
      if (!session?.user) return sendJson(res, 401, { error: "请先登录" });
      writeDb(db);
      return sendJson(res, 200, { username: session.username });
    }

    if (url.pathname === "/api/save" && req.method === "GET") {
      const session = getSessionUser(req, db);
      if (!session?.user) return sendJson(res, 401, { error: "请先登录" });
      writeDb(db);
      return sendJson(res, 200, { state: session.user.state || null });
    }

    if (url.pathname === "/api/save" && req.method === "POST") {
      const session = getSessionUser(req, db);
      if (!session?.user) return sendJson(res, 401, { error: "请先登录" });
      const { state } = await readBody(req);
      if (!state || typeof state !== "object") return sendJson(res, 400, { error: "存档格式错误" });
      session.user.state = state;
      session.user.updatedAt = Date.now();
      writeDb(db);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: "接口不存在" });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || "请求失败" });
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(ROOT, requested));
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": getStaticCacheControl(ext),
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Rune Frontier Idle server running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = {
  normalizeDb,
};
