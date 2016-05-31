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

io.on('connection', function(socket) {
	socket.emit('connected', {
		date: new Date(),
		user: socket.handshake.query.user
	});
	console.log('user connected');

	var source = Rx.Observable.fromEvent(socket, "message")
		.takeUntil(Rx.Observable.fromEvent(socket, "disconnect"));

	var writingSource = Rx.Observable.fromEvent(socket, "writing").throttle(3000);
	writingSource.subscribe(
		function (message) {
			socket.emit('stop writing', '');
		}
	);

	var subscription = source.subscribe(
		function (message) {
			const response = {
				text: message.text,
				date: new Date(),
				user: socket.handshake.query.user
			};
			console.log(response);
			socket.emit('message', response);
		},
		function (err) {
			console.log('Error: %s', err);
		},
		function () {
			socket.emit('disconnected', {
				date: new Date(),
				user: socket.handshake.query.user
			});
			console.log('user disconected');
		});

});

http.listen(3000, function() {
	console.log('socket port 3000');
});

module.exports = app;