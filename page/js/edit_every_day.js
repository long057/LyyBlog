
const $author = $('.author');
const $contentEn = $('.edit_content_en');
const $contentZh = $('.edit_content_zh');

$('.submit').on('click', function () {
    var author = $author.val();
    var contentEn = $contentEn.val();
    var contentZh = $contentZh.val();

    $.ajax({
        url: '/editEveryDay',
        type: 'post',
        data: {
            author,
            contentEn,
            contentZh
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    }).then(function (resp) {
        console.log(resp);
    }, function (resp) {
        console.log(resp);
    })
})