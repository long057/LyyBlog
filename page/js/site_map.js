
var siteMap = new Vue({
    el: "#article_wrap",
    data: {
        list: [],
        nowPage: 1,
        pageSize: 20,
        count: 100,
        pageNumList: [],
        totalPage: 0,
    },
    computed: {
        getTotalCount() {
            var self = this;
            return function () {
                axios({
                    url: '/queryBlogCount',
                    method: 'get',
                }).then( function ( resp ) {
                    self.count = resp.data.data[0].count;
                    self.totalPage = parseInt( (self.count + self.pageSize) /self.pageSize );
                    self.generatePageTool();
                } ).catch( function ( resp ) {
                    console.log( resp );
                } )
            }
        },
        getArticleList () {
            var self = this;
            return function () {
                axios({
                    url: '/queryBlogByPage?nowPage=' + self.nowPage + '&pageSize=' + self.pageSize,
                    method: 'get',
                }).then(function ( resp ) {
                    var result = resp.data.data.concat([]);
                    result.forEach( ele => {
                        ele.link = './blog_detail.html?blogId=' + ele.id;
                    })
                    self.list = result;
                }).catch(function ( resp ) {
                    console.log( resp );
                });
            }
        }
    },
    methods: {
        jumpTo ( page ) {
            if( page.text != '>>' && page.text != '<<' && page.text != '...') {
                this.nowPage = page.page;
            }
            if( page.text == '<<' && this.nowPage > 1 ) {
                this.nowPage --;
            } else if( page.text == '>>' && this.nowPage < this.totalPage) {
                this.nowPage ++;
            }
            this.getArticleList();
        },
        generatePageTool () {
            var self = this;
            var nowPage = self.nowPage;
            const totalPage = self.totalPage;
            var list = [];
            list.push({text: '<<', page: 1});
            list.push({text: 1, page: 1});
            if(nowPage > 5 && nowPage < totalPage) {
                list.push({text: '...', page: -1});
            }
            var  start = nowPage - 2;
            const end = nowPage + 2;
            for(; start <= end ; start ++ ) {
                if( start > 1 && start < totalPage ) {
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
        this.getTotalCount();
    }
})