const rpcServer = require('rpc-websockets').Server;

const eventSocket = new rpcServer({ port: 4000, host: 'localhost', path:"/"});

eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

console.log('Choose one of events: A, B or C ');

let input = process.stdin;

input.setEncoding('utf-8');
input.on('data', (data) =>{
    let getData = data.slice(0,1);
    if (data.length <= 3 && (getData === "A" || getData === "B" || getData ==="C")) {
    eventSocket.emit(getData,{
        x: `Event emitted: ${getData}`,
        date: (new Date).toTimeString()});
    }
}
);

