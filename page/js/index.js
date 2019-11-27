
var everyDay = new Vue({
    el: '#blog_every_day',
    data: {
        contentEn: '',
        contentZh: '',
        author: '',
        colorStyle: {},
    },
    computed: {
        getData () {
            var self = this;
            return function () {
                axios({
                    url: '/queryEveryDay',
                    method: 'get',
                }).then(function (resp) {
                    self.contentEn = resp.data.data[0]['content_en'];
                    self.contentZh = resp.data.data[0]['content_zh'];
                    self.author = resp.data.data[0].author;
                }).catch(function (resp) {
                    console.log(resp);
                });
            }
        },
    },
    methods: {

    },
    created: function () {
        this.getData();
    }
});

var articleListVm = new Vue({
    el: '#article_list',
    data: {
        nowPage: 1,
        pageSize: 10,
        totalCount: 100,
        pageNumList: [],
        articleList: [
            {
                title: '文字表',
                content: 'wetateatret',
                date: '1019-292-20',
                views: '10',
                tags: ['tag','tag3'],
                link: '/',
            },
        ]
    },
    computed: {
        getTotalCount () {
            var self = this;
            return function (url) {
                axios({
                    url,
                    method: 'get',
                }).then(function (resp) {
                    self.totalCount = resp.data.data[0].count;
                    self.generatePageTool();
                }).catch(function (resp) {
                    console.log(resp);
                });
            }
        },
        getArticleList () {
            var self = this;
            return function () {
                var searchUrlParams = location.search.indexOf('?') != -1 ? location.search.split('?')[1] : '';
                var tag = '';
                for(var i = 0; i < searchUrlParams.split('&').length; i ++) {
                    var temp = searchUrlParams.split('&')[i].split('=');
                    if(temp[0] == 'tag') {
                        try{
                            tag = temp[1];
                        }catch (e) {
                            throw new Error(e);
                        }
                    }
                }
                if(tag == '') {
                    // 不是通过tag筛选文章
                    axios({
                        url: '/queryBlogByPage?nowPage=' + self.nowPage + '&pageSize=' + self.pageSize,
                        method: 'get',
                    }).then(function (resp) {
                        var result = resp.data.data;
                        self.dealResult(result);
                    }).catch(function (resp) {
                        console.log( resp );
                    });
                    self.getTotalCount('/queryBlogCount');
                } else {
                    // 通过tag筛选文章
                    axios({
                        url: '/queryBlogByTag?tag=' + tag + '&nowPage=' + self.nowPage + '&pageSize=' + self.pageSize ,
                        method: 'get',
                    }).then(function (resp) {
                        var result = resp.data.data;
                        self.dealResult(result);
                    }).catch( function ( resp ) {
                        console.log(resp);
                    });
                    self.getTotalCount('/queryBlogCountByTag?tag=' + tag);
                }
            }
        },
    },
    methods: {
        dealResult(result) {
            var list = result.concat([]);
            for(var i = 0; i < list.length; i ++ ) {
                list[i].link = '/blog_detail.html?blogId=' + list[i].id;
                var tagArr = [];
                list[i].tags.replace(/(,|，|\s+)/g, ' ').split(' ').forEach((ele, index) => {
                    var temp = {};
                    temp.tag = ele;
                    temp.link = './index.html?tag=' + ele;
                    tagArr.push(temp);
                })
                list[i].tags = tagArr;
                list[i].title.replace(/(\+|\s)+/g, ' ');
                list[i].content.replace(/(\+|\s)+/g, ' ');
            }
            this.articleList = list;
        },
        addView (view, blogId) {
            view ++;
            axios({
                url: '/addViews?view=' + view + '&blogId=' + blogId,
                method: 'post',
            }).then(function ( resp ) {
                console.log( resp );
            }).catch( function ( resp ) {
                console.log( resp );
            })
        },
        jumpToPage (page) {
            if(page.text != '<<'&& page.text != '>>' && page.text != '...') {
                this.nowPage = page.page;
            }
            if(page.text == '<<' && this.nowPage > 1) {
                this.nowPage --;
            } else if (page.text == '>>' && this.nowPage < parseInt((this.totalCount + this.pageSize) / this.pageSize)) {
                this.nowPage ++;
            }
            this.getArticleList();
        },
        generatePageTool() {
            var self = this;
            var nowPage = self.nowPage;
            var pageSize = self.pageSize;
            var totalCount = self.totalCount;
            var totalPage = parseInt((pageSize + totalCount ) / pageSize );
            var list = [];
            list.push({text: '<<', page: 1});
            list.push({text: 1, page: 1});
            if(nowPage > 4) {
                list.push({text: '...', page: -1});
            }
            var start = nowPage - 2;
            var end = nowPage + 2;
            for(; start <= end; start ++) {
                if(start > 1 && start < totalPage) {
                    list.push({text: start, page: start});
                }
            }
            if(nowPage + 2 < totalPage) {
                list.push({text: '...', page: -1});
            }
            if(totalPage > 1) {
                list.push({text: totalPage, page: totalPage});
            }
            list.push({text: '>>', page: totalPage});
            self.pageNumList = list;
        }
    },
    created () {
       this.getArticleList();
    }
});

