// var mongoose = require('mongoose'),
//   Article = mongoose.model('Article');

module.exports = function(app){
	app.get('/', function(req, res){
		// Article.find(function(err, articles){
		// 	if(err) throw new Error(err);
		// 	res.render('home/index', {
		// 		title: 'Generator-Express MVC',
		// 		articles: articles
		// 	});
		// });
	});
};