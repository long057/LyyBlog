var blogDao = require('../dao/BlogDao');
var tagsDao = require('../dao/TagsDao');
var tagBlogMappingDao = require('../dao/TagBlogMappingDao');
var timeUtil = require('../util/TimeUtil');
var respUtil = require('../util/WriteResult');
var url = require('url');

var path = new Map();

function addViews( request, response ) {
    var params = url.parse( request.url, true ).query;
    blogDao.addViews(parseInt( params.view ),parseInt( params.blogId ), function ( result ) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '添加成功', null ));
        response.end();
    })
}
path.set( '/addViews', addViews );

function queryBlogDetailByBlogId( request, response ) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByBlogId( parseInt( params.blogId ) , function ( result ) {
        response.writeHead( 200 );
        response.write( respUtil.writeResult( 'success', '获取成功', result ));
        response.end();
    })
}
path.set( '/queryBlogDetailByBlogId', queryBlogDetailByBlogId );

function queryNewHots(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryNewHots(parseInt(params.size), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '获取成功', result));
        response.end();
    })
}
path.set('/queryNewHots', queryNewHots);

function queryBlogCountByTag(request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {
        var tagId = result[0].id;
        tagBlogMappingDao.queryBlogCountByTagId(tagId, function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success', '获取成功', result));
            response.end();
        })
    })
}
path.set('/queryBlogCountByTag', queryBlogCountByTag);

function queryBlogCount(request, response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '获取成功', result));
        response.end();
    })
}
path.set('/queryBlogCount', queryBlogCount);

function queryBlogByTag(request, response) {
    var params = url.parse(request.url, true).query;
    // tag --> tagId  --> blogId  --> blogList
    // 一篇文章有多个tag 每次插入文章都会插入tag  tag不能重复
    tagsDao.queryTag(params.tag, function (result) {
        var tagId = result[0].id;
        queryBlogIdByTagId(tagId, parseInt(params.nowPage) - 1, parseInt(params.pageSize), response);
    })

}
path.set('/queryBlogByTag', queryBlogByTag);


function queryBlogByPage(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByPage(parseInt(params.nowPage) - 1, parseInt(params.pageSize), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult('success', '获取成功', result));
        response.end();
    })
}
path.set('/queryBlogByPage', queryBlogByPage);

function insertBlog(request, response) {
    request.on('data', function (data) {
        data = decodeURIComponent(data.toString());

        var paramsList = data.split('&');
        var params = [];
        paramsList.forEach(function (ele, index) {
            var temp = ele.split('=');
            params[temp[0].trim()] = temp[1].replace(/(\+|\s)+/g, ' ').trim();
        })
        blogDao.insertBlog(params.title, params.content, params.tags, 0, timeUtil.getNowTime(), timeUtil.getNowTime(), function (result) {
            var blogId = result.insertId;
            var tags = params.tags.replace(/(，|,|\++|\s+)/g, ' ');
            var tagList = tags.split(' ');
            tagList.forEach(ele => {
                queryTag(ele, blogId, response);
            })
        })
    })
}
path.set('/insertBlog', insertBlog);

function queryBlogIdByTagId(tagId, page, pageSize, response) {
    tagBlogMappingDao.queryBlogIdByTagId(tagId, page, pageSize,function ( result ) {
        queryBlogByBlogId(result, response);
    })
}

function queryBlogByBlogId(blogIdList, response) {
    var blogList = [];
    for(var i = 0; i < blogIdList.length; i ++) {
        var blogId = blogIdList[i]['blog_id'];
        blogDao.queryBlogByBlogId(blogId, function (result) {
            blogList.push(result[0]);

            if(blogList.length == blogIdList.length) {
                response.writeHead(200);
                response.write(respUtil.writeResult('success', '获取成功', blogList));
                response.end();
            }

        })
    }

}

function queryTag(tag, blogId, response) {
    tagsDao.queryTag(tag, function (result) {
        if(result == null || result.length == 0) {
            insertTag(tag, blogId, response);
        } else {
            insertTagBlogMapping(result[0].id, blogId, response);
        }
    })
}

function insertTag(tag, blogId, response) {
    tagsDao.insertTag(tag , blogId , timeUtil.getNowTime(), timeUtil.getNowTime() , function (result) {
        var tagId = result.insertId;
        insertTagBlogMapping(tagId, blogId, response);
    })
}

function insertTagBlogMapping (tagId, blogId, response) {
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, timeUtil.getNowTime(), timeUtil.getNowTime(), function (result) {
        if(result.insertId) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success', '添加成功', null));
            response.end();
        }
    })
}

module.exports.path = path;