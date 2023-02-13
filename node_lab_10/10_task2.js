const WebSocket = require('ws');

let k = 0;
let socket = new WebSocket('ws:/localhost:4000/wsserver');
socket.onopen = () => {
    console.log('Socket.onopen is used.');
    let timer = setInterval(() => { socket.send(`10_task_2 client: ${++k}`); },3000);
    setTimeout(()=> {clearInterval(timer); socket.close(console.log('Client socket is closed'))},20000);

};

socket.onclose = () => { console.log('Socket.onclose is used.'); };
socket.onmessage = (e) => { console.log('Socket.onmessage is used.', e.data); };
socket.onerror = function(error) { console.log('Error: ' + error.message); };
