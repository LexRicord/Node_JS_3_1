const http = require('http');
const url = require('url');
const fs = require("fs");

let PORT = 3000;

let http_handler = (req, res) => {
    if(req.method === 'GET' && url.parse(req.url).pathname === '/close_socket') {
        res.writeHead(200,{'Content-Type': 'application/json; charset=utf-8'});
        setTimeout(() => { http_server.close() }, 3000);
        res.end("<h2>Server will be closed in 3 seconds");
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/socket_info') {
        res.writeHead(200,{'Content-Type': 'application/json; charset=utf-8'});
        res.write('Client (local) port: ' + res.socket.localPort + '\n');
        res.write('Client (local) ip: ' + res.socket.localAddress + '\n');
        res.write('Server (remote) port: '+ res.socket.remotePort+ '\n');
        res.end('Server (remote) ip: '+ res.socket.remoteAddress);
    }

    if(req.method === 'POST' && url.parse(req.url).pathname === '/json_to_file') {
        let data = '';
        let jsonResult;
        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => {
            res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
            data = JSON.parse(data);
            let result = {};
            result.name = data.name;
            result.age = data.age;
            jsonResult = JSON.stringify(result);
            console.log(jsonResult);
            let wfile = fs.createWriteStream("files/out_file.txt");
            wfile.write(jsonResult);
            res.end(JSON.stringify(result));
        })
    }
}
let http_server = http.createServer();

http_server.listen(3000, () => {
    console.log("Server running at http://"+http_server.remoteAddress+":"+http_server.remotePort+"/");
}).on('error', (e) => {
    console.log("Server running at http://"+http_server.remoteAddress+":"+http_server.remotePort+"/ : ERROR = ", e.code);

}).on('request', http_handler);