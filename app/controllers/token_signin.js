var token = require('../lib/token'),
	uuid = require('node-uuid'),
	Q = require('q');

module.exports = function(app) {
	var session = {};
	app.get('/token/signin',token.signIn(authFn));
};

module.exports.test = {};

var authFn = module.exports.test.authFn = function (req){
	var deferred = Q.defer(),
	id = uuid.v4();
	deferred.resolve({
		username: id
	});
	return deferred.promise;
}