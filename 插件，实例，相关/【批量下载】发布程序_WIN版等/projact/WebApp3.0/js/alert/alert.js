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
    selet()

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

    //读取所有设备ID

    function load_ui_dev_id(data) {
        $.each(data, function(i, n) {
            var ui_dev_id = n.ui_dev_id
            var ui_dev_name = n.ui_dev_name
            $(".a_massge .tiaojian_list").append('<li pro_value="' + ui_dev_id + '">' + ui_dev_name + '</li>')
        });
    }
    DataHandle("GetUiDevList", {}, load_ui_dev_id);

    // 查询历史报警\
    var pageindex = 0
    var pagesize = 20
    $("#Sear").live('click', function(e) {
        cx_alert()
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
    function cx_alert() {
        var page_index = pageindex
        var page_size = pagesize
        var begin_time = $("#time1").val() + ":00"
        var end_time = $("#time2").val() + ":00"
        var ui_dev_id = $(".msgtype_selct").attr("pro_value");
        $("#Alert1").empty()

        function alert_chxun(data) {
            if (data) {
                $.each(data, function(i, n) {
                    var alarm_info = n.alarm_info
                    var alarm_time = n.alarm_time
                    var confirm_type = n.confirm_type
                    var confirm_user = n.confirm_user
                    var ui_dev_name = n.ui_dev_name
                    var ui_prop_name = n.ui_prop_name
                    var ui_dev_id = n.ui_dev_id
                    // alert(alarm_time)
                    if ("0" == confirm_type) {
                        confirm_type = "未确认";
                    }
                    if ("1" == confirm_type) {
                        confirm_type = "短信";
                    }
                    if ("2" == confirm_type) {
                        confirm_type = "客户端";
                    }
                    var newtd = $("<td>" + ui_dev_name + "</td><td>" + ui_prop_name + "</td><td>" + alarm_info + "</td><td>" + alarm_time + "</td><td>" + confirm_type + "</td><td>" + confirm_user + "</td>");
                    var newtr = $("<tr ui_dev_id ='" + ui_dev_id + "'></tr>");
                    newtr.append(newtd);
                    $("#Alert1").append(newtr);
                });
            } else {
                $("#Alert1").append("<tr><td colspan='6' algin='center' style='height:120px; line-height:120px'>没有报警记录</td></tr>");
            }
        }
        if (ui_dev_id == "all") {
            var data_all_alert = {
                page_index: page_index,
                page_size: page_size
            }
        } else {
            var data_all_alert = {
                page_index: page_index,
                page_size: page_size,
                ui_dev_id: ui_dev_id
            }
        };

        DataHandle("GetAlarmList", data_all_alert, alert_chxun, loading);
    }



    function get_ul(data) {
        $("#Alert").empty();
        if (data) {
            $.each(data, function(i, v) {
                var ui_dev_id = v.ui_dev_id //应用设备ID
                var ui_dev_name = v.ui_dev_name //应用设备名称
                var ui_prop_id = v.ui_prop_id //应用属性ID
                var ui_prop_name = v.ui_prop_name //应用属性名称
                var confirm_type = v.confirm_type //确认方式
                var confirm_user = v.confirm_user //确认人
                var alarm_time = v.alarm_time //告警时间
                var send_times = v.send_times //总要发送次数
                var had_send_times = v.had_send_times //已经发送的次数
                var alarm_info = v.alarm_info //告警内容
                var alarm_id = v.alarm_id;
                if ("0" == confirm_type) {
                    confirm_type = "未确认";
                    var link = "<a href='javascript:void(0)' alarm_id='" + alarm_id + "' user_id='" + user_id + "'>告警确认</a>"
                }
                if ("1" == confirm_type) {
                    confirm_type = "短信";
                    var link = "短信已确认"
                }
                if ("2" == confirm_type) {
                    confirm_type = "客户端";
                    var link = "客户端已确认"
                }
                //建立表格
                var newtd = $("<td>" + ui_dev_name + "</td><td>" + ui_prop_name + "</td><td>" + confirm_type + "</td><td>" + confirm_user + "</td><td>" + alarm_time + "</td><td>" + had_send_times + "</td><td>" + send_times + "</td><td>" + alarm_info + "</td><td>"+link+"</td>");
                var newtr = $("<tr ui_dev_id ='" + ui_dev_id + "'></tr>");
                newtr.append(newtd);
                $("#Alert").append(newtr);
            });
        } else {
            $("#Alert").append("<tr><td colspan='9' algin='center' style='height:120px; line-height:120px'>设备暂无报警</td></tr>");
        };
    }
    DataHandle("GetCurrentAlarm", {}, get_ul, loading);

    //告警确认
    $("#Alert td").find("a").live("click", function() {
        if (confirm("是否确认这条告警信息")) {
            var user_id = $(this).attr("user_id");
            var alarm_id = $(this).attr("alarm_id");
            var Data = {
                user_id: user_id,
                alarm_id: alarm_id
            }
            DataHandle("ConfirmAlarm", Data, AlarmHandle);
        } else {
            return false;
        }
    });

    function AlarmHandle(data) {
        if (data) {
            alert(data.error_msg);
        } else {
            alert("确认成功!");
            location.reload();
        }
    }



})

//告警历史记录