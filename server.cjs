const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 10000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === '/sw.js') {
      const body = "self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',()=>self.clients.claim());";
      res.statusCode = 200;
      res.setHeader('content-type','application/javascript; charset=utf-8');
      res.setHeader('cache-control','public, max-age=0, must-revalidate');
      res.end(body);
      return;
    }
    handle(req, res);
  }).listen(port, () => {
    console.log(`CUSTOM_SERVER listening on ${port}`);
  });
});
