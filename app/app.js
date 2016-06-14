const IoC = require('electrolyte'),
	express = require('express'),
	socketIO = require('socket.io'),
	cors = require('cors'),
    Rx = require('rx'),
	bodyParser = require('body-parser');

IoC.use(IoC.dir('app'));
IoC.use(IoC.dir('app/routers'));
IoC.use(IoC.dir('app/services'));

const PORT = process.env.PORT || 8008;
const server = express()
	.use(cors())
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())
	.use('/api', IoC.create('users-router'))
	.use('/api', IoC.create('auth-router'))
	.listen(PORT, function() {
		console.log('listening port ' + PORT);
	});


const io = socketIO(server);

io.use(IoC.create('socket-service'));

const userService = IoC.create('users-service');

io.on('connection', function(socket) {
	const response = {
		date: new Date(),
		user: socket.handshake.query.user
	};
	console.log('connected', response);
	io.emit('connected', response);
	userService.addUser(socket.handshake.query.user);
	socket.emit('users', userService.allUsers());
	console.log('all users: ', userService.allUsers());

	var writingSource = Rx.Observable.fromEvent(socket, "writing");
	writingSource.subscribe(
		function (message) {
			const response = {
				user: socket.handshake.query.user
			};
			console.log('writing ', response);
			io.emit('writing', response);
		}
	);

	var source = Rx.Observable.fromEvent(socket, "message")
		.takeUntil(Rx.Observable.fromEvent(socket, "disconnect"));

	var subscription = source.subscribe(
		function (message) {
			const response = {
				text: message.text,
				date: new Date(),
				user: socket.handshake.query.user
			};
			console.log(response);
			io.emit('message', response);
		},
		function (err) {
			console.log('Error: %s', err);
		},
		function () {
			const response = {
				date: new Date(),
				user: socket.handshake.query.user
			};
			console.log('disconected ', response);
			userService.removeUser(socket.handshake.query.user);
			io.emit('disconnected', response);
		});

});

module.exports = server;