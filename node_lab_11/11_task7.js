const rpc = require('rpc-websockets').Server;

let server = new rpc({port: 4000, host: 'localhost'});

server.register('A', () => {console.log('A: The event sends a message: "Yo, dude"')}).public();
server.register('B', () => {console.log('B: The event sends a message: "Hello world!"')}).public();
server.register('C', () => {console.log('C: The event sends a message: "Collective consciousness is here"')}).public();