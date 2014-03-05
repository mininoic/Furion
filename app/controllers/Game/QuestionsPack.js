	var QuestionsPack = function(){
		this.questions = [{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		},{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		},{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		},{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		},{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		},{
			question: 'Question 1?',
			selections: ['A','B','C','D']
		}];
		this.answers = [0,1,2,3,0,1];
		this.currentQuestion = 0;
	};
	QuestionsPack.prototype = {
		check: function(answers){
			return answers === this.answers[this.currentQuestion];
		},
		currectAnswer: function(){
			return this.answers[this.currentQuestion];
		},
		nextQuestion: function(){
			this.currentQuestion++;
		}
	}
};