var root = require('find-root')(),
	IO = require(root+'/config/socketio');


var Player = function(username){
	this.username = username;
	this.score = 0;
	this.submittedAnswer = null;
	var self = this;
	IO.on(username, 'answer', function(data, socket){
		console.log(data.answer);
		self.answer(data);
	});
};
Player.prototype = {
	notify: function(message, data){
		return IO.notify(this.username, message, data);
	},
	profile: function(){
		return this.username;
	},
	answer: function(data){
		this.submittedAnswer = data.answer;
		if (this.onAnswer) this.onAnswer(data.answer, this.username);
	},
	addScore: function(isCorrect, startTime){
		console.log(isCorrect, startTime);
		var deltaTime = Date.now() - startTime;
		var scoreTime = 10000 - deltaTime;
		if (scoreTime > 0){
			this.score += (scoreTime / 1000) << 0;
		}
	}
};
module.exports = Player;