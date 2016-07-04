//读取设备类型列表

function load_type_list() {
    function GetUiDevTypeList(data) {
        $.each(data, function(i, n) {
            var ui_dev_type = n.ui_dev_type //应用设备类型
            var ui_dev_type_name = n.ui_dev_type_name //应用设备类型名称
            var system_class = n.system_class //系统类型(0:动力系统; 1:环境系统; 2:配电系统; 3:安防系统)
            var file_path = n.file_path //应用设备类型的图片路径
            if (system_class == 0) {
                $("#dongli ul").append('<li><a href="type_list.html" ui_dev_type="' + ui_dev_type + '"><img src="../' + file_path + '" /><span>' + ui_dev_type_name + '</span></a><span class="alert_msg_index">0</span></li>')
            };
            if (system_class == 1) {
                $("#huanjing ul").append('<li><a href="type_list.html" ui_dev_type="' + ui_dev_type + '"><img src="../' + file_path + '" /><span>' + ui_dev_type_name + '</span></a><span class="alert_msg_index">0</span></li>')
            };
            if (system_class == 2) {
                $("#peidian ul").append('<li><a href="type_list.html" ui_dev_type="' + ui_dev_type + '"><img src="../' + file_path + '" /><span>' + ui_dev_type_name + '</span></a><span class="alert_msg_index">0</span></li>')
            };
            if (system_class == 3) {
                $("#anfang ul").append('<li><a href="type_list.html" ui_dev_type="' + ui_dev_type + '"><img src="../' + file_path + '" /><span>' + ui_dev_type_name + '</span></a><span class="alert_msg_index">0</span></li>')
            };
            // 链接后增加参数
            link_add(".sys_all_l ul li a[ui_dev_type='" + ui_dev_type + "']", "&ui_dev_type=" + ui_dev_type)
        });
        hover_img()
        alert_type_list()
    }
    DataHandle("GetUiDevTypeList", {}, GetUiDevTypeList, loading)
}


// 读取设备类型实时告警条数
function alert_type_list() {
    function alert_load_type(data) {
        $.each(data, function(index, n) {
            var ui_dev_type = n.ui_dev_type ;
            var alert_nboer = parseInt($(".sys_item a[ui_dev_type='"+ui_dev_type+"']").next().text())+1
            $(".sys_item a[ui_dev_type='"+ui_dev_type+"']").next().text(alert_nboer);
            $(".sys_item a[ui_dev_type='"+ui_dev_type+"']").next().show();
        }); 
    }
    DataHandle("GetCurrentAlarm", {}, alert_load_type, loading)
}

// 鼠标经过图片动画

function hover_img() {
    $(".sys_item ul li a").hover(function() {
            var img_a = $(this).find("img");
            img_a.stop().animate({
                height: "45px",
                top: "0px",
                left: "2px"
            }, 100)
        },
        function() {
            var img_a = $(this).find("img");
            img_a.stop().animate({
                height: "40px",
                top: "4px",
                left: "7px"
            }, 100);
        });
}

$(function() {
    // 读取机房名称
    function attr_room(data) {
        var param_value = data.param_value;
        $(".sys_title").text(param_value)
    }
    var name_room_data = {
        param_key: "room_name"
    }
    DataHandle("GetSysParam", name_room_data, attr_room)
    load_type_list()
    
})