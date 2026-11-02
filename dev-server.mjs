// Local dev server: serves the static game and runs the Vercel functions in /api.
// Without database env vars the leaderboard keeps scores in memory (lost on restart).
// To use the real database: `vercel env pull .env.local`, then restart.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 5178;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
};

for (const file of ['.env', '.env.local']) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

async function api(req, res, name) {
  const mod = await import(pathToFileURL(join(ROOT, 'api', `${name}.js`)).href);
  const handler = mod[req.method];
  if (!handler) { res.statusCode = 405; return res.end(); }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const response = await handler(new Request(`http://localhost${req.url}`, {
    method: req.method, headers: req.headers, body: hasBody ? Buffer.concat(chunks) : undefined,
  }));
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

http.createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  try {
    const route = path.match(/^\/api\/([\w-]+)$/);
    if (route) return await api(req, res, route[1]);
    const file = normalize(join(ROOT, path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
    const body = await readFile(file);
    res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch (err) {
    res.statusCode = err.code === 'ENOENT' ? 404 : 500;
    if (res.statusCode === 500) console.error(err);
    res.end();
  }
}).listen(PORT, () => console.log(`Snooze Blaster on http://localhost:${PORT}`));
