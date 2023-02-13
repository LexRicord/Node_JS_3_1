const http = require('http');
const fs = require('fs');

const fileName = 'received.png';
const file = fs.createWriteStream(fileName);

let options = {
    host: 'localhost',
    path: `/09_08/nanomachines.png`,
    port: 5000,
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`res.response (statusCode) = ${res.statusCode}`);
    res.pipe(file);
    res.on("end", () => {
        console.log(`http.request is end: file '${fileName}' was delivered to ./node_lab0_9`);
    });
});

req.on('error', (e) => {
    console.log(`http.request: error: ${e.message}`);
});
req.end();