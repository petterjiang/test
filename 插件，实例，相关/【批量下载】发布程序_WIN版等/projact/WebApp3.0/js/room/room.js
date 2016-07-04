$(function() {
    var addr = document.location.href;
    ReadIp();
    // alert(addr)
    // var data1 = {}
    // if (addr.indexOf("transmit_room_ip") > -1) {
    //     // alert(transmit_room_ip)
    //     var tmp = addr.split("&");
    //     var transmit_room_ip = "",
    //         transmit_room_port = "";
    //     for (var i = 0; i < tmp.length; i++) {
    //         // alert(i)
    //         if (tmp[i].indexOf("transmit_room_ip") > -1) {
    //             var tra = tmp[i].split("=")
    //             transmit_room_ip = tra[1]
    //             // alert(transmit_room_ip)

    //         };
    //         if (tmp[i].indexOf("transmit_room_port") > -1) {
    //             var tra_port = tmp[i].split("=")
    //             transmit_room_port = tra_port[1]
    //         };
    //     };
    //     // alert(transmit_room_ip)
    //     if (transmit_room_ip != "") {

    //         data1 = {
    //             transmit_room_ip: transmit_room_ip,
    //             transmit_room_port: transmit_room_port
    //         }
    //     };
    // };

    // 读取机房名称

    function attr_room(data) {

        if (data) {
            var param_value = data.param_value;
            $(".name_room input").val(param_value)
        } else {
            $(".name_room input[type='text']").val("福控机房监控系统")
        };
    }
    var name_room_data = {
        param_key: "room_name"
    }
    DataHandle("GetSysParam", name_room_data, attr_room)
    // 读取公司名称

    function attr_gs(data) {

        if (data) {
            var param_value = data.param_value;
            $(".gs_name input").val(param_value)
        } else {
            $(".gs_name input").val("福控科技")
        };
    }
    var name_gs_data = {
        param_key: "gs_name"
    }
    DataHandle("GetSysParam", name_gs_data, attr_gs)
    // 读取系统名称

    function attr_system(data) {

        if (data) {
            var param_value = data.param_value;
            $(".system_name input").val(param_value)
        } else {
            $(".system_name input").val("物联网控制系统")
        };
    }
    var name_system_data = {
        param_key: "system_name"
    }
    DataHandle("GetSysParam", name_system_data, attr_system)

    // 修改公司名称
    $(".change_name_gs").live('click', function(e) {
        var val_name = $(".gs_name input").val()
        if (val_name == "") {
            alert("请输入名称")
        } else {
            var name_gs_set = {
                param_key: "gs_name",
                param_value: val_name
            }
            DataHandle("SetSysParam", name_gs_set, set_room);
        };
    });
    // 修改系统名称
    $(".change_name_system").live('click', function(e) {
        var val_name = $(".system_name input").val()
        if (val_name == "") {
            alert("请输入名称")
        } else {
            var name_gs_set = {
                param_key: "system_name",
                param_value: val_name
            }
            DataHandle("SetSysParam", name_gs_set, set_room);
        };
    });

    // 修改机房名称
    $(".change_name_room").live('click', function(e) {
        var val_name = $(".name_room input").val()
        if (val_name == "") {
            alert("请输入名称")
        } else {
            var name_room_set = {
                param_key: "room_name",
                param_value: val_name
            }

            DataHandle("SetSysParam", name_room_set, set_room);
        };
    });

    //读取机房IP

    function ReadIp() {
        DataHandle("GetIpInfo", {}, IpInfo);

        function IpInfo(data) {
            if (data) {
                if (data.error_code) {
                    alert(data.error_msg);
                } else {
                    $("#Addr").val(data.ip);
                    $("#GateWay").val(data.gateway);
                    $("#Mask").val(data.mask);
                }
            }
        }
    }
    //修改机房IP
    $(".change_ip_room").live("click", function(e) {
        var Addr = $("#Addr").val();
        var Mask = $("#Mask").val();
        var GateWay = $("#GateWay").val();
        if ((Addr == "") || (Mask == "") || (GateWay == "")) {
            alert("请输入相关信息")
        } else {
            var Addr_set = {
                ip: Addr,
                mask: Mask,
                gateway: GateWay
            }

            DataHandle("SetIpInfo", Addr_set, set_room)
        };
    });

    function set_room(data) {
        if (data) {
            alert(data.error_msg);
        } else {
            alert("修改成功");
            location.reload();
        }
    }

    // 读取机房类型

    function set_room_type(data) {
        var room_type = data.room_type
        if (room_type == 0) {
            var room_tpye_text = "3200"
        };
        if (room_type == 1) {
            var room_tpye_text = "3008"
        };
        if (room_type == 2) {
            var room_tpye_text = "3200S"
        };
        $(".room_type span").text(room_tpye_text)
    }
    DataHandle("GetVerInfo", {}, set_room_type)


    $("#btnUpload").live("click", function(e) {
        e.preventDefault();
        var area_id = 0;
        if ($("#flUpload").val() == "") {
            alert("请选择一个图片文件，再点击上传。");
            return;
        }
        var url = $("#flUpload").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "png" && url_[nobor] != "PNG") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择PNG格式上传");
            return false;
        };

        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host;
        IpAddr = IpAddr.split(":")[0];
        var dataip = ""
        var addr1 = document.location.href;
        // 判断如果是多机房，则上传到自定机房图片，否则上传默认图片
        if (addr1.indexOf("transmit_room_ip") > -1) {
            // alert(transmit_room_ip)
            var tmp = addr1.split("&");
            var transmit_room_ip = "",
                transmit_room_port = "";
            for (var i = 0; i < tmp.length; i++) {
                // alert(i)
                if (tmp[i].indexOf("transmit_room_ip") > -1) {
                    var tra = tmp[i].split("=")
                    transmit_room_ip = tra[1]
                    // alert(transmit_room_ip)

                };
                if (tmp[i].indexOf("transmit_room_port") > -1) {
                    var tra_port = tmp[i].split("=")
                    transmit_room_port = tra_port[1]
                };

            };
            // alert(transmit_room_ip)
            if (transmit_room_ip != "") {
                dataip = "&transmit_room_ip=" + transmit_room_ip + "&transmit_room_port=" + transmit_room_port
                // alert(dataip)
                $.ajaxSetup({
                    data: {
                        "transmit_room_ip": transmit_room_ip,
                        "transmit_room_port": transmit_room_port
                    }
                });
            };
            var img_name = transmit_room_ip
            $('#UpLoadForm').ajaxSubmit({
                async: true,
                type: "POST",
                url: "http://" + IpAddr + ":" + Port + "/UpLoadFile?file_name=" + img_name + ".png",
                dataType: "jsonp",
                success: function(data) {
                    alert("上传成功")
                    location.reload();
                },
                error: function(data) {
                    if (data) {

                        alert(data)
                    };
                }
            });
        } else {
            $('#UpLoadForm').ajaxSubmit({
                async: true,
                type: "POST",
                url: "http://" + IpAddr + ":" + Port + "/SetAreaBG?area_id=" + area_id + dataip,
                dataType: "jsonp",
                success: function(data) {
                    alert("上传成功")
                    location.reload();


                },
                error: function(data) {
                    if (data) {

                        alert(data)
                    };
                }
            });

        };
        //alert(local)


    });
    //弹出层----------
    $(".add_u_b").live("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(".add_form").show();
    });
    /*$(".add_area").live("click",function(e)
    {
    e.stopPropagation();
    $("body").append("<div id='fade'></div>");
    $("#fade").css("opacity",0.5);
    $(".area_form").fadeIn(500);
    });*/
    $("#fade").live("click", function(e) {
        e.stopPropagation();
        $(".fuceng").fadeOut(500, function() {});
        $("#fade").fadeOut(200, function() {
            $("#fade").remove()
        });
        $(".add_form input").val("");
        $(".quanxian p").replaceWith("<p>权限选择</p>")
        //$(".send_form .no_send").click();
    });
    $(".close, .no_send").live("click", function() {
        $("#fade").click();
    });
    //删除用户------------------------
    $(".delete_user").live("click", function() {
        if (confirm("确定要删除此用户")) {
            var ind = $(".user_now tr").index($(this).parents("tr"));
            var user_id = $(this).attr("user_id");
            $this = $(this)

            DataHandle("DelUser", {
                user_id: user_id
            }, dela_use);
        } else {
            return false;
        }

        function dela_use(data) {
            if (data) {
                alert(data.error_msg)
            } else {
                alert("删除成功")
                location.reload();
            }
        }
    });
    //修改密码
    $(".passwd").live("click", function() {

    });
    //表格操作------------------------

    $(".sele").live("click", function(e) {
        e.stopPropagation();
        $(".use_type").show();
    })
    $(document).click(function() {
        $(".use_type").hide();
    })

    $(".send_form .send_messg").live("click", function(e) {
        e.preventDefault();
        var user_name = $("#uesr_name").val()
        var user_password = $("#user_password").val()
        var user_password1 = $("#user_password1").val()
        var role_type = $(".quanxian p").attr("role_type")
        //alert(role_type)
        if (user_password != user_password1) {
            alert("两次密码不一致");
            return false;
        }
        if (user_name == "" || user_password == "" || user_password1 == "" || role_type == undefined) {
            alert("请输入完整");
            return false;
        }

        var vUserPassword = $.md5(user_password);
        vUserPassword = vUserPassword.toUpperCase()
        // alert(vUserPassword)
        DataHandle("AddUser", {
            user_name: user_name,
            user_password: vUserPassword,
            role_type: role_type
        }, adduser);

        function adduser(data) {
            if (data) {
                if (data.error_msg) {
                    alert(data.error_msg)
                } else {
                    alert("添加成功")
                    DataHandle("GetUserList", data1, user)
                    $(".no_send").click();
                    $(".user_now td").parent().remove();
                }
            }

        }

    })
    $(".use_type").empty()

    function quxian(data) {
        $.each(data, function(i, n) {
            var role_type_name = n.role_type_name
            var role_type = n.role_type
            if (role_type != "0") {
                $(".use_type").append("<li><a href=\"#\" role_type=\"" + role_type + "\">" + role_type_name + "</a><li>");
            }
        });

    }
    DataHandle("GetRoleList", data1, quxian)
    $(".use_type a").live("click", function(e) {
        e.stopPropagation();
        var role_type = $(this).attr("role_type")
        var t_text = $(this).text();
        $(this).parents(".quanxian").children("p").text(t_text).attr("role_type", role_type);
        $(this).parents(".use_type").hide();
    })
    // 取消按钮
    $(".no_send").live('click', function(e) {
        e.preventDefault();
        $(".add_table input").val("")
        $(".quanxian p").text("权限选择").removeAttr()
        $(".add_form").hide();
    });
})