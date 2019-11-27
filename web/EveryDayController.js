var timeUtil = require('../util/TimeUtil');
var respUtil = require('../util/WriteResult');
var everyDayDao = require('../dao/EveryDayDao');

var path = new Map();
function editEveryDay(request, response) {
    request.on('data', function (data) {
        data = decodeURIComponent(data.toString());
        var paramList = data.split('&');
        var params = [];
        paramList.forEach(ele => {
            var temp = ele.split('=');
            params[temp[0].trim()] = temp[1].replace(/(\+|\s)+/g, ' ').trim();
        });
        everyDayDao.insertEveryDay(params.contentEn, params.contentZh, params.author, timeUtil.getNowTime(), timeUtil.getNowTime(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success', '添加成功', null));
            response.end();
        })
    })
}
path.set('/editEveryDay', editEveryDay);

function queryEveryDay(requset, response) {
    everyDayDao.queryEveryDay(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '获取成功', result));
        response.end();
    })
}
path.set('/queryEveryDay', queryEveryDay);

module.exports.path = path;