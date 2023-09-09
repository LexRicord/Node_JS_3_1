var http = require('http');

let head = (request) => {
    let rc = '';
    for (let key in request.headers)
        rc += '<h3><span style="color: #2ec4b6;">' + key + ':</span> ' + request.headers[key] + '</h3>';
    return rc;
};

http.createServer(function(request, response) {
    let body = '';
    request.on('dat', str => {
        body += str;
        console.log('dat', body);
    });

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    request.on('end', () => response.end(
            '<!DOCTYPE html><html lang=\"en\"><head><title>Node 01-task3</title></head>' +
            '<body style="background: #e0e0e0; color: #012748; font-family: \'Times New Roman\'">' +
            '<h1>Request structure</h1>' +
            '<h3><span style="color: #ad2424;">METHOD:</span> ' + request.method + '</h3>' +
            '<h3><span style="color: #ad2424;">URI:</span> ' + request.url + '</h3>' +
            '<h3><span style="color: #ad2424;">VERSION:</span> ' + request.httpVersion + '</h3>' +
            '<h3><span style="color: #ad2424;">HEADERS:</span> ' + head(request) + '</h3>' +
            '<h3><span style="color: #2464ad;">HEADERS(v2):</span> ' + request.headers + '</h3>' +
            '<h3><span style="color: #2464ad;">HTTP Version Major:</span> ' + request.httpVersionMajor + '</h3>' +
            '<h3><span style="color: #2464ad;">HTTP Version Minor' +':</span> ' + request.httpVersionMinor + '</h3>' +
            '<h3><span style="color: #ad2424;">BODY:</span> ' + body + '</h3>' +
            '</body>' +
            '</html>'
        )
    )
}).listen(3000);

console.log('Server running at http://localhost:3000/');
