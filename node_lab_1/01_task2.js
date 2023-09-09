var http = require('http');

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.end('<h1 style="color: #ffffff; font-family: \'Times New Roman\'">Hello World!!</h1>\n');
}).listen(3000); // creates a listener on the specified port or path.

console.log('Server running at http://localhost:3000/');