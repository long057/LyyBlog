
var tagDao = require('../dao/TagsDao');
var respUtil = require('../util/WriteResult');

var path = new Map();

function queryAllTag(request, response) {
    tagDao.queryAllTag(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '获取成功', result));
        response.end();
    })
}

path.set('/queryAllTag', queryAllTag);

module.exports.path = path;