var fs = require('fs');

var globalConfig = {};

var conf = fs.readFileSync('./server.conf');
var confs = conf.toString().split('\r\n');

for(var i = 0; i < confs.length; i ++) {
    globalConfig[confs[i].split('=')[0].trim()] = confs[i].split('=')[1].trim();
}

module.exports = globalConfig;