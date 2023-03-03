const http = require('http');

let jsonParm = JSON.stringify(
    {
        "name": "Alexander",
        "age": "20"
    },
    {
        "name": "Vladimir",
        "age": "65"
    },
    {
        "name": "Saucy Jack",
        "age": "31"
    }
);

let options = {
    host: 'localhost',
    path: '/json_to_file',
    port: 3000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const req = http.request(options, (res) => {
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