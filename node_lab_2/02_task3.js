const http = require('http');
const fs = require('fs');

const server = http.createServer(function (request, response) {
    if (request.url === '/api/name') {
        try {
            let html = fs.readFileSync('text.txt', 'utf-8');
            response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end(html);
        } catch (err) {
            console.error('Error reading the file:', err);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        }
    }
});

server.listen(5000, 'localhost', () => {
    console.log('Server running at http://localhost:5000/api/name');
});
