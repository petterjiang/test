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

    // ��ȡ��������

    function attr_room(data) {

        if (data) {
            var param_value = data.param_value;
            $(".name_room input").val(param_value)
        } else {
            $(".name_room input[type='text']").val("���ػ������ϵͳ")
        };
    }
    var name_room_data = {
        param_key: "room_name"
    }
    DataHandle("GetSysParam", name_room_data, attr_room)
    // ��ȡ��˾����

    function attr_gs(data) {

        if (data) {
            var param_value = data.param_value;
            $(".gs_name input").val(param_value)
        } else {
            $(".gs_name input").val("���ؿƼ�")
        };
    }
    var name_gs_data = {
        param_key: "gs_name"
    }
    DataHandle("GetSysParam", name_gs_data, attr_gs)
    // ��ȡϵͳ����

    function attr_system(data) {

        if (data) {
            var param_value = data.param_value;
            $(".system_name input").val(param_value)
        } else {
            $(".system_name input").val("����������ϵͳ")
        };
    }
    var name_system_data = {
        param_key: "system_name"
    }
    DataHandle("GetSysParam", name_system_data, attr_system)

    // �޸Ĺ�˾����
    $(".change_name_gs").live('click', function(e) {
        var val_name = $(".gs_name input").val()
        if (val_name == "") {
            alert("����������")
        } else {
            var name_gs_set = {
                param_key: "gs_name",
                param_value: val_name
            }
            DataHandle("SetSysParam", name_gs_set, set_room);
        };
    });
    // �޸�ϵͳ����
    $(".change_name_system").live('click', function(e) {
        var val_name = $(".system_name input").val()
        if (val_name == "") {
            alert("����������")
        } else {
            var name_gs_set = {
                param_key: "system_name",
                param_value: val_name
            }
            DataHandle("SetSysParam", name_gs_set, set_room);
        };
    });

    // �޸Ļ�������
    $(".change_name_room").live('click', function(e) {
        var val_name = $(".name_room input").val()
        if (val_name == "") {
            alert("����������")
        } else {
            var name_room_set = {
                param_key: "room_name",
                param_value: val_name
            }

            DataHandle("SetSysParam", name_room_set, set_room);
        };
    });

    //��ȡ����IP

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
    //�޸Ļ���IP
    $(".change_ip_room").live("click", function(e) {
        var Addr = $("#Addr").val();
        var Mask = $("#Mask").val();
        var GateWay = $("#GateWay").val();
        if ((Addr == "") || (Mask == "") || (GateWay == "")) {
            alert("�����������Ϣ")
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
            alert("�޸ĳɹ�");
            location.reload();
        }
    }

    // ��ȡ��������

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
            alert("��ѡ��һ��ͼƬ�ļ����ٵ���ϴ���");
            return;
        }
        var url = $("#flUpload").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "png" && url_[nobor] != "PNG") {
            alert("��֧��" + url_[nobor] + "�ĸ�ʽ��������ѡ��PNG��ʽ�ϴ�");
            return false;
        };

        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host;
        IpAddr = IpAddr.split(":")[0];
        var dataip = ""
        var addr1 = document.location.href;
        // �ж�����Ƕ���������ϴ����Զ�����ͼƬ�������ϴ�Ĭ��ͼƬ
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
                    alert("�ϴ��ɹ�")
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
                    alert("�ϴ��ɹ�")
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
    //������----------
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
        $(".quanxian p").replaceWith("<p>Ȩ��ѡ��</p>")
        //$(".send_form .no_send").click();
    });
    $(".close, .no_send").live("click", function() {
        $("#fade").click();
    });
    //ɾ���û�------------------------
    $(".delete_user").live("click", function() {
        if (confirm("ȷ��Ҫɾ�����û�")) {
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
                alert("ɾ���ɹ�")
                location.reload();
            }
        }
    });
    //�޸�����
    $(".passwd").live("click", function() {

    });
    //������------------------------

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
            alert("�������벻һ��");
            return false;
        }
        if (user_name == "" || user_password == "" || user_password1 == "" || role_type == undefined) {
            alert("����������");
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
                    alert("��ӳɹ�")
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
    // ȡ����ť
    $(".no_send").live('click', function(e) {
        e.preventDefault();
        $(".add_table input").val("")
        $(".quanxian p").text("Ȩ��ѡ��").removeAttr()
        $(".add_form").hide();
    });
})