$(function ()
{

    LoadCalc();
    Load();

    $("#Style").find("a").bind("click", Swc);   //点击切换样式
    $("#AddBut").bind("click", AddPowerPage);    //打开增加能耗页面
    $("#closebut").bind("click", ClosePowerPage);             //关闭增加能耗页面

    $("#SearData").bind("click", SearData);                  //查询指定时间内的能耗信息
    $(".SelDev p").bind("click", SelDev);        //选择设备，添加能耗信息
    $(".Submit").bind("click", Submit);        //提交添加能耗设备
    $(".DelPower").live("click", DelPower);

    DevType();
    Link();
    GetUser();
});
/*
    获取用户信息
*/
function GetUser()
{
    var UserMsg = new reUser(); //创建用户对象
    var UserName = UserMsg.user_name();
    var UserID = UserMsg.user_id();
    var RoleType = UserMsg.role_type();
    Authority(RoleType);
}
/*
加载日历
*/
function LoadCalc()
{
    $(".SearTr input:gt(0)").live("click", function (e)
    {
        e.stopPropagation();
        WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});
    });
}

//初始加载当天至前一个月的能耗
function Load()
{
    var myDate = new Date();
    var year = myDate.getFullYear();
    var mon = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var Hour = myDate.getHours();
    var Minute = myDate.getMinutes();
    if (mon < 10) {
        mon = "0" + mon;
    }
    else {
        mon = mon;
    }
    if (day < 10) {
        day = "0" + day;
    }
    else {
        day = day;
    }
    if (Hour < 10) {
        Hour = "0" + Hour;
    }
    else {
        Hour = Hour;
    }
    if (Minute < 10) {
        Minute = "0" + Minute;
    }
    else {
        Minute = Minute;
    }
    var BeginDay = day - 1;
    if (BeginDay < 10) {
        BeginDay = "0" + BeginDay;
    }
    else {
        BeginDay = BeginDay;
    }
    if (BeginDay <= 0) {
        if (mon = 1) {
            mon = 12;
            year = year - 1;
        }
        else {
            mon = mon - 1;
        }
    }

    var BeginTime = year + "-" + mon + "-" + BeginDay + " " + Hour + ":" + Minute;
    var EndTime = year + "-" + mon + "-" + day + " " + Hour + ":" + Minute;
    var Price = "1";
    $("#elc").val(Price);
    $("#StartTime").val(BeginTime);
    $("#EndTime").val(EndTime);
    Elc(Price, BeginTime, EndTime, 0);
}

/*
功能:能耗处理函数
参数:
Price           :       能耗单价
BeginTime       :       查询的起始时间         
EndTime         :       查询的结束时间
ID              :       显示样式的ID.ID=0时表示初始化加载

*/
function Elc(Price, BeginTime, EndTime, ID)
{
    $("#NoneInfo").remove();
    var LoadData = {
        unit_price: Price,
        begin_time: BeginTime,
        end_time: EndTime
    }
    $("#power_info tr:gt(1)").remove();
    if ((ID == "TableStyle") || (ID == "0")) {
        $("#power_info tr:gt(0)").remove();
        DataHandle("CalEc", LoadData, ElcHandleTable);
    }
    if (ID == "ChartStyle") {
        DataHandle("CalEc", LoadData, ElcHandleChart);
    }
}
/*
功能:生成表格样式的能耗列表
*/
function ElcHandleTable(data)
{
    var Flag = 1;
    $.each(data, function (i, v)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            else {
                if ((typeof v == "object") && (v != null)) {
                    $.each(v, function (ii, vv)
                    {
                        if (vv.daily_average == "") {
                            vv.daily_average = "暂无数据";
                        }
                        if (vv.monthly_average == "") {
                            vv.monthly_average = "暂无数据";
                        }
                        if (vv.price == "") {
                            vv.price = "暂无数据";
                        }
                        $("#power_info").append("<tr><td ui_dev_id='" + vv.ui_dev_id + "'>" + vv.ui_dev_name + "</td><td ui_prop_id='" + vv.ui_prop_id + "'>" + vv.ui_prop_name + "</td><td>" + vv.daily_average + "</td><td>" + vv.monthly_average + "</td><td>" + vv.price + "</td><td class='DelBut'><a href='javascript:void(0)' title='点击删除' class='DelPower' ui_dev_id='" + vv.ui_dev_id + "' ui_prop_id='" + vv.ui_prop_id + "'>删除</a></td><tr>");
                    });
                    GetUser();
                    Flag = 0;
                }
            }
        }

    });
    if (Flag == 1) {
        $("#power_info").append("<tr><td colspan='6' style='height:120px;line-height:120px;'>暂无相关信息</td><tr>");
    }
}
/*
功能:生成图表样式的能耗列表
*/
function ElcHandleChart(data)
{
    var categories = [];
    var DevData = [];   //日均能耗
    var MonthData = []; //月均能耗
    var DevName = [];
    var Prop = [];
    var Flag = 1;
    $.each(data, function (i, v)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            if (data.ec_item == null) {
                Flag = 0;
            }
            else {
                if ((typeof v == "object") && (v != null)) {
                    $.each(v, function (ii, vv)
                    {
                        DevName.push(vv.ui_dev_name + '(' + vv.ui_prop_name + ')');
                        DevData.push(Number(vv.daily_average));
                        MonthData.push(Number(vv.monthly_average));
                    });
                }
            }
        }
    });
    if (Flag == 0) {
        $(".power_info .ChartCont").append("<div id='NoneInfo' style='height:100px;line-height:120px;color:#fff;'>暂无相关信息</div>");
        $("#day_average").css("display", "none");
        $("#month_average").css("display", "none");
        return false;
    }
    else {
        ChartsSty('日均能耗', DevName, DevData, '#day_average');
        ChartsSty('月均能耗', DevName, MonthData, '#month_average');
    }
}

