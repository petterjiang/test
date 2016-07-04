var newul1;
var newul2;
var newli;
var clearInter = new Array();
var page_index = 0; //默认显示页数
var page_size = 30; //默认显示条数
var Page = 250;
$(function ()
{
    GetUiDevList();
    $("#addpue").bind("click", OpenAddPage);
    $(".InfoTab").find("a").bind("click", SwcTab);
    LoadCalc();
    Load();
    PueDev();
    $("#Sear").bind("click", function ()
    {
        var PageIndex = 0;
        $(".prev").find("span").empty();
        PueHis(PageIndex);
    });   //查询PUE历史记录
    if (page_index == 0) {
        $(".prev").find("span").empty();
    }
    $(".tanchu_new").find(".closebut").bind("click", ClosePage);
    $(".fuceng").find(".closebut").bind("click", CloseAddPage);
    Next();
    Prev();
    $("#PowerChart").append("<div id='NoneInfo' style='height:100px;line-height:100px;color:#fff;'>暂无相关信息</div>");
    $("#SearChart").live("click", PueData);
    GetUser();
    //=======================掉用SetHook


    var chage_pue = function (SetHook)
    {
        $.each(SetHook, function (i, n)
        {
            if (n.pue_id) {
                var pue_id = n.pue_id;
                var pue_value = n.pue_value;

                $(".pue_list td[pueid]").each(
                    function ()
                    {
                        var this_pue_id = $(this).attr("pueid");
                        if (this_pue_id == pue_id) {
                            $(this).parent().find(".pue_avl").text(pue_value);
                        }

                    }
                );
            }

        });
    };
    b_callbacks.add(chage_pue);
    // StartComet();
});
//初始加载当天至前一天的PUE
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
    $("#time1").val(BeginTime);
    $("#time2").val(EndTime);
    $("#time3").val(BeginTime);
    $("#time4").val(EndTime);
    PueHis(page_index);
    Chart();
}
$(".menu").find("li").live("click", function ()
{
    var PueID = $(this).attr("pue_id");
    var PueName = $(this).text();
    $("#Clear1").val(PueName);
    $("#Clear1").attr("pue_id", PueID);
});
//pue设备列表
function PueDev()
{
    DataHandle("GetPUEList", {}, PUEList);
    function PUEList(data)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            else {
                $.each(data, function (i, v)
                {
                    $("#PueDev").append("<li pue_id='" + v.pue_id + "'>" + v.pue_name + "</li>");
                });
            }
        }

    }
    $("#Clear1").live("click", function ()
    {
        $("#PueDev").css("display", "block");
    });
    $("#PueDev").find("li").live("click", function ()
    {
        var pue_id = $(this).attr("pue_id");
        var pue_name = $(this).text();
        $("#PueDev").css("display", "none");
        $("#Clear1").attr("pue_id", pue_id);
        $("#Clear1").text(pue_name);
    });
}
function PueData()
{
    var pue_id = $("#Clear1").attr("pue_id");
    var pue_name = $("#Clear1").text();
    var StartTime = $("#time3").val();
    var EndTime = $("#time4").val();
    var Data;
    var PueValue = [];
    var RecTime = [];
    Data = {
        pue_id: pue_id,
        begin_time: StartTime,
        end_time: EndTime,
        page_index: page_index,
        page_size: Page
    }
    if (pue_name == "请选择") {
        alert("请选择一个PUE");
        return false;
    }
    else {
        DataHandle("GetHisPUE", Data, HisPUE);
    }
    function HisPUE(data)
    {
        if (data) {
            if (data.errro_code) {
                alert(data.error_msg);
            }
            else {
                $(".NoneInfo").remove();
                $.each(data, function (i, v)
                {
                    
                    if (i % 10 == 0) {
                        PueValue.push(Number(v.pue_value));
                        RecTime.push(v.rec_time);
                    }
                });
            }
        }
        else {
            return false;
        }
        ChartSty(PueValue, RecTime, pue_name);
    }

}
//查找上一页
function Prev()
{
    $(".prev").find("span").click(function ()
    {
        page_index = page_index - 1;
        PueHis(page_index);
        $(".next").find("span").text("下一页");
        if (page_index == 0) {
            $(".prev").find("span").empty();
        }
        else {
            $(".prev").find("span").text("上一页");
        }
    });
}
//查找下一页
function Next()
{
    $(".next").find("span").bind("click",function ()
    {
        page_index += 1;
        PueHis(page_index);
        $(".prev").find("span").text("上一页");
    });
}
//图表样式
function ChartSty(PueVal, RecTime, pue_name)
{
    $('#PowerChart').highcharts({

        chart: {
            zoomType: 'x',
            spacingRight: 20,
            backgroundColor: "#333"
        },
        title: {
            text: pue_name + '的PUE统计',
            style: {
                color: '#fff'
            }
        },
        xAxis: {
            categories: RecTime
    },
    yAxis: {
        title: {
            text: '值'
        }
    },
    tooltip: {
        shared: true
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
            },
            lineWidth: 1,
            marker: {
                enabled: false
            },
            shadow: false,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },

    series: [{
        type: 'area',
        name: '值',
        data: PueVal
    }],
    exporting: {
        enabled: false
    }

});
$(".highcharts-axis-labels").css("display", "None");
}
//PUE历史记录
function PueHis(PageIndex)
{
    $("#PueCont").find("tr").remove();
    var StartTime = $("#time1").val();
    var EndTime = $("#time2").val();
    var Data;
    var pue_id;
    var pue_name;
    if (PageIndex == 0) {
        page_index = 0;
    }
    DataHandle("GetPUEList", {}, pue_list, loading);
    function pue_list(data)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            else {
                $.each(data, function (i, v)
                {
                    pue_id = v.pue_id;
                    pue_name = v.pue_name;
                    Data = {
                        page_index: PageIndex,
                        page_size: page_size,
                        begin_time: StartTime,
                        end_time: EndTime,
                        pue_id: pue_id
                    }
                    DataHandle("GetHisPUE", Data, HisPue);
                });
            }
        }
        

    }
    function HisPue(data)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            else {
                $.each(data, function (i, v)
                {
                    $("#PueCont").append("<tr pue_id='" + pue_id + "'><td>" + pue_name + "</td><td>" + v.pue_value + "</td><td>" + v.rec_time + "</td></tr>");
                });
            }
        }
        else {
            $("#PueCont").append("<tr><td colspan='3' style='height:120px;line-height:120px;'>暂无相关信息</td></tr>");
            $(".next").find("span").empty();
            return false;
        }    
    }

}
//图表统计
function Chart()
{

}
function SwcCont(ID)
{
    if (ID == "Info1") {
        $(".pue_history").css("display", "none");
        $(".pue_show").css("display", "block");
        $(".pue_chart").css("display", "none");
    }
    if (ID == "Info2") {
        $(".pue_history").css("display", "block");
        $(".pue_show").css("display", "none");
        $(".pue_chart").css("display", "none");
    }
    if (ID == "Info3") {
        $(".pue_history").css("display", "none");
        $(".pue_show").css("display", "none");
        $(".pue_chart").css("display", "block");
    }
}
/*
加载日历
*/
function LoadCalc()
{
    $(".Input input").live("click", function (e)
    {
        e.stopPropagation();
        WdatePicker()
    });
}
/*
获取用户信息
*/
function GetUser()
{
    var UserMsg = new reUser(); //创建用户对象
    var UserName = UserMsg.user_name();
    var UserID = UserMsg.user_id();
    var RoleType = UserMsg.role_type();
    GetPUEList(RoleType);
    Authority(RoleType);
}

