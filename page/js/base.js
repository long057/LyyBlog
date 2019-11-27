
var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tagList: [],
    },
    computed: {
        randomColor () {
            return function () {
                const red = parseInt(Math.random() * 255);
                const green = parseInt(Math.random() * 255);
                const blue = parseInt(Math.random() * 255);
                return "rgb("+ red + ", " + green + ", " + blue + ")";
            }
        },
        randomFontSize () {
            return function () {
                var fontSize = parseInt(Math.random() * 20 + 5);
                return fontSize +'px';
            }
        },
        getTagList() {
            var self = this;
            return function () {
                axios({
                    url: '/queryAllTag',
                    method: 'get',
                }).then(function (resp) {
                    var result = resp.data.data.concat([]);
                    for(var i = 0; i < result.length; i ++ ) {
                        result[i].tag = result[i].tag.indexOf('+') != -1 ? result[i].tag.replace(/\++/g, '') : result[i].tag;
                        result[i].link = './index.html?tag=' + result[i].tag;
                    }
                    self.tagList = result;
                }).catch(function (resp) {
                    console.log(resp);
                })
            }
        },
    },
    methods:{},
    created () {
        this.getTagList();
    }
});

var newHots = new Vue({
    el: '#new_hots',
    data: {
        hotList:[],
    },
    computed: {
        getNewHots () {
            var self = this;
            return function (){
                axios({
                    url: '/queryNewHots?size=10',
                    method: 'get',
                }).then(function (resp) {
                    var result = resp.data.data.concat([]);
                    var list = [];
                    result.forEach(ele => {
                        var temp = {};
                        temp.id = ele.id;
                        temp.title = ele.title;
                        temp.link = '/blog_detail.html&blogId=' + ele.id;
                        list.push(temp);
                    })
                    self.hotList = list;
                }).catch(function (resp) {
                    console.log(resp);
                })
            }
        }
    },
    created () {
        this.getNewHots();
    }
});

var newComments = new Vue({
    el: '#new_comments',
    data: {
        commentList: [],
    },
    computed: {
        getNewComments () {
            var self = this;
            return function () {
                axios({
                    url: '/queryNewComments?size=5',
                    method: 'GET',
                }).then(function ( resp ) {
                    var result = resp.data.data.concat([]);
                    result.forEach(ele => {
                        ele.link = './blog_detail.html?blogId=' + ele.blog_id;
                    })
                    self.commentList = result;
                }).catch(function ( resp ) {
                    console.log( resp );
                })
            }
        }
    },
    created () {
        this.getNewComments();
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