/*
切换导航标签
*/
function Swc()
{
    var ID = $(this).attr("id");
    $(this).parents().find("a").each(function ()
    {
        if ($(this).attr("class") == "on_show") {
            $(this).removeClass("on_show");
        }
    });
    $(this).addClass("on_show");
    SwcStyle(ID);
}

/*
切换显示样式
*/
function SwcStyle(ID)
{
    var Price = $("#elc").val();
    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();
    if (ID == "TableStyle") {
        $("#power_info").css("display", "");
        $(".AddBut").css("display", "");
        $("#day_average").css("display", "none");
        $("#month_average").css("display", "none");
    }
    if (ID == "ChartStyle") {
        $("#power_info").css("display", "none");
        $(".AddBut").css("display", "none");
        $("div.AddPage").css("display", "none");
        $("#day_average").css("display", "");
        $("#month_average").css("display", "");
    }
    Elc(Price, StartTime, EndTime, ID);
}

function ChartsSty(Title,DevName,Val,ID)
{
    $(ID).highcharts({
        chart: {
            type: 'column',
            margin: [50, 50, 100, 80],
            backgroundColor: "#333"
        },
        title: {
            text: Title,
            style: {
                color: '#fff'
            }
        },
        xAxis: {
            categories: DevName,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    color: '#fff'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '能耗值',
                style: {
                    color: '#fff'
                }
            }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        formatter: function ()
        {
            var point = this.point,
                s = '<b>' + this.x +'<br/>'+ '能耗值为:</b>' + this.y + '<br/>';
            return s;
        }
    },
    series: [{
        name: Title,
        data: Val,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            x: 4,
            y: 10,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});
$(".highcharts-button").css("display", "none");
}

/*
打开增加PUE页面
*/
function AddPowerPage()
{
     
    $("#Clear1").text("请选择");
    $("#Clear2").text("请选择");
    $("#Clear3").text("请选择");
    $("div.AddPage").css("display", "block");
}

/*
关闭增加PUE页面
*/
function ClosePowerPage()
{
    $("div.AddPage").css("display", "none");
}

/*
查询指定时间内的PUE信息
*/
function SearData()
{
    var elc = $("#elc").val();
    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();

    $("#Style").find("a").each(function ()
    {
        var Name = $(this).attr("class");
        var ID = $(this).attr("id");
        if (Name == "on_show") {
            Elc(elc, StartTime, EndTime, ID);
        }
    });
}

/*
功能:选择设备，添加能耗
*/
function SelDev()
{
    var $this = $(this);
    var ID = $this.attr("id");
    $(".SelDev").find("ul").css("display", "none");
    $(this).siblings("ul").css("display", "block");
    $(this).siblings("ul").find("li").click(function ()
    {
        $this.text($(this).text());
        var ThisLi = $(this);
        GetID(ID, $this, ThisLi);
        $(this).parents("ul").css("display", "none");
    });
}
function GetID(ID, $this, ThisLi)
{
    if (ID == "Clear1") {
        $this.attr("ui_dev_id", ThisLi.attr("ui_dev_id"));
    }
    if (ID == "Clear2") {
        $this.attr("ui_prop_id", ThisLi.attr("ui_prop_id"));
    }
    if (ID == "Clear3") {
        $this.attr("system_class", ThisLi.attr("system_class"));
    }
}

/*
功能:加载设备类型
*/
function DevType()
{
    DataHandle("GetUiDevList", {}, Dev);
}

function Dev(data)
{
    var ui_dev_id;
    var ui_dev_name;
    var system_class;
    var ui_prop_id;
    var ui_prop_name;
    var show_level;
    var DevID;
    $.each(data, function (i, v)
    {
        ui_dev_name = data[i].ui_dev_name;
        ui_dev_id = data[i].ui_dev_id;
        system_class = data[i].system_class;
        Create(system_class, ui_dev_name, ui_dev_id);
        DataHandle("GetUiDevPropList", { ui_dev_id: ui_dev_id }, Prop);
    });
    function Prop(data)
    {
        $.each(data, function (i, v)
        {
            if (data) {
                if (data.error_code) {

                }
                else {
                    ui_prop_id = data[i].ui_prop_id;
                    ui_prop_name = data[i].ui_prop_name;
                    show_level = data[i].show_level;
                    DevID = data[i].ui_dev_id;
                    $("#Prop").append("<li ui_dev_id='" + DevID + "' ui_prop_id='" + ui_prop_id + "'style='display:none;'>" + ui_prop_name + "</li>");
                }
            }
        });
    }
}
/*
建立设备列表
*/
function Create(system_class, ui_dev_name, ui_dev_id)
{
    $("#Dev").append("<li ui_dev_id='" + ui_dev_id + "' system_class='" + system_class + "'style='display:none;'>" + ui_dev_name + "</li>");
}
/*
联动系统类型与设备与属性
*/
function Link()
{
    var system_class;
    var ui_dev_id;
    var ui_prop_id;
    $("#DevType").find("li").bind("click", function ()
    {
        $("#Clear1").text("请选择");
        $("#Clear2").text("请选择");
        system_class = $(this).attr("system_class");
        $("#Dev").find("li").each(function ()       //根据系统类型选择下面的设备
        {
            $(this).css("display", "none");
            if ($(this).attr("system_class") == system_class) {
                $(this).css("display", "block");
            }
        });
    });
    $("#Dev").find("li").live("click", function ()
    {
        $("#Clear2").text("请选择");
        ui_dev_id = $(this).attr("ui_dev_id");
        $("#Prop").find("li").each(function ()
        {
            $(this).css("display", "none");
            if ($(this).attr("ui_dev_id") == ui_dev_id) {
                $(this).css("display", "block");
            }
        });
    });
}

/*
提交添加能耗设备
*/
function Submit()
{
    var DevType = $("#Clear3").text();    //设备类型
    var Dev = $("#Clear1").text();    //设备
    var Prop = $("#Clear2").text();    //属性
    var ec_prop = [];
    var op_type = "0";
    var jsonstr;
    var Add = {}
    var DevArray = new Array();
    var tmp = {}
    Add.ui_dev_id = $("#Clear1").attr("ui_dev_id");
    Add.ui_prop_id = $("#Clear2").attr("ui_prop_id");
    ec_prop.push(Add);
    tmp.ec_prop = ec_prop;
    tmp.op_type = op_type;
    DevArray.push(tmp);
    jsonstr = JSON.stringify(DevArray);
    jsonstr = jsonstr.slice(1, -1);
    var Data = {
        json_string: jsonstr
    }
    if ((DevType == "请选择") || (Dev == "请选择") || (Prop == "请选择")) {
        alert("选择不能为空");
        return false;
    }
    else {
        DataHandle("ModEcProp", Data, PropHandler);

    }
}

function PropHandler(data)
{
    if (data) {
        if (data.error_code) {
            alert(data.error_msg);
        }
    }
    else {
        alert("添加成功");
        ClosePowerPage();
        location.reload();
    }

}
/*
    删除能耗设备
*/
function DelPower()
{
    if (confirm("确定删除吗？")) {
        var ec_prop = [];
        var op_type = "1";
        var jsonstr;
        var Add = {}
        var DevArray = new Array();
        var tmp = {}
        Add.ui_dev_id = $(this).attr("ui_dev_id");
        Add.ui_prop_id = $(this).attr("ui_prop_id");
        ec_prop.push(Add);
        tmp.ec_prop = ec_prop;
        tmp.op_type = op_type;
        DevArray.push(tmp);
        jsonstr = JSON.stringify(DevArray);
        jsonstr = jsonstr.slice(1, -1);
        var Data = {
            json_string: jsonstr
        }
        DataHandle("ModEcProp", Data, DelHandle);
    }
    else {
        return false;
    }
}

function DelHandle(data)
{
    if (data) {
        if (data.error_code) {
            alert(data.error_msg);
        }
    }
    if (data == null) {
        alert("删除成功");
        location.reload();
    }
}

/*
    功能:不同用户权限的显示
    参数:role_type    :   所属权限
*/
function Authority(role_type)
{
    var AddDiv = $(".power_info .AddBut");
    var Del = $("#Del");
    var DelBut = $(".power_info .DelBut");
    if (role_type == "0") {
        //全显
    }
    if (role_type == "1") {
        //全显
    }

    if (role_type == "2") {
        AddDiv.remove();
        Del.remove();
        DelBut.remove();
    }
}