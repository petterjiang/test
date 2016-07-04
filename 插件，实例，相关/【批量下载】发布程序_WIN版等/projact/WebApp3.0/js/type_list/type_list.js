//��ȡ�豸�����б�

function load_type_left() {
	function GetUiDevTypeList(data) {
		$.each(data, function(i, n) {
			var ui_dev_type = n.ui_dev_type //Ӧ���豸����
			var ui_dev_type_name = n.ui_dev_type_name //Ӧ���豸��������
			var system_class = n.system_class //ϵͳ����(0:����ϵͳ; 1:����ϵͳ; 2:���ϵͳ; 3:����ϵͳ)
			var file_path = n.file_path //Ӧ���豸���͵�ͼƬ·��

			$(".left_nav ul").append('<li><a class="" href="" ui_dev_type="' + ui_dev_type + '"><img src="../images/upload_bg/ui_dev_type' + ui_dev_type + '.png" height="35" /><span class="name_type">' + ui_dev_type_name + '</span><span class="type_con"></span></a></li>')
		});
		//���Ӻ����Ӳ���
		var height_nav = $(".left_nav").height() - $(".right_top").height()
		// alert(height_nav)
		link_add(".left_nav ul a")
	}
	DataHandle("GetUiDevTypeList", {}, GetUiDevTypeList, loading)
}


// ������ʼʱ��

function time_start() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var mon = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var Hour = myDate.getHours();
	var Minute = myDate.getMinutes();
	if (mon < 10) {
		mon = "0" + mon;
	} else {
		mon = mon;
	}
	if (day < 10) {
		day = "0" + day;
	} else {
		day = day;
	}
	if (Minute < 10) {
		Minute = "0" + Minute;
	} else {
		Minute = Minute;
	}
	var BeginDay = day - 1;
	if (BeginDay < 10) {
		BeginDay = "0" + BeginDay;
	} else {
		BeginDay = BeginDay;
	}
	if (BeginDay <= 0) {
		if (mon = 1) {
			mon = 12;
			year = year - 1;
		} else {
			mon = mon - 1;
		}
	}

	var BeginTime = year + "-" + mon + "-" + BeginDay + " " + Hour + ":" + Minute;
	var EndTime = year + "-" + mon + "-" + day + " " + Hour + ":" + Minute;
	$("#time_now1").val(BeginTime);
	$("#time_now2").val(EndTime);

	$("#time_now1, #time_now2").click(function(e) {
		WdatePicker({
			dateFmt: 'yyyy-MM-dd HH:mm'
		})
	});
}

// ��ȡӦ���豸(�б�)

function load_dev_list() {
	function GetUiDevList(data) {
		$.each(data, function(i, n) {
			var ui_dev_id = n.ui_dev_id //Ӧ���豸
			var ui_dev_name = n.ui_dev_name //�豸����
			var area_x = n.area_x //����x����
			var area_y = n.area_y //����y����
			var system_class = n.system_class //ϵͳ����
			var ui_dev_type = n.ui_dev_type //Ӧ���豸��������
			var file_path = n.file_path //ͼƬurl
			var online_sts = n.online_sts //����״̬(0:���ߣ�1:����)
			var place_sts = n.place_sts //��ǰ������0:�ѳ�����1:�����У�
			var in_map = n.in_map //�豸�Ƿ���ʾ��ͼ
			var offline_sms = n.offline_sms //:�����Ƿ񷢶��Ÿ澯
			// �ж�״̬class������
			var zhuangtaiClass = ""
			var zhuangtaiTexgt = ""
			var buchefangClass = ""
			if (online_sts == 0) {
				zhuangtaiClass = "lixian"
				zhuangtaiTexgt = "������"
			} else {
				if (place_sts == 1) {
					zhuangtaiClass = "yunxing"
					zhuangtaiTexgt = "������"
					buchefangClass = "bufang_on"
				} else {
					zhuangtaiClass = "chefang"
					zhuangtaiTexgt = "������"
					buchefangClass = "bufang_off"
				};
			};

			var html = '<div class="list_d_iteam" ui_dev_id="' + ui_dev_id + '" ui_dev_type="' + ui_dev_type + '" offline_sms="' + offline_sms + '"><h3>' + ui_dev_name + '</h3><p class="zhuantai ' + zhuangtaiClass + '"><span></span>' + zhuangtaiTexgt + '</p><ul class="prop_list"></ul></div>'
			var html_drag = '<div class="drag" title="����϶����Ҽ��鿴������Ϣ" ui_dev_type="' + ui_dev_type + '" place_sts="' + place_sts + '" in_map="' + in_map + '" x_posent="' + area_x + '" y_posent="' + area_y + '" ui_dev_id="' + ui_dev_id + '"><div class="img_box tuodong"><img src="../' + file_path + '" width="40" style="display:none;"><div class="s_s"><p class="zhuantai ' + zhuangtaiClass + '"><span></span>' + zhuangtaiTexgt + '</p><div class="ctrlkg" title="��������ť"><span class="' + buchefangClass + '"></span></div><div class="button_kz"></div></div></div><a href="javascript:void(0);" class="handle_bott">' + ui_dev_name + '</a></div>'
			$(".tpye_box_list").append(html)
			$(".equipments_box ").append(html_drag)
			load_dev_prop(ui_dev_id)
		});
		//ͳ�������豸����
		$(".left_nav ul a").each(function() {
			var ui_dev_type = $(this).attr("ui_dev_type");
			$(this).find('.type_con').text(unttype(ui_dev_type))
		});
		load_show()
		drag_do()
	}
	DataHandle("GetUiDevList", {}, GetUiDevList, loading)
}

function unit(units,val) {
	var temp = units.split("|");
	for (var i = 0; i < temp.length; i++) {
		var Things = temp[i].split(":");
		if (Things[0] == val) {
			var checked_c = Things[1]
		};
	};
	return checked_c
}

// ��ȡ�豸�����б�

function load_dev_prop(ui_dev_id) {
	function GetUiDevPropList(data) {
		$.each(data, function(i, n) {
			var ui_dev_id = n.ui_dev_id //Ӧ���豸ID
			var ui_prop_id = n.ui_prop_id //Ӧ������ID
			var ui_prop_name = n.ui_prop_name //Ӧ����������
			var prop_type = n.prop_type //��������
			var show_level = n.show_level //��ʾ����(-1:����ʾ;0:��ͨ����;1:��Ҫ����;2:��ҳ����)
			var file_path = n.file_path //ͼƬ·��
			var units = n.units //��λ(�����ж�������֮���ö��Ÿ���)
			var alarm_info = n.alarm_info //�澯��Ϣ(���������Ը澯�ˣ������Ǹ澯�����ݣ�����Ϊ��)
			var alarm_cond = n.alarm_cond //�澯����(0:�����ø澯,1:����,2:���ڵ���,3:С��,4:С�ڵ���,5����)
			var prop_value = n.prop_value //��ǰ����ֵ
			var ui_flag = n.ui_flag; //�жϿ���
			var show_level = n.show_level //��ʾ����
			// alert(prop_type)
			// �ж��Ƿ��д���
			if (i == "error_code") {
				$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list").empty().append('<li style="padding-left: 24px;">' + data.error_msg + '</li>')
				return false
			} else {
				if (prop_type.indexOf("r") > -1) { //�ж��Ƿ����д������
					// �ж��Ƿ�澯
					var gaojingClass = ""
					if (alarm_info == "") {
						gaojingClass = "color_wite"
					} else {
						gaojingClass = "color_red"
						$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai baojing').html("<span></span>������");
						var alert_href = $(".alert_msg a").attr("href")
						$(".drag[ui_dev_id='" + ui_dev_id + "'] .handle_bott").attr("href", alert_href).addClass('color_red').css('cursor', 'pointer');
					};
					// �ж��Ƿ񿪹�
					if (ui_flag == "1") {
						if (prop_value == 0) {
							var text_sf = "��"
						} else {
							var text_sf = "��"
						};
						var propTxet = '<li class="' + gaojingClass + '" ui_prop_id="' + ui_prop_id + '" show_level="' + show_level + '"><span class="name_shuxing">' + ui_prop_name + '</span><span class="val_shuxing"><span class="val_zhi">' + text_sf + '</span></span></li>'
						$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list").append(propTxet);
					} else if (ui_flag == "11") {
						prop_value = unit(units,prop_value)
						var propTxet = '<li class="' + gaojingClass + '" ui_prop_id="' + ui_prop_id + '" show_level="' + show_level + '"><span class="name_shuxing">' + ui_prop_name + '</span><span class="val_shuxing"><span class="val_zhi" units="'+units+'">' + prop_value + '</span> <span class="units"></span></span></li>'
						$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list").append(propTxet);
					} else {
						var propTxet = '<li class="' + gaojingClass + '" ui_prop_id="' + ui_prop_id + '" show_level="' + show_level + '"><span class="name_shuxing">' + ui_prop_name + '</span><span class="val_shuxing"><span class="val_zhi">' + prop_value + '</span> <span class="units">' + units + '</span></span></li>'
						$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list").append(propTxet);
					};

				} else {
					// �ж��Ƿ񿪹�
					if (ui_flag == "1") {
						$.ajax({
							type: "get",
							url: GetUrl("ReadUiDevProp"),
							data: {
								ui_dev_id: ui_dev_id,
								ui_prop_id: ui_prop_id
							},
							dataType: "jsonp",
							contentType: "application/json;charset=gb2312",
							success: function(ReadUiDevProp) {
								var prop_value = ReadUiDevProp.prop_value;
								if (prop_value == 1) {
									$(".drag[ui_dev_id='" + ui_dev_id + "']").find(".button_kz").append("<p><a href='' class='oppen_b' ui_prop_id=" + ui_prop_id + " prop_value='" + prop_value + "'></a>");
								}
								if (prop_value == 0) {
									$(".drag[ui_dev_id='" + ui_dev_id + "']").find(".button_kz").append("<p><a href='' class='close_b' ui_prop_id=" + ui_prop_id + " prop_value='" + prop_value + "' ></a>");
								}
							}
						})
					} //end if
				};
			};
		});
	}

	DataHandle("GetUiDevPropList", {
		ui_dev_id: ui_dev_id
	}, GetUiDevPropList, loading)
}

// // ��ȡʵʱ�澯����
// function alert_list () {
// 	function alert_load_n (data) {
// 		var alert_nober = data.length
// 		$(".alert_msg a").text(alert_nober)
// 	}
// 	DataHandle("GetCurrentAlarm", {}, alert_load_n, loading)
// }



// ͳ�������豸

function unttype(type_s) {
	var type_nuber = 0
	$(".list_d_iteam").each(function() {
		var ui_dev_type = $(this).attr("ui_dev_type");
		if (ui_dev_type == type_s) {
			type_nuber += 1
		};
	});
	return type_nuber
}

function cashu(Nobuer) {
	if (Nobuer == 0) {
		return Nobuer
	};
	if (Nobuer == 1) {
		Nobuer = "����"
		return Nobuer
	};
	if (Nobuer == 2) {
		Nobuer = "���ڵ���"
		return Nobuer
	};
	if (Nobuer == 3) {
		Nobuer = "С��"
		return Nobuer
	};
	if (Nobuer == 4) {
		Nobuer = "С�ڵ���"
		return Nobuer
	};
	if (Nobuer == 5) {
		Nobuer = "����"
		return Nobuer
	};
}

// ������ʾ

function load_show() {
	var this_href = document.location.href;
	var href_temp = this_href.split("&");
	var ui_dev_type = "2800"
	for (var i = 0; i < href_temp.length; i++) {
		if (href_temp[i].indexOf("ui_dev_type") > -1) {
			var ui_dev = href_temp[i].split("=");
			ui_dev_type = ui_dev[1]
		};
	};
	$(".left_nav li a[ui_dev_type='" + ui_dev_type + "']").click();
}

// ͼƬ��ʾ��

function set_wh() {
	var w_height = $(".left_nav").height() - $(".right_top").height()
	var w_width = $(".all_equipments").width(); //�����߱���
	var imgsrc = $("#img_id").attr("src");
	var bili = w_height / w_width;
	var img = new Image();

	img.onload = function() {
		var img_h = this.height;
		var img_w = this.width;
		var img_bili = img_h / img_w; //����ͼƬ��߱���
		$("#img_id").css("width", "100%").css("height", "");
	}
	// $(".equipments_box").css({
	// 	height: w_height,
	// 	width: w_width
	// });
	img.src = imgsrc;
}

// �½��ƶ�����

function drag_do() {
	var move = new moveDiv(".drag", "#img_id", "1");
	// alert(1)
	move.move_area();
	move.move_set();
	$(window).resize(function() {
		move.move_area();
		move.move_set();
	});
}

// �Ҽ��˵�

function RightMenu1() {}
RightMenu1.prototype = {
	classname: "rightmenu",
	ui_dev_id: "",
	pageX: "",
	pageY: "",
	link_a: [{
		text: "�鿴��ϸ",
		class_name: "ck_more"
	}, {
		text: "����",
		class_name: "ctl_ld"
	}, {
		text: "������",
		class_name: "ctl_bcf"
	}, {
		text: "��������",
		class_name: "ctl_bj"
	}, {
		text: "��ʷ��¼",
		class_name: "ctl_ls"
	}],
	creat: function() {
		$("." + this.classname).remove();
		$("body").append("<div class='" + this.classname + "' style='position: absolute; left:" + this.pageX + "px; top:" + this.pageY + "px; z-index:10001;'></div>");
		var ui_dev_id = this.ui_dev_id;
		var classname = this.classname;
		$.each(this.link_a, function(i, n) {
			var text = n.text;
			var class_name = n.class_name;
			var a_link = "<a ui_dev_id = '" + ui_dev_id + "' class='" + class_name + "'>" + text + "</a>";
			$("." + classname).append(a_link);
		});
	},
	hide: function() {
		var classname = this.classname
		$("body").click(function() {
			$("." + classname).remove();
		});
	},
	link_click: function() {
		var ui_dev_id = this.ui_dev_id;
		$.each(this.link_a, function(i, n) {
			var text = n.text;
			var class_name = n.class_name;
			$("." + class_name).click(function() {
				$(".box_li[id='" + ui_dev_id + "']").click();
				$(".tab_title li").eq(i).click();
			});
		});
	}
}


//ȫ����ʽ

function full_map() {
	// �޸���ʽ
	$(".equipments_box").css({
		'position': 'absolute',
		'background': '#333',
		'top': '0',
		'left': '0',
		'width': '100%',
		'height': '100%'
	});
	$(".tishi").css('position', 'absolute');
	$(".equipments_box #img_id").css({
		'height': '100%'
	});
	$(".ctr_map span").text("�˳�ȫ��");
	$(".ctr_map").removeClass().addClass("ctr_map_out");
	$("body").css('overflow', 'hidden').scrollTop(0);
	$("html").scrollTop(0);
}

// �˳�ȫ����ʽ

function exit_full_map() {
	$(".equipments_box").css({
		'position': 'relative',
		'background': '',
		'top': '',
		'left': '',
		'width': '',
		'height': ''
	});
	$(".tishi").css('position', 'static');
	$(".equipments_box #img_id").css({
		'height': ''
	});
	$(".ctr_map_out span").text("ȫ����ʾ");
	$(".ctr_map_out").removeClass().addClass("ctr_map");
	$("body").css('overflow', '');
}
// body��ʽ

function body_style() {
	if ($(".equipments_box").find('.ctr_map').length > 0) {
		$("body").css('overflow', '');
	} else {
		$("body").css('overflow', 'hidden').scrollTop(0);
		$("html").scrollTop(0);

	};
}

