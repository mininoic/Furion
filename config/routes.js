var express = require('express'),
	fs = require('fs'),
	root = require('find-root')();

module.exports = function(app){
	var modelsPath = root + '/app/controllers';
	fs.readdirSync(modelsPath).forEach(function(file) {
		if (file.length - file.indexOf('.js') === 3) {
			require(modelsPath+'/'+file)(app);
		}
	});
};
