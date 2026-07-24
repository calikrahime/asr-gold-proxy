const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });
  res.end('ASR Gold WebSocket Proxy OK');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (client) => {
  const upstream = new WebSocket('ws://5.250.255.85:12350');
  
  upstream.on('message', (data) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
  
  upstream.on('close', () => client.close());
  upstream.on('error', () => client.close());
  
  client.on('message', (data) => {
    if (upstream.readyState === WebSocket.OPEN) {
      upstream.send(data);
    }
  });
  
  client.on('close', () => upstream.close());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
