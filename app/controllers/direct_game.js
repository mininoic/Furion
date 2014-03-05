var Rooms = require('./game/Rooms');

module.exports = function run(app) {
	app.get('/api/create-new-direct-game', function(req, res){
		//IF req.user played all
		var room = Rooms.create();
		res.send(200,room.id);
	});
};