//打开增加页面

function OpenAddPage()
{
    $(".fuceng").css("display", "block");
}

function CloseAddPage()
{
    $(".fuceng").css("display", "none");
}

function OpenPage()
{
    $(".tanchu_new").css("display", "block");
}

function ClosePage()
{
    $(".tanchu_new").css("display", "none");
}
//读取pue信息

function GetPUEList(role_type)
{
    function pueload(data)
    {
        if (data) {
            if (data.error_code) {
                alert(data.error_msg);
            }
            else {
                $.each(data, function (i, n)
                {
                    var pue_name = n.pue_name
                    var pue_id = n.pue_id;
                    var show_level = n.show_level;
                    DataHandle("GetPUEValue", {
                        pue_id: pue_id
                    }, PueValue, loading);

                    function PueValue(data)
                    {
                        var pue_value = data.pue_value

                        if (2 == role_type) {
                            $(".pue_list table").append("<tr><td pueid='" + pue_id + "'>" + pue_name + "</td><td class='pue_avl'>" + pue_value + "</td><td><a href='javascript:void(0)' class='click_more'>详细</a></td></tr>");
                        }
                        else {
                            $(".pue_list table").append("<tr><td pueid='" + pue_id + "'>" + pue_name + "</td><td class='pue_avl'>" + pue_value + "</td><td><a href='javascript:void(0)' class='click_more'>详细</a> <a href='javascript:void(0)' class='delete_pue'>删除</a></td></tr>");
                        }
                    }
                });
            }
        }
        else {
            $(".pue_list table").append("<tr><td colspan='3' style='height:120px;line-height:120px;'>暂无相关信息</td></tr>");
        }
        
    }

    DataHandle("GetPUEList", {
        type: "1"
    }, pueload, loading);

}



