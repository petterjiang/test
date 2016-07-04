(function($) {
    $(function() {})
    // 封装JQ方法插件
    $.fn.extend({
        check: function(option) {
            var setting = {
                dev_type: "32", //类型值
                dev_type_name: "温湿度", //类型名称
                dev_start_img: "../../images/upload_bg/15.png", //初始图片路径
                dev_change_img: "", //变化图片路径
                dev_sx_list: [{ //
                    name: "温度",
                    value: "10",
                    wite: "度",
                    alert_msg: "color_wite",
                    data_ui_prop_id: "12",
                    show_level: "0"
                }, {
                    name: "湿度",
                    value: "10",
                    wite: "度",
                    alert_msg: "color_wite",
                    data_ui_prop_id: "13",
                    show_level: "1"
                }]
            }
            var option_new = $.extend(setting, option);
            var dev_type_name = option_new.dev_type_name;
            var dev_type = option_new.dev_type;
            var dev_start_img = option_new.dev_start_img;
            var dev_sx_list = option_new.dev_sx_list;
            $(this).each(function() {
                // <h2 class="title_dis">设备类型：<span class="name_type">' + dev_type_name + '</span></h2>
                var html_content = '<div class="display_box"><div class="content_dis"><div class="img_list"><img src="' + dev_start_img + '" width="200" style="display:block; margin:20px auto;"></div><div class="left_dis"><div class="sx_tubiao"><div class="container c"><div class="gauge" id="canvas1" style="height:0"></div><div id="canvas2" class="gauge" style="height:0"></div><div style="clear:both;"></div></div></div></div></div><div class="sx_text"><div class="title">设备属性</div></div></div>';

                var i_tubiao_No = 1;
                $(this).append(html_content); //增加html代码     

                $.each(dev_sx_list, function(i, n) {
                    if (n.show_level != 0) {
                        var biaopan_id = "canvas" + i_tubiao_No;
                        i_tubiao_No += 1
                    };
                    var shuxing_list = '<div class="shuxi ' + n.alert_msg + '" data_ui_prop_id="' + n.data_ui_prop_id + '" show_level="' + n.show_level + '" biaopan_id = "' + biaopan_id + '"><span class="name" title="点击修改名称">' + n.name + ' </span><span class="value">' + n.value + '</span><span class="wite">' + n.wite + '</span></div>';
                    $(".sx_text").append(shuxing_list);
                });

                // 清除所有setInterval（）
                var tmpID = setInterval(function() {}, 10);
                while (--tmpID > 0)
                    clearInterval(tmpID);
                // 清除所有setInterval（）
                var ui_dev_id = $(".right_top h2").attr("ui_dev_id")
                $(".sx_text .shuxi").each(function() {
                    var show_level = $(this).attr("show_level");
                    var biaopan_id = $(this).attr("biaopan_id");
                    var name = $(this).find('.name').text();
                    var value = $(this).find('.value').text();
                    var $this_val = $(this).find('.value')
                    var wite = $(this).find('.wite').text();
                    if ($(this).attr("show_level") != "0") {

                        function getbiapban(imgname) {
                            $(".content_dis").append('<div class="biaopian_2"><p>' + name + '</p><div class="' + biaopan_id + '" show_level="' + show_level + '">' + value + '</div></div>');
                            $('.' + biaopan_id).speedometer({
                                percentage: value || 0,
                                scale: 300,
                                limit: true,
                                minimum: 0,
                                maximum: 300,
                                suffix: wite,
                                thisCss: {
                                    backgroundImage: "url('../images/pub/" + imgname + ".png')"
                                }
                            });
                            var nos = setInterval(function() {
                                var text = $(".sx_text .shuxi[biaopan_id='" + biaopan_id + "']").find('.value').text()
                                $('.' + biaopan_id).speedometer({
                                    percentage: text || 0,
                                    scale: 300,
                                    limit: true,
                                    minimum: 0,
                                    maximum: 300,
                                    suffix: wite,
                                    thisCss: {
                                        backgroundImage: "url('../images/pub/" + imgname + ".png')"
                                    }
                                });
                            }, 1000)
                        }
                        if (dev_type == "3200") {
                            getbiapban("background3")
                        } else if (dev_type == "3400") {
                            getbiapban("background")
                        } else if (dev_type == "3500") {
                            getbiapban("background2")
                        } else if (dev_type == "3600") {
                            getbiapban("background4")
                        } else if (dev_type == "3100" || dev_type == "3101") {
                            return false;
                        } else {
                            $(".gauge").css('height', '');
                            var g1 = new JustGage({
                                id: biaopan_id,
                                value: value,
                                title: name, //名称
                                symbol: wite, //单位
                                min: -100,
                                max: 300,
                                decimals: 0,
                                gaugeWidthScale: 0.6
                            });
                            setInterval(function() {
                                var text = $(".sx_text .shuxi[biaopan_id='" + biaopan_id + "']").find('.value').text()
                                g1.refresh(text);
                            }, 1000)
                        }
                    }


                });
                // 短信模块代码
                if (dev_type == "2800") {
                    // alert(2800)
                    $(".display_box").append('<div class="ctl_masg"><h2>CDMA功能</h2><div class="send_masge"><p><span>号码：</span><input class="haoma" type="text" /></p><p><span>短信内容：</span><textarea class="con_massage"></textarea></p><div class="ctl_bot"><span class="sd_ms_bot">发送短信</span><span class="sd_phone_bot">拨打电话</span></div></div></div>')
                };
                if (dev_type == "3300") {
                    // alert(2800)
                    $(".sx_text").remove()
                    $(".display_box").append('<div class="ctl_masg"><h2>空调控制功能</h2><div class="cont_ms"><div class="cont_in"><p>模式选择：</p><ul><li ui_prop_id="0"><label>自动模式 <input name="RadioGroup1" type="radio" value="" checked="checked" /></label></li><li ui_prop_id="1"><label>制冷模式 <input name="RadioGroup1" type="radio" value="" /></label></li><li ui_prop_id="2"><label>制热模式 <input name="RadioGroup1" type="radio" value="" /></label></li><li ui_prop_id="3"><label>除湿模式 <input name="RadioGroup1" type="radio" value="" /></label></li><li ui_prop_id="4"><label>送风模式 <input name="RadioGroup1" type="radio" value="" /></label></li></ul></div><p class="tiaojietitel">温度选择：</p><div class="tiaojie"><div class="layout-slider"><input id="SliderSingle" type="slider" name="price" value="22" /></div></div></div><div class="ctl_bot kongt"><span class="send_pz">确认</span><span class="close_sb">关机</span></div></div>');
                    // 调用slider插件
                    jQuery("#SliderSingle").slider({
                        from: 16,
                        to: 30,
                        step: 1,
                        round: 1,
                        dimension: '℃',
                        skin: "round"
                    });
                };

                if (dev_type == "4100") {
                    // 读取属性列表
                    

                        function load_sx(data) {
                            var zt_kaiguan //开关状态;
                            var moshi = '' //模式;
                            var sonfeng = '' //风力;
                            var wendu = '' //温度
                            $.each(data, function(k, n) {
                                var ui_prop_id = n.ui_prop_id;
                                var units = n.units;
                                var prop_value = n.prop_value;
                                // 开关状态读取
                                if (ui_prop_id == "0") {
                                    if (prop_value == "开") {
                                        zt_kaiguan = '<div class="show_zt kaiqi"><span></span>已开启</div>'
                                    } else {

                                        zt_kaiguan = '<div class="show_zt guanbi"><span></span>已关闭</div>'
                                    };
                                };
                                // 空调模式读取
                                if (ui_prop_id == "1") {
                                    var temp = units.split("|");
                                    for (var i = 0; i < temp.length; i++) {
                                        var Things = temp[i].split(":");
                                        var checked_c = ''
                                        if (Things[0] == prop_value) {
                                            var checked_c = 'checked=checked'
                                        };
                                        var html_li = '<li units="' + Things[0] + '"><label>' + Things[1] + '模式 <input name="RadioGroup1" type="radio" value="" ' + checked_c + ' /></label></li>'
                                        moshi = moshi + html_li
                                    };
                                };
                                // 风力读取
                                if (ui_prop_id == "3") {
                                    var temp = units.split("|");
                                    for (var i = 0; i < temp.length; i++) {
                                        var Things = temp[i].split(":");
                                        var checked_c = ''
                                        if (Things[0] == prop_value) {
                                            var checked_c = 'checked=checked'
                                        };
                                        var html_li = '<li units="' + Things[0] + '"><label>' + Things[1] + ' <input name="RadioGroup2" type="radio" value="" ' + checked_c + ' " /></label></li>'
                                        sonfeng = sonfeng + html_li
                                    };
                                }
                                // 温度读取
                                if (ui_prop_id == "2") {
                                    wendu = prop_value
                                }
                            });
                            // 增加html代码
                            $(".display_box").append('<div class="ctl_masg"><h2>空调控制</h2><div class="cont_in"><p>空调状态：</p><div class="zt_now c">' + zt_kaiguan + '<span class="open_kt">打开</span><span class="close_kt">关闭</span></div><p>模式选择：</p><ul>' + moshi + '</ul><span class="queren_botton" ui_prop_id="1">设置模式</span><p class="">风力选择：</p><div class="wind_power"><ul>' + sonfeng + '</ul></div><span class="queren_botton" ui_prop_id="3">设置风力</span></div><p class="tiaojietitel">温度选择：</p><div class="tiaojie"><div class="layout-slider"><input id="SliderSingle" type="slider" name="price" value="' + wendu + '" /></div></div><span class="wendu_quren" ui_prop_id="2">设置温度</span></div>')
                            // 调用slider插件
                            jQuery("#SliderSingle").slider({
                                from: 16,
                                to: 30,
                                step: 1,
                                round: 1,
                                dimension: '℃',
                                skin: "round"
                            });
                        }
                    DataHandle("GetUiDevPropList", {
                        ui_dev_id: ui_dev_id
                    }, load_sx, loading)
                };

                // 开关
                if (dev_type == "3100" || dev_type == "3101") {
                    // alert(1)
                    $(".sx_text").remove();

                        function load_sx1(data) {
                            $.each(data, function(i, n) {
                                var ui_prop_id = n.ui_prop_id;
                                var units = n.units;
                                var prop_value = n.prop_value;
                                $(".display_box").append('<div class="ctl_masg" ui_prop_id="' + ui_prop_id + '"><h2>开关控制</h2><div class="kaiguan"><span class="dakai">打开</span><span class="guanbi">关闭</span></div></div>')
                            });
                        }

                    DataHandle("GetUiDevPropList", {
                        ui_dev_id: ui_dev_id
                    }, load_sx1, loading)

                };
            });
        }
    })
})(jQuery);