$(function () {
    try {
        var _serverUrl = window.location.href.substr(0, window.location.href.lastIndexOf('UserHelp/E47-help.html', window.location.href));
        var tempUrl;
        $.ajax({
            type: 'GET',
            url: _serverUrl + "BaseApi/Global/GetSubSystemsMainServerBySubjectID?appid=000&access_token=4d39af1bff534514e24948568b750f6c&sysIDs=260",
            data: '',
            success: function (sysUrl) {
                try {
                    //var sysUrl = $.parseJSON(sysUrls);
                    tempUrl = sysUrl.Data[0].WebSvrAddr;
                    if (tempUrl != undefined && tempUrl != '') {
                        $('#home-btn').attr('href', tempUrl + '/html/help');
                    }
                }
                catch (e) { $('#home-btn').attr('href', 'javascript:void();'); }
            }
        });
    } catch (ex) { $('#home-btn').attr('href', 'javascript:void();'); }

    var pageframe = document.getElementById('pageframe').contentWindow;
    $('#pageframe').attr("src", "./ProVersion.html");
    // nav收缩展开
    $('.nav-item>a').on('click', function () {
        $(".nav-item ul").slideUp(300);
        if ($(this).next().length <= 0) {
            //$(this).next().css('display') == "none" ||$(this).next().length<=0
            //展开未展开
            // $('.nav-item').children('ul').slideUp(300);
            //$(this).next('ul').slideDown(300);
            $(".nav-item li a").css("background-color", "transparent");
            $(".nav-item").removeClass("slideDown");
            $(this).parent('li').addClass('nav-show').siblings('li').removeClass('nav-show');
        } else if ($(this).next().css('display') == "none") {
            //收缩已展开
            //$('.nav-item.nav-show').removeClass('nav-show');
            $(this).next('ul').slideDown(300);
            $(".nav-item").removeClass("slideDown");
            $(this).parent().addClass("slideDown");
        } else {
            $(this).parent().removeClass("slideDown");
        }
    });
    //左上角回到帮助系统首页
    // $("#home-btn").on("click", function () {
    //     $.ajax({
    //         url: "yun/260",
    //         type: "get",
    //         success: function(res){
    //             if(res.StatusCode === 200){
                    
    //                 window.open(res.result.webSvrAddr + "html/help?lg_tk=")
    //             }
    //         }
    //     })
    // });
    $(".listarrow").on("click", function () {

        if ($("#content").attr("data-showlist") == "0") {
            $('#list').css('overflow-y', "auto");
            $("#content").attr("data-showlist", 1);
            if (isIE()) {
                console.log(1);
                pageframe.scrollHide();
                $("#page").css({
                    "width": "80%"
                });
                // $('#page').animate({
                //     "width":"80%"
                // },100);
                window.setTimeout(pageframe.scrollShow, 600)
            }

        }
        else {
            $("#content").attr("data-showlist", 0);

            if (isIE()) {
                console.log(2);
                $('#list').css('overflow-y', "hidden");
                // window.setTimeout(function () {
                //     $("#page").css({
                //         "width":"calc(100% - 2px)"
                //     });
                // }, 500);

                pageframe.scrollHide();
                $('#page').animate({
                    "width": $('#content').width() - 2 + 'px'
                }, 600, function () {
                    pageframe.scrollShow();
                });
            }
        }
    });



    $(".jumpurl").on("click", function () {

        if (!$(this).parent().hasClass('nav-item')) {
            $('.nav-item li a').css('backgroundColor', 'transparent');
            $(this).css("backgroundColor", 'rgba(0,0,0,0.3)');
            $(".nav-item").removeClass("nav-show");
            $(this).parent().parent().parent().addClass("nav-show");
        }
        var url = $(this).attr("data-url");
        if (url) {

            $('#pageframe').attr("src", url);
        }
    });

    //接收到消息，关闭层
    if (typeof window.postMessage !== 'undefined') {
        var reciver = function (e) {
            var data = e.data;
            $("a").attr("data-chosen", "0");
            $("a[title='" + data + "']").attr("data-chosen", "1");
        }
        if (window.addEventListener) {
            window.addEventListener('message', reciver, false);
        } else {
            window.attachEvent('onmessage', reciver);
        }
    }

    var isIE = function () { //ie?  
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera || userAgent.indexOf("Trident/7.0") > -1; //判断是否IE浏览器  
        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器  
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器  
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器  
        var isIE11 = userAgent.indexOf("Windows NT 6.1;") > -1 && userAgent.indexOf("Trident/7.0;") > -1; //判断是否是IE11

        if (isChrome || isFF || isSafari || isOpera) {
            return false;
        }

        if (isIE || isEdge || isIE11) {
            return true;
        } else {
            return false;
        }
    }

});
