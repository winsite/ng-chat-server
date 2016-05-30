const IoC = require('electrolyte'),
	express = require('express'),
	bodyParser = require('body-parser');

IoC.use(IoC.dir('app'));
IoC.use(IoC.dir('app/routers'));
IoC.use(IoC.dir('app/services'));

const app = express.Router()
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())
	.use('/api', IoC.create('auth-router'));

module.exports = app;