function GetUiDevList()
{
    DataHandle("GetUiDevList", {}, DevListLoad, loading);
}

function DevListLoad(data)
{
    $.each(data, function (o, m)
    {
        var ui_dev_name = m.ui_dev_name;
        var ui_dev_id = m.ui_dev_id;
        var SystemClass = m.system_class;
        $(".shebei_list").append("<label><span system_class=\"" + SystemClass + "\" ui_dev_id=\"" + ui_dev_id + "\">" + ui_dev_name + "</span> <input type=\"radio\" name=\"RadioGroup1\" /></label> ")
        GetUiDevPropList(ui_dev_id);
    });
}

function GetUiDevPropList(ui_dev_id)
{
    $.ajax({
        type: "get",
        data: {
            ui_dev_id: ui_dev_id
        },
        url: GetUrl("GetUiDevPropList"),
        dataType: "jsonp",
        contentType: "application/json;charset=gb2312",
        success: function (data)
        {
            $.each(data, function (x, l)
            {
                var ui_prop_name = l.ui_prop_name;
                var shebeiid = l.ui_dev_id
                var prop_id = l.ui_prop_id;
                var prop_type = l.prop_type;
                if (prop_type == "r") {
                    $(".shuxing_list").append("<div class='no_sele' prop_id=\"" + prop_id + "\" ui_dev_id=\"" + ui_dev_id + "\"><a href='javascript:void(0)'>" + ui_prop_name + "</a></div> ");
                }
            })
        }
    });
}
//切换导航标签
function Swc()
{

}
//===============================
$(".sele").live("click", function (e)
{
    e.stopPropagation();
    $(".menu").show();
})
$(document).click(function ()
{
    $(".menu").hide();
})

