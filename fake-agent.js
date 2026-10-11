// Stands in for the Datadog agent so dd-trace's CI Visibility initialises without a real agent
// or API key. /info advertises the endpoints dd-trace looks for; everything else is accepted
// and discarded.
const http = require('http');

function startFakeAgent(port) {
  const server = http.createServer((req, res) => {
    req.resume();
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        req.url.startsWith('/info')
          ? JSON.stringify({ endpoints: ['/evp_proxy/v2/', '/evp_proxy/v4/', '/v0.4/traces'] })
          : '{}'
      );
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

module.exports = { startFakeAgent };
