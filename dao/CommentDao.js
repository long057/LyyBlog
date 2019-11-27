var dbutil = require( './dbutil' );

function queryCommentsByBlogId( blogId, success ) {
    var querySql = "select * from comments where blog_id = ?;";
    var params = [blogId];
    var connection = dbutil();
    connection.connect();
    connection.query(querySql, params, function ( err, result ) {
        if( err == null ) {
            success( result );
            return;
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

function addComment(blogId, name, comment, email, parent, parentName, ctime, utime, success ) {
    var insertSql = 'insert into comments (blog_id, user_name, comment, email, parent, parent_name, ctime, utime) values (?,?,?,?,?,?,?,?);';
    var params = [blogId, name, comment, email, parent, parentName, ctime, utime];
    var connection = dbutil();
    connection.connect();
    connection.query(insertSql, params, function ( err, result ) {
        if( err == null ) {
            success( result );
            return;
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

function queryNewComments( size, success ) {
    var querySql = "select * from comments order by id desc limit ?;";
    var parmas = [ size ];

    var connection = dbutil();
    connection.connect();
    connection.query( querySql , parmas , function ( err , result ) {
        if( err == null ) {
            success( result );
            return;
        } else {
            throw new Error( err );
        }
    });
    connection.end();
}

module.exports = {
    queryNewComments,
    addComment,
    queryCommentsByBlogId
}