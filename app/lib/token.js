var expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),
	Args = require('args-js'),
	Q = require('q'),
	socketioJwt = require('socketio-jwt');

var secret = "bC4v3?47J7Cir]t?2RPengK)es?RoiYT$ML{p3&LRT77]6V=HT)8CqoHCH88eGk38g:rAh.sfZ;VRAJf>4)jw4np7VVqK@[9d[)8";

exports.protect = expressJwt({secret: secret});

exports.protectSocket = function(io){
	io.set('authorization', socketioJwt.authorize({
	  secret: secret,
	  handshake: true
	}));
};

exports.socketProfile = function(socket){
	return socket.handshake.decoded_token;
};

exports.verify = function(token, callback){
	var deferred = Q.defer();
	jwt.verify(token, secret, function(err, decoded) {
		if (err) deferred.reject(new Error(false));
		else deferred.resolve(decoded);
	});
	return deferred.promise;
};

exports.signIn = function(){

	var args = Args([
		{authFn:    		Args.FUNCTION | Args.Optional,
			_default: function(req){
				var deferred = q.defer();
				deferred.resolve({
					username: 'test'
				});
				return deferred.promise;
			}},
		{expiresInMinutes:  Args.INT      | Args.Optional,
			_default: 300},
		{failFn: 			Args.FUNCTION | Args.Optional,
			_default: function(res){
				res.send(401, 'Wrong user or password');
			}}
	], arguments);

	return function (req, res) {

		args.authFn(req)
		.then(function(profile){
			var token = jwt.sign(profile, secret,
				{expiresInMinutes: args.expiresInMinutes});
			res.json({ token: token });
		}).fail(function(err){
			args.failFn(res);
		});
	};

};