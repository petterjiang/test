$(function () {
    //检查URL，如果不是通过密码验证登录则跳转到登录页面
    var Addr = window.location.href;
    var tmp = Addr.split("?");
    if (typeof tmp[1] == "undefined") {
        window.location.href = "../index.html";
    }
    User();
});

/*
参数： Time:       退出前的经过时间
功能： 定时退出登录
*/

function TimeExit(Time) {
    window.setTimeout(function () {
        window.location.href = "../index.html";
    }, Time);
}


/*
    参数：
    返回值：
    功能:             根据用户名设置不同的权限
*/
function User() {
    var user_name;
    var user_id;
  //  user_name = $.query.get("UserName");        //用户名
 //   user_id = $.query.get("user_id");           //用户ID

}