var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var db = require('./db/mongoose');
var MsgLog = require('./model/log');


//Initiating empty user and message Array


var users = [];
var messages = [];




app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.use(express.static(path.join(__dirname, 'public')));

//Socket connection
io.sockets.on('connection', function(socket) {

    //Create user
    socket.on('define user', function(data, callback){
        if (users.indexOf(data)!= -1){
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsers();
        }

    });

    //Send Message
    socket.on('send message', function(data){
        var username = socket.username;
        var msg = data;
        var sent = new Date();
        var sent_utc = new Date(sent.getFullYear(), sent.getMonth(), sent.getDate(), sent.getHours(), sent.getMinutes(), sent.getSeconds());

        io.sockets.emit('show message', {
            user: username,
            msg: msg,
            time: sent_utc.toTimeString().substring(0, 8)
        });

        var message = {username: username, msg: msg, time: sent_utc};
        messages.push(message);


        var messageToSave = new MsgLog({
            time: sent_utc,
            username: username,
            msg: msg
        });

        messageToSave.save(function(err){
           if(err){
               throw(err);
               console.log(err);
           }else{
               console.log("Message saved to db");
           }
        });
    });

    //Disconnect update
    socket.on('disconnect', function(data){
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsers;
    });

    //Update users function
    function updateUsers(){
        io.sockets.emit('users', users);
    };


});

app.get('/', function(req, res){
    res.render('index');
});

server.listen(process.env.PORT || 3000);
console.log('Server Running');

