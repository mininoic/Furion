module.exports = function(app){
	app.require(function(IO){
		var Player = function(username){
			this.username = username;
			this.score = 0;
			this.submittedAnswer = null;
			var self = this;
			IO.on(username, 'answer', function(data, socket){
				self.answer(data);
			});
		};
		Player.prototype = {
			notify: function(message, data){
				return IO.notify(username, message, data);
			},
			profile: function(){
				return username;
			},
			answer: function(data){
				this.submittedAnswer = data.answer;
				if (this.onAnswer) this.onAnswer(data.answer, this.username);
			},
			addScore: function(isCorrect, startTime){
				var deltaTime = Date.now() - startTime;
				var scoreTime = 10000 - deltaTime;
				if (scoreTime > 0){
					this.score += (scoreTime / 1000) << 0;
				}
			}
		};
		app.createModule('Player', Player);
	})
};