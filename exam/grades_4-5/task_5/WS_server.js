const WebSocket = require('ws');

const wsServer = new WebSocket.Server(
    {
        port:5000, 
        host:'localhost'
    }
);

let n = 1;
let activeClient = 0;
wsServer.on('connection',(ws)=>
{
    ws.on('pong', data =>
    {
        activeClient+=parseInt(data, 10);
    });

    setInterval(() =>
    {
        wsServer.clients.forEach(client =>
        {
            client.ping(1);
        });
        console.log('Active: ' + (activeClient));
        activeClient = 0;
    }, 5000);

    let counter = setInterval(()=>
    {
        wsServer.clients.forEach((client)=>
        {
            if(client.readyState === WebSocket.OPEN)
            {
                client.send('WS_server:' + n++);
            }
        });
    }, 2000);
    setTimeout(()=>
        {
            let i = 0;
            clearInterval(counter);
            console.log("Counter is off"+ wsServer.connection);

            wsServer.clients.forEach((client)=>
            {
                i++;
               console.log("Client "+ i +" connections is closed");
               client.close();
            });
        },20000);
});

