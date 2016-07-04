$(function() {
    var user_id;
    var Addr = window.location.href;
    var tmp = Addr.split("&");
    var temp;
    for (var i = 0; i < tmp.length; i++) {
        temp = tmp[i].split("=");
        for (var j = 0; j < temp.length; j++) {
            if ("user_id" == temp[j]) {
                user_id = temp[j + 1];
            }
        }
    }
    // 搜索初始时间
    var myDate = new Date();
    var year = myDate.getFullYear();
    var mon = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var Hour = myDate.getHours();
    var Minute = myDate.getMinutes();
    if (mon < 10) {
        mon = "0" + mon;
    } else {
        mon = mon;
    }
    if (day < 10) {
        day = "0" + day;
    } else {
        day = day;
    }
    if (Minute < 10) {
        Minute = "0" + Minute;
    } else {
        Minute = Minute;
    }
    var BeginDay = day - 1;
    if (BeginDay < 10) {
        BeginDay = "0" + BeginDay;
    } else {
        BeginDay = BeginDay;
    }
    if (BeginDay <= 0) {
        if (mon = 1) {
            mon = 12;
            year = year - 1;
        } else {
            mon = mon - 1;
        }
    }

    var BeginTime = year + "-" + mon + "-" + BeginDay + " " + Hour + ":" + Minute;
    var EndTime = year + "-" + mon + "-" + day + " " + Hour + ":" + Minute;
    $("#time1").val(BeginTime);
    $("#time2").val(EndTime);

    $("#time1, #time2").click(function(e) {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:mm'
        })
    });
    selet()

    // 读取电话号码
    $(".a_phone .tiaojian_list").empty();

    function get_phone(data) {
        $(".a_phone .tiaojian_list").append('<li pro_value="all">所有电话</li>')
        $.each(data, function(index, n) {
            var phone = n.phone;
            $(".phone_list").append('<tr><td align="center">' + phone + '</td><td align="center"><span class="delet_phone">删除</span></td></tr>');
            $(".a_phone .tiaojian_list").append('<li pro_value="' + phone + '">' + phone + '</li>')
        });

    }
    DataHandle("GetPhoneList", {}, get_phone, loading);

    $(".add_phone").click(function(e) {
        e.preventDefault();
        open("user-add-container");
    });
    $("#u_cancel").click(function(e) {
        $(".u_body").val("");
    });

    // 添加删除电话号码函数

    function sedphoen(phonesno, sz, sucss) {
        var phones = []
        var poadd = {}
        poadd.phone = phonesno;
        phones.push(poadd)
        var datasend = new Array();
        var ppp = {}
        ppp.op_type = sz;
        ppp.phones = phones;
        datasend.push(ppp)

        var jsonStr = JSON.stringify(datasend);
        jsonStr = jsonStr.slice(1, -1) //截取字符串去掉头尾第一个字母
        // alert(jsonStr)

        function set_phone(data) {
            if (data) {
                alert(data.error_msg)
            } else {
                alert(sucss);
                location.reload();
            };
        }
        DataHandle("OpPhoneList", {
            json_string: jsonStr
        }, set_phone, loading);
    }
    // 添加按钮
    $(".add_phone_botton").click(function(e) {
        var new_phone1 = $("#new_phone1").val()
        if (isNaN(new_phone1) || new_phone1.length < 5 || new_phone1.length > 16) {
            alert("请输入正确电话号码");
            return false;
        };
        var sucss = "电话输入成功"
        sedphoen(new_phone1, 0, sucss)

    });
    // 删除按钮
    $(".delet_phone").live('click', function(e) {
        var new_phone1 = $(this).parents("tr").find('td').eq(0).text()
        var sucss = "删除成功"
        sedphoen(new_phone1, 1, sucss)
    });
    // 翻页变量
    var pageindex = 0
    var pagesize = 20
    // 下拉选择菜单

        function selet() {
            $(".tiaojian_list li").live("click", function(e) {
                e.stopPropagation()
                // alert($(this).text())
                $(this).parent().hide();
                var pro_value = $(this).attr('pro_value');
                $(this).parent().prev().attr("pro_value", pro_value);
                $(this).parent().prev().text($(this).text())
            });
            $(".tiaojian_list").prev().click(function(e) {
                e.stopPropagation()
                pageindex = 0
                if ($(this).next().is(":hidden")) {
                    $(".tiaojian_list").hide();
                    $(this).next().show();
                } else {
                    $(".tiaojian_list").hide();
                };
            });
            $(document).click(function(e) {
                $(".tiaojian_list").hide();
            });
        }

        function type_text(type_sms) {
            var text
            if (type_sms == "0") {
                text = "采集量告警短信"
            };
            if (type_sms == "1") {
                text = "设备离在线通知"
            };
            if (type_sms == "2") {
                text = "模块离在线通知"
            };
            return text
        }

        // 读取短信发送记录

    $("#Sear").live('click', function(e) {
        var phone = $(".phone_selct").attr('pro_value')
        var sms_type = $(".msgtype_selct").attr('pro_value');
        load_msg(phone, sms_type)
    });
    $("#Sear").click();


    $(".page_prev").click(function(e) {
        if (pageindex==0) {
            alert("已经是第一页")
            return false
        };
        pageindex -= 1
        $("#Sear").click();
    });
    $(".page_next").click(function(e) {
        var leng_t = $(".send_msg_list td").parent().size();
        if (leng_t<20) {
            alert("已经是最后一页")
            return false;
        };
        pageindex += 1
        $("#Sear").click();
    });


    function load_msg(phone, sms_type) {
        var page_index = pageindex
        var page_size = pagesize
        var begin_time = $("#time1").val() + ":00"
        var end_time = $("#time2").val() + ":00"
        var phone = phone
        var sms_type = sms_type
        var data = {}
        if (phone == "all" && sms_type == "all") {
            data = {
                page_index: page_index,
                page_size: page_size,
                begin_time: begin_time,
                end_time: end_time
            }
        };
        if (phone == "all" && sms_type != "all") {
            data = {
                page_index: page_index,
                page_size: page_size,
                begin_time: begin_time,
                end_time: end_time,
                sms_type: sms_type
            }
        };
        if (phone != "all" && sms_type == "all") {
            data = {
                page_index: page_index,
                page_size: page_size,
                begin_time: begin_time,
                end_time: end_time,
                phone: phone
            }
        };
        if (phone != "all" && sms_type != "all") {
            data = {
                page_index: page_index,
                page_size: page_size,
                begin_time: begin_time,
                end_time: end_time,
                phone: phone,
                sms_type: sms_type
            }
        };

        function set_msg(data) {
            $(".send_msg_list td").parent().remove();
            if (data) {
                $.each(data, function(i, n) {
                    var phone = n.phone //：手机号码
                    var sms = n.sms
                    var sms_type = type_text(n.sms_type)
                    var rec_time = n.rec_time
                    var had_send = n.had_send //发送是否成功 1 成功
                    if (had_send == "1") {
                        var text_cb = "成功"
                    } else {
                        var text_cb = "失败"
                    };
                    $(".send_msg_list").append('<tr><td align="center">' + phone + '</td><td>' + sms + '</td><td>' + sms_type + '</td><td>' + rec_time + '</td><td>' + text_cb + '</td></tr>')
                });
            } else {
                $(".send_msg_list").append('<tr height="150"><td align="center" colspan="5">没有记录</td></tr>')
            };

        }
        DataHandle("GetSmsLog", data, set_msg, loading);

    }
})