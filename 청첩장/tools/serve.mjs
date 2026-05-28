import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".json", "application/json; charset=utf-8"],
]);

function send(response, status, body) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(body);
}

function resolveRequestPath(requestUrl, root, port) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const filePath = path.resolve(root, relativePath);
  const rootWithSeparator = root.endsWith(path.sep) ? root : root + path.sep;

  if (filePath !== root && !filePath.startsWith(rootWithSeparator)) {
    return undefined;
  }

  return filePath;
}

export function createPreviewServer(options = {}) {
  const root = path.resolve(options.root || defaultRoot);
  const port = Number(options.port || process.env.PORT || 4173);

  return http.createServer(async (request, response) => {
    if (!request.url) {
      send(response, 400, "Bad request");
      return;
    }

    const filePath = resolveRequestPath(request.url, root, port);

    if (!filePath) {
      send(response, 403, "Forbidden");
      return;
    }

    try {
      const file = await stat(filePath);

      if (!file.isFile()) {
        send(response, 404, "Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": mimeTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      send(response, 404, "Not found");
    }
  });
}

export async function startPreviewServer(options = {}) {
  const port = Number(options.port || process.env.PORT || 4173);
  const server = createPreviewServer(options);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  console.log(`Wedding invitation preview: http://127.0.0.1:${port}`);
  return server;
}

const directRunUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";

if (import.meta.url === directRunUrl) {
  await startPreviewServer({
    root: process.argv[2] || defaultRoot,
    port: process.argv[3] || process.env.PORT || 4173,
  });
}
