module.exports = function (config) {
	const nedb = require('nedb'),
		path = require('path'),
		db = {};

	db.users = new nedb({filename: path.join(config.db.path, '/users.nedb'), autoload: true});

	db.invites = new nedb({filename: path.join(config.db.path + '/invites.nedb'), autoload: true});

	return db;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['config'];