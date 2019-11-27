
var dbutil = require('./dbutil');

function queryBlogCountByTagId(tagId, success) {
    var querySql = "select count(1) as count from tag_blog_mapping where tag_id = ?;";
    var params = [tagId];
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

function queryBlogIdByTagId(tagId, page, pageSize, success) {
    var querySql = "select blog_id from tag_blog_mapping where tag_id = ? limit ?, ?;";
    var params = [tagId, page, pageSize];
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

function insertTagBlogMapping(tagId, blogId, ctime, utime, success) {
    var insertSql = "insert into tag_blog_mapping (tag_id, blog_id, ctime, utime) values (?,?,?,?);";
    var params = [tagId, blogId, ctime, utime];
    var connection = dbutil();
    connection.connect();
    connection.query(insertSql, params, function (err, result) {
        if(err == null) {
            success(result);
            return;
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

module.exports = {
    insertTagBlogMapping,
    queryBlogIdByTagId,
    queryBlogCountByTagId,
}