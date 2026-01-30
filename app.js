import { createServer } from 'http';

const server = createServer((req, res) => {
  res.end('Hello World (from Node!)');
});

server.listen(3000);