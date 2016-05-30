module.exports = function(config, datastore) {
	const express = require('express'),
		request = require('request'),
		jwt = require('jwt-simple'),
		moment = require('moment'),
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

		var inviteToken = req.body.invite;
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
					datastore.invites.findOne({token: inviteToken}, function(err, invite) {
						if(!invite){
							return res.status(404).send({message: 'Invite not found.'});
						}
						if(invite.used){
							return res.status(400).send({message: 'Invite already used.'});
						}
						datastore.invites.update({token: inviteToken}, {$set: {used: true}});
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
	});

	router.post('/auth/facebook', function(req, res) {
		var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
		var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
		var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
		var params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.FACEBOOK_SECRET,
			redirect_uri: req.body.redirectUri
		};

		var inviteToken = req.body.invite;
		// Step 1. Exchange authorization code for access token.
		request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
			if (response.statusCode !== 200) {
				return res.status(500).send({ message: accessToken.error.message });
			}

			// Step 2. Retrieve profile information about the current user.
			request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
				if (response.statusCode !== 200) {
					return res.status(500).send({ message: profile.error.message });
				}
				if (req.header('Authorization')) {
					User.findOne({ facebook: profile.id }, function(err, existingUser) {
						if (existingUser) {
							return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
						}
						var token = req.header('Authorization').split(' ')[1];
						var payload = jwt.decode(token, config.TOKEN_SECRET);
						User.findById(payload.sub, function(err, user) {
							if (!user) {
								return res.status(400).send({ message: 'User not found' });
							}
							user.facebook = profile.id;
							user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
							user.displayName = user.displayName || profile.name;
							user.save(function() {
								var token = createJWT(user);
								res.send({ token: token });
							});
						});
					});
				} else {
					// Step 3. Create a new user account or return an existing one.
					User.findOne({ facebook: profile.id }, function(err, existingUser) {
						if (existingUser) {
							var token = createJWT(existingUser);
							return res.send({ token: token });
						}
						datastore.invites.findOne({token: inviteToken}, function(err, invite) {
							if(!invite){
								return res.status(404).send({message: 'Invite not found.'});
							}
							if(invite.used){
								return res.status(400).send({message: 'Invite already used.'});
							}
							datastore.invites.update({token: inviteToken}, {$set: {used: true}});
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
				}
			});
		});
	});

	return router;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['config', 'datastore'];