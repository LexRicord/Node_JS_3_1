const udp = require('dgram');
const PORT = 4000;

let client = udp.createSocket('udp4');

let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 1 : parm;

client.on('message', (msg, info) =>
{
    MsgBuff = msg.toString();
    console.log(`UDP-Server started ${info.address}:${info.port}: { ${MsgBuff} }`);
});

client.on('error', (err) => 
{
    console.log('Error: ' + err);
    client.close();
});

for (let i = 0; i < prfx; i++) {
client.send(("Hi, dude"), PORT, '26.110.209.160', (err) =>
{
    if (err) 
    {
        client.close();
    }
    else 
    {
        console.log("[Message №"+i+" is sent]");
    }
});
}
