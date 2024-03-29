const http = require('http');
const url = require('url');
const fs = require("fs");
const { parse } = require('querystring');
const parseString = require('xml2js').parseString;
const xmlBuilder = require('xmlbuilder');
const mp = require('multiparty');
const body_parser = require('body-parser');
const express = require('express');
var app = express();

let http_handler = (req, res) => {
    if(req.method === 'GET' && url.parse(req.url).pathname === '/connection') {
        if(!url.parse(req.url, true).query.set) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>KeepAliveTimeout = ${server.keepAliveTimeout}</h2>`);
        } else {
            server.keepAliveTimeout = +url.parse(req.url, true).query.set;
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>KeepAliveTimeout was updated, new value = ${server.keepAliveTimeout}</h2>`);
        }
        req.connection.on('close', function(err) { console.log('[KeepAliveTimeout] has ran out; connection was closed.'); });
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/headers') {
        let result = "<h2>\tREQUEST HEADERS: </h2><br/>";
        for (key in req.headers) {
            result += `* ${key} : ${req.headers[key]}<br/>`;
        }
        result += "<h2>\tRESPONSE HEADERS: </h2><br/>";
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Hello", "World");
        const resHeaders = res.getHeaders();
        for (key in resHeaders) {
            result += `* ${key} : ${resHeaders[key]}<br/>`;
        }
        res.writeHead(200);
        res.end(result);
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/parameter') {
        if((x = +url.parse(req.url, true).query.x) && (y = +url.parse(req.url, true).query.y)) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>Success! results:</h2><p>${x} + ${y} = ${x + y}</p><p>${x} - ${y} = ${x - y}</p><p>${x} * ${y} = ${x * y}</p><p>${x} / ${y} = ${x / y}</p>`);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>ERROR (parameters not provided): ${url.parse(req.url).pathname}</h2>`);
        }
    }

    if(req.method === 'GET' && RegExp(/^\/parameter\/[a-zA-Z1-9]+\/[a-zA-Z1-9]+/).test(url.parse(req.url).pathname)) {
        console.log('Regex is checked');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        let p = url.parse(req.url,true);
		let x=+p.pathname.split('/')[2];
		let y=+p.pathname.split('/')[3];
        if(!Number.isInteger(x) || !Number.isInteger(y)) {
            res.end(`ERROR: x (${p.pathname.split('/')[2]}) and y (${p.pathname.split('/')[3]}) are not integer:` + p.pathname);
        }
        else res.end(`<h2>Results :</h2><p>${x} + ${y} = ${x + y}</p><p>${x} - ${y} = ${x - y}</p><p>${x} * ${y} = ${x * y}</p><p>${x} / ${y} = ${x / y}</p>`);
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/close') {
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
        setTimeout(() => { server.close() }, 3000);
        res.end("<h2>Server will be closed in 3 seconds");
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/socket') {
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
		res.write('Client (local) port: ' + res.socket.localPort + '<br\/>');
		res.write('Client (local) ip: ' + res.socket.localAddress + '<br\/>');
		res.write('Server (remote) port: '+ res.socket.remotePort + '<br\/>');
		res.end('Server (remote) ip: '+ res.socket.remoteAddress);
    }

    if(req.method === 'POST' && url.parse(req.url).pathname === '/req-data') {
        let buf = '';
        req.on('data', (data) => {
            console.log('data = ', data);
            console.log('request.on(data) = ', data.length);
            buf += data;
        });
        req.on('end', () => {
            console.log('request.on(end) = ', buf.length)
        });
        res.end('<h2>end</h2>');
    }

    if(req.method === 'GET' && url.parse(req.url).pathname === '/resp-status') {
        if((url.parse(req.url, true).query.code) && (url.parse(req.url, true).query.mess))  {
            let code = url.parse(req.url, true).query.code;
            let mess = url.parse(req.url, true).query.mess;
            res.writeHead(code, mess,{'Content-Type': 'text/html; charset=utf-8'});
            //res.statusMessage = mess;
            res.end();
            console.log(JSON.stringify(req.headers));
            console.log(JSON.stringify('Response status '+res.status));
            console.log(JSON.stringify('Request status '+req.status));
        }
    }

    if(url.parse(req.url).pathname === '/formparameter') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(fs.readFileSync('./form.html'))
        }
        else if (req.method === 'POST') {
            let result = '';
            req.on('data', chunk => { result += chunk.toString(); });
            req.on('end', () => {
                let parm = parse(result);
                for (let key in parm) {
                    result += `${key} = ${parm[key]}<br/>`;
                }
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                res.write('<h2>data received from parm:</h2>')
                res.end(result);
            })
        }
        else res.end('<h1>Something goes wrong</h1>');
    }

    if(req.method === 'POST' && url.parse(req.url).pathname === '/json') {
        let data = '';
        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => {
            res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
            data = JSON.parse(data);
            let result = {};
            result.__comment = "response: Node_JS_8_10";
            result.x_plus_y = data.x + data.y;
            result.concat_s_and_o = `${data.s}: ${data.o.name} ${data.o.surname}`;
            result.length_m = data.m.length;
            res.end(JSON.stringify(result));
        })
    }
    /*
    {
        "__comment": "POST-запрос.Лабораторная работа 8 задание №10",
        "x":1,
        "y":2,
        "s":"Сообщение",
        "m":["a","b","c","d"],
        "o":{"surname":"Иванов","name":"Иван"}
    }
    */

    if(req.method === 'POST' && url.parse(req.url).pathname === '/xml') {
        let xmlString = '';
        req.on('data', data => { xmlString += data.toString(); });
        req.on('end', () => {
            parseString(xmlString, (err, result) => {
                if (err) {
                    console.log("xml parse error");
                    res.writeHead(400, { "Content-Type": "text/xml; charset=utf-8" });
                    res.end("<result>parse error</result>");
                    return;
                }
                let sum = 0;
                let string = "";
                result.request.x.forEach(el => { sum += Number.parseInt(el.$.value); })
                result.request.m.forEach(el => { string += el.$.value; })

                let xmlDoc = xmlBuilder.create('response')
                    .att("id", Math.round(Math.random() * 100))
                    .att("request", result.request.$.id);
                xmlDoc.ele('sum', { element: "x", sum: `${sum}`});
                xmlDoc.ele('concat', { element: "m", result: `${string}`});

                rc = xmlDoc.toString({pretty: true});
                res.writeHead(400, { "Content-Type": "text/xml; charset=utf-8" });
                res.end(xmlDoc.toString({ pretty: true }));
            });
        })
    }
    /*
<request id="28">
    <x value="3"/>
    <x value="3"/>
    <m value="z"/>
    <m value="x"/>
    <m value="c"/>
</request>
*/

    if(req.method === 'GET' && url.parse(req.url).pathname === '/files') {
        fs.readdir("./static", (err, files) => {
            if (err) {
                res.end("./static directory not found");
                return;
            }
            res.setHeader("X-static-files-count", `${files.length}`);
            res.end();
        });
    }

    if(req.method === 'GET' && RegExp(/^\/files\/[a-zA-Z1-9]+/).test(url.parse(req.url).pathname)) {
        try {
            res.end(fs.readFileSync('static/' + url.parse(req.url, true).pathname.split('/')[2]));
        } catch (err) {
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('404 ' + err.toString());
        }
    }

    if(url.parse(req.url).pathname === '/upload') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(fs.readFileSync('./upload.html'))
        }
        else if (req.method === 'POST') {
            let result = '';
            let form = new mp.Form({ uploadDir: './static' });
            form.on('file', (name, file) => { 
                console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
            });
            form.on('error', (err)=>{res.end('an error has occurred')});
            form.on('close', () => {
                res.writeHead(200, {'Content-type': 'text/plain'});
                res.end("File has uploaded!");
            });
            form.parse(req);
        }
        else res.end('<h1>Something goes wrong!</h1>');
    }
}

let server = http.createServer();
server.keepAliveTimeout = 10000;

server.listen(5000, () => {
    console.log('Server running at http://localhost:5000/');
}).on('error', (e) => {
    console.log('Server running at http://localhost:5000/ : ERROR = ', e.code);
}).on('request', http_handler);