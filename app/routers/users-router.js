module.exports = function(secured, datastore) {
	const express = require('express'),
		  router = express.Router();

	router.get('/users/:id', secured, function(req, res, next) {
		datastore.users.findOne({_id: req.params.id}, function(err, doc) {
			if(err){return next(err);}
			res.json(doc);
		});
	});

	return router;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['secured', 'datastore'];