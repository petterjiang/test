/*
功能：登录检测
*/
var vUserName;
var vUserPassword;
var tmp;
$(function() {
    // 读取公司名称
    function attr_gs(data) {

        if (data) {
            var param_value = data.param_value;
            $(".name_qiye").text(param_value)
        } else {
            $(".name_qiye").text("福控科技")
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
            $(".name_xitong").text(param_value)
        } else {
            $(".name_xitong").text("物联网控制系统")
        };

    }
    var name_system_data = {
        param_key: "system_name"
    }
    DataHandle("GetSysParam", name_system_data, attr_system)
    /* 登录回车事件 */
    $("input").keyup(function(e) {
        tmp = $(this);
        if (e.keyCode == 13) {
            login();
        }
    });
    $(".input_table .name").focus();
    $("#login").bind("click", login);
    $(".subit_chongzhi").bind("click", Ret);
});

/*
功能：登录验证
*/

function login() {
    vUserName = $(".name").val();
    vUserPassword = $.md5($(".password").val());
    var Data = {
        user_name: vUserName,
        user_password: vUserPassword
    }
    var Url = "Login";
    DataHandle(Url, Data, LoginCheck);
}

/*
输入参数:   data        返回的数据
返回值：    无
功能:       返回的数据处理
*/

function LoginCheck(data) {
    if (data) {
        if (data.error_code) {
            alert(data.error_msg);
            tmp.blur();
        } else {
            if (data.room_type == 2) {
                window.location.href = "./html/web.html?UserName=" + vUserName + "&user_id=" + data.user_id + "&room_type=" + data.room_type + "&role_type=" + data.role_type;
            } else {
                window.location.href = "./html/web_one.html?UserName=" + vUserName + "&user_id=" + data.user_id + "&room_type=" + data.room_type + "&role_type=" + data.role_type;
            }
        }
    }
}


/*
输入参数:   
返回值：    无
功能:       重置输入框
*/

function Ret() {
    $("input").val("");
    $(".input_table .name").focus();
}