/**
 * Created by megam on 1/6/2017.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var md5 = require('md5');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'chat'
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



app.get('/', function (req, res) {
    if (req.param("js")) {
        if (req.param("js") == "socket.io") {
            res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js')
        } else if (req.param("js") == "angular") {
            res.sendFile(__dirname + '/node_modules/angular/angular.min.js')
        } else if (req.param("js") == "angular-route") {
            res.sendFile(__dirname + '/node_modules/angular-route/angular-route.min.js')
        } else if (req.param("js") == "angular-cookies") {
            res.sendFile(__dirname + '/node_modules/angular-cookies/angular-cookies.min.js')
        } else if (req.param("js") == "jquery") {
            res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js')
        } else if (req.param("js") == "jquery.nicescroll") {
            res.sendFile(__dirname + '/node_modules/jquery.nicescroll/jquery.nicescroll.min.js')
        }
    } else if (req.param("css")) {
        if (req.param("css") == "style") {
            res.sendFile(__dirname + '/res/style/style.css')
        } else if (req.param("css") == "normalize") {
            res.sendFile(__dirname + '/res/style/normalize.css')
        }
    } else {
        res.redirect("/chat");
    }
});

app.get('/chat', function (req, res) {
    var requetsFile = req.param("path");
    if (requetsFile == undefined) {
        res.sendFile(__dirname + '/chat/index.html');
    } else {
        res.sendFile(__dirname + '/chat/' + requetsFile);
        console.log('[Express]: Sending - ' + __dirname + '/chat/' + requetsFile);
    }
});

app.get('/*', function (req, res) {
    res.send('');
});

app.post('/auth', function (req, res) {
    var username = req.param("username");
    var password = md5(req.param("password"));
    var grant_type = req.param("grant_type");

    console.log('[Auth]: Authenticating "' + username + '" with "' + password + '" using granting type "' + grant_type + '"');

    //do the challenge
    var db_password = "", db_id = "", db_email = "";
    connection.query('SELECT `id`, `username`, `password`, `email` FROM `users` WHERE `username` = "' + username + '"', function(err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            db_id = rows[0].id;
            db_email = rows[0].email;
            db_password = rows[0].password;
        }
        console.log('Fetched query: ', rows[0]);

        if (db_password == password) {
            res.statusCode = 200;
            res.send({userID: db_id, userName: username, email: db_email});
        } else {
            res.statusCode = 401;
            res.send({error: 'invalid_credentials'});
        }
    });
});

io.on('connection', function (socket) {
    var connectedUser = socket.handshake.query['name'];
    console.log('[Chat]: User ' + connectedUser + ' has been connected.');

    io.sockets.in(socket).emit('SYS_MSG', 'Welcome to chat, ' + connectedUser + '!');
    io.emit('HANDSHAKE_SUCCESSFUL', {"userID": socket.id, "userName": connectedUser});

    //join the user to his own chat
    socket.join(connectedUser);

    socket.on('CHAT_MSG', function (msg) {
        //parse and test if structure is valid
        if (msg.content) {
            //send to the same user
            console.log('[Chat]: Sending to self "' + msg.toUser + '"');
            io.sockets.in(connectedUser).emit('CHAT_USER', msg.content);
        }
        if (msg.content && msg.toUser) {
            console.log('[Chat]: Sending to channel "' + msg.toUser + '"');
            io.sockets.in(msg.toUser).emit('CHAT_OTHER',msg.content);
        }
        console.log('[Chat]: [' + connectedUser + '] -> [' + msg.toUser + '] {' + msg.content + '}');
    });

    socket.on('disconnect', function () {
        console.log('[Chat]: User ' + connectedUser + ' has been disconnected');
    });
});

http.listen(3000, function () {
    console.log('[Express]: Running and listening on *:3000.');
});