$(function() {
	load_type_left();
	// �½��л�
	var tpye_change = new tab_change(".chage_click li", ".list_iteam", "on_select")
	tpye_change.click_change();
	set_wh()
	selet();
	alert_list()
	load_dev_list();

	// ����setHock
	var chage_text = function(SetHook) {
		$.each(SetHook, function(i, n) {
			if (n.ui_dev_prop) {
				var ui_dev_prop = n.ui_dev_prop;
				var ui_prop_id = ui_dev_prop.ui_prop_id;
				var ui_dev_id = ui_dev_prop.ui_dev_id;
				var prop_value = ui_dev_prop.prop_value;
				var obj = $(".list_d_iteam[ui_dev_id='" + ui_dev_id + "']")
				// �豸�б�ɶ�����ʱʱˢ��
				obj.find("li").each(
					function() {
						if ($(this).attr("ui_prop_id") == ui_prop_id) {
							var units = $(this).find('.val_zhi').attr("units");
							if (units!=undefined) {
								prop_value = unit(units,prop_value)
							};
							$(this).find('.val_zhi').text(prop_value);
						}
					}
				);
				if ($(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + ui_dev_id + "'] .zhuantai").hasClass('lixian')) {
					$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai yunxing').html("<span></span>������");
				}
				// �����豸��ϸ�����б�ʵʱˢ��
				$(".sx_text .shuxi").each(
					function() {
						var DevID = $(".a_type h2").attr("ui_dev_id");
						if ($(this).attr("data_ui_prop_id") == ui_prop_id && DevID == ui_dev_id) {
							$(this).find('.value').text(prop_value);
						}
					}
				);
			}
			// ʵʱˢ�¸澯
			if (n.alarm) {
				var alarm = n.alarm;
				var alarm_ui_dev_id = alarm.ui_dev_id;
				var alarm_ui_prop_id = alarm.ui_prop_id;
				// var alarm_x = parseInt($(".alert_msg a").text());
				// alarm_x += 1;
				// $(".alert_msg a").text(alarm_x);
				// alert(alarm_ui_dev_id)
				$(".list_d_iteam[ui_dev_id='" + alarm_ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + alarm_ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai baojing').html("<span></span>������");
				$(".list_d_iteam[ui_dev_id='" + alarm_ui_dev_id + "'] .prop_list li[ui_prop_id='" + alarm_ui_prop_id + "']").removeClass().addClass('color_red');
				$(".sx_text .shuxi[data_ui_prop_id='" + alarm_ui_prop_id + "']").removeClass().addClass('shuxi').addClass('color_red');
				var alert_href = $(".alert_msg a").attr("href")
				$(".drag[ui_dev_id='" + alarm_ui_dev_id + "'] .handle_bott").attr("href", alert_href).addClass('color_red').css('cursor', 'pointer');

			};
			if (n.alarm_remove) {
				var alarm_remove = n.alarm_remove
				var remove_ui_dev_id = n.ui_dev_id;
				var remove_ui_prop_id = n.ui_prop_id;
				// var alarm_x = parseInt($(".alert_msg a").text());
				// alarm_x -= 1;
				// $(".alert_msg a").text(alarm_x);
				$(".list_d_iteam[ui_dev_id='" + remove_ui_dev_id + "'] .prop_list li[ui_prop_id='" + remove_ui_prop_id + "']").removeClass().addClass('color_wite');
				$(".sx_text .shuxi[data_ui_prop_id='" + remove_ui_prop_id + "']").removeClass().addClass('shuxi').addClass('color_wite')

				if (alarm_remove == "999") {
					$(".list_d_iteam[ui_dev_id='" + remove_ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + remove_ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai yunxing').html("<span></span>������");
					$(".drag[ui_dev_id='" + remove_ui_dev_id + "'] .handle_bott").attr("href", "javascript:void(0);").removeClass('color_red').css('cursor', '');
				};
			};
			if (n.dev_offline == 1) {
				var dev_offline = n.dev_offline;
				var off_ui_dev_id = n.ui_dev_id;
				$(".list_d_iteam[ui_dev_id='" + off_ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + off_ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai lixian').html("<span></span>������");
			};
			if (n.dev_offline == 99) {
				var dev_offline = n.dev_offline;
				var off_ui_dev_id = n.ui_dev_id;
				$(".list_d_iteam[ui_dev_id='" + off_ui_dev_id + "'] .zhuantai, .drag[ui_dev_id='" + off_ui_dev_id + "'] .zhuantai").removeClass().addClass('zhuantai yunxing').html("<span></span>������");
			};

		})
	};

	b_callbacks.add(chage_text);


	//�������������һ��¼�
	$(".drag, .list_d_iteam").live("mouseup", function(e) {

		if (e.which == 3) {
			$(".tab_title li").show()
			var le_shebei = $(this).attr("ui_dev_type");
			var this_id = $(this).attr("ui_dev_id");
			var x = e.pageX;
			var y = e.pageY;
			RightMenu1.prototype.ui_dev_id = this_id;
			RightMenu1.prototype.pageX = x;
			RightMenu1.prototype.pageY = y;

			var rightmenu0 = new RightMenu1();
			if (le_shebei == "2800") {
				rightmenu0.link_a = [{
					text: "�鿴��ϸ",
					class_name: "ck_more"
				}, {
					text: "����",
					class_name: "ctl_ld"
				}, {
					text: "������",
					class_name: "ctl_bcf"
				}];
				$(".tab_title li").eq(4).hide();
			};
			rightmenu0.creat();
			rightmenu0.hide();
			// rightmenu0.link_click();
		}
	});

	//�����ʾ�����豸
	$(".left_nav ul li a").live('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		close_chushi();
		body_style()
		$(".leixing .tiaojian_list").empty();
		$(".a_type").hide();
		$(".tpye_box_list").show()
		var ui_dev_type = $(this).attr("ui_dev_type");
		$(this).addClass('on_tpye').parent().siblings().find('a').removeClass('on_tpye')
		$(".list_d_iteam").each(function() {
			var this_ui_dev_type = $(this).attr("ui_dev_type")
			if (this_ui_dev_type == ui_dev_type) {
				$(this).show()
			} else {
				$(this).hide()
			};
		});
		$(".drag").each(function() {
			var this_ui_dev_type = $(this).attr("ui_dev_type")
			var in_map = $(this).attr("in_map")
			if (this_ui_dev_type == ui_dev_type && in_map == "1") {
				$(this).show()
			} else {
				$(this).hide()
			};
		});
		if ($("#list_mod").hasClass('on_select')) {
			$(".drag").hide()
		};
		if ($("#map_mod").hasClass('on_select')) {
			$(".list_d_iteam").hide()
		};
		// 
	});
	//��������ť
	$(".ctrlkg span").live("click", function() {
		var SetPlace, this_class, chengepla, text_show //���ò���������
		var ui_dev_id = $(this).parents(".drag").attr("ui_dev_id");
		var place_sts = $(this).parents(".drag").attr("place_sts");
		var $this = $(this)
		if (place_sts == "1") {
			chengepla = "0";
			SetPlace = "2";
			this_class = "bufang_off";
			text_show = "<span></span>������"
		}
		if (place_sts == "0") {
			chengepla = "1";
			SetPlace = "0";
			this_class = "bufang_on";
			text_show = "<span></span>������"
		};
		var data = {
			ui_dev_id: ui_dev_id, //Ӧ���豸ID
			place_type: SetPlace //��������
		}

			function Setpl(data) {
				$.each(data, function(i, n) {
					var place_sts = n.place_sts;
					var error_msg = n.error_msg;
					if (error_msg) {
						alert(error_msg);
					} else {
						$this.removeClass().addClass(this_class);
						$this.parents(".drag").attr("place_sts", chengepla).find('.zhuantai').html(text_show);
						$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "']").find('.zhuantai').html(text_show);
					};
				});
			}
		DataHandle("SetPlace", data, Setpl, loading)
	})
	//���ؿ���
	$(".button_kz a").live("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		$this_obj = $(this)
		// var name_v = $(this).find("span").text()
		var this_class = $(this).attr("class"),
			ui_dev_id = $(this).parents(".drag").attr("ui_dev_id"),
			ui_prop_id = $(this).attr("ui_prop_id"),
			prop_value = $(this).attr("prop_value")

			if (prop_value == 0) {
				prop_value = 1
			} else {
				prop_value = 0
			}
			// alert(prop_value)
		$.ajax({
			type: "get",
			url: GetUrl("WriteUiDevProp"),
			data: {
				ui_dev_id: ui_dev_id,
				ui_prop_id: ui_prop_id,
				prop_value: prop_value
			},
			dataType: "jsonp",
			contentType: "application/json;charset=gb2312",
			success: function(WriteUiDevProp) {
				// alert(prop_value)
				//var error_msg1 = n.error_msg;
				if (WriteUiDevProp) {
					alert(WriteUiDevProp.error_msg)
				} else {
					if (prop_value == "0") {
						// $this_obj.html("<span>" + name_v + "</span>��")
						$this_obj.removeClass("oppen_b").addClass("close_b").attr("prop_value", "0");
					}
					if (prop_value == "1") {
						// $this_obj.html("<span>" + name_v + "</span>��")
						$this_obj.removeClass("close_b").addClass("oppen_b").attr("prop_value", "1");
					}
				}
			}
		});
	});
	// �б�ģʽ��ť
	$("#list_mod").click(function(e) {
		e.preventDefault();
		$(this).addClass('on_select')
		$("#map_mod").removeClass('on_select')
		$(".equipments_box").hide()
		$(".left_nav ul li a.on_tpye").click();
	});
	// ��ͼģʽ��ť
	$("#map_mod").click(function(e) {
		e.preventDefault();
		$(this).addClass('on_select')
		$("#list_mod").removeClass('on_select')
		$(".equipments_box").show()
		$(".left_nav ul li a.on_tpye").click();
		drag_do()
	});

	// �豸��ϸ��Ϣ��ȡ����

	function zhuangtaitu(ui_dev_id) {
		// $(".atype_list_box .list_iteam").eq(0).click();
		var array_setting = []; //���������б�����
		var ui_dev_id = ui_dev_id
		var obj = $(".list_d_iteam[ui_dev_id='" + ui_dev_id + "']")
		var le_shebei = obj.attr("ui_dev_type") //�ҵ�Ҫ�鿴���豸����
		var type_img = $(".drag[ui_dev_id='" + ui_dev_id + "']").find("img").attr("src");
		var title_sheibei = obj.find("h3").text();
		$(".a_type .right_top h2").text(title_sheibei); //�޸��豸����
		$(".a_type .right_top h2").attr("ui_dev_id", ui_dev_id) //����������豸id
		$(".sele p").text("��ѡ��").attr('select_val', '');
		var offline_sms = obj.attr('offline_sms');
		// �����б������������
		obj.find('li').each(function() {
			var text = $(this).find(".name_shuxing").text()
			//alert(text)
			var ui_prop_id = $(this).attr("ui_prop_id")
			//alert(ui_dev_id)
			//$(".val_sel_list").append("<li><a ui_prop_id='" + ui_prop_id + "'>" + text + "</a></li>")
			//10��17���¼���
			var name = $(this).find('.name_shuxing').text();
			var value = $(this).find('.val_zhi').text();
			var wite = $(this).find('.units').text();
			var alert_msg = $(this).attr('class');
			// alert(wite)
			var show_level = $(this).attr("show_level")
			var setting_list = {};
			setting_list.name = name;
			setting_list.value = value;
			setting_list.wite = wite;
			setting_list.alert_msg = alert_msg;
			setting_list.data_ui_prop_id = ui_prop_id;
			setting_list.show_level = show_level;
			array_setting.push(setting_list)
		});

		if ($(".atype_list_box .list_iteam").eq(0).children()) {
			$(".atype_list_box .list_iteam").eq(0).empty();
		}
		var this_id = ui_dev_id,
			// uno = $(this).index(),
			text_title,
			tubiaoshuliang = $(this).find(".bj_show").size(); //ͼ��������
		$("#modle").check({
			dev_type: le_shebei, //����ֵ
			dev_type_name: "", //��������
			dev_start_img: type_img, //��ʼͼƬ·��
			dev_sx_list: array_setting
		});
		// alert(title_sheibei)
		//����չʾ
		$(".liandongshow").empty();
		$(".liandongshow").append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><th height='26'>�豸����</th><th>��������</th><th>Ŀ���豸</th><th>Ŀ������</th><th>Ŀ�����Բ���</th><th>����</th></tbody></table>")

		DataHandle("GetLinkList", {
			ui_dev_id: ui_dev_id
		}, liandong, loading)

		// ��ȡ�Ѿ���ȡ���豸�����б�
		$(".prop_val ul").empty();
		$(".tiaojian li").live('click', function(e) {
			if ($(this).attr("pro_value") > 6) {
				$("#prop_value2, #prop_value1").show().css({
					width: '40px',
					marginRight: '10px'
				});
			} else {
				$("#prop_value2").hide()
				$("#prop_value1").css('width', '90px');
			};
		});
		$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .name_shuxing").each(function() {
			var text = $(this).text();
			var ui_prop_id = $(this).parent().attr("ui_prop_id")
			$(".prop_val ul").append('<li pro_value="' + ui_prop_id + '">' + text + '</li>')
		});
		// ��ȡ�Ѿ���ȡ���豸�����б�
		$(".left_nav li a").each(function() {
			var tpye_dev = $(this).attr('ui_dev_type');
			var text = $(this).find('.name_type').text();
			if ($(this).find('.type_con').text() != 0) {
				$(".leixing ul").append('<li pro_value="' + tpye_dev + '">' + text + '</li>')
			};
		});

		//��ȡ������

		function getbufang(data) {
			var place_type = data.place_type //�������ͣ�0��������1��ʱ��β�����2����������place_typeΪ1ʱ�����²��������壺
			var place_begin_time = data.place_begin_time //������ʼʱ��
			var place_end_time = data.place_end_time //��������ʱ��
			var place_week_day = data.place_week_day //���ڼ������磺place_week_day =��0,1,4������ʾ�����գ�����һ�������ģ�
			var text_title = "";
			$(".bf_week input").attr("checked", false)
			place_week_day = place_week_day.split(",");
			for (var i = 0; i < place_week_day.length; i++) {
				var this_val = place_week_day[i];

				$(".bf_week input[value='" + this_val + "']").attr("checked", true)
			};


			if (place_type == "0") {
				text_title = "�Ѿ�����"
			};
			if (place_type == "2") {
				text_title = "�Ѿ�����"
			};
			if (place_type == "1") {
				text_title = "ʱ��β����ѿ���"
				$("#time1").val(place_begin_time);
				$("#time2").val(place_end_time);
			};
			$(".title_bf span").text(text_title);
		}
		DataHandle("GetPlace", {
			ui_dev_id: ui_dev_id
		}, getbufang)

		// ��ȡ�澯
		$(".baojing_box td").parent().remove()
		if (offline_sms == "0") {
			$(".set_line input").attr('checked', false);
		} else {
			$(".set_line input").attr('checked', true);
		};

		function alert_load(data) { //��ȡ�澯���html
			$.each(data, function(o, n) {
				var ui_dev_id = n.ui_dev_id;
				var ui_prop_id = n.ui_prop_id;
				var ui_prop_name = n.ui_prop_name;
				var prop_type = n.prop_type;
				var show_level = n.show_level;
				var units = n.units;
				var alarm_info = n.alarm_info; //�澯��Ϣ(���������Ը澯�ˣ������Ǹ澯�����ݣ�����Ϊ��)
				var alarm_cond = n.alarm_cond; //�澯����0:�����ø澯,1:����,2:���ڵ���,3:С��,4:С�ڵ���,5����)��Ϊ 0ʱ�����¸澯������Ч��
				var alarm_value = n.alarm_value; //�澯����ֵ
				var pre_time = n.pre_time; //Ԥ��ʱ�䣬��λ��
				var send_times = n.send_times; //�澯���ʹ���
				var send_interval = n.send_interval; //���ͼ������λ����
				if (alarm_cond != 0) {};
				var alarm_cond_text = cashu(alarm_cond)
				var add_com; //��������
				if (prop_type.indexOf("r") > -1) {
					if (alarm_cond == 0) {
						add_con = "<tr ui_dev_id='" + ui_dev_id + "' ui_prop_id = '" + ui_prop_id + "' cond='" + alarm_cond + "'><td class='name_pro' width=12% height=30>" + ui_prop_name + "</td><td width=60% colspan=5 >���޸澯����</td><td><a class='gjpz'>���ø澯</a></td></tr>";
					} else {
						add_con = "<tr ui_dev_id='" + ui_dev_id + "' ui_prop_id = '" + ui_prop_id + "' cond='" + alarm_cond + "'><td class='name_pro' width=12% height=30 cond='" + alarm_cond + "'>" + ui_prop_name + "</td><td width=12% class='alarm_cond'>" + alarm_cond_text + "</td><td width=12% class='alarm_value'>" + alarm_value + "</td><td width=12% class='pre_time'>" + pre_time + "(��) </td><td width=12% class='send_time'>" + send_times + "</td><td width=12% class='send_interval'>" + send_interval + "(����)</td><td><a class='gjpz'>�޸�����</a></td></tr>";
					}
					$(".baojing_box").find("table").append(add_con);
				}
			});
		}
		DataHandle("GetUiDevPropList", {
			ui_dev_id: ui_dev_id
		}, alert_load)
		//��ȡ�澯��

		//��ȡ��ʷ��¼
		$('.a_massge ul').empty()
		time_start()
		$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list li").each(function(i) {

			var ui_prop_id = $(this).attr('ui_prop_id');
			var text = $(this).find('.name_shuxing').text();
			if (i == 0) {
				$(".msgtype_selct").attr('pro_value', ui_prop_id).html(text)
			};
			$('.a_massge ul').append('<li pro_value="' + ui_prop_id + '">' + text + '</li>');
		})
		$("#Sear").click();
	}

	var zero_value;
	var one_value;
	var pageindex = 0
	var pagesize = 20
	$("#Sear").live('click', function() {
		pageindex = 0
		history_read()
	});
	$(".a_massge .tiaojian_list li").live('click', function() {
		pageindex = 0
	});

	function history_read() {
		var begin_time = $("#time_now1").val();
		var end_time = $("#time_now2").val();
		var ui_dev_id = $('.right_top h2').attr('ui_dev_id')
		$('.history table td').parent().remove();
		DataHandle("GetDiTrans", {
			ui_dev_id: ui_dev_id
		}, DITransHandle);

		function DITransHandle(data) {
			if (data) {
				zero_value = data.zero_value;
				one_value = data.one_value;
				// $(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list li").each(function() {
				var ui_dev_id = $('.right_top h2').attr('ui_dev_id')
				var ui_prop_id = $(".msgtype_selct").attr('pro_value');
				var name = $(".msgtype_selct").text();

				function histry_load(data) {
					$.each(data, function(i, n) {
						var prop_value = n.prop_value;
						var rec_time = n.rec_time;
						if ((zero_value != undefined) && (one_value != undefined)) {
							if (prop_value == "0") {
								prop_value = zero_value;
							}
							if (prop_value == "1") {
								prop_value = one_value;
							}
						} else {
							prop_value = prop_value;
						}
						var con_tex = "<tr><td>" + name + "</td><td>" + prop_value + "</td><td align='center'>" + rec_time + "</td></tr>";
						$(".history table tr:first").after(con_tex);

					})
				}
				DataHandle("GetHisData", {
					ui_dev_id: ui_dev_id,
					ui_prop_id: ui_prop_id,
					page_index: pageindex,
					page_size: pagesize,
					begin_time: begin_time,
					end_time: end_time
				}, histry_load, loading);

			}
		}
	}
	$(".page_prev").live('click', function(e) {
		if (pageindex == 0) {
			alert("�Ѿ��ǵ�һҳ")
			return false
		};
		pageindex -= 1
		history_read()
		// $("#Sear").click();
	});
	$(".page_next").live('click', function(e) {
		var leng_t = $(".history td").parent().size();
		// alert(leng_t)
		if (leng_t < 20) {
			alert("�Ѿ������һҳ")
			return false;
		};
		pageindex += 1
		history_read()
		// $("#Sear").click();
	});



	// ���ø澯
	$(".set_line input").live('click', function(e) {
		var ui_dev_id = $(".right_top h2").attr('ui_dev_id');
		var check = $(this).find('input')
		var offline_sms = null
		if ($(".set_line input").is(":checked")) {
			offline_sms = 1
		} else {
			offline_sms = 0
		};

		function setlineoffcdma(data) {

			if (offline_sms == 0) {
				alert("�Ѿ��������߲����ͱ�������");
				$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "']").attr('offline_sms', '0');
			} else {
				alert("�Ѿ�����������Ȼ���ͱ�������");
				$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "']").attr('offline_sms', '1');
			};
		}
		DataHandle("ModUiDev", {
			ui_dev_id: ui_dev_id,
			offline_sms: offline_sms
		}, setlineoffcdma, loading)
	});


	$(".gjpz").live('click', gj_click);

	function gj_click() {
		var ui_dev_id = $(this).parents("tr").attr("ui_dev_id");
		var ui_prop_id = $(this).parents("tr").attr("ui_prop_id");
		var ui_prop_name = $(this).parents("tr").find(".name_pro").text();
		var alarm_cond = $(this).parents("tr").find(".alarm_cond").text();
		var alarm_value = $(this).parents("tr").find(".alarm_value").text();
		var pre_time = $(this).parents("tr").find(".pre_time").text().split("(");
		var send_time = $(this).parents("tr").find(".send_time").text();
		var send_interval = $(this).parents("tr").find(".send_interval").text().split("(");
		var cond = $(this).parents("tr").attr("cond");
		$(".tanchu_gjing h2").append("(<span>" + ui_prop_name + "</span>)");
		$(".tanchu_gjing").attr({
			"ui_dev_id": ui_dev_id,
			"ui_prop_id": ui_prop_id
		}).show();
		$("#add-over-layer").show();
		if (cond == "0") {
			return false;
		} else {
			$(".sele .choose").text(alarm_cond);
			$(".sele .choose").attr("pro_value", cond)
			$("#bj_value1").val(alarm_value);
			$("#bj_shijian").val(pre_time[0]);
			$("#bj_cishu").val(send_time);
			$("#bj_jiange").val(send_interval[0]);
		}
	};
	$(".gj_tiaojian .tiaojian_list li").live("click", function() {
		var alarm_cond = $(this).attr("pro_value");

		if (alarm_cond == 0) {
			$(".gj_select_set").find("input").each(function() {
				$(this).val("");
				$(this).attr("disabled", "disabled");
			});
		} else {
			$(".gj_select_set").find("input").each(function() {
				$(this).removeAttr("disabled");
			});
		}
	});
	$(".add_gj").live('click', change_gj);

	function change_gj() {
		var ui_dev_id = $(".tanchu_gjing").attr("ui_dev_id");
		var name_pro = $(".tanchu_gjing h2 span").text();
		var ui_prop_id = $(".tanchu_gjing").attr("ui_prop_id");
		var alarm_cond = $(".gj_tiaojian .choose").attr("pro_value");
		var alarm_cond_value = $(".gj_tiaojian .choose").val();
		var alarm_value = $("#bj_value1").val();
		var pre_time = $("#bj_shijian").val();
		var send_times = $("#bj_cishu").val();
		var send_interval = $("#bj_jiange").val();
		var custom_alarm_info = $("#bj_sendtext").val();
		var data_all;
		if (alarm_cond == "0") {
			data_all = {
				ui_dev_id: ui_dev_id,
				ui_prop_id: ui_prop_id,
				alarm_cond: alarm_cond
			}
		} else {
			if (alarm_value == "" || pre_time == "" || send_times == "" || send_interval == "") {
				alert("��������ֵ");
				return false
			} else {
				data_all = {
					ui_dev_id: ui_dev_id,
					ui_prop_id: ui_prop_id,
					alarm_cond: alarm_cond,
					alarm_value: alarm_value,
					pre_time: pre_time,
					send_times: send_times,
					send_interval: send_interval,
					custom_alarm_info: custom_alarm_info
				}
			}
		}

		function newbaojing(data) {
			if (data) {
				alert(data.error_msg)
			} else {
				alert("���óɹ�");
				var add_con;
				var alarm_cond_text = cashu(alarm_cond);
				if (alarm_cond == 0) {
					add_con = "<tr ui_dev_id = '" + ui_dev_id + "'ui_prop_id='" + ui_prop_id + "' cond='" + alarm_cond + "'><td class='name_pro' width=12% height=30>" + name_pro + "</td><td colspan='5'>���޸澯����</td><td><a class='gjpz'>���ø澯</a></td></tr>";
				} else {
					add_con = "<tr ui_dev_id='" + ui_dev_id + "' ui_prop_id = '" + ui_prop_id + "'cond='" + alarm_cond + "'><td class='name_pro' width=12% height=30>" + name_pro + "</td><td width=12% class='alarm_cond'>" + alarm_cond_text + "</td><td width=12% class='alarm_value'>" + alarm_value + "</td><td width=12% class='pre_time'>" + pre_time + "(��)</td><td width=12% class='send_time'>" + send_times + "</td><td width=12% class='send_interval'>" + send_interval + "(����)</td><td><a class='gjpz'>�޸�����</a></td></tr>";
				}
				$(".baojing_box tr[ui_prop_id='" + ui_prop_id + "']").replaceWith(add_con);
				$(".quxiao_shux").click();

			};
		}
		DataHandle("ModUiProp", data_all, newbaojing, loading)
	}
	// ����豸���Ͷ�ȡ�豸����
	$(".leixing ul li").live("click", function(event) {
		var pro_value = $(this).attr("pro_value");
		$(".shebei ul").empty();
		$(".mubiaoshuxing ul").empty();
		$(".list_d_iteam[ui_dev_type='" + pro_value + "']").each(function() {
			var text = $(this).find('h3').text()
			var ui_dev_id = $(this).attr("ui_dev_id")
			$(".shebei .shebei_select").text("��ѡ��").removeAttr("pro_value");
			$(".mubiaoshuxing .mubiaoshuxing_select").text("��ѡ��").removeAttr("pro_value");
			$(".shebei ul").append('<li pro_value="' + ui_dev_id + '">' + text + '</li>')
			// ��ȡ����д���豸����

			function selec_inter(data) {
				$.each(data, function(i, n) {
					var ui_prop_id = n.ui_prop_id //:Ӧ������ID
					var ui_prop_name = n.ui_prop_name //Ӧ����������
					var prop_type = n.prop_type //��������
					if (prop_type.indexOf("w") > -1) {

						$(".mubiaoshuxing ul").append('<li pro_value="' + ui_prop_id + '">' + ui_prop_name + '</li>')
					};
				});
			}
			DataHandle("GetUiDevPropList", {
				ui_dev_id: ui_dev_id
			}, selec_inter, loading)
		});
	});

	$(".mubiaoshuxing ul li").live('click', function(e) {
		var prop_type = $(this).attr('pro_value');
		var ui_dev_type = $(".leixing_select").attr("pro_value");

		// �ж��Ƿ�cdma
		if (ui_dev_type == "2800") {
			// alert(ui_dev_type)
			if (prop_type == 0) { // ���Ͷ���
				var input_html = "<p class='menu_title'>�绰����: </p> <input id='des_prop_value' type='text' style='float:left; margin-right:10px; width:90px;'> <p class='menu_title' style='margin-top:15px;'>��������: </p><textarea id='des_prop_value1' type='text' style='float:left; width:130px;border: 1px solid #000; background:none; color:#fff; line-height: 18px;margin: 4px 0;padding: 2px 5px; height:45px;margin-top:15px;'></textarea>"

				$(".ld_inter").empty().append(input_html).show();
			} else if (prop_type == 1) { // ����绰
				var input_html = "<p class='menu_title'>�绰����: </p> <input id='des_prop_value' type='text' style='float:left; margin-right:10px; width:90px;'>"
				$(".ld_inter").empty().append(input_html).show();
			}
		} else {
			var input_html = "<p class='menu_title'>Ŀ������ֵ: </p> <input id='des_prop_value' type='text'>"
			$(".ld_inter").empty().append(input_html).show();
		};;
	});
	// ����豸��ȡ�豸��������
	// $(".shebei ul li").live("click", function(event) {
	// 	var pro_value = $(this).attr("pro_value");

	// 	// $(".list_d_iteam[ui_dev_id='" + pro_value + "'] .prop_list li").each(function() {
	// 	// 	var text = $(this).find('.name_shuxing').text()
	// 	// 	var ui_prop_id = $(this).attr("ui_prop_id")
	// 	// 	$(".mubiaoshuxing .mubiaoshuxing_select").text("��ѡ��").removeAttr("pro_value");
	// 	// 	$(".mubiaoshuxing ul").append('<li pro_value="' + ui_prop_id + '">' + text + '</li>')
	// 	// });
	// });

	// ���������������
	$(".add_liandong").live('click', function(e) {
		$(".liandongadd").show();
	});
	//ȡ����������
	$(".quxiao_shux").live('click', function(e) {
		e.preventDefault()
		$(".liandongadd").hide()
		$(".liandongadd input").val("");
		$(".tiaojian_list").prev().text("��ѡ��").removeAttr('pro_value');
		$(".tanchu_gjing h2").text("�澯����")
		$(".tanchu_new, .tanchu_gjing").hide();
		$(".tanchu_new").hide();
		$(".ld_inter").hide();
		$("#prop_value2").hide();
		$(".tanchu_new input, .tanchu_gjing input").val("");
		$(".tanchu_new input").val("");
		$(".tanchu_dev_add").hide();
		$("#add-over-layer").hide();
		$("#bj_sendtext").val("");
	});

	// ��������
	$(".add_shux").live("click", function(e) {
		e.stopPropagation();
		var ui_dev_id = $(".a_type h2").attr("ui_dev_id")
		var ui_prop_id = $(".prop_select").attr("pro_value")
		var prop_cond = $(".tiaojian_select").attr("pro_value")
		var prop_value1 = $("#prop_value1").val()
		var prop_value2 = $("#prop_value2").val()
		var des_ui_dev_id = $(".shebei_select").attr("pro_value")
		var des_ui_prop_id = $(".mubiaoshuxing_select").attr("pro_value")
		var des_prop_value = $("#des_prop_value").val();
		var des_prop_value1 = $("#des_prop_value1").val();
		if (des_prop_value1 != undefined) {
			des_prop_value = des_prop_value + "," + des_prop_value1
		};

		function ldadd(data) {
			if (data) {
				if (data.error_msg) {
					alert(data.error_msg)
				} else {
					$.ajax({
						type: "get",
						url: GetUrl("GetLinkList"),
						data: {
							ui_dev_id: ui_dev_id
						},
						dataType: "jsonp",
						contentType: "application/json;charset=gb2312",
						success: function(GetLinkList) {
							$(".liandongshow table td").parents("tr").empty();
							liandong(GetLinkList);
							$(".no_msg").remove();
							close_chushi();
							alert("���������ɹ�");
						}
					})
				}
			};
		}
		DataHandle("AddLink", {
			ui_dev_id: ui_dev_id,
			ui_prop_id: ui_prop_id,
			prop_cond: prop_cond,
			prop_value1: prop_value1,
			prop_value2: prop_value2,
			des_ui_dev_id: des_ui_dev_id,
			des_ui_prop_id: des_ui_prop_id,
			des_prop_value: des_prop_value
		}, ldadd)
	});

	//ɾ������
	$(".delete_ld").live("click", function() {
		var link_id = $(this).attr("link_id");
		var result1 = confirm("ȷ��ɾ��������¼��?")
		if (result1) {
			$this_ptr = $(this).parents("tr");
			//DataHandle("DelLink", {link_id:link_id}, delete_ld)
			$.ajax({
				type: "get",
				url: GetUrl("DelLink"),
				dataType: "jsonp",
				data: {
					link_id: link_id
				},
				contentType: "application/json;charset=gb2312",
				success: function(data) {
					//alert("ɾ���ɹ�");
					$this_ptr.remove();
				}
			});
		} else {
			return false
		}
	});

	// ��ȡ����

	function liandong(ldval) {
		if (!ldval) {
			$(".liandongshow").append("<div class='no_msg' style='font-size:18px; font-weight:bold; line-height:200px; text-align:center;'>����������Ϣ</div><a class='add_liandong'>��������</a>")
		} else {
			$.each(ldval, function(px, j) {
				//alert(px)
				var ui_dev_name = j.ui_dev_name //�豸��������
				var ui_prop_name = j.ui_prop_name //����ֵ
				var ui_prop_id = j.ui_prop_id //����ֵID
				var prop_cond = j.prop_cond // ����ID
				var prop_value1 = j.prop_value1 //����1
				var prop_value2 = j.prop_value2 //����2
				var des_ui_dev_name = j.des_ui_dev_name //Ŀ����������
				var link_id = j.link_id //Ŀ��״ֵ̬ID
				var des_ui_prop_id = j.des_ui_prop_id //Ŀ������
				var des_prop_value = j.des_prop_value //Ŀ����������ֵ
				var des_ui_dev_id = j.des_ui_dev_id //Ŀ��ID
				var des_ui_prop_name = j.des_ui_prop_name
				var link_id = j.link_id;

				//�ж�����
				if (prop_cond == 1) {
					var tiaojian = ">" + prop_value1
				}
				if (prop_cond == 2) {
					var tiaojian = ">=" + prop_value1
				}
				if (prop_cond == 3) {
					var tiaojian = "<" + prop_value1
				}
				if (prop_cond == 4) {
					var tiaojian = "<=" + prop_value1
				}
				if (prop_cond == 5) {
					var tiaojian = "=" + prop_value1
				}
				if (prop_cond == 6) {
					var tiaojian = "!=" + prop_value1
				}
				if (prop_cond == 7) {
					var tiaojian = ">=" + prop_value1 + " ���� <=" + prop_value2
				}
				if (prop_cond == 8) {
					var tiaojian = "<=" + prop_value1 + " ���� <=" + prop_value2
				}
				$(".liandongshow table").append("<tr><td>" + ui_prop_name + "</td><td>" + tiaojian + "</td><td>" + des_ui_dev_name + "</td><td>" + des_ui_prop_name + "</td><td>" + des_prop_value + "</td><td><a link_id='" + link_id + "' class='delete_ld'>ɾ������</a></td></tr>")

			})
			$(".liandongshow").append("<a class='add_liandong'>��������</a>")
		}
	}

	// ���Ӳ�����
	$(".sed_bf_sz").live("click", function(e) {
		e.preventDefault()
		var ui_dev_id = $(".a_type h2").attr("ui_dev_id");
		var place_type = "1";
		var place_begin_time = $("#time1").val();
		var place_end_time = $("#time2").val();
		var arr = []
		$(".bf_week input:checked").each(function(i) {
			var this_val = $(this).val();
			arr[i] = this_val;
		});
		var place_week_day = arr.join(",")
		var data = {
			ui_dev_id: ui_dev_id,
			place_type: place_type,
			place_begin_time: place_begin_time,
			place_end_time: place_end_time,
			place_week_day: place_week_day
		};

		function setbufang(data) {
			var place_sts = data.place_sts;
			var error_msg = data.error_msg;
			if (error_msg) {
				alert(error_msg)
			} else {
				// $("#2.box_li").parents(".drag").find(".ctrlkg").children("a").removeClass().addClass("bufang_on");
				// $(".title_bf span").text("ʱ��β����ѿ���");
				if (place_sts == "0") {

					$(".drag[ui_dev_id='" + ui_dev_id + "']").find('.ctrlkg').children('span').removeClass().addClass("bufang_off")
					$(".zhuantai").html("<span></span>������")
					$(".title_bf span").text("������");
					// $(".ctrlkg span").removeClass().addClass("bufang_off")
				} else {
					$(".drag[ui_dev_id='" + ui_dev_id + "']").find('.ctrlkg').children('span').removeClass().addClass("bufang_on")
					$(".zhuantai").html("<span></span>������")
					$(".title_bf span").text("������");
				};
				alert("��ʱ��β����ɹ�")
			}
			// body...
		}
		DataHandle("SetPlace", data, setbufang)
	});

	// ��������
	$(".sed_bf_lk").live('click', function(e) {
		e.preventDefault()
		var ui_dev_id = $(".a_type").find('h2').attr("ui_dev_id")
		var data = {
			ui_dev_id: ui_dev_id, //Ӧ���豸ID
			place_type: 0 //��������
		}

			function Setpl(data) {

				var place_sts = data.place_sts;
				var error_msg = data.error_msg;
				if (error_msg) {
					alert(error_msg);
				} else {
					alert("���������ɹ�")
					$(".title_bf span").text("������");
				};

			}
		DataHandle("SetPlace", data, Setpl, loading)
	});
	// ��������
	$(".sed_cf_lk").live('click', function(e) {
		e.preventDefault()
		var ui_dev_id = $(".a_type").find('h2').attr("ui_dev_id")
		var data = {
			ui_dev_id: ui_dev_id, //Ӧ���豸ID
			place_type: 2 //��������
		}

			function Setpl1(data) {
				$.each(data, function(i, n) {
					var place_sts = n.place_sts;
					var error_msg = n.error_msg;
					if (error_msg) {
						alert(error_msg);
					} else {
						alert("���������ɹ�")
						$(".title_bf span").text("������");
					};
				});
			}
		DataHandle("SetPlace", data, Setpl1, loading)
	});


	// ����ѡ��˵�

	function selet() {
		$(".tiaojian_list li").live("click", function(e) {
			e.stopPropagation()
			// alert($(this).text())
			$(this).parent().hide();
			var pro_value = $(this).attr('pro_value');
			$(this).parent().prev().attr("pro_value", pro_value);
			$(this).parent().prev().text($(this).text())
		});
		$(".tiaojian_list").prev().click(function(e) {
			e.stopPropagation()
			if ($(this).next().is(":hidden")) {
				$(".tiaojian_list").hide();
				$(this).next().show();
			} else {
				$(".tiaojian_list").hide();
			};
		});
		$(document).click(function(e) {
			$(".tiaojian_list").hide();
		});
	}

	// �رճ�ʼ��

	function close_chushi() {
		$(".quxiao_shux").click();
	}


	// �Ҽ��˵����
	$(".rightmenu a").live('click', function(e) {
		$(".tpye_box_list").hide();
		$(".a_type").show();
		var ui_dev_id = $(this).attr("ui_dev_id")
		var index_me = $(this).index()
		zhuangtaitu(ui_dev_id)
		$(".chage_click li").eq(index_me).click();
		$("body").css('overflow', '');
		// alert(ui_dev_id)
		// �½���ѡs
	});
	$(".list_d_iteam").live("click", function(e) {
		$(".tpye_box_list").hide();
		$(".a_type").show();
		var ui_dev_id = $(this).attr("ui_dev_id")
		$(".chage_click li").eq(0).click();
		zhuangtaitu(ui_dev_id)

	});
	// �رյ�����ť
	$(".a_type .close_paren").live("click", function(e) {
		$(this).parent().hide();
		$(".tpye_box_list").show()
		close_chushi()
		$(".leixing .tiaojian_list").empty()
		body_style()
	});
	// ��ͼȫ��
	$(".ctr_map span").live('click', function(e) {
		full_map();
		drag_do()
	});
	$(".ctr_map_out span").live('click', function(e) {
		exit_full_map();
		drag_do()
	});

	// ���������豸��ͼ��ʾ
	$(".add_dev").live('click', function(e) {
		$("#add-over-layer").show();
		$(".tanchu_dev_add").show();
		find_dev_name()
	});

	// ���Ӻ�ɾ����ͼ��ʾ�豸
	$(".add_sb").live('click', function(e) {
		add_sc();
	});

	function add_sc() {
		$(".dev_sb_list li").each(function() {
			var inmap = $(this).find('input').attr('checked');
			var ui_dev_id = $(this).attr('ui_dev_id');
			var in_map = 0
			$(".drag[ui_dev_id='" + ui_dev_id + "']").hide().attr('in_map', '0');
			if (inmap == "checked") {
				in_map = 1;
				$(".drag[ui_dev_id='" + ui_dev_id + "']").show().attr('in_map', '1');
			};
			var data = {
				ui_dev_id: ui_dev_id,
				in_map: in_map
			}

				function send(data) {}
			DataHandle("ModUiDev", data, send, loading)
		});
		alert("�����ɹ�");
		$(".quxiao_shux").click();
	}

	// �ҵ������豸

	function find_dev_name() {
		var ui_dev_type = $(".left_nav ul li a.on_tpye").attr('ui_dev_type');
		$(".dev_sb_list ul").empty();
		$(".drag[ui_dev_type='" + ui_dev_type + "']").each(function() {
			var dev_name = $(this).find('.handle_bott').text();
			var in_map = $(this).attr('in_map');
			var ui_dev_id = $(this).attr("ui_dev_id")
			var checked = ""
			if (in_map != 0) {
				checked = 'checked="checked"'
			};
			$(".dev_sb_list ul").append('<li ui_dev_id="' + ui_dev_id + '" in_map="' + in_map + '"><span>' + dev_name + '</span><input type="checkbox" ' + checked + ' value="" /></li>')
		});
	}


	// CDMA���Ͷ���
	$(".sd_ms_bot").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var ui_prop_id = 0;
		var prop_value1 = $(".haoma").val()
		var prop_value2 = $(".con_massage").val()
		var prop_value = prop_value1 + "," + prop_value2

		if (prop_value1 == "") {
			alert("�����������绰")
			return false;
		}
		if (prop_value2 == "") {
			alert("�������������")
			return false;
		};
		if (isNaN(prop_value1) || prop_value1.length < 5 || prop_value1.length > 16) {
			alert("��������ȷ�绰����");
			return false;
		};;
		var data_massage = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value // prop_value:��ֵ
		}
		// alert(data_massage.prop_value)

			function send_massge(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("���Ͷ��ųɹ�")
				};
			}
		DataHandle("WriteUiDevProp", data_massage, send_massge, loading)
	});
	// CDMA���Ͳ���绰
	$(".sd_phone_bot").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var ui_prop_id = 1;
		var prop_value = $(".haoma").val()
		if (prop_value == "") {
			alert("�����������绰")
			return false;
		}
		if (isNaN(prop_value) || prop_value.length < 5 || prop_value.length > 16) {
			alert("��������ȷ�绰����");
			return false;
		};;
		var data_massage = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value // prop_value:��ֵ
		}
		// alert(data_massage.prop_value)

			function send_massge(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("����绰�ɹ�")
				};
			}
		DataHandle("WriteUiDevProp", data_massage, send_massge, loading)
	});

	// �յ�����
	$(".send_pz").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var ui_prop_id = $(".cont_in input:checked").parents("li").attr("ui_prop_id");
		var prop_value = $("#SliderSingle").val();
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value // prop_value:��ֵ
		}
		// alert(ui_prop_id)

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("���Ϳ�������ɹ�")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});
	// �յ��ػ�
	$(".close_sb").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: "5" // ui_prop_id:Ӧ������ID
		}

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("�ػ��ɹ�")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});

	// ���ÿյ�����
	$(".open_kt").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: "0", // ui_prop_id:Ӧ������ID
			prop_value: "1"
		}

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("�����ɹ�")
					$(".show_zt").removeClass('guanbi').addClass('kaiqi').html("<span></span>�ѿ���")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});

	// ���ÿյ��ػ�
	$(".close_kt").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: "0", // ui_prop_id:Ӧ������ID
			prop_value: "0"
		}

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("�ػ��ɹ�")
					$(".show_zt").removeClass('kaiqi').addClass('guanbi').html("<span></span>�ѹر�")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});
	// ���ÿյ�����
	$(".queren_botton").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var prop_value = $(this).prev().find('input:checked').parents("li").attr("units");
		var ui_prop_id = $(this).attr("ui_prop_id")

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("���óɹ�")
				};
			}
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value
		}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});

	$(".wendu_quren").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var prop_value = $(this).prev().find('input').val();
		var ui_prop_id = $(this).attr("ui_prop_id")

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("���óɹ�")
				};
			}
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value
		}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});

	// ����豸����
	$(".kaiguan .dakai").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var prop_value = "1"
		var ui_prop_id = $(this).parents(".ctl_masg").attr("ui_prop_id")
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value
		}

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("�򿪳ɹ�");
					$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list li[ui_prop_id='" + ui_prop_id + "']").find('.val_shuxing').text("��")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});
	$(".kaiguan .guanbi").live('click', function(e) {
		var ui_dev_id = $(this).parents(".a_type").find('.right_top').find('h2').attr("ui_dev_id");
		var prop_value = "0"
		var ui_prop_id = $(this).parents(".ctl_masg").attr("ui_prop_id")
		var data_kt = {
			ui_dev_id: ui_dev_id, // ui_dev_id:Ӧ���豸ID
			ui_prop_id: ui_prop_id, // ui_prop_id:Ӧ������ID
			prop_value: prop_value
		}

			function send_ktpz(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					alert("�رճɹ�")
					$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list li[ui_prop_id='" + ui_prop_id + "']").find('.val_shuxing').text("��")
				};
			}
		DataHandle("WriteUiDevProp", data_kt, send_ktpz, loading)
	});


	// �޸���������
	$(".shuxi .name").live('click', function(e) {
		e.preventDefault();
		var text = $(this).text()
		var ui_prop_id = $(this).parent().attr("data_ui_prop_id");
		var ui_dev_id = $(".right_top h2").attr("ui_dev_id");
		var biaopan_id = $(this).parent().attr("biaopan_id");
		$("#new_name").val(text).attr({
			"ui_prop_id": ui_prop_id,
			"ui_dev_id": ui_dev_id,
			"biaopan_id": biaopan_id
		});

		function getbile(data) {
			$.each(data, function(i, n) {
				var ui_base = n.ui_base //ת����ֵ
				var ui_scale = n.ui_scale //:ת������
				var ui_prop_id_stmep = n.ui_prop_id
				if (ui_prop_id_stmep == ui_prop_id) {
					$("#new_base").val(ui_base)
					$("#new_scale").val(ui_scale)
				};
			});
			open("user-add-container");
		}
		DataHandle("GetUiDevPropList", {
			ui_dev_id: ui_dev_id
		}, getbile, loading)

	});

	$("#u_cancel").live('click', function(e) {
		$(".u_body").val("");
	});

	$(".add_name_botton").live('click', function(e) {
		var ui_prop_id = $("#new_name").attr("ui_prop_id");
		var ui_dev_id = $("#new_name").attr("ui_dev_id");
		var biaopan_id = $("#new_name").attr("biaopan_id");
		var ui_prop_name = $("#new_name").val();
		var ui_base = $("#new_base").val();
		var ui_scale = $("#new_scale").val()
		var data_kt = {
			ui_dev_id: ui_dev_id,
			ui_prop_id: ui_prop_id,
			ui_prop_name: ui_prop_name,
			ui_base: ui_base,
			ui_scale: ui_scale
		}

			function chengename(data) {
				if (data) {
					alert(data.error_msg);
				} else {
					$(".shuxi[data_ui_prop_id='" + ui_prop_id + "'] .name").text(ui_prop_name);
					$(".list_d_iteam[ui_dev_id='" + ui_dev_id + "'] .prop_list li[ui_prop_id='" + ui_prop_id + "'] .name_shuxing").text(ui_prop_name)
					if (biaopan_id != "undefined") {
						$("." + biaopan_id).prev().text(ui_prop_name)
						$("#" + biaopan_id).find('tspan').first().text(ui_prop_name)
					};
					alert("�޸ĳɹ�");
					$("#u_cancel").click();
				};
			}
		DataHandle("ModUiProp", data_kt, chengename, loading)
	});

})