const express = require('express');

const app = require('./app.js');
express().use(app).listen(8080, function() {
	console.log('listening port 8080');
});