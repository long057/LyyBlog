var dbutil = require('./dbutil');

function queryAllTag(success) {
    var querySql = "select * from tags limit 30;";

    var connection = dbutil();
    connection.connect();
    connection.query(querySql, function (err, result) {
        if(err == null) {
            success(result);
            return;
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

function queryTag(tag, success) {
    var querySql = "select * from tags where tag = ?;";
    var params = [tag];
    var connection = dbutil();
    connection.connect();
    connection.query(querySql, params, function (err, result) {
        if(err == null) {
            success(result);
            return;
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

function insertTag(tag, blogId, ctime, utime, success) {
    var insertSql = "insert into tags (tag,blog_id, ctime, utime) values (?,?,?,?);";
    var params = [tag, blogId, ctime, utime];
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

module.exports = {
    queryTag,
    insertTag,
    queryAllTag
}