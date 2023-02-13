const http = require('http');

let jsonParm = JSON.stringify(
    {
        "__comment": "request: lab 09_task4",
        "x": 3,
        "y": 11,
        "s": "Message",
        "m": ["a", "b", "c", "d", "e", "f"],
        "o": {"surname": "Herman", "name": "Alexander"}
    }
);

let options = {
    host: 'localhost',
    path: '/09_04',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const req = http.request(options, (res) => {
    console.log(`res.response (statusCode) = ${res.statusCode}`);
    
    let data = "";
    res.on("data", (chunk) => {
        data += chunk.toString('utf8');
    });
    res.on("end", () => {
        console.log(`http.request: end: body = ${data}`);
        console.log(`http.request: end: parse(body) = ${JSON.parse(data)}`);
    });
});

req.on('error', (e) => {
    console.log(`http.request: error: ${e.message}`);
});
req.end(jsonParm);