const IoC = require('electrolyte'),
	express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser');

IoC.use(IoC.dir('app'));
IoC.use(IoC.dir('app/routers'));
IoC.use(IoC.dir('app/services'));

const app = express.Router()
	.use(cors())
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())
	.use('/api', IoC.create('auth-router'));

module.exports = app;