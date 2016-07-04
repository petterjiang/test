function room_list(titlel) {
    this.class_name = "room_iteam";
    this.titlel = titlel;
} //机房
room_list.prototype = {
    mubiao_class: "room_list",
    ID_room: "1",
    show_cont: { //展示内容  {text_title,text_val 不可修改。其他可自定义和传递}
        dev_No: {
            text_title: "设备数量",
            text_val: "45"
        },
        alert: {
            text_title: "报警条数",
            text_val: "2"
        }
    },
    extend: "删除机房",
    inter: {
        text: "进入机房",
        link: "web.html"
    },
    text_wapper: "机房3,是在福控的1个单独机房",
    creat: function() {

    },
    html_add: function() { //添加机房列表
        var show_cont = this.show_cont;
        var shenchu = this.extend;
        var jiarn = this.inter.text;
        var text_val_add = "";
        var text_ctrl = "<div class='ctrl_but'><a href='" + this.inter.link + "'>" + jiarn + "</a><a href='javascript:void(0)'>" + shenchu + "</a></div>"
        $.each(show_cont, function(i, n) {
            var titl = show_cont[i].text_title;
            var con = show_cont[i].text_val;
            var text = "<div class='hide_msg'>" + titl + ":" + con + "</div>"
            text_val_add += text;
        });
        var html_text = "<div class='" + this.class_name + "' room_id = '" + this.ID_room + "'><h2>" + this.titlel + "</h2><div class='room_content'>" + text_val_add + "</div><div class='hover_x'><div class='text_wapper'>" + this.text_wapper + "</div>" + text_ctrl + "</div></div>";
        $("." + this.mubiao_class).append(html_text);
        $(".room_iteam").hover(
            function() {
                $(this).find('.hover_x').stop().animate({
                    top: "24px"
                }, 200);
            },
            function() {
                $(this).find('.hover_x').stop().animate({
                    top: "110px"
                }, 200);
            }
        )
    }
}



//移动对象
//第一个参数时移动的id或者class  
//第二个参数是图片的id   #****   
//当不带第二个参数时对象移动调用move_noparent方法
//参数带符号class前加.   id前加#

function moveDiv(moveID, parent, nochange) {
    this.objname = moveID;
    this.parents = parent;
    this.move_area = function() {
        var moveclass = this.objname;
        var parents = this.parents;
        var img = new Image();
        
        
        img.onload = function() {
            var max_h, max_w;      
            var div_h = $(parents).parent().height()
            var div_w = $(parents).parent().width()
            var div_xishu = div_h / div_w;
            // alert(div_xishu)
            var img_h = this.height;
            var img_w = this.width;
            var xishu = img_h / img_w;
            
            // 判断比例，图片总是显示整张
            if (div_xishu > xishu) {
                max_w = $(parents).parent().width()
                max_h = max_w * xishu;
            };
            if (div_xishu < xishu) {
                max_h = $(parents).parent().height();
                max_w = max_h / xishu - 30;
            };
            $(moveclass).find('.tuodong').mousedown(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.which == 1) {
                    var $this_p = $(this).parent()
                    var sleft = $(this).parent().position().left;
                    //alert(sleft)
                    var stop = $(this).parent().position().top;
                    var mouseleft = e.clientX - sleft;
                    var mousetop = e.clientY - stop;
                    var move = true;
                    var index = $this_p.index()
                    $("body").mousemove(function(e) {
                        if (move == true) {
                            var mouseleft1 = e.clientX - mouseleft;
                            var mousetop1 = e.clientY - mousetop;
                            if (nochange == "1") {
                                var max_w = $(parents).parent().width()
                                var max_h = $(parents).parent().height()
                            };
                            // 边界
                            if (mouseleft1 < 0) {
                                mouseleft1 = 0;
                            };
                            if (mouseleft1 > max_w) {
                                mouseleft1 = max_w;
                            };
                            if (mousetop1 < 0) {
                                mousetop1 = 0;
                            };
                            if (mousetop1 > max_h) {
                                mousetop1 = max_h;
                            };
                            $this_p.css({
                                top: mousetop1,
                                left: mouseleft1
                            });
                        };
                    });

                    $(this).mouseup(function(e) {

                        move = false;
                        var sleft = $this_p.position().left;
                        var stop = $this_p.position().top;
                        //计算移动体x轴的相对父元素的对比值
                        if (nochange == "1") {
                            max_w = $(parents).parent().width()
                            max_h = $(parents).parent().height()
                        };
                        var x_posent = sleft / max_w;
                        //计算移动体y轴的相对父元素的对比值
                        var y_posent = stop / max_h;
                        $this_p.attr({
                            x_posent: x_posent,
                            y_posent: y_posent
                        });
                        // 修改坐标
                        if (moveclass == ".quyu_list") {
                            var data = {
                                room_id: $this_p.attr("area_id"),
                                room_x: x_posent,
                                room_y: y_posent
                            }

                                function addXY(data) {}

                            DataHandle("ModRoom", data, addXY)
                        };
                        if (moveclass == ".drag") {
                            var ui_dev_id = $this_p.attr("ui_dev_id"),
                                this_top = $this_p.attr("y_posent"),
                                this_left = $this_p.attr("x_posent");
                            // alert(this_top)

                            function chenge_xy(data) {
                                if (data) {
                                    alert(data.error_msg)
                                };
                            }
                            DataHandle("ModUiDev", {
                                ui_dev_id: ui_dev_id,
                                area_x: this_left,
                                area_y: this_top
                            }, chenge_xy)
                        };
                    });
                }
            });

        }
        img.src = $(this.parents).attr("src");
    };
    this.move_noparent = function() { //没有第二个参数时的移动
        var mouseleft;
        var mousetop;
        var mouseleft1;
        var mousetop1;
        var moveclass = this.objname;
        var parents = this.parents;
        var img = new Image();
        $(moveclass).each(function(i) {
            $(this).children().first().mousedown(function(e) {
                e.preventDefault();
                var $this_p = $(this).parent()
                var sleft = $(this).parent().offset().left;
                var stop = $(this).parent().offset().top;
                mouseleft = e.clientX - sleft;
                mousetop = e.clientY - stop;
                var move = true;
                $("body").mousemove(function(e) {
                    if (move == true) {
                        mouseleft1 = e.clientX - mouseleft;
                        mousetop1 = e.clientY - mousetop;
                        $this_p.css({
                            top: mousetop1,
                            left: mouseleft1
                        });
                    };
                });
                $("body").mouseup(function(e) {
                    move = false;
                });
            });
        })
    };
    this.move_set = function() {
        var objname = this.objname;
        var parents = this.parents;
        var img = new Image();
        
        img.onload = function() {
            var max_h, max_w
            var div_h = $(parents).parent().height()
            var div_w = $(parents).parent().width()
            var div_xishu = div_h / div_w;
            var img_h = this.height;
            var img_w = this.width;
            var xishu = img_h / img_w;
            if (div_xishu > xishu) {
                max_w = $(parents).parent().width()
                max_h = max_w * xishu;
            };
            if (div_xishu < xishu) {
                max_h = $(parents).parent().height();
                max_w = max_h / xishu - 30;

            };
            if (nochange == "1") {
                var max_w = $(parents).parent().width()
                var max_h = $(parents).parent().height()
            };
            $(objname).each(function() {
                var x_posent = $(this).attr('x_posent');
                var y_posent = $(this).attr('y_posent');

                $(this).css({
                    top: y_posent * max_h,
                    left: x_posent * max_w,
                });
            });
        }
        img.src = $(this.parents).attr("src");
    };

}



