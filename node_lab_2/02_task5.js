const http = require('http');
const fs = require('fs');
const fetch = require('node-fetch');

http.createServer(async function (request, response) {
    if (request.url === '/api/name') {
        fs.readFile('text.txt', (err, data) => {
            if (err) {
                ErrHandler(response);
            } else {
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end(data);
            }
        });
    } else if (request.url === '/fetch') {
        try {
            const url = 'http://localhost:5000/api/name';
            const fetchResponse = await fetch(url);
            if (fetchResponse.ok) {
                const userData = await fetchResponse.text();

                const template = fs.readFileSync('fetch.html', 'utf-8');
                const modifiedHtml = template.replace('<!-- USER_DATA_PLACEHOLDER -->', userData);
                
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(modifiedHtml);
            } else {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
            }
        } catch (error) {
            console.error(error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        }
    } else {
        ErrHandler(response);
    }
}).listen(3000);

function ErrHandler(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>ERROR</h1>');
}

console.log('Server running at http://localhost:3000/fetch');
