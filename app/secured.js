module.exports = function(config) {
	const jwt = require('jwt-simple'),
		moment = require('moment');

	return function(req, res, next) {
		if (!req.headers.authorization) {
			return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
		}
		var token = req.headers.authorization.split(' ')[1];

		var payload = null;
		try {
			payload = jwt.decode(token, config.TOKEN_SECRET);
		}
		catch (err) {
			return res.status(401).send({ message: err.message });
		}

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({ message: 'Token has expired' });
		}
		req.user = payload.sub;
		next();
	};
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['config'];