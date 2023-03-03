const net = require('net');

let HOST = '127.0.0.7';
let PORT = 3000;

let parmMessage = process.argv[2];

let message = typeof parmMessage == 'undefined' ? 'Message to Server Socket' : parmMessage;

let client = net.Socket();

client.connect(PORT,HOST,()=>{
    let X = message;
    let input = process.stdin;

    console.log(`Client socket connected: ${client.remoteAddress}:${client.remotePort}`);

    let sender = client.on('data', data => {
        X = "["+message+']';
        setInterval(() => {
            client.write(X.toString());
        }, 10000);
    });

    setTimeout(() => {
        clearInterval(sender);
        client.end();
    }, 30000);
});

client.on('data', data => {
    console.log(`Client data: ${data.toString()}`);
});

client.on('close',() =>{
    console.log('Client socket closed');
});

client. on('error',(e)=>
{
    console.log(`Client socket error is occurred:`,e);
});

client.write(message);





