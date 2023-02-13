const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open',()=>{
    ws.subscribe('C').then(r => console.log('Event "C" is on:\n',r));
    ws.on("C", () => console.log("Event C breaks in in a roundabout"));
});