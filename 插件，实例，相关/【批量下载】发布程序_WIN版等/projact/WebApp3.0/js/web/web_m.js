$(function() {
    // 背景图片函数
    function set_wh() {
        var w_height = $(".map_box").height() - $(".all_wapper .nav_top_new").outerHeight() - $(".all_wapper .user_mssage").outerHeight();
        var w_width = $(".map_box").width(); //计算宽高比例
        var bili = w_height / w_width;
        var img = new Image();
        
        img.onload = function() {
            var img_h = this.height;
            var img_w = this.width;
            var img_bili = img_h / img_w; //计算图片宽高比例
            if (img_bili < bili) {
                $(".map_show img").css("width", "100%").css("height", "");
            } else {
                $(".map_show img").css("height", "100%").css("width", "");
            };
        }
        img.src = $("#img_id").attr("src");
        $(".map_show").css({
            height: w_height,
            width: w_width
        });
    }

    set_wh();
    // 获取当前时间

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
    get_now()
    // 循环展示时间
    var time_go = setInterval(function() {
        get_now()
    }, 1000);

    // 打开前动画
    var speed_a = 500 //变化速度
    setTimeout(function() {
        $(".loading_show").animate({
                width: "100px",
                height: "99px",
                top: "90px",
                left: 0,
                margin: 0
            },
            speed_a);
        $(".time_now").animate({
                top: "40px",
                fontSize: "12px"
            },
            speed_a);
        $(".map_box").animate({
            opacity: 1
        }, speed_a, function() {
            $(".add_iteam").fadeIn(speed_a);
        });
        $(".add_iteam").animate({
            height: "245px"
        }, 900)
    }, 2000)
    $(window).resize(function(e) {
        set_wh();
    });


    var Addr = window.location.href;
    var this_ip = "localhost"
    var tmp = Addr.split("?");
    var url_hz = tmp[1];

    // 获取本地ip

    function Getip() {
        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host;
        //    var IpAddr = "192.168.2.251";
        IpAddr = IpAddr.split(":")[0];
        return (IpAddr);
    }

    function loadroom(data) { //load机房信息
        $.each(data, function(i, n) {
            var room_id = n.room_id //机房ID
            var room_name = n.room_name //机房名称
            var room_ip = n.room_ip //机房IP
            var room_port = n.room_port //端口号
            var room_type = n.room_type //机房类型(0:3200,1:3008,2:3200s)
            var room_x = n.room_x //坐标x
            var room_y = n.room_y //坐标y
            var type_name
            if (room_type == 0) {
                type_name = "3200"
            };
            if (room_type == 1) {
                type_name = "3008"
            };
            if (room_type == 2) {
                type_name = "3200S"
            };
            $("#room_name").append("<option value='" + room_id + "'>" + room_name + "</option>")

            var maplist1 = new map_list(room_id, room_x, room_y);
            maplist1.area_name = room_name;
            if (room_type == 2) {
                maplist1.link_in = "http://" + room_ip + "/html/web.html?" + url_hz
            };
            if (room_type == 0) {
                maplist1.link_in = "http://" + Getip() + "/html/web_one.html?" + url_hz + "&transmit_room_ip=" + room_ip + "&transmit_room_port=" + room_port
            };
            if (room_type == 1) {
                maplist1.link_in = "http://" + Getip() + "/html/web_one.html?" + url_hz + "&transmit_room_ip=" + room_ip + "&transmit_room_port=" + room_port
            };
            // alert(room_type)
            // maplist1.link_in = "web.html?"+url_hz+"&transmit_room_ip="+room_ip 
            //参数后面带上机房的ip

            var bjdata = {
                room_id: room_id
            }

                function loadbj(data) {
                    var dev_count = data.dev_count
                    var alarm_count = data.alarm_count
                    maplist1.title = {
                        title_name: "概况",
                        title_cont: {
                            pue: {
                                cont_name: "机房ID",
                                cont_val: room_id
                            },
                            wendu: {
                                cont_name: "机房名称",
                                cont_val: room_name
                            },
                            shidu: {
                                cont_name: "机房IP",
                                cont_val: room_ip
                            },
                            gaojing: {
                                cont_name: "设备类型",
                                cont_val: type_name
                            },
                            shuliang: {
                                cont_name: "设备数量",
                                cont_val: dev_count
                            },
                            baojingsl: {
                                cont_name: "报警条数",
                                cont_val: alarm_count
                            }
                        }
                    }
                    maplist1.add_html();
                    maplist1.add_hover();
                    var move = new moveDiv(".quyu_list", "#img_id");
                    move.move_area();
                    move.move_set();
                    $(window).resize(function() {
                        move.move_area();
                        move.move_set();
                    });
                    
                    if (alarm_count>0) {
                        $(".quyu_list[area_id='"+room_id+"']").find('span').css('background-image', 'url(../images/pub/bj.gif)');
                    }else{
                        $(".quyu_list[area_id='"+room_id+"']").find('span').css('background-image', '');
                    };
                }
            DataHandle("GetRoomSummary", bjdata, loadbj)
        });
        // 增加移动


    }
    DataHandle("GetRoomList", {}, loadroom)
    var move1 = new moveDiv(".user-add-container");
    move1.move_noparent();

    $(".add_area").click(function() {
        open("user-add-container");
    });
    $(".add_img").click(function() {
        open("user-add-img");
    });
    $(".deleta_area").click(function() {
        open("user-del-area");
    });
    $("#user-del-area #u_ok").click(function(e) {
        var room_id = $("#room_name").val()
        // alert(room_id)

            function roomreload(data) {
                alert("删除成功");
                location.reload();
            }
        DataHandle("DelRoom", {
            room_id: room_id
        }, roomreload)
        // DelRoom
    });



    $("#user-add-container #u_ok").live("click", function() {
        var parents_obj = $(this).parents(".user-add-container");
        var room_name = $("#new_title").val();
        var room_ip = $("#new_url").val();
        var room_type = $("#new_type").val();
        var room_port = $("#new_duankou").val();
        var data = {
            room_name: room_name,
            room_ip: room_ip,
            room_port: room_port,
            room_type: room_type
        }

            function addroom(data) {
                // alert(1)
                if (data.error_msg) {
                    alert(data.error_msg);
                    return false;
                } else {
                    alert("添加成功");
                    location.reload();
                };

            }

        DataHandle("AddRoom", data, addroom, loading)


    });



    // 点击上传图片
    $("#btnUpload").click(function(e) {
        e.preventDefault();
        // var area_id = $(".location a:last").attr("area_id");
        if ($("#flUpload").val() == "") {
            alert("请选择一个图片文件，再点击上传。");
            return;
        }
        var url = $("#flUpload").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "png" && url_[nobor] != "PNG") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择");
            return false;
        };

        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host
        //var Port = "8002";
        IpAddr = IpAddr.split(":")[0];
        //alert(local)
        $('#UpLoadForm').ajaxSubmit({
            async: true,
            url: "http://" + IpAddr + ":" + Port + "/UpLoadFile?file_name=map_all.png",
            dataType: "jsonp",
            success: function(data) {
                if (data) {
                    alert(data.error_msg)
                    return false
                } else {
                    alert("上传成功")
                    location.reload();
                }
            }
        });
    });


})