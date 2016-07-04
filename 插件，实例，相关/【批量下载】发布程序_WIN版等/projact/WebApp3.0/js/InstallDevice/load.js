(function($) {
    $(function() {
        function eorro(data) {
            if (data.error_msg) {
                alert(data.error_msg);
            }
        };
        //升级模块
        $("#update1").live("click", function() {
            $(".file_sed").css("display", "block");
        });
        $("#update2").live("click", function() {
            $(".file_sed1").css("display", "block");
        });
        $(".img_qx").click(function() {
            $(".file_sed").css("display", "none");
            $(".file_sed1").css("display", "none");
        });
        UpDate1();
        UpDate2();
        UpDate3();
        SearIntf1();
        $.fn.Drag = function(options) {
            var defaults = {
                limit: window, //是否限制拖放范围，默认限制当前窗口内
                drop: false, //是否drop
                handle: false, //拖动手柄
                finish: function() {} //回调函数
            };
            var options = $.extend(defaults, options);
            this.X = 0; //初始位置
            this.Y = 0;
            this.dx = 0; //位置差值
            this.dy = 0;
            var This = this;
            var ThisO = $(this); //被拖目标
            var thatO;
            if (options.drop) {
                var ThatO = $(options.drop); //可放下位置
                ThisO.find('div').css({
                    cursor: 'move'
                });
                var tempBox = $('<div id="tempBox" class="grid"></div>');
            } else {
                options.handle ? ThisO.find(options.handle).css({
                    cursor: 'move',
                    '-moz-user-select': 'none'
                }) : ThisO.css({
                    cursor: 'move',
                    '-moz-user-select': 'none'
                });
            }
            //拖动开始
            this.dragStart = function(e) {
                e.preventDefault();
                var cX = e.pageX;
                var cY = e.pageY;
                if (options.drop) {
                    ThisO = $(this);
                    if (ThisO.find('div').length != 1) {
                        return
                    } //如果没有拖动对象就返回
                    This.X = ThisO.find('div').offset().left;
                    This.Y = ThisO.find('div').offset().top;
                    tempBox.html(ThisO.html());
                    ThisO.html('');
                    $('body').append(tempBox);
                    tempBox.css({
                        left: This.X,
                        top: This.Y
                    });
                } else {
                    This.X = ThisO.offset().left;
                    This.Y = ThisO.offset().top;
                    ThisO.css({
                        margin: 0
                    })
                }
                This.dx = cX - This.X;
                This.dy = cY - This.Y;
                if (!options.drop) {
                    ThisO.css({
                        position: 'absolute',
                        left: This.X,
                        top: This.Y
                    })
                }

                $(document).live("mousemove", This.dragMove);
                $(document).live("mouseup", This.dragStop);
                if ($.browser.msie) {
                    ThisO[0].setCapture();
                } //IE,鼠标移到窗口外面也能释放
            }
            //拖动中
            this.dragMove = function(e) {
                e.preventDefault();
                var cX = e.pageX;
                var cY = e.pageY;
                if (options.limit) { //限制拖动范围
                    //容器的尺寸
                    var L = $(options.limit)[0].offsetLeft ? $(options.limit).offset().left : 0;
                    var T = $(options.limit)[0].offsetTop ? $(options.limit).offset().top : 0;
                    var R = L + $(options.limit).width();
                    var B = T + $(options.limit).height();
                    //获取拖动范围
                    var iLeft = cX - This.dx,
                        iTop = cY - This.dy;
                    //获取超出长度
                    var iRight = iLeft + parseInt(ThisO.innerWidth()) - R,
                        iBottom = iTop + parseInt(ThisO.innerHeight()) - B;
                    //alert($(window).height())
                    //先设置右下，再设置左上
                    if (iRight > 0) iLeft -= iRight;
                    if (iBottom > 0) iTop -= iBottom;
                    if (L > iLeft) iLeft = L;
                    if (T > iTop) iTop = T;
                    if (options.drop) {
                        tempBox.css({
                            left: iLeft,
                            top: iTop
                        })
                    } else {
                        ThisO.css({
                            left: iLeft,
                            top: iTop
                        })
                    }
                } else {
                    //不限制范围
                    if (options.drop) {
                        tempBox.css({
                            left: cX - This.dx,
                            top: cY - This.dy
                        })
                    } else {
                        ThisO.css({
                            left: cX - This.dx,
                            top: cY - This.dy
                        });
                    }
                }
            }
            //拖动结束
            this.dragStop = function(e) {
                //e.preventDefault();
                if (options.drop) {
                    var flag = false;
                    var cX = e.pageX;
                    var cY = e.pageY;
                    var oLf = ThisO.offset().left;
                    var oRt = oLf + ThisO.width();
                    var oTp = ThisO.offset().top;
                    var oBt = oTp + ThisO.height();
                    if (!(cX > oLf && cX < oRt && cY > oTp && cY < oBt)) { //如果不是在原位
                        for (var i = 0; i < ThatO.length; i++) {
                            var XL = $(ThatO[i]).offset().left;
                            var XR = XL + $(ThatO[i]).width();
                            var YL = $(ThatO[i]).offset().top;
                            var YR = YL + $(ThatO[i]).height();
                            if (XL < cX && cX < XR && YL < cY && cY < YR) { //找到拖放目标，交换位置
                                var newElm = $(ThatO[i]).html();
                                $(ThatO[i]).html(tempBox.html());
                                ThisO.html(newElm);
                                thatO = $(ThatO[i]);
                                tempBox.remove();
                                flag = true;
                                break; //一旦找到，就终止循环
                            }
                        }
                    }
                    if (!flag) { //如果找不到拖放位置，归回原位
                        tempBox.css({
                            left: This.X,
                            top: This.Y
                        });
                        ThisO.html(tempBox.html());
                        tempBox.remove();
                    }
                }
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
                options.finish(e, ThisO, thatO);
                if ($.browser.msie) {
                    ThisO[0].releaseCapture();
                }
            }
            //绑定拖动
            options.handle ? ThisO.find(options.handle).live("mousedown", This.dragStart) : ThisO.live("mousedown", This.dragStart);
            //IE禁止选中文本
            //document.body.onselectstart=function(){return false;}
        }
        //下面是例子
        //.drag li里面的元素对应的放置位置是.drop li，完成后回调change函数，默认限制拖动范围是窗口内部
        //$('.drag li').Drag({drop:'.drop li',finish:change});
        //.drag li里面的元素对应的放置位置是.drop li和.drag li（自身），完成后回调change函数，默认限制拖动范围是窗口内部
        //$('.drop li').Drag({drop:'.drop li, .drag li',finish:change});
        //$('#test').Drag({handle:'h2',finish:change});//不限制拖动范围，可设置limit:false
        var change = function(e, oldElm, newElm) {
            var aaa = newElm.html()
            var bbb = oldElm.html()
            var intf_id = newElm.find(".dk_name").attr("intf_id")
            var box_port = newElm.index();
            var box_id = newElm.parents(".sb_demo").attr("box_id")
            var intf_id1 = oldElm.find(".dk_name").attr("intf_id")
            var box_port1 = "-1";
            var box_id1 = "-1"
            var Data = {
                intf_id: intf_id,
                box_port: box_port,
                box_id: box_id
            }
            var data = {
                intf_id: intf_id1,
                box_port: box_port1,
                box_id: box_id1
            }
            if (bbb != "") {
                alert("请先卸载机箱上的模块")
                // DataHandle("ModIntfBox", data, end1, loading)
                location.reload();
            } else {
                DataHandle("ModIntfBox", Data, yxd, loading)
            }

            function yxd(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    DataHandle("GetIntfList", {}, zhuangtai, loading)
                }

                function zhuangtai(data) {
                    $.each(data, function(i, n) {
                        var intf_id = n.intf_id
                        var intf_sn = n.intf_sn
                        var intf_type = n.intf_type
                        var intf_type_name = n.intf_type_name
                        var box_id = n.box_id
                        var box_port = n.box_port
                        var online_sts = n.online_sts //是否在线
                        if (online_sts == 0) {
                            var mkzt = "<span class='lixian'></span> 离线中"
                        } else {
                            var mkzt = "<span class='zaixian'></span> 运行中"
                        };
                        $("div[box_id='" + box_id + "'] .bjing li").eq(box_port).html(mkzt);

                    });

                }
            }

            function end1(data) {

                if (data) {
                    alert(data.error_msg)
                } else {
                    DataHandle("ModIntfBox", Data, eorro, loading)
                }
            }
        }

        var change1 = function(e, oldElm, newElm) {
            var aaa = oldElm.html()
            //alert(aaa)
            var src_intf_id = oldElm.find(".dk_name").attr("intf_id")
            var des_intf_id = newElm.find(".dk_name").attr("intf_id")
            var box_port = newElm.index();
            var box_id = newElm.parents(".sb_demo").attr("box_id")
            //var box_id = newElm.parents(".sb_demo").attr("box_id")
            //alert(src_intf_id);
            if (src_intf_id) {
                var Data = {
                    src_intf_id: src_intf_id,
                    des_intf_id: des_intf_id
                }
                DataHandle("SwitchBox", Data, eorro, loading)

            } else {
                var Data1 = {
                    intf_id: des_intf_id,
                    box_port: box_port,
                    box_id: box_id
                }
                DataHandle("ModIntfBox", Data1, eorro, loading)
            }
        }
        var box;
        DataHandle("GetBoxList", {}, add_jixiang, loading)

        function add_jixiang(data) {
            $.each(data, function(i, n) {
                var box_id = n.box_id
                var jizu = "<div class='jizu'><h2></h2></div>"
                box = "<h3></h3><div class='sb_demo' box_id='" + box_id + "'><div class='cdma'></div><ul class='duankou'><li>端口1：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li><li>端口2：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li><li>端口3：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li><li>端口4：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li><li>端口5：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li><li>端口6：<a class='ps' href='javascript:void(0)'>配置</a> <a class='xz' href='javascript:void(0)'>卸载</a></li></ul><ul class='drop box'><li></li><li></li><li></li><li></li><li></li><li></li></ul><ul class='bjing'><li></li><li></li><li></li><li></li><li></li><li></li></ul></div>"
                $("#container").append(box);
                add_jz();
                $(".sb_demo .duankou li").first().find("a.xz").hide();
                $(".sb_demo .drop li").first().css('height', '0').css('overflow', 'hidden');
            });
            $(".sb_demo").first().append("<div class='guding'>内置ip模块</div>")

            $('.drag li').Drag({
                drop: '.drop li',
                finish: change
            });
            //.drag li里面的元素对应的放置位置是.drop li和.drag li（自身），完成后回调change函数，默认限制拖动范围是窗口内部
            $('.drop li').Drag({
                drop: '.drop li, .drag li',
                finish: change1
            });

        }
        var jxiang;



        // 调用setHock
        var chage_zhuangtai = function(SetHook) {
            $.each(SetHook, function(i, n) {
                if (n.intf_offline) {
                    var intf_offline = n.intf_offline;
                    var intf_id = n.intf_id;
                    if (intf_offline == 1) {
                        var mkzt = "<span class='lixian'></span> 离线中"
                    } else {
                        var mkzt = "<span class='zaixian'></span> 运行中"
                    };
                    if ($(".dk_name[intf_id='" + intf_id + "']").text().indexOf("CDMA") > 0) {
                        $(".cdma").find('.cdma_zx').html(mkzt);
                    } else {
                        var zhuangtai_ind = $(".dk_name[intf_id='" + intf_id + "']").parents("li").index();
                        $(".dk_name[intf_id='" + intf_id + "']").parents(".box").next().find('li').eq(zhuangtai_ind).html(mkzt)
                    }

                };
                if (n.intf_debug) {
                    if (n.intf_debug.indexOf("发送")>-1) {
                        var color = "style='color:red;'"
                    }else{
                        var color = "style='color:green;'"
                    };
                    $(".tiaoshi_con .aft_app").after('<p '+color+'>'+n.intf_debug+'</p>')
                };
            })
        };

        b_callbacks.add(chage_zhuangtai);

        


        //增加机箱
        $(".add_jx").live("click", function() {
            var box_id = $(".sb_demo").last().attr("box_id");
            box_id = parseFloat(box_id)
            DataHandle("AddBox", {
                box_id: box_id + 1
            }, eorro, loading)

            function eorro(data) {
                //alert(data)
                if (data) {
                    alert(data.error_msg)
                } else {
                    location.reload();
                }
            }
        })
        //增加机箱



        //删除机箱
        $(".del_jx").live("click", function() {
            var box_id = $(".sb_demo").last().attr("box_id");
            var pd = true
            $(".sb_demo").last().find(".drop").find("li").each(function() {
                if ($(this).text() != "") {
                    alert("请先卸载机箱上的模块");
                    pd = false;
                    return false;
                };
            });
            if (pd == false) {
                return false;
            };
            box_id = parseFloat(box_id)
            //alert(box_id)
            DataHandle("DelBox", {
                box_id: box_id
            }, eorro, loading)

            function eorro(data) {
                //alert(data)
                if (data) {
                    alert(data.error_msg)
                } else {
                    location.reload();
                }
            }
        })
        //删除机箱

        function add_jz() {
            $(".jizu").each(function() {
                var t_index = $(this).index();
                $(this).children("h2").replaceWith("<h2>机组" + t_index + "</h2>")
            });
            $(".sb_demo").each(function() {
                var t_index1 = $(".sb_demo").index($(this));
                //alert(t_index1)
                $(this).prev().replaceWith("<h3>机箱" + t_index1 + "</h3>")
            });
        }

        function bg_fade() {
            $("body").append("<div id='fade'></div>");
            $("#fade").css("opacity", 0.5);
            $(".add_form").fadeIn(500);
        }

        function bg_fade_out() {
            $("#fade").fadeOut(200, function() {
                $("#fade").remove()
            });
        }

        //配置设备======================================
        $(".duankou .ps, .cdma .ps").live("click", pz_dk)

        function pz_dk() {
            if ($(this).parent().hasClass('cdma')) {
                var mokuai = $(".cdma").find(".dk_name");
            } else if ($(".duankou .ps").index($(this)) == 0) {
                var t_index = $(".duankou .ps").index($(this));
                var mokuai = $(".guding").find(".dk_name");
            } else {
                var t_index = $(".duankou .ps").index($(this));
                var mokuai = $(".drop li").eq(t_index).find(".dk_name");

            };

            var tmp = mokuai.text().split(")");
            var text_i = tmp[1];

            var mokuai_id = mokuai.attr("intf_id");

            function GET_ysb(GetDevList) {
                if (GetDevList) {
                    // $(".232sb").show();
                    $(".232sb td").parent().remove();
                    $.each(GetDevList, function(i, n) {
                        var dev_id = n.dev_id
                        var dev_name = n.dev_name
                        var dev_param = n.dev_param
                        var dev_type = n.dev_type
                        var intf_id = n.intf_id
                        var intf_sub = n.intf_sub
                        var dev_addr = n.dev_addr
                        $(".duankou" + intf_sub + " .232sb").append("<tr class='dev' dev_id=" + dev_id + " intf_id='" + intf_id + "'><td align='center' class='sb_name'>" + dev_name + "</td><td>" + dev_addr + "</td><td align='left' class='check_yy'>无应用</td><td align='center'><a href='javascript:void(0)' class='chg_name'>修改名称</a> <a href='javascript:void(0)' class='dev_sb'>添加到应用</a> <a href='javascript:void(0)' class='dele_sb'>卸载设备</a></td></tr>");
                        DataHandle("GetUiDevByDev", {
                            dev_id: dev_id
                        }, add_check_yy, loading)

                        function add_check_yy(data) {
                            if (data) {
                                $(".duankou" + intf_sub + " .232sb tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                            };
                        }
                        DataHandle("GetBitRate", {
                            intf_id: mokuai_id,
                            port: intf_sub
                        }, load_bit, loading)

                        function load_bit(data) {
                            if (data) {
                                var bit_rate = data.bit_rate;
                                $(".duankou" + intf_sub + " .botlive").val(bit_rate);
                            } else {
                                $(".duankou" + intf_sub + " .botlive").val("");
                            };
                        }
                    })
                }
            }

            function GET_ip(data) {
                if (data) {
                    $(".232sb td").parent().remove();
                    $.each(data, function(i, n) {
                        var dev_addr = n.dev_addr
                        var dev_id = n.dev_id
                        var dev_name = n.dev_name
                        var dev_type = n.dev_type
                        var intf_id = n.intf_id
                        var mf_id = n.mf_id
                        var dev_addr = n.dev_addr
                        $(".dunkou_lb2 .232sb").append("<tr class='dev' dev_id=" + dev_id + " intf_id='" + intf_id + "'><td align='center' class='sb_name'>" + dev_name + "</td><td>" + dev_addr + "</td><td align='left' class='check_yy'>无应用</td><td align='center'><a href='javascript:void(0)' class='chg_name'>修改名称</a> <a href='javascript:void(0)' class='dev_sb'>添加到应用</a> <a href='javascript:void(0)' class='dele_sb'>卸载设备</a></td></tr>");
                        DataHandle("GetUiDevByDev", {
                            dev_id: dev_id
                        }, add_check_yy, loading)

                        function add_check_yy(data) {
                            if (data) {
                                $(".dunkou_lb2 .232sb tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                            };
                        }
                    });

                }
            }



            $(".peizhi_con table td").parent().remove();
            if (text_i != null) {
                bg_fade();
                if (text_i == "RS232/RS485接口") {
                    $(".pezhi_box_232").fadeIn(500);
                    $(".pezhi_box_232").attr("intf_id", mokuai_id)
                    DataHandle("GetDevList", {
                        intf_id: mokuai_id
                    }, GET_ysb, loading)
                }
                if (text_i == "内置IP模块") {
                    $(".pezhi_box_ip").fadeIn(500);
                    $(".pezhi_box_ip").attr("intf_id", mokuai_id)
                    DataHandle("GetDevList", {
                        intf_id: mokuai_id
                    }, GET_ip, loading)
                };
                if (text_i != "RS232/RS485接口" && text_i != "内置IP模块") {
                    DevList(mokuai_id);
                    $(".pezhi_box").fadeIn(500);
                    text_i = text_i;
                    $(".pezhi_box h2").text(text_i); //！！！！  
                    $(".pezhi_box h2").attr("IntfID", mokuai_id);
                }
            } else {
                alert("请先移动模块到此端接口");
            }
        }

        $(".xz").live("click", dele_dev)

        function dele_dev() {
            var t_index = $(".duankou .xz").index($(this));
            var mokuai = $(".drop li").eq(t_index).find(".dk_name");
            var mokuai_id = mokuai.attr("intf_id");

            function dele_dev_inty(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    location.reload();
                };
            }
            DataHandle("DelIntf", {
                intf_id: mokuai_id
            }, dele_dev_inty, loading)

        }

        $(".add_dev_sb1").live("click", function() {
            $(".peizhi_dev_add1").show();
        })
        $(".add_dev_sb").live("click", function() {
            $(".peizhi_dev_add").show();
            var duankou_text = $(".duankou_change .currt").text();
            var intf_sub = $(".duankou_change .currt").index();
            $(".dk_title").text("在" + duankou_text + "增加新的原始设备").attr('intf_sub', intf_sub);
        })

        $(".tiaoshi_open").live("click", function(e) {
            var intf_id = $(this).parents(".pezhi_box_232").attr('intf_id');
            var port = $(".duankou_change .currt").index();
            $('.tiaoshi_con').empty().attr({
                intf_id: intf_id,
                port: port
            });;
            $('.tiaoshi_con').append('<span class="cont_add"></span><span class="aft_app"></span>')
            function gohed (data) {
                $(".tiaoshi_window").show();
            }
            DataHandle("IntfDebug", {
                intf_id: intf_id,
                port:port,
                switch:1
            }, gohed, loading)
        });
        $(".tiaoshi_close").live("click", function(e) {
            var intf_id = $(this).parents(".pezhi_box_232").attr('intf_id');
            var port = $(".duankou_change .currt").index();
            function gohed (data) {
                $('.tiaoshi_con').empty();
                $(".tiaoshi_window").hide();
            }
            DataHandle("IntfDebug", {
                intf_id: intf_id,
                port:port,
                switch:0
            }, gohed, loading)
            
        });
        $(".close_tiaoshi").live('click', function(e) {
            var port = $(".duankou_change .currt").index();
            $(".tiaoshi_close").eq(port).click();
        });


        $(".sotp_line").live('click', function(e) {
           $(".aft_app").remove()
        });

        $('.continiu_go').live('click', function(e) {
            $('.cont_add').after('<span class="aft_app"></span>')
        });



        DataHandle("GetDevTypeList", {}, datatype, loading) //获取设备类型列表

        function datatype(data) {
            $.each(data, function(i, n) {
                var dev_type = n.dev_type //设备类型
                var dev_type_name = n.dev_type_name //类型名称
                if (dev_type >= 32 && dev_type <= 255) {
                    $(".leibie1").append("<li><a href='javascript:void(0)' dev_type='" + dev_type + "'>" + dev_type_name + "</a></li>")
                };
                if (dev_type >= 256 && dev_type <= 287) {
                    $(".leibie2").append("<li><a href='javascript:void(0)' dev_type='" + dev_type + "'>" + dev_type_name + "</a></li>")
                };


            })
        }

        //RS232配置设备切换=======================================
        $(".duankou_change li").live('click', function() {
            $(this).addClass('currt').siblings().removeClass('currt');
            var this_index = $(this).index()
            $(".dunkou_lb .model_d").eq(this_index).show().siblings().hide();
        });
        //RS232配置设备切换=======================================

        //配置设备======================================
        $(".dev_sb").live("click", peizhi_dev)

        function peizhi_dev() {
            var dev_id = $(this).parents("tr").attr("dev_id")
            var cs_name = $(this).parents("tr").find('td').first().text();
            $(".peizhi_dev").show().attr("dev_id", dev_id);
            $(".peizhi_dev .change_name1 input").val(cs_name)
            DataHandle("DevId2UiDevType", {
                dev_id: dev_id
            }, UiDevType, loading)

            function UiDevType(data) {
                $.each(data, function(i, n) {
                    var ui_dev_type = n.ui_dev_type //:应用设备类型
                    var ui_dev_type_name = n.ui_dev_type_name //:应用设备类型名称
                    $(".lexing_dev .leibie").append("<li><a href='javascript:void(0)' ui_dev_type='" + ui_dev_type + "'>" + ui_dev_type_name + "</a></li>");
                    $(".peizhi_dev .sele p").replaceWith('<p class="choose" ui_dev_type="' + ui_dev_type + '">' + ui_dev_type_name + '</p>');
                });

            }
        }

        $(".peizhi_dev .wcpz1").live("click", function() { //增加设备
            var dev_id = $(".peizhi_dev").attr("dev_id");
            var ui_dev_name = $(".change_name1 input").val();
            // var area_id = $(".menu_style .sele p").attr("area_id")
            var ui_dev_type = $(".lexing_dev .sele p").attr("ui_dev_type")
            var setuidev = {
                dev_id: dev_id, //:设备ID
                ui_dev_name: ui_dev_name, //:设备名称
                // area_id: area_id, //:区域ID【可选】
                ui_dev_type: ui_dev_type //应用设备类型
            }
            if (ui_dev_name == "" || ui_dev_name == "请输入设备名称") {
                alert("请输入设备名称")
                return false
            };
            DataHandle("AddUiDev", setuidev, add_ui, loading)

            function add_ui(data) {
                if (data.error_msg) {
                    alert(data.error_msg)
                } else {
                    alert("设置成功")
                    $(".quxiao_pz1").click();


                    DataHandle("GetUiDevByDev", {
                        dev_id: dev_id
                    }, add_check_yy, loading)
                }

                function add_check_yy(data) {
                    if (data) {
                        $(".dunkou_lb .232sb tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                        $(".dunkou_lb2 .232sb tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                        $(".leixing tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                    };
                }
            }
        });

        $("input[type='text']").focus(function() {
            $(this).val("")
        })


        $(".peizhi_dev_add .wcpz1").live("click", function() { //增加设备，配置完成
            var int_ind = $(".pezhi_box_232").attr("intf_id");
            var dev_name = $(".change_name2 input").val();
            var dev_type = $(".lexing_dev1 .sele p").attr("dev_type");
            var dev_addr = $(".change_addr input").val();
            var mf_id = $(".xinghao_dev .sele p").attr("mf_id");
            var intf_sub = $(".dk_title").attr("intf_sub");
            //var area_id = $("#arar_ui_dev .sele p").attr("area_id");
            if (dev_name == "") {
                alert("请输入设备名称");
                return false;
            }
            //alert(mf_id)
            var send_data = {
                dev_name: dev_name,
                dev_type: dev_type,
                dev_addr: dev_addr,
                mf_id: mf_id,
                intf_id: int_ind,
                intf_sub: intf_sub
            }
            DataHandle("AddDev", send_data, reslt, loading) //增加设备

            function reslt(data) {
                var dev_id = data.dev_id
                var dev_name = data.dev_name
                var dev_param = data.dev_param
                var dev_type = data.dev_type
                var intf_id = data.intf_id
                var intf_sub = data.intf_sub
                var dev_addr = data.dev_addr
                if (data.error_msg) {
                    alert(data.error_msg)
                } else {
                    alert("设置成功")
                    $(".duankou" + intf_sub + " .232sb").append("<tr class='dev' dev_id=" + dev_id + " intf_id='" + intf_id + "'><td align='center' class='sb_name'>" + dev_name + "</td><td>" + dev_addr + "</td><td align='left' class='check_yy'>无应用</td><td align='center'><a href='javascript:void(0)' class='chg_name'>修改名称</a> <a href='javascript:void(0)' class='dev_sb'>添加到应用</a> <a href='javascript:void(0)' class='dele_sb'>卸载设备</a></td></tr>")
                    $(".close1").click();
                }
            }
        });


        $(".peizhi_dev_add1 .wcpz1").live("click", function() { //增加设备，配置完成
            var int_ind = $(".pezhi_box_ip").attr("intf_id");
            var dev_name = $(".change_name3 input").val();
            var dev_type = $(".lexing_dev2 .sele p").attr("dev_type");
            var dev_addr = $(".change_addr2 input").val();
            var mf_id = $(".xinghao_dev2 .sele p").attr("mf_id");
            //var area_id = $("#arar_ui_dev .sele p").attr("area_id");
            if (dev_name == "") {
                alert("请输入设备名称");
                return false;
            }
            //alert(mf_id)
            var send_data = {
                dev_name: dev_name,
                dev_type: dev_type,
                dev_addr: dev_addr,
                mf_id: mf_id,
                intf_id: int_ind
            }
            DataHandle("AddDev", send_data, reslt, loading) //增加设备

            function reslt(data) {
                var dev_id = data.dev_id
                var dev_name = data.dev_name
                var dev_param = data.dev_param
                var dev_type = data.dev_type
                var intf_id = data.intf_id
                var dev_addr = data.dev_addr
                if (data.error_msg) {
                    alert(data.error_msg)
                } else {
                    alert("设置成功")
                    $(".dunkou_lb2 .232sb").append("<tr class='dev' dev_id=" + dev_id + " intf_id='" + intf_id + "'><td align='center' class='sb_name'>" + dev_name + "</td><td>" + dev_addr + "</td><td align='left' class='check_yy'>无应用</td><td align='center'><a href='javascript:void(0)' class='chg_name'>修改名称</a> <a href='javascript:void(0)' class='dev_sb'>添加到应用</a> <a href='javascript:void(0)' class='dele_sb'>卸载设备</a></td></tr>")
                    $(".close1").click();
                }
            }
        });

        //查看已配置应用列表==========================
        $(".check_yy a").live("click", function(e) {
            $(".list_yy").show();
            var pve_name = $(this).parents("tr").find("td").eq(0).text()
            var dev_id = $(this).parents("tr").attr("dev_id");
            $(".pve_name span").text(pve_name).attr("dev_id", dev_id);
            DataHandle("GetUiDevByDev", {
                dev_id: dev_id
            }, add_td, loading)
        });
        // $(".232sb .check_yy a").live("click", function(e) {
        // 	$(".list_yy").show();
        // 	var pve_name = $(this).parents("tr").find("td").eq(0).text()
        // 	$(".pve_name span").text(pve_name);
        // 	var dev_id = $(this).parents("tr").attr("dev_id");
        // 	DataHandle("GetUiDevByDev", {
        // 		dev_id: dev_id
        // 	}, add_td)
        // });

        function add_td(data) {
            $.each(data, function(i, n) {
                var ui_dev_id = n.ui_dev_id //：应用设备ID
                var ui_dev_name = n.ui_dev_name //:应用设备名称
                // var area_id = n.area_id //:区域ID
                var area_name = n.area_name //:区域名
                var ui_dev_type = n.ui_dev_type //:应用设备类型
                var ui_dev_type_name = n.ui_dev_type_name //:应用设备类型名称
                if (ui_dev_type == "2900") {
                    var link_set = "<a class='ai_set' href='javascript:void(0)'>AI含义设置</a>"
                } else if (ui_dev_type == "3000") {
                    var link_set = "<a class='di_set' href='javascript:void(0)'>DI含义设置</a>"
                } else {
                    var link_set = ""
                }
                $(".list_yy table").append("<tr><td ui_dev_id='" + ui_dev_id + "'>" + ui_dev_name + "</td><td ui_dev_type = '" + ui_dev_type + "'>" + ui_dev_type_name + "</td><td>" + link_set + " &nbsp;<a class='chg_name_dev'>修改名称</a> &nbsp;<a class='delete_ui_dev'>删除设备</a></td></tr>")
            });
        }
        //查看已配置应用列表==========================

        //AI量程
        $(".ai_set").live("click", function(event) {
            var $this_obj = $(this)
            var this_ui_dev_id = $this_obj.parents("tr").find("td").eq(0).attr("ui_dev_id");

            function GetAiTrans(data) {
                var input_min = "<div><strong>最小量程:</strong> <input type='text' id='input_min' value='" + data.input_min + "' /> <span>最小量程(不小于0)</span></div>" //:最小量程(不小于0)
                var input_max = "<div><strong>最小量程:</strong> <input type='text' id='input_max' value='" + data.input_max + "' /> <span>最大量程(不超过3600)</span></div>" //:最大量程(不超过3600)
                var m_min = "<div><strong>实际测量最小值:</strong> <input type='text' id='m_min' value='" + data.m_min + "' /></div>" //:实际测量最小值
                var m_max = "<div><strong>实际测量最大值:</strong> <input type='text' id='m_max' value='" + data.m_max + "' /></div>" //:实际测量最大值
                var unit = "<div><strong>单位:</strong> <input type='text' id='unit' value='" + data.unit + "' /></div>" //:单位
                var ttext = "<div class='di_set_box' id='ai_set' ui_dev_id='" + this_ui_dev_id + "'><div class='close_di'></div><div class='box_in_style'>" + input_min + input_max + m_min + m_max + unit + "<div class='conrol'><a class=tijiao>提交</a> <a class='quxiao_set'>取消</a></div></div></div>"
                $("body").append(ttext);

            }
            DataHandle("GetAiTrans", {
                ui_dev_id: this_ui_dev_id
            }, GetAiTrans, loading);
        });
        $(".close_di").live('click', function(event) {
            $(this).parent().remove()
        });
        $(".quxiao_set").live('click', function(event) {
            $(".close_di").click();
        });
        $("#ai_set .tijiao").live('click', function(event) {
            var ui_dev_id = $(this).parents("#ai_set").attr("ui_dev_id")
            var input_min = $("#input_min").val()
            var input_max = $("#input_max").val()
            var m_min = $("#m_min").val()
            var m_max = $("#m_max").val()
            var unit = $("#unit").val()
            var data = {
                ui_dev_id: ui_dev_id,
                input_min: input_min,
                input_max: input_max,
                m_min: m_min,
                m_max: m_max,
                unit: unit
            }

                function ModAiTrans(data) {
                    if (data) {
                        alert(data.error_msg)
                    } else {
                        alert("修改成功")
                        $(".quxiao_set").click();
                    };
                }
            DataHandle("ModAiTrans", data, ModAiTrans, loading)
        });
        //===

        // DI含义设置

        $(".di_set").live("click", function(event) {
            var $this_obj = $(this)
            var this_ui_dev_id = $this_obj.parents("tr").find("td").eq(0).attr("ui_dev_id");

            function GetAiTrans(data) {
                var zero_value = "<div><strong>0值含义:</strong> <input type='text' id='zero_value' value='" + data.zero_value + "' /> <span></span></div>" //::0值含义
                var one_value = "<div><strong>1值含义:</strong> <input type='text' id='one_value' value='" + data.one_value + "' /> <span></span></div>" //::1值含义

                var ttext = "<div class='di_set_box' id='di_set' ui_dev_id='" + this_ui_dev_id + "'><div class='close_di'></div><div class='box_in_style'>" + zero_value + one_value + "<div class='conrol'><a class=tijiao>提交</a> <a class='quxiao_set'>取消</a></div></div></div>"
                $("body").append(ttext);

            }
            DataHandle("GetDiTrans", {
                ui_dev_id: this_ui_dev_id
            }, GetAiTrans, loading);
        });
        $("#di_set .tijiao").live('click', function(event) {
            var ui_dev_id = $(this).parents("#di_set").attr("ui_dev_id")
            var zero_value = $("#zero_value").val()
            var one_value = $("#one_value").val()
            var data = {
                ui_dev_id: ui_dev_id,
                zero_value: zero_value,
                one_value: one_value
            }

                function ModDiTrans(data) {
                    if (data) {
                        alert(data.error_msg)
                    } else {
                        alert("修改成功")
                        $(".quxiao_set").click();
                    };
                }
            DataHandle("ModDiTrans", data, ModDiTrans, loading)
        });
        // =====================


        // 修改原始名称
        $(".chg_name").live("click", function(e) {
            var dev_id = $(this).parents("tr").attr("dev_id");
            $(".change_name").find("input").val("请输入设备名称");
            $(".change_name").attr("dev_id", dev_id);
            open("change_nm")
        });
        $(".esc_change").live("click", function(e) {
            $(".change_name").hide().removeAttr('dev_id').removeAttr('ui_dev_id').find("input").val("请输入设备名称");
            $("#add-over-layer").hide();
        });
        $(".enter_change").live("click", function(e) {
            var dev_id = $(".change_name").attr("dev_id");
            var ui_dev_id = $(".change_name").attr("ui_dev_id");
            var dev_name = $(".change_name input").val();
            if (dev_name == "" || dev_name == "请输入设备名称") {
                alert("请输入设备名称")
                return false;
            }

            if (dev_id) {
                DataHandle("ModDev", {
                    dev_id: dev_id,
                    dev_name: dev_name
                }, chage_name, loading);
            };
            if (ui_dev_id) {
                DataHandle("ModUiDev", {
                    ui_dev_id: ui_dev_id,
                    ui_dev_name: dev_name
                }, chage_name1, loading);
            };

            function chage_name1(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    alert("修改成功");
                    $(".table_style tr td[ui_dev_id='" + ui_dev_id + "']").html(dev_name);
                    $(".esc_change").click();
                };
            }

            function chage_name(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    alert("修改成功");
                    $(".table_style tr[dev_id='" + dev_id + "']").find(".sb_name").html(dev_name);
                    $("#add-over-layer").hide();
                    $(".esc_change").click();
                };
            }

        });
        // 修改应用名称

        $(".chg_name_dev").live('click', function(e) {
            var ui_dev_id = $(this).parents("tr").find('td').first().attr("ui_dev_id");
            $(".change_name").find("input").val("请输入设备名称");
            $(".change_name").attr("ui_dev_id", ui_dev_id);
            open("change_nm")
        });


        //删除已配置应用==========================
        $(".delete_ui_dev").live("click", function(e) {
            var $this_obj = $(this)
            var this_ui_dev_id = $this_obj.parents("tr").find("td").eq(0).attr("ui_dev_id");
            var dev_id = $(this).parents(".table_style").children(".pve_name").find("span").attr("dev_id");
            DataHandle("DelUiDev", {
                ui_dev_id: this_ui_dev_id
            }, del_ui_dev, loading)

            function del_ui_dev(data) {
                alert("删除成功")
                $this_obj.parents("tr").remove();
                $(".table_style tr[dev_id='" + dev_id + "']").find(".check_yy").html("无应用")
                $(".close_list_yy").click();
            }
        });
        //删除已配置应用==========================

        $(".dele_sb").live("click", function(e) {
            var dev_id = $(this).parents("tr").attr("dev_id");
            $this_dev = $(this).parents("tr")
            DataHandle("DelDev", {
                dev_id: dev_id
            }, del_dev, loading)

            function del_dev(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    alert("删除成功")
                    $this_dev.remove();
                };
            }
        });


        $(".sele").live("click", function(e) {
            e.stopPropagation();
            $(".sele").find("p").next("ul").hide();
            $(this).find("p").next("ul").show();
        });
        $(document).click(function() {
            $(".sele").find("p").next().hide();
        });
        $(".sele a").live("click", function(e) {
            e.stopPropagation();
            $(".sele").find("p").addClass("choose").next().hide();
            var t_texrt = $(this).text();
            var ui_prop_id = $(this).attr("ui_prop_id");
            var prop_cond = $(this).attr("prop_cond");
            var ui_dev_id = $(this).attr("ui_dev_id");
            var intf_sub = $(this).attr("intf_sub");
            var dev_type = $(this).attr("dev_type");
            var mf_id = $(this).attr("mf_id");
            // var area_id = $(this).attr("area_id")
            var des_ui_prop_id = $(this).attr("des_ui_prop_id");
            var ui_dev_type = $(this).attr("ui_dev_type");
            $(this).parents(".sele").children("p").attr("intf_sub", intf_sub).attr("ui_dev_type", ui_dev_type).attr("dev_type", dev_type).attr("mf_id", mf_id).text(t_texrt);
        });
        $(".sele .menu a").live("click", function() {
            $(".shebei_list").empty();
            $(".ld_inter").hide();
            $(".ld_shebei .sele > p").replaceWith("<p>请选择</p>")
            $(".ld_val .sele > p").replaceWith("<p>请选择</p>")
            // var area_id = $(this).attr("area_id");
        });
        $(".lexing_dev .sele a").live("click", function(e) {

        });
        $(".lexing_dev1 a").live("click", function() {
            $(".cjxinghao").empty();
            $(".xinghao_dev .sele > p").replaceWith("<p>请选择</p>")
            var dev_type = $(this).attr("dev_type");
            $(this).parents("ul").prev().attr("dev_type", dev_type);
            DataHandle("GetMfList", {
                dev_type: dev_type
            }, dataxinghao, loading) //获取设备类型的厂家型号表

            function dataxinghao(data) {
                $.each(data, function(i, n) {
                    var mf_id = n.mf_id //:厂家型号ID
                    var mf_name = n.mf_name //:厂家型号名称
                    $(".cjxinghao").append("<li><a href='javascript:void(0)' mf_id='" + mf_id + "'>" + mf_name + "</a></li>")
                })
            }
        })
        //配置设备======================================


        // 修改波特率
        $(".changebit").live('click', function(e) {
            if ($(this).attr("change_text") == "0") {
                $(this).prev().removeAttr('disabled').css('border', '1px solid #000');
                $(this).text("确定").attr("change_text", "1");
            } else {

                var intf_id = $(".pezhi_box_232").attr("intf_id")
                var intf_sub = $(this).parents(".model_d").index()
                var bit_rate = $(this).prev().val()
                if (isNaN(bit_rate)) {
                    alert("请输入数字");
                    return false
                } else {
                    DataHandle("SetBitRate", {
                        intf_id: intf_id,
                        port: intf_sub,
                        bit_rate: bit_rate
                    }, bit_seucc)


                    $(this).text("修改").attr("change_text", "0");
                    $(this).prev().attr('disabled', "disabled").css('border', 'none');
                }

            };

            function bit_seucc(data) {
                alert("修改成功")
            }
        });

        //修改名称======================================
        var c_name_dev_id
        $(".set_name").live("click", function(e) {
            e.stopPropagation();
            c_name_dev_id = $(this).parents("tr").attr("dev_id")
            $("body").append("<div class='change_name'><input type='text' value='请输入名称' /> <a href='javascript:void(0)' class='qd_s_name'>确定</a> <a href='javascript:void(0)' class='qx_s_name'>取消</a></div>")
            $(".change_name input").focus()
        })
        $(".qd_s_name").live("click", function(e) {
            e.stopPropagation();
            var c_name = $(this).prev().val();
            if (c_name == "" || c_name == "请输入名称") {
                alert("请输入名称")
                return false
            }
            var data_in = {
                dev_id: c_name_dev_id,
                dev_name: c_name
            }
            DataHandle("ModDev", data_in, Name, loading);
            $("table tr[dev_id='" + c_name_dev_id + "']").find(".sb_name").text(c_name)
            $(".change_name").remove();
        })

            function Name(data) {
                if (data) {
                    alert(data.error_msg)
                } else {
                    alert("修改成功")
                    $(".change_name").remove();
                }
            }
        $(".qx_s_name").live("click", function() {
            $(".change_name").remove();
        })
        //修改名称======================================


        //上传图片======================================
        $("#btnUpload").click(function(e) {
            e.preventDefault();
            //var area_id = $(".location a:last").attr("area_id");
            if ($("#flUpload").val() == "") {
                alert("请选择一个图片文件，再点击上传。");
                return;
            }
        });
        //上传图片======================================


        //取消配置按钮
        $(".quxiao_pz").live("click", function() {
            bg_fade_out()
            $(".pezhi_box, .pezhi_box_232, .pezhi_box_ip").fadeOut(500);
            $(".peizhi_dev").fadeOut(500);
            $(".peizhi_dev1").fadeOut(500);
            $(".peizhi_dev2").fadeOut(500);
        })
        $(".quxiao_pz1").live("click", function() {
            //bg_fade_out ()
            $(".peizhi_dev").fadeOut(500);
            $(".peizhi_dev1").fadeOut(500);
            $(".peizhi_dev2").fadeOut(500);
            $(".leibie").empty();
            $(".lexing_dev .sele p, .menu_style .sele p, .lexing_dev1 .sele p, .xinghao_dev .sele p").replaceWith("<p>请选择</p>");
            $(".up_loadimg input").val("")
            $(".change_name1 input, .change_name2 input, .change_name3 input").val("请输入设备名称");
            $(".change_addr input, .change_addr2 input").val("请输入设备地址")
        })
        $(".close_list_yy").live("click", function() {
            $(".list_yy").hide();
            $(".list_yy td").parent("tr").remove()
        });
        $(".close").live("click", function() {
            $(".quxiao_pz").click();
            $(".quxiao_pz1").click();
            $(".close_list_yy").click();
            $(".change_name").hide();
        })
        $(".close1").live("click", function() {
            $(".quxiao_pz1").click();
        })
        /*
        功能：     搜索模块
        */

        //读取模块列表

        function SearIntf1() {
            //alert(1)
            DataHandle("SearchIntfList", {}, add_seach, loading)

            function add_seach(data) {
                if (data) {
                    $.each(data, function(o, m) {
                        var intf_addr = m.intf_addr
                        var intf_sn = m.intf_sn
                        var intf_type = m.intf_type
                        var intf_rand = m.intf_rand
                        //var intf_type_name = n.intf_type_name
                        if (intf_type < 65530) {
                            DataHandle("AddIntf", {
                                intf_addr: intf_addr,
                                intf_sn: intf_sn,
                                intf_type: intf_type
                            }, eorro, loading)
                        }

                        function eorro(data) {
                            if (data) {
                                //alert(data.error_msg)
                            }
                        }
                    });
                }

                function jixiang(data) {
                    $.each(data, function(i, n) {
                        var intf_id = n.intf_id
                        var intf_sn = n.intf_sn
                        var intf_type = n.intf_type
                        var intf_type_name = n.intf_type_name
                        var box_id = n.box_id
                        var box_port = n.box_port
                        var online_sts = n.online_sts //是否在线
                        if (online_sts == 0) {
                            var mkzt = "<span class='lixian'></span> 离线中"
                        } else {
                            var mkzt = "<span class='zaixian'></span> 运行中"
                        };

                        if (intf_type != "1" && intf_type != "4") {
                            if (box_id == "-1") {
                                var NewIntf = $("<li><div class=><p class='dk_name' intf_type='" + intf_type + "' intf_id='" + intf_id + "'>(" + intf_sn + ")<br>" + intf_type_name + "</p></div></li>");
                                $(".drag").append(NewIntf);

                            } else {
                                var NewIntf = $("<div class=><p class='dk_name' intf_type='" + intf_type + "' intf_id='" + intf_id + "'>(" + intf_sn + ")<br>" + intf_type_name + "</p></div>");

                                $("div[box_id='" + box_id + "'] .drop li").eq(box_port).append(NewIntf);
                                $("div[box_id='" + box_id + "'] .bjing li").eq(box_port).html(mkzt);
                            }
                        }
                        if (intf_type == "4") {
                            $(".sb_demo").eq(0).find(".cdma").append("<a class='ps' href='javascript:void(0)'>配置</a><div class=><p class='dk_name' intf_type='" + intf_type + "' intf_id='" + intf_id + "'>(" + intf_sn + ")<br>CDMA</p><div class='cdma_zx'>" + mkzt + "</div></div>");
                        }
                        if (intf_type == "1") {
                            $("div[box_id='" + box_id + "'] .bjing li").eq(0).html(mkzt);
                            $(".guding").html("<div class=><p class='dk_name' intf_type='" + intf_type + "' intf_id='" + intf_id + "'>(" + intf_sn + ")<br>" + intf_type_name + "</p></div>")
                        }
                    })
                }
                DataHandle("GetIntfList", {}, jixiang, loading)


            }
        }

        function SearIntf() {
            DataHandle("GetIntfList", {}, IntfHandle, loading);
        }

        function IntfHandle(data) {
            $.each(data, function(i, v) {
                GetIntfTypeList(v.intf_type, v.intf_id, v.intf_addr, v.intf_sn);
            });
        }

        //读取模块类型列表

        function GetIntfTypeList(IntfType, IntfID, IntfAddr, intf_sn) {
            var NewIntf;
            DataHandle("GetIntfTypeList", {}, IntfTypeHandle, loading);

            function IntfTypeHandle(data) {
                $.each(data, function(i, v) {
                    var box_id = v.box_id;
                    var box_port = v.box_port;
                    var intf_sn = v.intf_sn;

                    if ((v.intf_type == IntfType) && (IntfType == 1)) {
                        $(".sb_demo .guding").append("<p class='dk_name' id='" + IntfID + "'>(" + intf_sn + ")" + v.intf_type_name + "</p >");
                    }
                    if ((v.intf_type == IntfType) && (IntfType != 1)) {
                        NewIntf = $("<li><div class=><p class='dk_name' id='" + IntfID + "'>(" + intf_sn + ")" + v.intf_type_name + "</p >< /div></li > ");
                        $(".drag ").append(NewIntf)
                    } else {
                        $(".drag ").append(NewIntf)
                        $("div[box_id = '" + box_id + "'].drop ").append(NewIntf)
                    }
                });
            }
        }

        function DevList(IntfID) {
            var dev_id;
            $(".dev").remove();
            DataHandle("GetDevList", {}, DevDataHandle, loading);

            function DevDataHandle(data) {
                $.each(data, function(i, v) {
                    if (IntfID == v.intf_id) {
                        var dev_id = v.dev_id;
                        NewDev = $("<tr class='dev' dev_id=" + v.dev_id + " intf_id='" + v.intf_id + "'><td align='center'>" + v.dev_name + "</td><td align='left' class='check_yy'>无应用</td><td align='center'><a href='javascript:void(0)' class='dev_sb'>添加到应用</a></tr>");
                        $(".leixing ").append(NewDev);

                        function add_check_y(data) {
                            if (data) {
                                $(".leixing tr[dev_id='" + dev_id + "']").find(".check_yy").html("有应用，请<a href='javascript:void(0)'>点击查看应用</a>");
                            };
                        }
                        DataHandle("GetUiDevByDev", {
                            dev_id: dev_id
                        }, add_check_y, loading);
                    }
                });


            }
        }
    });
})(jQuery);

function UpDate1() {
    $("#btnUpload11").click(function(e) {
        var intfid = $(this).parents().find("h2").attr("intfid");
        if ($("#flUpload11").val() == "") {
            alert("请选择一个文件，再点击上传。");
            return;
        }
        var url = $("#flUpload11").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "bin") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择");
            return false;
        };
        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host
        //var Port = "8002";
        IpAddr = IpAddr.split(":")[0];
        $('#UpLoadForm11').ajaxSubmit({
            async: true,
            url: "http://" + IpAddr + ":" + Port + "/UpdateIntf?intf_id=" + intfid,
            dataType: "jsonp",
            success: function(data) {
                alert("上传成功");
                location.reload();
            }
        });
    });

}

