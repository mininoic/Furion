var socketio = require('socket.io'),
	token = require('../app/lib/token'),
	_ = require('underscore'),
	Q = require('q');

var IO = {};

IO.def = function(httpServer){
	var io = socketio.listen(httpServer);
	io.set('log level', 1);
	
	this.sockets = {};
	this.get = function(profile){
		var deferred = Q.defer();
		if (_.isString(profile)){
			deferred.resolve(this.sockets[profile]);
		} else if (profile.username) {
			deferred.resolve(this.sockets[profile.username]);
		} else deferred.reject();
		return deferred.promise;
	};
	this.connect = function(profile, socket){
		var deferred = Q.defer();
		if (_.isString(profile)){
			this.sockets[profile] = socket;
			deferred.resolve();
		} else if (profile.username) {
			this.sockets[profile.username] = socket;
			deferred.resolve();
		} else deferred.reject();
		return deferred.promise;
	};
	this.disconnect = function(profile){
		var deferred = Q.defer();
		if (_.isString(profile)){
			this.sockets[profile] = false;
			deferred.resolve();
		} else if (profile.username) {
			this.sockets[profile.username] = false;
			deferred.resolve();
		} else deferred.reject();
		return deferred.promise;
	};
	this.notify = function(profile, message, data){
		var deferred = Q.defer();
		this.get(profile).then(function(socket){
			socket.emit(message, data);
			deferred.resolve();
		}, function(err){
			deferred.reject();
		});
		return deferred.promise;
	};
	this.on = function(profile, evt, fn){
		var deferred = Q.defer();
		this.get(profile).then(function(socket){
			socket.on(evt, function(data){
				fn(data,socket)
			});
			deferred.resolve();
		}, function(err){
			deferred.reject();
		});
		return deferred.promise;
	};
	this.off = function(profile, evt){
		var deferred = Q.defer();
		this.get(profile).then(function(socket){
			socket.removeListener(evt, function(err){
				if (err) deferred.reject();
				deferred.resolve();
			});
		}, function(err){
			deferred.reject();
		});
		return deferred.promise;
	};
	this.BROADCAST = function(message, data){
		io.sockets.emit(message,data);
	};
	this.Events = {};
	var events = this.Events;
	this.ON = function(evt, fn){
		events[evt] = fn;
	};
	this.io = io;

	var self = this;
	
	token.protectSocket(io);
	
	io.sockets.on('connection', function(socket){
		var profile = token.socketProfile(socket)
		
		self.connect(profile, socket)
		.then(function(){
			socket.emit('authentication succeed');
		}, function(err){
			socket.emit('authentication failed');
		});
		
		socket.on('disconnect', function() {
			self.disconnect(profile.username);
		});
		for (evt in events){
			socket.on(evt, function(data){
				events[evt](data,socket);
			});
		}
	});
};

module.exports = IO;