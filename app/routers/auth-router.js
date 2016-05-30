module.exports = function(config, datastore) {
	const express = require('express'),
		request = require('request'),
		jwt = require('jwt-simple'),
		moment = require('moment'),
		qs = require('querystring'),
		router = express.Router();

	function createJWT(user) {
		var payload = {
			sub: user._id,
			iat: moment().unix(),
			exp: moment().add(14, 'days').unix()
		};
		return jwt.encode(payload, config.TOKEN_SECRET);
	}

	router.post('/auth/google', function(req, res) {
		var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
		var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
		var params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.GOOGLE_SECRET,
			redirect_uri: req.body.redirectUri,
			grant_type: 'authorization_code'
		};

		// Step 1. Exchange authorization code for access token.
		request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
			var accessToken = token.access_token;
			var headers = { Authorization: 'Bearer ' + accessToken };

			// Step 2. Retrieve profile information about the current user.
			request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
				if (profile.error) {
					return res.status(500).send({message: profile.error.message});
				}

				// Step 3. Create a new user account or return an existing one.
				datastore.users.findOne({ google: profile.sub }, function(err, existingUser) {
					if (existingUser) {
						return res.send({ token: createJWT(existingUser) });
					}
					var user = {};
					user.google = profile.sub;
					user.picture = profile.picture.replace('sz=50', 'sz=200');
					user.displayName = profile.name;
					datastore.users.insert(user, function(err, user) {
						var token = createJWT(user);
						res.send({ token: token });
					});
				});
			});
		});
	});

	router.post('/auth/github', function(req, res) {
		var accessTokenUrl = 'https://github.com/login/oauth/access_token';
		var userApiUrl = 'https://api.github.com/user';
		var params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.GITHUB_SECRET,
			redirect_uri: req.body.redirectUri
		};

		// Step 1. Exchange authorization code for access token.
		request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
			accessToken = qs.parse(accessToken);
			var headers = { 'User-Agent': 'Satellizer' };

			// Step 2. Retrieve profile information about the current user.
			request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {


				// Step 3b. Create a new user account or return an existing one.
				datastore.users.findOne({ google: profile.sub }, function(err, existingUser) {
					if (existingUser) {
						return res.send({ token: createJWT(existingUser) });
					}
					var user = {};
					user.github = profile.id;
					user.picture = profile.avatar_url;
					user.displayName = profile.name;
					datastore.users.insert(user, function(err, user) {
						var token = createJWT(user);
						res.send({ token: token });
					});
				});
			});
		});
	});


	return router;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['config', 'datastore'];