// // 打开

// function open(openid) {
//     var w = $("body").width() / 2 - $("#" + openid).width() / 2;
//     var h = $("body").height() / 2 - $("#" + openid).height() / 2
//     $("#" + openid).css({
//         top: h,
//         left: w
//     });
//     $("#add-over-layer").show();
//     $("#" + openid).show();
// }
// // 关闭

// function conClose(closid) {
//     $("#add-over-layer").hide();
//     $("#" + closid).hide();
//     var w = $("body").width() / 2 - $("#" + closid).width() / 2;
//     var h = $("body").height() / 2 - $("#" + closid).height() / 2
//     // alert(w)
//     $("#" + closid).css({
//         top: h,
//         left: w
//     });
// }


// 鼠标经过显示

function map_list(area_ID, x_posent, y_posent) {
    this.area_ID = area_ID;
    this.x_posent = x_posent;
    this.y_posent = y_posent;
    this.link_in = "#"
}
map_list.prototype = {
    class_parent: "map_show",
    area_name: "区域1",
    title: {
        title_name: "概况",
        title_cont: {
            pue: {
                cont_name: "pue",
                cont_val: "1.5"
            },
            wendu: {
                cont_name: "温度",
                cont_val: "1.5"
            },
            shidu: {
                cont_name: "湿度",
                cont_val: "1.5"
            },
            gaojing: {
                cont_name: "告警事件",
                cont_val: "1.5"
            }
        }
    },
    add_html: function() {
        var html_text = "<div class='quyu_list' area_ID = '" + this.area_ID + "' y_posent='" + this.y_posent + "'  x_posent='" + this.x_posent + "'><span class='tuodong'></span><a href='" + this.link_in + "'>" + this.area_name + "</a></div>";
        $("." + this.class_parent).append(html_text);
        var titlename = this.area_name + this.title.title_name;
        var ul_text = ""
        $.each(this.title.title_cont, function(i, n) {
            var cont_name = n.cont_name;
            var cont_val = n.cont_val;
            var litext = "<li><strong>" + cont_name + ":</strong><span>" + cont_val + "</span></li>"
            ul_text = ul_text + litext
        });
        var hover_a_div = "<div class='hover_a_div' area_ID = '" + this.area_ID + "'><h3>" + titlename + "</h3><ul>" + ul_text + "</ul></div>"
        $("body").append(hover_a_div);
    },
    add_hover: function() {
        var add_set = $("." + this.class_parent).find('.quyu_list').children('a');
        var parent = $("." + this.class_parent)
        add_set.hover(
            function(e) {
                var this_a_id = $(this).parents(".quyu_list").attr("area_ID");
                var screen_x = $(this).parents(".quyu_list").offset().left;
                var screen_y = $(this).parents(".quyu_list").offset().top;
                var w_height = $(window).height();
                var w_width = $(window).width();
                var ot_height = $(".hover_a_div").outerHeight();
                var ot_width = $(".hover_a_div").outerWidth();
                $(".hover_a_div[area_ID='" + this_a_id + "']").show().css({
                    left: screen_x + 25,
                    top: screen_y + 22
                });
                if (w_height - screen_y < ot_height) {
                    $(".hover_a_div[area_ID='" + this_a_id + "']").show().css({
                        top: screen_y - ot_height
                    })
                };
                if (w_width - screen_x < ot_width) {
                    $(".hover_a_div[area_ID='" + this_a_id + "']").show().css({
                        left: screen_x - ot_width,
                    })
                };
            },
            function(e) {
                var this_a_id = $(this).parents(".quyu_list").attr("area_ID");
                var screen_x = $(this).parents(".quyu_list").offset().left;
                var screen_y = $(this).parents(".quyu_list").offset().top;
                $(".hover_a_div[area_ID='" + this_a_id + "']").hide();
            }
        )

    }
}

// 导航