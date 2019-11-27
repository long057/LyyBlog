var fs = require('fs');
var globalConfig = require('./config');

var files = fs.readdirSync(globalConfig['web_path']);

var controllerSet = [];
var pathMap = new Map();

for(var i = 0; i < files.length; i ++) {
    var temp = require('./' + globalConfig['web_path'] + '/' + files[i]);
    if(temp.path) {
        for(var [key, value] of temp.path) {
            if(pathMap.get(key) == null) {
                pathMap.set(key, value);
            } else {
                throw new Error('url pat异常：' + key);
            }
        }
        controllerSet.push(temp.path);
    }
}
module.exports = pathMap;