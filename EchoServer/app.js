var net = require('net');

var server = net.createServer(function(socket){
    // 'once' event listener may be used to respond only one time
    socket.on('data', function(data){
        socket.write(data);
    });
});

server.listen(8888);