$(".menu li a").live("click", function (e)
{
    e.stopPropagation();
    $(".menu").hide();
    $(".pue_shebei").show();
    var a_id = $(this).attr("system_class");
    $(".shebei_list label").hide();
    $(".shebei_list span[system_class='" + a_id + "']").parent().show()
    var val_sele = $(this).text();
    $(".sele p").text(val_sele);
});
//点击设备列表	
$(".shebei_list label").live("click", function ()
{
    var ui_dev1 = $(this).find("span").attr("ui_dev_id");
    $(".pue_val").show();
    $(".shuxing_list div.no_sele").hide();
    $(".shuxing_list div.sele_on").show();
    $(".shuxing_list .no_sele[ui_dev_id='" + ui_dev1 + "']").show()
});
$(".no_sele").live("click", function ()
{
    $no_sele = $(this)
    var ui_dev_id = $no_sele.attr("ui_dev_id");
    var prop_id = $no_sele.attr("prop_id");
    var name_shuxing = $no_sele.children("a").text()
    var name_text = $(".shebei_list span[ui_dev_id='" + ui_dev_id + "']").text();
    if ($no_sele.hasClass("sele_on")) {
        if ($no_sele.find(".fenzi").length > 0) {
            $no_sele.find(".fenzi").remove();
            $(".jieg_sel td[ui_dev_id='" + ui_dev_id + "']").each(
                function ()
                {
                    if ($(this).attr("prop_id") == prop_id) {
                        $(this).parents("tr").remove();
                    }

                }

            );
        }
        if ($no_sele.find(".fenmu").length > 0) {
            $no_sele.find(".fenmu").remove();
            $(".jieg_sel2 td[ui_dev_id='" + ui_dev_id + "']").each(
                function ()
                {
                    if ($(this).attr("prop_id") == prop_id) {
                        $(this).parents("tr").remove();
                    }
                }
            );
        }
        $no_sele.removeClass("sele_on");



    } else {
        if ($(".tanchu_new .add_shux").hasClass("shux_left")) {
            $no_sele.append("<span class='fenzi'></span>");

            DataHandle("ReadUiDevProp", {
                ui_dev_id: ui_dev_id,
                ui_prop_id: prop_id
            }, addtble, loading);
        }


        if ($(".tanchu_new .add_shux").hasClass("shux_right")) {
            $no_sele.append("<span class='fenmu'></span>")


            DataHandle("ReadUiDevProp", {
                ui_dev_id: ui_dev_id,
                ui_prop_id: prop_id
            }, addtble1, loading)
        }
        $no_sele.addClass("sele_on")
    }

    function addtble(ReadUiDevProp)
    {
        var ReadUiDevProp = ReadUiDevProp.prop_value
        $(".jieg_sel table").append("<tr><td>" + name_text + "</td><td class='ajax_send' prop_id='" + prop_id + "' ui_dev_id='" + ui_dev_id + "'>" + name_shuxing + "</td><td>" + ReadUiDevProp + "</td><td><a class='del_this_td' href='javascript:void(0)'>删除</a></td></tr>");
    }

    function addtble1(ReadUiDevProp)
    {
        var ReadUiDevProp = ReadUiDevProp.prop_value
        //alert(ReadUiDevProp)
        $(".jieg_sel2 table").append("<tr><td>" + name_text + "</td><td class='ajax_send' prop_id='" + prop_id + "' ui_dev_id='" + ui_dev_id + "'>" + name_shuxing + "</td><td>" + ReadUiDevProp + "</td><td><a class='del_this_td' href='javascript:void(0)'>删除</a></td></tr>");
    }
});

//区域鼠标经过
$(".menu li").live("mouseover", function ()
{
    //e.stopPropagation();
    //$(".menu ul").stop(true,false);
    $(this).children("ul").stop(true, true)
    $(this).children("ul").fadeIn(200);
    $(this).find("a").first().addClass("over_hander")

});
$(".menu li").live("mouseleave", function ()
{
    //e.stopPropagation();
    //$(".menu ul").stop(false,true)
    $(this).children("ul").fadeOut(200);
    $(this).find("a").first().removeClass("over_hander")
})
$(".add_pue").live("click", function (e)
{
    $(".fuceng").css("display", "block");
});


