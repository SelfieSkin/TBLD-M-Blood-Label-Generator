import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const mimeTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const root = process.cwd();

createServer((request, response) => {
  const safePath = normalize(decodeURIComponent(new URL(request.url, "http://localhost").pathname)).replace(/^\/+/, "");
  const filePath = join(root, safePath || "index.html");
  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(process.env.PORT || 4173, () => {
  console.log(`TBLD-M label generator available at http://localhost:${process.env.PORT || 4173}`);
});
