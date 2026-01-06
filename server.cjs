const { createServer } = require('http');
const next = require('next');
const { readFileSync } = require('fs');
const { join } = require('path');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === '/sw.js') {
      const body = readFileSync(join(process.cwd(), 'public', 'sw.js'));
      res.setHeader('content-type', 'application/javascript; charset=utf-8');
      res.setHeader('cache-control', 'public, max-age=0, must-revalidate');
      res.end(body);
      return;
    }
    handle(req, res);
  }).listen(process.env.PORT || 10000);
});
