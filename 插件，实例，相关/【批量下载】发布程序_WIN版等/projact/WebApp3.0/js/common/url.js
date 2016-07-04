//id,URL
//链接地址

$(function() {

    $(document).bind("contextmenu", function() {
        return false;
    }); //屏蔽右键
    // 所有A链接都带参数
    link_add("a");
    $.ajaxSetup({ 
        cache: false
    });
});

// 返回错误通用函数
// 链接后面增加跳转参数
// link_obj:要增加的对象
// val:要增加的值

function link_add(link_obj, val) {
    var this_href = document.location.href;
    var canshu = this_href.split(".html?")
    var sli;
    if (canshu[1] == undefined) {
        sli = ""
    } else {
        sli = canshu[1].split("&")
    };
    var new_canshu = "";
    for (var i = 0; i < sli.length; i++) {
        if (sli[i].indexOf("ui_dev_type") < 0) {
            if (i == 0) {
                new_canshu = new_canshu + sli[i]
            } else {
                new_canshu = new_canshu + "&" + sli[i]
            }
        };
    };
    $(link_obj).each(function() {
        var old_link = $(this).attr("href");
        if (val) {
            var new_link = old_link + '?' + new_canshu + val
        } else {
            var new_link = old_link + '?' + new_canshu
        };
        $(this).attr("href", new_link)
    });
    // var text = $(link_obj).text();
}

function GetUrl(str) {
    /*localhost*/
    var addr = document.location.host;
    var IpAddr = (addr == "") ? "localhost" : document.location.host;
    IpAddr = IpAddr.split(":")[0];
    return ("http://" + IpAddr + ":" + Port + "/" + str);
}


//Ajax调用函数

/*
    输入参数：   Url：        调用的接口名称，
                 Data：       传递的参数
                 CallBack：   返回的数据处理函数  
                 Bforsend:    数据发送时loading状态    
                 text:        Bforsend传递的参数
*/

function loading(text) {
    var text_html = "";
    if (text) {
        text_html = text;
    }
    $("body").append("<div class='loading_bg' style='background:#000; width:100%; height:100%; opacity:0.5; position:fixed; left:0; top:0; z-index:1000010;'></div>");
    $("body").append('<div class="loading_show1"><img src="../images/pub/loading.png" width="100%" height="100%" /><div class="time_now"></div></div>');
    get_now()
    // 循环展示时间
    var time_go = setInterval(function() {
        get_now()
    }, 1000);
    // $("body").append("<div class='loading_text' style='width:300px; height:200px; position:fixed; left:50%; top:50%; z-index:9001; background:#fff; line-height:200px; text-align:center; margin-left:-150px; z-index:1000011; margin-top:-100px;'>" + text_html + "数据正在加载...</div>");
};

// 时间显示

function get_now() {
    var date = new Date(); //日期对象
    var now = "";
    var houer
    var getMinutes
    var seconds
    houer = date.getHours();
    getMinutes = date.getMinutes()
    seconds = date.getSeconds()
    if (houer < 10) {
        houer = "0" + houer
    };
    if (getMinutes < 10) {
        getMinutes = "0" + getMinutes
    };
    if (seconds < 10) {
        seconds = "0" + seconds
    };
    now = houer + ":" + getMinutes + ":" + seconds;
    $(".time_now").text(now)
}

function DataHandle(Url, Data, CallBack, Bforsend, text) {
    $.ajax({
        type: "get",
        url: GetUrl(Url),
        dataType: "jsonp",
        beforeSend: function() {
            if (Bforsend) {
                Bforsend(text);
            };
        },
        complete: function() {

        },
        data: Data,
        contentType: "application/json;charset=gb2312",
        success: function(data) {
            $(".loading_show1, .loading_bg").remove();
            CallBack(data);
        },
        error: function() {
            alert("超时，请重试");
        }
    });
}

// $.ajaxSetup({
//     beforeSend: function() {
//         $("body").append("<div class='fade_bg' style='border: 4px solid #ccc;left: 25%;top: 25%;background: #fff;width: 50%;height: 50%;position: fixed;'><div class='loading' style='position:aboslute; top:50%; left50%;'>正在努力加载中，请稍后。。</div></div>")
//     },
//     complete: function() {
//         $(".fade_bg").remove();
//     }
//     error: function() {
//         $(".fade_bg").remove();
//     }
// });

/*
    功能:导航标签切换
    说明:a点击事件
*/

function SwcTab() {
    var ID = $(this).attr("id");
    $(this).parents().find("a").each(function() {
        if ($(this).attr("class") == "on_show") {
            $(this).removeClass("on_show");
        }
    });
    $(this).addClass("on_show");
    if (typeof ID == "string") {
        SwcCont(ID); //根据标签更换内容
    }
}