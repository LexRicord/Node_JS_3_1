const http = require('http');
const query = require('querystring');

let params = query.stringify({ x: 3, y: 11, s: "Hello!" });
console.log(`parameters: ${params}`);

let options = {
    host: 'localhost',
    path: '/09_03',
    port: 5000,
    method: 'POST'
}

const req = http.request(options, (res) => {
    console.log(`res.response (statusCode) = ${res.statusCode}`);
    
    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });
    res.on("end", () => {
        console.log(`http.request: end: body = ${data}`);
    });
});

req.on('error', (e) => {
    console.log(`http.request: error: ${e.message}`);
});
req.write(params);
req.end();