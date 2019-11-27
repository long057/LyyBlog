
var articleDetail = new Vue({
    el: "#article_detail",
    data: {
        article: {},
    },
    computed: {
        getArticle () {
            var self = this;
            return function () {
                var blogId = getUrlParams();
                axios({
                    url: '/queryBlogDetailByBlogId?blogId=' + blogId,
                    method: 'get',
                }).then(function ( resp ) {
                    var result = resp.data.data[0];
                    self.article = result;
                }).catch( function ( resp ) {
                    console.log( resp );
                });
            }
        },
    },
    methods: {

    },
    created () {
        this.getArticle();
    }
});

var commentList = new Vue({
    el: '#comment_list_wrap',
    data: {
        commentCount: 0,
        commentList: [],
    },
    computed: {
        getCommentList () {
            var self = this;
            return function () {
                var blogId = getUrlParams();
                axios({
                    url: '/queryCommentsByBlogId?blogId=' + blogId,
                    method: 'get',
                }).then(function ( resp ) {
                    var result = resp.data.data.concat([]);
                    result.forEach(ele => {
                        if( ele.parent > -1 ) {
                            ele.options = '回复@' + ele.parent_name;
                        }
                    })
                    self.commentList = result;
                }).catch( function ( resp ) {
                    console.log( resp );
                });
            }
        }
    },
    methods: {
        reply (commentId, userName) {
            document.getElementsByClassName('comment_reply')[0].value = commentId;
            document.getElementsByClassName('comment_reply_name')[0].value = userName;
        }
    },
    created () {
        this.getCommentList();
    }
});

var sendComments = new Vue({
    el: '#send_comments',
    data: {
        vcode: '',
        rightCode: '',
    },
    computed: {
        changeCode () {
            var self = this;
            return function () {
                axios({
                    url: '/queryRandomCode',
                    method: 'get',
                }).then(function ( resp ) {
                    self.vcode = resp.data.data.data;
                    self.rightCode = resp.data.data.text;
                }).catch(function ( resp ) {
                    console.log(resp);
                })
            }
        },
    },
    methods: {
        addComment() {
            var code = document.getElementsByClassName('comment_code')[0].value;
            if(code != this.rightCode) {
                alert('验证码错误');
                this.changeCode();
                return;
            }
            var blogId = getUrlParams();
            var replyParent = document.getElementsByClassName('comment_reply')[0].value;
            var replyParentName = document.getElementsByClassName('comment_reply_name')[0].value;
            var name = document.getElementsByClassName('comment_name')[0].value;
            var email = document.getElementsByClassName('comment_email')[0].value;
            var content = document.getElementsByClassName('comment_content')[0].value;
            axios({
                url: '/addComment',
                method: 'post',
                data: {
                    parent: replyParent,
                    parentName: replyParentName,
                    name,
                    email,
                    content,
                    blogId,
                },
            }).then(function ( resp ) {
                alert('评论成功');
                location.reload();
            }).catch(function ( resp ) {
                console.log( resp );
            });
        },
    },
    created () {
        this.changeCode();
    }
});

function getUrlParams() {
    var searchUrlParams = location.search.indexOf('?') != -1 ? location.search.split('?')[1] : '';
    var blogId = -10;
    for( var i = 0; i < searchUrlParams.split('&').length ; i ++ ) {
        var temp = searchUrlParams.split('&')[i].split('=');
        if(temp[0] == 'blogId') {
            try {
                blogId = temp[1];
            } catch (e) {
                throw new Error( e );
            }
        }
    }
    return blogId;
}