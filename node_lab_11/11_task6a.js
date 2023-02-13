const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open',()=>{
    ws.subscribe('A').then(r => console.log('Event "A" is on:\n',r));
    ws.on("A", () => console.log("Event A(rmstrong) standing here and realizing!"));
});