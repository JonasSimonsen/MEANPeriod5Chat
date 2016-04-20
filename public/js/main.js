
//Execute when document is ready
$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    var chatForm = $('#chatForm');
    var message = $('#chatInput');
    var chatWindow = $('#chatWindow');
    var userForm = $('#userForm');
    var username = $('#username');
    var users = $('#users');
    var error = $('#error');

    // User creation
    userForm.submit(function (e) {
        e.preventDefault();
        socket.emit('define user', username.val(), function (data) {
            if (data) {
                //$('#userFormWrap').hide();
                $('#mainWrap').show();

            } else {
                error.html('Username is already taken');
            }
        });
    });

    // Send message
    chatForm.submit(function (e){
        e.preventDefault();
        socket.emit('send message', message.val());
        message.val('');
    });

    // Chat window
    socket.on('show message', function(data){
       chatWindow.append('[' + data.time + '] ' + data.user + ' : ' + data.msg + '<br>');
    });

    // Get old messages
    socket.on('messages', function(data){
        chatWindow.append('[' + data.time + '] ' + data.user + ' : ' + data.msg + '<br>');
    });






        // Show users
        socket.on('users', function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<li class="list-group-item">' + data[i] + '</li>';
            }
            users.html(html);
        });



});

