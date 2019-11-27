var dbutil = require('./dbutil');

function insertEveryDay(contentEn, contentZh, author, ctime, utime, success) {
    var insertSql = "insert into every_day (content_en, content_zh, author, ctime, utime) values (?,?,?,?,?);";
    var params = [contentEn, contentZh, author, ctime, utime];

    var connection = dbutil();
    connection.connect();
    connection.query(insertSql, params, function (err, result) {
        if(err == null) {
            success(result);
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

function queryEveryDay (success) {
    var querySql = "select * from every_day order by id desc limit 1;";
    var params = [];

    var connection = dbutil();
    connection.connect();
    connection.query(querySql, params, function (err, result) {
        if(err == null) {
            success(result);
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

module.exports = {
    insertEveryDay,
    queryEveryDay,
}