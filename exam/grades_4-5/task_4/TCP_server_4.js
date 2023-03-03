const net = require('net');

let HOST = '0.0.0.0';
let PORT = 3000;

net.createServer((socket) =>
{
    socket.on('error',(e)=>
    {
        console.log(`Server socket error is occurred: ${e}`);
    });

    console.log(`Server socket connected. Address is ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data',(data)=>{
        console.log(`Message from ${socket.remoteAddress}:${socket.remotePort} : ${data.toString()}`);
    });

    socket.on('close', (data)=>{
        console.log('Server socket closed');
    });
}).listen(PORT,HOST);