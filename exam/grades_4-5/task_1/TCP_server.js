const net = require('net');

let HOST = '0.0.0.0';
let PORT = 3000;

net.createServer((socket) =>
{
    socket.on('error',(e)=>
    {
        console.log(`Server socket error is occurred: ${e}`);
    });

    console.log(`Server socket connected. Client's Address is ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data',(data)=>{
        console.log(`ECHO: ${data.toString()}`);
        socket.write(` ${data}`);
    });

    setTimeout(() => {
        console.log('After 60 seconds socket will close.');
        socket.end();
    }, 60000);

    socket.on('close', (data)=>{
        console.log('Server socket closed');
    });
}).listen(PORT,HOST);