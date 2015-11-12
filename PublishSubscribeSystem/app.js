var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client){
    var welcome = "Welcome!\n" + "Guests online: " + this.listeners('broadcast').length;

    client.write(welcome + '\n');
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, message){
        if (id != senderId){
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id){
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('error', function(err){
    console.log('ERROR: ' + err.message );
});

channel.setMaxListeners(50);

var server = net.createServer(function(client){
    console.log("Client: " + client.remoteAddress);
    var id = client.remoteAddress + ':' + client.remotePort;

    // client.on('connect', function(){
        console.log('Join has occured: ' + id);
        channel.emit('join', id, client);
    // });
    client.on('data', function(data){

        data = data.toString();
        console.log('Data has been received.' + data);
        channel.emit('broadcast', id, data);
    });

    client.on('close', function(){
        channel.emit('leave', id);
    });
});
server.listen(8888);