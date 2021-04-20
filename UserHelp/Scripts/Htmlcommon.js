$(window).resize(function () {
    $('.text_img').each(function () {
        $(this).css({
            "margin-left":($('.terminal_content').width()/2)-($(this).width()/2)+'px'
        })
    });
});

function scrollHide(){
    $("body").css("overflow-y","hidden");
}
function scrollShow(){
    $("body").css("overflow-y","auto");
}