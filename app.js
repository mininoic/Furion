require('./config/clim')();

var express  = require('express'),
	mongoose = require('mongoose'),
	config   = require('./config/config'),
	socketio = require('./config/socketio'),
	fs  = require('fs');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function(file) {
	if (file.length - file.indexOf('.js') === 3) {
		require(modelsPath+'/'+file)(app);
	}
});

console.title('ANHNT MININOIC CONSOLE');
var app = express();
app.socketio = new socketio(app.listen(config.port));

console.title('STARTING SERVER');
require('./config/express')(app, config);
require('./config/routes')(app);
