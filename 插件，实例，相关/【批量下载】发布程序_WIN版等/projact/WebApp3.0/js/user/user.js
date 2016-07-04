(function ($)
{
    var addr = document.location.href;
    // alert(addr)
    var data1 = {}
    if (addr.indexOf("transmit_room_ip") > -1) {
        // alert(transmit_room_ip)
        var tmp = addr.split("&");
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

            data1 = {
                transmit_room_ip: transmit_room_ip,
                transmit_room_port: transmit_room_port
            }
        };
    };
    DataHandle("GetUserList", data1, user)
    function user(data)
    {
        $.each(data, function (i, m)
        {
            var user_name = m.user_name;
            var role_type = m.role_type;
            var role_type_name = m.role_type_name
            var create_time = m.create_time; //创建时间
            var user_id = m.user_id; //用户ID

            $(".user_now table").append("<tr><td align=\"center\" valign=\"middle\">" + user_name + "</td><td align=\"center\" role_type=\"" + role_type + "\" valign=\"middle\">" + role_type_name + "</td><td align=\"center\" valign=\"middle\">" + create_time + "</td><td align=\"center\" valign=\"middle\"><a href='javascript:void(0)' class=\"delete_user\" user_id=" + user_id + " title='点击删除用户'>删除用户</a>&nbsp<a href='javascript:void(0)' class=\"passwd\" user_id=" + user_id + " title='点击修改密码'>修改密码</a></td></tr>");

        })
    }

    function ModHandle(data)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
                return false;
            }
        }
        else {
            alert("修改成功!");
            $(".ChgPasswd").css("display", "none");
        }
    }
    $(".ChgPasswd .Close").live("click", function ()
    {
        $(".ChgPasswd").css("display", "none");
    });
    $(".passwd").live("click", function ()
    {
        $(".ChgPasswd").css("display", "block");
        var UserID = $(this).attr("user_id");
        //密码修改
        $(".Submit").live("click", function ()
        {
            var OldPasswd = $("#OldPasswd").val();
            var NewPasswd = $("#NewPasswd").val();
            var RePasswd = $("#RePasswd").val();
            var vUserPassword = $.md5(NewPasswd).toUpperCase();
            if ((NewPasswd == "") || (RePasswd == "")) {
                alert("密码不能为空");
                return false;
            }
            if (NewPasswd != RePasswd) {
                alert("两次输入的密码不一致!");
                return false;
            }
            var Data = {
                user_id: UserID,
                user_password: vUserPassword
            }
            DataHandle("ModUser", Data, ModHandle);
        });
    });
    // 读取机房名称
    function attr_room(data)
    {
        var param_value = data.param_value;
        $(".name_room input").val(param_value)
    }
    var name_room_data = { param_key: "room_name" }
    DataHandle("GetSysParam", name_room_data, attr_room)

    // 修改机房名称
    $(".change_name_room").live('click', function (e)
    {
        var val_name = $(".name_room input").val()
        if (val_name == "") {
            alert("请输入名称")
        } else {
            var name_room_set = { param_key: "room_name", param_value: val_name }

            DataHandle("SetSysParam", name_room_set, set_room)
        };
    });
    function set_room(data)
    {
        alert("修改成功")
    }

    $("#btnUpload").live("click", function (e)
    {
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
        if (url_[nobor] != "png") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择PNG格式上传");
            return false;
        };

        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host
        //var Port = "8002";
        IpAddr = IpAddr.split(":")[0];
        var dataip = ""
        var addr1 = document.location.href;
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
        };
        //alert(local)
        $('#UpLoadForm').ajaxSubmit({
            async: true,
            url: "http://" + IpAddr + ":" + Port + "/SetAreaBG?area_id=" + area_id + dataip,
            dataType: "jsonp",
            success: function (data)
            {
                if (data) {
                    alert(data.error_msg)
                    return false
                } else {
                    alert("上传成功")
                }
            }
        });
    });
    //弹出层----------
    $(".add_u_b").live("click", function (e)
    {
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
    $("#fade").live("click", function (e)
    {
        e.stopPropagation();
        $(".fuceng").fadeOut(500, function () { });
        $("#fade").fadeOut(200, function ()
        {
            $("#fade").remove()
        });
        $(".add_form input").val("");
        $(".quanxian p").replaceWith("<p>权限选择</p>")
        //$(".send_form .no_send").click();
    });
    $(".close, .no_send").live("click", function ()
    {
        $("#fade").click();
    });
    //删除用户------------------------
    $(".delete_user").live("click", function ()
    {
        var ind = $(".user_now tr").index($(this).parents("tr"));
        var user_id = $(this).attr("user_id");
        $this = $(this);
        if (1 == user_id) {
            alert("内置管理员账户不可删除！！");
            return false;
        }
        else {
            if (confirm("确定要删除此用户")) {
                DataHandle("DelUser", {
                    user_id: user_id
                }, dela_use);
            }

            else {
                return false;
            }
        }
        function dela_use(data)
        {
            if (data) {
                alert(data.error_msg)
            } else {
                alert("删除成功")
                location.reload();
            }
        }
    });

    //表格操作------------------------

    $(".sele").live("click", function (e)
    {
        e.stopPropagation();
        $(".use_type").show();
    })
    $(document).click(function ()
    {
        $(".use_type").hide();
    })

    $(".send_form .send_messg").live("click", function (e)
    {
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

        function adduser(data)
        {
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

    function quxian(data)
    {
        $.each(data, function (i, n)
        {
            var role_type_name = n.role_type_name
            var role_type = n.role_type
            if (role_type != "0") {
                $(".use_type").append("<li><a href=\"#\" role_type=\"" + role_type + "\">" + role_type_name + "</a><li>");
            }
        });

    }
    DataHandle("GetRoleList", data1, quxian)
    $(".use_type a").live("click", function (e)
    {
        e.stopPropagation();
        var role_type = $(this).attr("role_type")
        var t_text = $(this).text();
        $(this).parents(".quanxian").children("p").text(t_text).attr("role_type", role_type);
        $(this).parents(".use_type").hide();
    })
    // 取消按钮
    $(".no_send").live('click', function (e)
    {
        e.preventDefault();
        $(".add_table input").val("")
        $(".quanxian p").text("权限选择").removeAttr()
        $(".add_form").hide();
    });
})(jQuery)