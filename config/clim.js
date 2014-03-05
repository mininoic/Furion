var colors    = require('colors'),
    clim      = require('clim'),
    pad       = require('node-string-pad');

console.end = function(title){
  clim.logWrite('DONE','',pad('[ '+'DONE '.green+title.toUpperCase().red+' ]', 90, 'X'.yellow, 'BOTH') );
  console.log();
};

console.obj = function(obj){
  console.debug(nodedump(obj));
};

console.done = function(mess){
  clim.logWrite('DONE','',mess );
};

console.debug = function(mess){
  clim.logWrite('DEBUG','',mess );
};

console.req = function(req, mess){
  var ip = req.connection.remoteAddress + ' ';
  clim.logWrite('REQ','',ip.yellow + mess );
};

console.res = function(req, mess){
  var ip = ' '+req.connection.remoteAddress;
  clim.logWrite('RES','',mess + ip.yellow);
};

console.title = function(title){
  console.log();
  clim.logWrite('TITLE','',pad('[ '+title.red+' ]', 80, '-'.yellow, 'BOTH') );
};

module.exports = function(){
  
  clim(console, true);
  clim.getTime = function(){
    var now = new Date();
    var hour = now.getHours(); hour = hour<10?'0':'' + hour;
    var minute = now.getMinutes(); minute = (minute<10?'0':'') + minute;
    var second = now.getSeconds(); second = (second<10?'0':'') + second;
    return hour+':'+minute+':'+second;
  };
  clim.logWrite = function(level, prefixes, msg) {
    // Default implementation writing to stderr
    var color = 'grey';
    switch (level) {
      case 'TITLE'  : color = 'white'; break;
      case 'DONE'   : color = 'green'; break;
      case 'WARN'   : color = 'yellow'; break;
      case 'REQ'    : color = 'yellow'; break;
      case 'RES'    : color = 'green'; break;
      case 'ERROR'  : color = 'red'; break;
      case 'DEBUG'  : color = 'red'; break;
    }
    var line = clim.getTime() + ' ' + pad(level, 5).bold[color] + ' | ';
    if (prefixes.length > 0) line += prefixes.join(' ');
    line += msg;
    process.stderr.write(line + '\n');

    // or post it web service, save to database etc...
  };
};