//查看pue详细
$(".click_more").live("click", function (e)
{
    e.stopPropagation();
    $("body").append("<div id='fade'></div>");
    $("#fade").css("opacity", 0.5);
    $(".pue_more").fadeIn(500);
    var pue_name = $(this).parent().prev().prev().text()
    var pue_id = $(this).parent().prev().prev().attr("pueid");
    //alert(pue_name)
    $(".pue_jieguo").text(pue_name).attr("pue_id", pue_id)

    var val_pue = $(this)
    var text = val_pue.parent().prev().text()
    $(".pue_jieguo").text(pue_name + "(值： " + text + ")")
    var s2 = setInterval(
        function ()
        {
            var text = val_pue.parent().prev().text()
            $(".pue_jieguo").text(pue_name + "(值： " + text + ")")
        }, 2000)
    clearInter.push(s2);
    var this_pue_al

    function PueValuetu(data)
    {
        var pue_value = data.pue_value
        this_pue_al = parseFloat(pue_value)
        tubiao(val_pue, this_pue_al);
    }
    DataHandle("GetPUEValue", {
        pue_id: pue_id
    }, PueValuetu, loading);

    //alert(val_pue)

    //生成线形图-----------------------

    function tubiao(ino_in, this_pue_al)
    {

        Highcharts.setOptions({
            global: {
                useUTC: true
            }
        });
        var a = 0;
        var chart;
        $('#content_id').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function ()
                    {

                        function aaaaa(ino_in)
                        {
                            var abcd = ino_in.parent().prev().text()
                            abcd = parseFloat(abcd)
                            //alert(abcd)
                            var x = (new Date()).getTime() + 28800000, // current time
                                y = abcd; //y轴的数值
                            series.addPoint([x, y], true, true);
                        }
                        // set up the updating of the chart each second
                        var series = this.series[0];

                        function abd(ino_in)
                        {
                            return function ()
                            {
                                aaaaa(ino_in);
                            }
                        }
                        var sss = setInterval(
                            abd(ino_in), 2000)
                        clearInter.push(sss)

                    }
                },
                backgroundColor: "#333"
            },
            title: {
                text: ""
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 300,
                style: {
                    color: '#fff'
                }
            },
            yAxis: {
                title: {
                    text: "pue",
                    style: {
                        color: '#fff'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#707070'
                }]
            },
            tooltip: {
                formatter: function ()
                {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.numberFormat(this.y, 1) + '<br/>' + '时间：' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: true
            },
            series: [{
                name: '实时pue',
                data: (function ()
                {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime() + 28800000,
                        i;
                    ///var yzhou = $this.find(".bj_show").eq(ino_in).find(".val_shishi").text();
                    //yzhou=parseFloat(yzhou);

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time,
                            y: this_pue_al
                        });
                    }
                    return data;
                })()
            }]
        });
        $(".highcharts-button").css("display", "none");
    }
    //============
    read_mingxi(pue_id)

    //调用SetHook
    var chage_pue_v = function (SetHook)
    {
        $.each(SetHook, function (i, n)
        {
            if (n.ui_dev_prop) {
                var ui_dev_prop = n.ui_dev_prop;
                var ui_prop_id = ui_dev_prop.ui_prop_id;
                var ui_dev_id = ui_dev_prop.ui_dev_id;
                var prop_value = ui_dev_prop.prop_value;
                $(".pue_more tr").each(
                    function ()
                    {
                        var ui_dev_id1 = $(this).find("td[ui_dev_id]").attr("ui_dev_id");
                        var ui_prop_id1 = $(this).find("td[ui_prop_id]").attr("ui_prop_id");
                        if (ui_dev_id == ui_dev_id1 && ui_prop_id == ui_prop_id1) {
                            $(this).find(".val_pue_sx").text(prop_value)
                        }
                    }
                );



            }
        })
    };
    b_callbacks.add(chage_pue_v);

});

//读取明细====================