function UpDate2() {
    $("#btnUpload22").click(function(e) {
        var intfid = $("#intf232").attr("intf_id");
        if ($("#flUpload22").val() == "") {
            alert("请选择一个文件，再点击上传。");
            return;
        }
        var url = $("#flUpload22").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "bin") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择");
            return false;
        };
        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host
        //var Port = "8002";
        IpAddr = IpAddr.split(":")[0];
        $('#UpLoadForm22').ajaxSubmit({
            async: true,
            url: "http://" + IpAddr + ":" + Port + "/UpdateIntf?intf_id=" + intfid,
            dataType: "jsonp",
            success: function(data) {
                alert("上传成功");
                location.reload();

            }
        });
    });

}

function UpDate3() {
    $("#btnUpload33").click(function(e) {
        var intfid = $("#intfip").attr("intf_id");
        if ($("#flUpload33").val() == "") {
            alert("请选择一个文件，再点击上传。");
            return;
        }
        var url = $("#flUpload33").val()
        var url_ = new Array();
        url_ = url.split(".")
        var nobor = url_.length - 1;
        if (url_[nobor] != "bin") {
            alert("不支持" + url_[nobor] + "的格式，请重新选择");
            return false;
        };
        var addr = document.location.host;
        var IpAddr = (addr == "") ? "localhost" : document.location.host
        //var Port = "8002";
        IpAddr = IpAddr.split(":")[0];
        $('#UpLoadForm33').ajaxSubmit({
            async: true,
            url: "http://" + IpAddr + ":" + Port + "/UpdateIntf?intf_id=" + intfid,
            dataType: "jsonp",
            success: function(data) {
                alert("上传成功");
                location.reload();

            }
        });
    });

}

/*
    模块状态
*/

function IntfStatus(IntfID) {
    DataHandle("GetIntfList", {}, StatusHandle);

    function StatusHandle(data) {
        $.each(data, function(i, v) {
            if (v.intf_id == IntfID) {

            }
        });
    }
}