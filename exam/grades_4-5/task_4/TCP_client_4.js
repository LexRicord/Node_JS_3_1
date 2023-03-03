const net = require('net');

let HOST = '127.0.0.7';
let PORT = 3000;

let parmMESSAGE = process.argv[2];
let message = typeof parmMESSAGE == 'undefined' ? 'Message to Server Socket' : parmMESSAGE;

let client = net.Socket();

client.connect(PORT,HOST,()=>{
    let X = message;
    let i = 0;
    console.log(`Client socket connected: ${client.remoteAddress}:${client.remotePort}`);

    let sender = client.on('data', data => {
        X = data + "№"+ i;
        i++;
        setInterval(() => {
            client.write(X.toString());
        }, 2000);
    });

    setTimeout(() => {
        clearInterval(sender);
        client.end();
    }, 30000);
});

client.on('close',() =>{
    console.log('Client socket closed');
});

client. on('error',(e)=>
{
    console.log(`Client socket error is occurred:`,e);
});

client.write(message);