function read_mingxi(pue_id)
{
    /*根据用户类型确定显示的内容*/
    var UserMsg = new reUser(); //创建用户对象
    var RoleType = UserMsg.role_type();
    $.ajax({
        type: "get",
        data: {
            pue_id: pue_id
        },
        url: GetUrl("GetPUEDtl"),
        dataType: "jsonp",
        contentType: "application/json;charset=gb2312",
        success: function (GetPUEDtl)
        {

            $.each(GetPUEDtl, function (l, p)
            {
                var ui_dev_name = p.ui_dev_name;
                var ui_prop_name = p.ui_prop_name;
                var nd_type = p.nd_type;
                var ui_dev_id = p.ui_dev_id;
                var ui_prop_id = p.ui_prop_id;
                //alert(1)
                if (nd_type == "0") {

                    DataHandle("ReadUiDevProp", {
                        ui_dev_id: ui_dev_id,
                        ui_prop_id: ui_prop_id
                    }, addtble, loading)


                }

                function addtble(ReadUiDevProp)
                {
                    var ReadUiDevProp = ReadUiDevProp.prop_value;
                    if (RoleType == 2) {
                        $(".jieg_sel3 table").append("<tr><td ui_dev_id='" + ui_dev_id + "'>" + ui_dev_name + "</td><td ui_prop_id='" + ui_prop_id + "'>" + ui_prop_name + "</td><td class='val_pue_sx'>" + ReadUiDevProp + "</td></tr>");
                    }
                    else {
                        $(".jieg_sel3 table").append("<tr><td ui_dev_id='" + ui_dev_id + "'>" + ui_dev_name + "</td><td ui_prop_id='" + ui_prop_id + "'>" + ui_prop_name + "</td><td class='val_pue_sx'>" + ReadUiDevProp + "</td><td><a class='del_this_td' href='javascript:void(0)'>删除</a></td></tr>");
                    }
                }
                if (nd_type == "1") {

                    DataHandle("ReadUiDevProp", {
                        ui_dev_id: ui_dev_id,
                        ui_prop_id: ui_prop_id
                    }, addtble2, loading)

                }

                function addtble2(ReadUiDevProp)
                {
                    var ReadUiDevProp = ReadUiDevProp.prop_value;
                    if (RoleType == 2) {
                        $(".jieg_sel4 table").append("<tr><td ui_dev_id='" + ui_dev_id + "'>" + ui_dev_name + "</td><td ui_prop_id='" + ui_prop_id + "'>" + ui_prop_name + "</td><td class='val_pue_sx'>" + ReadUiDevProp + "</td></tr>");
                    }
                    else {
                        $(".jieg_sel4 table").append("<tr><td ui_dev_id='" + ui_dev_id + "'>" + ui_dev_name + "</td><td ui_prop_id='" + ui_prop_id + "'>" + ui_prop_name + "</td><td class='val_pue_sx'>" + ReadUiDevProp + "</td><td class='DelBut'><a class='del_this_td' href='javascript:void(0)'>删除</a></td></tr>");
                    }
                }
            });


        }

    });         //end ajax


}

