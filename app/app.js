const IoC = require('electrolyte'),
	express = require('express'),
	cors = require('cors'),
    Rx = require('rx'),
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

const userService = IoC.create('users-service');

io.on('connection', function(socket) {
	const response = {
		date: new Date(),
		user: socket.handshake.query.user
	};
	console.log('connected', response);
	io.emit('connected', response);
	userService.addUser(socket.handshake.query.user);
	io.emit('users', userService.allUsers());
	console.log(userService.allUsers());

	var writingSource = Rx.Observable.fromEvent(socket, "writing").forEach(function() {
		const response = {
			text: message.text,
			user: socket.handshake.query.user
		};
		console.log(response);
		io.emit('writing', response);
	}).throttle(3000)
		.takeUntil(Rx.Observable.fromEvent(socket, "disconnect"));
	writingSource.subscribe(
		function (message) {
			io.emit('stop writing', '');
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

http.listen(3000, function() {
	console.log('socket port 3000');
});

module.exports = app;