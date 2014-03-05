var uuid = require('node-uuid'),
	Q = require('q'),
	token = require('../../lib/token')
	IO = require('../socketio')();

var Rooms = { room: {} };
var room = Rooms.room;

Rooms.create = function(){
	var id = uuid.v4();
	while ( session.has(id) ) id = uuid.v4();
	this.room[id] = new Room();
	return id;
};

function Room(){
	this.questionsPack = new QuestionsPack();
	this.roundStartTime = null;
	this.player1 = null;
	this.player2 = null;
}

Room.prototype = {
	addPlayer: function(username){
		var deferred = Q.defer();
		//Create new Player
		var player = new Player(username);

		player.onAnswer = function(answer){
			var isCorrect = questionsPack.check(answer),
			self = this;

			if (isCorrect) self.addScore(self.roundStartTime);

			self.notify('2',{
				answer: questionsPack.correctAnswer(),
				enemyAnswer: (self.enemy && self.enemy.submittedAnswer)?self.enemy.submittedAnswer:null
			});

			self.enemy.notify('1',{
				enemyIsCorrect: isCorrect
			});
		};

		if (!this.player1) {
			this.player1 = player;
			deferred.resolve();
		} else if (!this.player2){
			this.player2 = player;

			var player1 = this.player1,
				player2 = this.player2,
				questions = this.questionsPack.questions;

			player1.enemy = player;
			player2.enemy = player1;

			var self = this;
			//Notify to both users to start game
			player1.notify('startGame', {
				enemy: player2.profile(),
				questions: questions
			}).then(function(){
				return player2.notify('startGame', {
					enemy: player1.profile(),
					questions: questions
				});
			}).then(function(){
				self.start();
				deferred.resolve();
			})
		} else deferred.reject();
		return deferred.promise;
	},
	start: function(){

		//RESET
		this.roundStartTime = Date.now();
		this.player1.submittedAnswer = null;
		this.player2.submittedAnswer = null;

		var self = this;
		if (this.currentQuestion < 6)
			setTimeout(function(){

				self.player1.notifyEnemyAnswer();
				self.player2.notifyEnemyAnswer();

				self.questionsPack.nextQuestion();
				self.start();
			}, 12000);
	}
};

function notifyEnemyAnswer(player){
	player.notify('4',{
		enemyAnswer: player.enemy.submittedAnswer
	});
}

IO.ON('join', function(data, socket){

	var profile = token.socketProfile(socket);

	room[data.roomId]
	.addPlayer(profile.username)
	then(function(){

	}).fail(function(){

	});
	
});

module.exports = Rooms;