$("#fade").live("click", function (e)
{
    e.stopPropagation();
    $(".fuceng").fadeOut(500, function () { });
    $(".pue_more").fadeOut(500, function () { });
    $(".tanchu_new").hide();
    $(".pue_shebei, .pue_val").hide();
    $(".sele_on").removeClass("sele_on").find("span").remove();
    $("#fade").fadeOut(200, function ()
    {
        $("#fade").remove()
    });
    $(".jieg_sel3 tr td").parent().remove();
    $(".jieg_sel4 tr td").parent().remove();
    $(".pue_jieguo").text("PUE值：加载中。。。");
    for (var ia = 0; ia < clearInter.length; ia++) {
        var valid = clearInter[ia]
        clearInterval(valid)
    }
    clearInter = new Array();
});
$(".close").live("click", function ()
{
    $("#fade").click();
});
$("#quxiao").live('click', function (e)
{
    $(".fuceng .closebut span").click();
});
$("#add").live("click", function ()
{
    var pue_name = $(".pue_name").val();
    var show_level;
    if ($("#HomeSet").attr("checked")) {
        show_level = "1";
    } else {
        show_level = "0";
    }
    if (!pue_name) {
        alert("请输入pue名称");
        return false
    }
    var pue_dtl = []
    $(".ajax_send").each(function (i)
    {
        var ui_dev_id = $(this).attr("ui_dev_id");
        var ui_prop_id = $(this).attr("prop_id");
        if ($(this).parents(".jieg_sel").length > 0) {
            var nd_type = "0";
        }
        if ($(this).parents(".jieg_sel2").length > 0) {
            var nd_type = "1";
        }
        var poadd = {}
        poadd.ui_dev_id = ui_dev_id;
        poadd.ui_prop_id = ui_prop_id;
        poadd.nd_type = nd_type;
        pue_dtl.push(poadd)
    });
    var pue_name_json = new Array();
    var ppp = {}
    ppp.pue_name = pue_name;
    ppp.show_level = show_level;
    ppp.pue_dtl = pue_dtl;
    pue_name_json.push(ppp)
    var jsonStr = JSON.stringify(pue_name_json);
    jsonStr = jsonStr.slice(1, -1) //截取字符串去掉头尾第一个字母
    //alert(jsonStr)
    $.ajax({
        type: "get",
        data: {
            json_string: jsonStr
        },
        url: GetUrl("AddPUE"),
        dataType: "jsonp",
        contentType: "application/json;charset=gb2312",
        success: function (AddPUE)
        {
            //alert("添加成功");
            if (AddPUE) {
                alert(AddPUE.error_msg)
            } else {
                location.reload();
            };
        }
    }) //end ajax
});
//删除pue
$(".delete_pue").live("click", function ()
{
    var result = confirm("确定删除此条记录吗?")
    if (result) {
        $this_ptr = $(this).parents("tr")
        var pueid = $this_ptr.find("td[pueid]").attr("pueid");

        $.ajax({
            type: "get",
            data: {
                pue_id: pueid
            },
            url: GetUrl("DelPUE"),
            dataType: "jsonp",
            contentType: "application/json;charset=gb2312",
            success: function (DelPUE)
            {
                alert("删除成功");
                $this_ptr.remove();
                location.reload();
            }

        }) //end ajax

    } else {
        return false
    }

})

//$(".").live("click",function(){})	
//增加pue属性
$(".add_shuxing").live("click", function ()
{
    //alert(1)
    $(".tanchu_new").fadeIn(200);
    if ($(this).parents(".jieg_sel").length > 0) {
        $(".tanchu_new .add_shux").addClass("shux_left")
    }
    if ($(this).parents(".jieg_sel2").length > 0) {
        $(".tanchu_new .add_shux").addClass("shux_right")
    }

});
$(".add_shuxing1").live("click", function ()
{
    $(".tanchu_new").fadeIn(200);
    $(".sele_on").removeClass("sele_on").find("span").remove();
    if ($(this).parents(".jieg_sel3").length > 0) {
        $(".tanchu_new .add_shux").addClass("shux_left1").addClass("shux_left")
    }
    if ($(this).parents(".jieg_sel4").length > 0) {
        $(".tanchu_new .add_shux").addClass("shux_right1").addClass("shux_right")
    }

})


$(".quxiao_shux").live("click", function ()
{
    $(".tanchu_new").fadeOut(200);
    $(".tanchu_new .add_shux").removeClass().addClass("add_shux")
});
$(".add_shux").live("click", function ()
{
    if (!$(".sele_on").length > 0) {
        alert("请选择属性")
        return false
    }
    $(".tanchu_new").fadeOut(200);
    $(".tanchu_new .add_shux").removeClass().addClass("add_shux")
});

