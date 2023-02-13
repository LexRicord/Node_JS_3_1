const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open',()=>{
    ws.subscribe('B').then(r => console.log('Event "B" is on:\n',r));
    ws.on("B", () => console.log("Event B rules!"));
});