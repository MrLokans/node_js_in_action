function divEsapedContentElement(message){
    return $('<div></div>').text(message);
}

function divSystemContentElement(message){
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket){

    var message = $('#send-message').val();
    var systemMessage;
    console.log("processing " + message);
    if (message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if (systemMessage){
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEsapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

var socket = io.connect('http://localhost');

$(document).ready(function(){
    var chatApp = new Chat(socket);

    socket.on('nameResult', function(result){
        var message;

        if (result.success){
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('message', function(message){
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', function(rooms){
        $('#room-list').empty();

        for(var room in rooms){
            // TODO: check whether this is correct, for .. in .. does not work that way?
            room = room.substring(1, room.length);
            if (room != ''){
                $('#room-list').append(divEsapedContentElement(room));
            }
        }

        // room is switched via clicking the corresponding room div
        $('#room-list div').click(function(){
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    // constantly update rooms list
    setInterval(function(){
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus();
    $('#send-form').submit(function(){
        processUserInput(chatApp, socket);
        return false;
    });

});