const IoC = require('electrolyte'),
	express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser');

IoC.use(IoC.dir('app'));
IoC.use(IoC.dir('app/routers'));
IoC.use(IoC.dir('app/services'));

const app = express.Router()
	.use(cors())
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())
	.use('/api', IoC.create('users-router'))
	.use('/api', IoC.create('auth-router'));

const http = require('http').Server(app),
	  io = require('socket.io')(http);

io.use(IoC.create('socket-service'));

io.on('connection', function(socket) {
	console.log('user connected');

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('date', function(date){
		console.log(date);
	});

});

http.listen(3000, function() {
	console.log('socket port 3000');
});

module.exports = app;