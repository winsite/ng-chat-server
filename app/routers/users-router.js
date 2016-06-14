module.exports = function(secured, datastore) {
	const express = require('express'),
		  router = express.Router();

	router.get('/users/:id', secured, function(req, res, next) {
		datastore.users.findOne({_id: req.params.id}, function(err, doc) {
			if(err){return next(err);}
			res.json(doc);
		});
	});

	router.get('/users', secured, function(req, res, next) {
		datastore.users.find({}, function(err, doc) {
			if(err){return next(err);}
			res.json(doc);
		});
	});

	router.get('/', function(req, res, next) {
		res.status(200).send('No Content');
	});

	return router;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['secured', 'datastore'];