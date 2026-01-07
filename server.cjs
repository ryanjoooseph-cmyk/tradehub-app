const { createServer } = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');
const next = require('next');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === '/sw.js') {
      try {
        const body = readFileSync(join(__dirname, 'public', 'sw.js'));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.end(body);
        return;
      } catch (e) {
        res.statusCode = 404;
        res.end('');
        return;
      }
    }
    handle(req, res);
  }).listen(process.env.PORT || 3000, () => {
    console.log('> Ready on port', process.env.PORT || 3000);
  });
});
