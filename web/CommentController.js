var url = require( 'url' );
var timeUtil = require( '../util/TimeUtil' );
var respUtil = require( '../util/WriteResult' );
var commentDao = require( '../dao/CommentDao' );
var captcha = require('svg-captcha');

var path = new Map();

function queryRandomCode( request, response ) {
    var img = captcha.create({fontSize: 50, width: 100, height: 30});
    response.writeHead(200);
    response.write( respUtil.writeResult( 'success', '获取成功', img ) );
    response.end();
}
path.set( '/queryRandomCode', queryRandomCode );

function queryCommentsByBlogId( request, response ) {
    var params = url.parse( request.url, true ).query;
    commentDao.queryCommentsByBlogId( parseInt( params.blogId ), function ( result ) {
        response.writeHead(200);
        response.write( respUtil.writeResult( 'success', '评论成功', result ));
        response.end();
    })
}
path.set( '/queryCommentsByBlogId', queryCommentsByBlogId );

function addComment( request, response ) {
    request.on('data', function ( data ) {
        var params = JSON.parse( decodeURIComponent( data.toString() ) );
        commentDao.addComment(parseInt( params.blogId ), params.name, params.content, params.email, parseInt( params.parent ), params.parentName, timeUtil.getNowTime(), timeUtil.getNowTime(), function ( result ) {
            response.writeHead(200);
            response.write( respUtil.writeResult( 'success', '评论成功', null ));
            response.end();
        })
    })
}
path.set( '/addComment', addComment );

function queryNewComments( request, response ) {
    var params = url.parse( request.url, true).query;
    commentDao.queryNewComments( parseInt(params.size) , function (result ) {
        response.writeHead( 200 );
        response.write( respUtil.writeResult( 'success' , '获取成功' , result ) );
        response.end();
    })
}
path.set( '/queryNewComments', queryNewComments );

module.exports.path = path;