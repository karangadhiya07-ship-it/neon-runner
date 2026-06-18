/**
 * Neon Runner — Hostinger Node.js Server
 * Serves the Expo web build as a static site.
 * Entry point: node server.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const STATIC_ROOT = path.resolve(__dirname, "public");
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".otf":  "font/otf",
  ".map":  "application/json",
  ".webp": "image/webp",
};

const CACHE_HEADERS = {
  // JS/CSS/fonts with content hash → cache for 1 year
  ".js":    "public, max-age=31536000, immutable",
  ".mjs":   "public, max-age=31536000, immutable",
  ".css":   "public, max-age=31536000, immutable",
  ".ttf":   "public, max-age=31536000, immutable",
  ".woff":  "public, max-age=31536000, immutable",
  ".woff2": "public, max-age=31536000, immutable",
  // Images — cache 1 week
  ".png":  "public, max-age=604800",
  ".jpg":  "public, max-age=604800",
  ".jpeg": "public, max-age=604800",
  ".ico":  "public, max-age=604800",
  ".webp": "public, max-age=604800",
  // HTML — no cache (always fresh)
  ".html": "no-cache, no-store, must-revalidate",
};

function serveFile(filePath, res) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return false;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const cacheControl = CACHE_HEADERS[ext] || "public, max-age=3600";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
    "X-Content-Type-Options": "nosniff",
  });
  res.end(content);
  return true;
}

const server = http.createServer((req, res) => {
  // Security: prevent path traversal
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;
  const safePath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
const fullPath = path.join(STATIC_ROOT, safePath === "/" ? "index.html" : safePath);

  // Must stay within STATIC_ROOT
  if (!fullPath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // Try exact path first
  if (serveFile(fullPath, res)) return;

  // Try with .html extension
  if (serveFile(fullPath + ".html", res)) return;

  // Try index.html inside directory
  if (serveFile(path.join(fullPath, "index.html"), res)) return;

  // SPA fallback — serve index.html for all unknown routes
  // (Expo Router handles client-side routing)
  const indexPath = path.join(STATIC_ROOT, "index.html");
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath);
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    res.end(content);
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Neon Runner server running on port ${PORT}`);
});
