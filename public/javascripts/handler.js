/* global socket */
/* global $ */
$(document).ready(function() {

    //define functions socket.emit sending to server (app.js) and socket.on receiving 
    // 'new message' is for the id of the socket and $('#new-message') is for the button
    function sendFunction() {
        socket.emit('new message', $('#new-message').val());
        $('#new-message').val('');
    };
    // 'chat message' is for the id of the socket and $('#new-area') is for the text area
    socket.on('chat message', function(msg) {
        $('#messages-area').append($('<li>').text(msg));
    });
    window.onbeforeunload = function() {
        console.log('unload');
        socket.emit('disconnect');
    };
});
