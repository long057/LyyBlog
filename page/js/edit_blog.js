const $title = $('.title');
const $tags = $('.tags');
const $content = $('.edit_content');

$('.submit').on('click', function () {
    var title = $title.val();
    var tags = $tags.val();
    var content = $content.val();

    $.ajax({
        url: '/insertBlog',
        type: 'post',
        data: {
            title,
            tags,
            content,
        },
    }).then(function (resp) {
        alert( '提交成功' );
        $title.val('');
        $tags.val('');
        $content.val('');
    }, function (resp) {
        console.log(resp);
    })
})