$(".shux_left1, .shux_right1").live("click", function ()
{
    $(".pue_val").hide();
    var pue_id = $(".pue_jieguo").attr("pue_id")
    //alert(array_addpue)


    var op_type = "0"; //增加

    var pue_dtl = [];
    $(".sele_on").each(function ()
    {
        var ui_dev_id = $(this).attr("ui_dev_id");
        var ui_prop_id = $(this).attr("prop_id");
        if ($(this).find(".fenzi").length > 0) {
            var nd_type = "0"
        }
        if ($(this).find(".fenmu").length > 0) {
            var nd_type = "1"
        }
        //alert(nd_type)
        var add_mo = {};
        //alert(ui_prop_id)
        add_mo.ui_dev_id = ui_dev_id
        add_mo.ui_prop_id = ui_prop_id
        add_mo.nd_type = nd_type
        pue_dtl.push(add_mo);
    });

    var array_addpue = new Array(); //alert(op_type)
    var ppp = {}
    ppp.pue_id = pue_id
    ppp.op_type = op_type
    ppp.pue_dtl = pue_dtl
    array_addpue.push(ppp)
    //alert(pue_id)
    //var obj={a:[2,3],b:{m:[3,4],n:2} }

    var jsonStr = JSON.stringify(array_addpue);
    jsonStr = jsonStr.slice(1, -1) //截取字符串去掉头尾第一个字母
    //alert(jsonStr);

    function add_pue_sx(data)
    {
        if (data) {
            alert(data.error_msg)
        } else {
            $(".shuchu_box td").parent().remove();
            //alert("修改成功");
            read_mingxi(pue_id)
        }
    }
    DataHandle("ModPUEDtl", {
        json_string: jsonStr
    }, add_pue_sx, loading)
});

$(".jieg_sel3 .del_this_td, .jieg_sel4 .del_this_td").live("click", function ()
{
    var pue_id = $(".pue_jieguo").attr("pue_id");
    var op_type = "1";
    var ui_dev_id;
    var ui_prop_id
    $(this).parents("tr").find("td").each(function ()
    {
        if ($(this).attr("ui_dev_id")) {
            ui_dev_id = $(this).attr("ui_dev_id");
        }
        if ($(this).attr("ui_prop_id")) {
            ui_prop_id = $(this).attr("ui_prop_id")
        }
    })
    var delate = new Array();
    var pue_dtl = new Array();
    var pue_dtl_son = {}
    pue_dtl_son.ui_dev_id = ui_dev_id
    pue_dtl_son.ui_prop_id = ui_prop_id
    pue_dtl.push(pue_dtl_son);
    var delate_son = {}
    delate_son.pue_id = pue_id
    delate_son.op_type = op_type
    delate_son.pue_dtl = pue_dtl
    delate.push(delate_son);
    var jsonStr = JSON.stringify(delate);
    jsonStr = jsonStr.slice(1, -1) //截取字符串去掉头尾第一个字母
    //alert(jsonStr);

    var result1 = confirm("确定删除此条记录吗?")
    if (result1) {
        DataHandle("ModPUEDtl", {
            json_string: jsonStr
        }, delate_pue_sx, loading)
    } else {

        return false;
        //alert(1)
    }

    function delate_pue_sx(data)
    {
        if (data) {
            alert(data.error_msg)
        } else {
            $(".shuchu_box td").parent().remove();
            //alert("删除成功");
            read_mingxi(pue_id)
        }
    }
})

$(".del_this_td").live("click", function ()
{
    var prop_id = $(this).parent().siblings(".ajax_send").attr("prop_id");
    var ui_dev_id = $(this).parent().siblings(".ajax_send").attr("ui_dev_id")
    //alert(ui_dev_id)
    $(".sele_on[prop_id='" + prop_id + "']").each(function ()
    {
        if ($(this).attr("ui_dev_id") == ui_dev_id) {
            $(this).removeClass("sele_on").find("span").remove();
        }
    })
})

$(".jieg_sel .del_this_td, .jieg_sel2 .del_this_td").live("click", function ()
{
    $(this).parents("tr").remove();
})

/*
功能:不同用户权限的显示
参数:role_type    :   所属权限
*/
function Authority(role_type)
{
    var AddDiv = $(".pue_demo .add_but");
    var DelBut = $(".delete_pue");
    var add_shuxing1 = $(".add_shuxing1");
    var DelBt = $("th.DelBt");
    var del_this_td = $(".del_this_td");
    if (role_type == "0") {
        //全显
    }
    if (role_type == "1") {
        //全显
    }

    if (role_type == "2") {
        AddDiv.remove();
        DelBut.remove();
        add_shuxing1.remove();
        DelBt.remove();
        del_this_td.remove();
    }
}