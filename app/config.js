module.exports = function() {

	const path = require('path'),
		  root = path.resolve(path.dirname(require.main.filename), '..');

	const config = {
		db: {
			path: path.join(root, '/data/db')
		},
		GOOGLE_SECRET: 'KgmsVWkZiHTe2padfnmym_TG',
		TOKEN_SECRET: 'ASDFASasdfasDCQSREzADGvsdfhwq' + Math.floor(Math.random()*100),
		GITHUB_SECRET: 'e64f082819bae7850a7d9d2aab63ef6cb113b4be'
	};

	return config;
};

module.exports['@singleton'] = true;