var dbutil = require('./dbutil');

function addViews( view, blogId , success ) {
    var updateSql = 'update blog set views = ? where id = ?;';
    var params = [view, blogId];
    var connection = dbutil();
    connection.connect();
    connection.query(updateSql, params, function (err, result) {
        if(err == null) {
            success(result);
            return;
        } else {
            throw new Error(err);
        }
    });
    connection.end();
}

function queryNewHots(size, success) {
    var querySql = "select * from blog order by id desc limit ?;";
    var params = [size];

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

function queryBlogCount(success) {
    var querySql = "select count(1) as count from blog;";
    var params = [];
    var connection = dbutil();
    connection.connect();
    connection.query( querySql , params , function ( err, result ) {
        if(err == null) {
            success( result );
            return;
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

function queryBlogByBlogId(blogId, success) {
    var querySql = "select * from blog where id = ?;";
    var params = [blogId];
    var connection = dbutil();
    connection.connect();
    connection.query( querySql , params , function ( err, result ) {
        if(err == null) {
            success( result );
            return;
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

function queryBlogByPage(page, pageSize, success) {
    var querySql = "select * from blog order by id desc limit ?, ?;";
    var params = [page * pageSize, pageSize];

    var connection = dbutil();
    connection.connect();
    connection.query( querySql , params , function ( err, result ) {
        if(err == null) {
            success( result );
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

function insertBlog(title, content, tags, views, ctime, utime, success) {
    var insertSql = "insert into blog (title,content,tags,views,ctime,utime) values (?,?,?,?,?,?);";
    var params = [title, content, tags, views, ctime, utime];

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
    insertBlog,
    queryBlogByPage,
    queryBlogByBlogId,
    queryBlogCount,
    queryNewHots,
    addViews
}