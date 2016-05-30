module.exports = function() {

	const path = require('path'),
		  root = path.resolve(path.dirname(require.main.filename), '..');

	const config = {
		db: {
			path: path.join(root, '/data/db')
		},
		GOOGLE_SECRET: '_94S6IGyg8D8111ozBBerjSO',
		TOKEN_SECRET: 'iYZ8m3lvjjR1QkXTzT5Y6g5h4HkQjloo'
	};

	return config;
};

module.exports['@singleton'] = true;