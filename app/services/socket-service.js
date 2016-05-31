module.exports = function(config) {
	const 	moment = require('moment'),
	    	jwt = require('jwt-simple');

	return function(socket, next) {
		var token = socket.handshake.query.token;

		if (!token) {
			return next(new Error('Please make sure your request has an Authorization header'));
		}

		var payload = null;
		try {
			payload = jwt.decode(token, config.TOKEN_SECRET);
		}
		catch (err) {
			return next(new Error(err.message));
		}

		if (payload.exp <= moment().unix()) {
			return next(new Error('Token has expired'));
		}

		socket.handshake.query.user = payload.sub;
		next();
	}
};


module.exports['@singleton'] = true;
module.exports['@require'] = ['config'];