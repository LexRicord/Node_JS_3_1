const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000/');

let input = process.stdin;

ws.on('open', () => {
    console.log('Choose one of events: A, B or C ');
});

input.setEncoding('utf-8');
input.on('data', (data) =>{
    let c = data.slice(0,1);
    if (data.length <= 3 && (c === "A" || c === "B" || c ==="C")) ws.notify(c);
});
