module.exports = function(db) {

	return db;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['db'];
