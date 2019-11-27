var express = require('express');
var globalConfig = require('./config');
var loader = require('./loader');

var app = new express();

app.use(express.static(globalConfig['page_path']));

app.post('/insertBlog', loader.get('/insertBlog'));
app.post('/editEveryDay', loader.get('/editEveryDay'));

app.get('/queryEveryDay', loader.get('/queryEveryDay'));

app.get('/queryBlogByPage', loader.get('/queryBlogByPage'));

app.get('/queryBlogByTag', loader.get('/queryBlogByTag'));

app.get('/queryBlogCount', loader.get('/queryBlogCount'));

app.get('/queryAllTag', loader.get('/queryAllTag'));

app.get('/queryBlogCountByTag', loader.get('/queryBlogCountByTag'));

app.get('/queryNewHots', loader.get('/queryNewHots'));

app.get('/queryNewComments', loader.get('/queryNewComments'));

app.get('/queryBlogDetailByBlogId', loader.get('/queryBlogDetailByBlogId'));

app.post('/addComment', loader.get( '/addComment' ));

app.get('/queryCommentsByBlogId', loader.get( '/queryCommentsByBlogId' ));

app.get( '/queryRandomCode', loader.get( '/queryRandomCode' ));

app.post( '/addViews', loader.get( '/addViews' ));


app.listen(globalConfig['port'], function () {
    console.log('server is running');
})