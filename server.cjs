const { createServer } = require('http');
const next = require('next');
const fs = require('fs');
const path = require('path');

const app = next({ dev: false });
const handle = app.getRequestHandler();
const swPath = path.join(__dirname, 'public', 'sw.js');

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === '/sw.js') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      try { res.end(fs.readFileSync(swPath, 'utf8')); }
      catch { res.end("/* sw missing */"); }
      return;
    }
    handle(req, res);
  }).listen(process.env.PORT || 3000);
});
