const http = require('http');
const fs = require('fs');
const url = require('url');

let fact = (num) => { return num < 2 ? 1 : num * fact(num - 1); }

http.createServer(function (request, response) {
	if(url.parse(request.url).pathname === '/fact') {
        if (url.parse(request.url, true).query.k !== null) {
            let k = +url.parse(request.url, true).query.k;
            if (Number.isInteger(k)) {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                response.end(JSON.stringify({ k: k , fact: fact(k) }));
            }
        }
        if(url.parse(request.url, true).query.k === undefined) {
            console.log('No parameters ');
            response.end(JSON.stringify({k:0}));
        }
  	}
    
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./03_task3.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(html)
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/fact');