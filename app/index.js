const express = require('express');

const app = require('./app.js');
express().use(app).listen(8008, function() {
	console.log('listening port 8008');
});