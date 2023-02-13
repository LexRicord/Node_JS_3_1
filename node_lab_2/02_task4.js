const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
    if(request.url === '/api/name') {
        fs.readFile('text.txt',(err, data)=>
        {
            if(err) ErrHandler(response);
            response.writeHead(200, {'Content-Type': 'text/plain'})
            response.end(data);
        })
    }
    if(request.url === '/xmlhttprequest')
    {
        fs.stat('xmlhttprequest.html', (err, stat)=>
            {
                if(err)
                {
                    ErrHandler(response);
                    console.log('error', err);
                }
                let html = fs.readFileSync('xmlhttprequest.html');
                response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                response.end(html);
            }
        )
    }
}).listen(5000);

function ErrHandler(res){
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>ERROR</h1>')
}
console.log('Server running at http://localhost:5000/xmlhttprequest');