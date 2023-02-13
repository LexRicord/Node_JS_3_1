const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:5000');

let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'ZXC' : parm;

ws.on('open',()=>{
    ws.on('message',(data)=>{
        data = JSON.parse(data);
        console.log('Message: ',data);
    });

    setInterval(()=>{
        ws.send(JSON.stringify(
            {
                x:prfx,
                t: (new Date()).toString()
            }
        ))
    },3000)
});

ws.on('error',(e)=>{
    console.log('WS-server error is occurred: ',e)
});