// ��ȡʵʱ�澯����

function alert_list() {
	function alert_load_n(data) {
		var alert_nober = data.length
		$(".alert_msg a").text(alert_nober)
		// alert(alert_nober)
	}
	DataHandle("GetCurrentAlarm", {}, alert_load_n, loading)
}
/* 
	�л�ͨ�ö��� tab_change
	���� ��
	clickobj:�������
	chengeobj:��Ӧ����л��Ķ���
	onsele_class�������ǰ��clss
*/

function tab_change(clickobj, chengeobj, onsele_class) {
	this.clickobj = clickobj;
	this.chengeobj = chengeobj;
	this.onsele_class = onsele_class;
}
tab_change.prototype = {
	click_change: function() {
		var clickobj = this.clickobj;
		var chengeobj = this.chengeobj;
		var onsele_class = this.onsele_class;
		$(clickobj).click(function(e) {
			var index_click = $(this).index(clickobj);
			$(this).addClass(onsele_class).siblings().removeClass(onsele_class)
			$(chengeobj).eq(index_click).show().siblings().hide()
		});
	}
}

// ��

function open(openid) {
    var w = $(window).width() / 2 - $("#" + openid).outerWidth() / 2;
    var h =  $(window).height() / 2 - $("#" + openid).outerHeight() / 2
    $("#" + openid).css({
        top: h,
        left: w
    });
    $("#add-over-layer").show();
    $("#" + openid).show();
}
// �ر�

function conClose(closid) {
    $("#add-over-layer").hide();
    $("#" + closid).hide();
    var w = $(window).width() / 2 - $("#" + openid).outerWidth() / 2;
    var h =  $(window).height() / 2 - $("#" + openid).outerHeight() / 2
    // alert(w)
    $("#" + closid).css({
        top: h,
        left: w
    });
}

// ���������û���Ϣ===============================
// ����ʾ��
/*
		var user_mssage = new reUser();
		user_mssage.user_name()   ���ص�ǰ�û�����
		user_mssage.user_id() 	  ���ص�ǰ�û�id
		user_mssage.role_type()   ���ص�ǰ�û�����
		*/

function reUser() {
	// ���ص�ǰȫ����
	this.window_url = function() {
		var url_a = window.location.href
		return url_a
	};
	// ���ص�ǰ�û�����
	this.user_name = function() {
		var user_name;
		var url = this.window_url();
		var temp = url.split("&")
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].indexOf("UserName") > -1) {
				var temp_in = temp[i].split("=")
				user_name = temp_in[1];
				break;
			};
		};
		// alert(user_name)
		return user_name
	};
	// ���ص�ǰ�û�id
	this.user_id = function() {
		var user_id;
		var url = this.window_url();
		var temp = url.split("&")
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].indexOf("user_id") > -1) {
				var temp_in = temp[i].split("=")
				user_id = temp_in[1];
				break;
			};
		};
		// alert(user_id)
		return user_id
	};
	// ���ص�ǰ�û�����
	this.role_type = function() {
		var role_type;
		var url = this.window_url();
		var temp = url.split("&")
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].indexOf("role_type") > -1) {
				var temp_in = temp[i].split("=")
				role_type = temp_in[1];
				break;
			};
		};
		// alert(role_type)
		return role_type
	};
}

// ���������û���Ϣ ��==============================

// ����ͷ��=============================

function header(interClass) {
	this.interClass = interClass;
	this.html = '<div class="user_mssage"><div class="top_width">��ǰ��¼�û���<span class="use_n">admin</span>��<span class="role_type">��ͨ�û�</span>�� <a class="cur_po exit" href="../index.html">�˳���¼</a></div></div><div class="nav_top_new"><div class="top_width"><h1></h1><ul><li><a href="web_one.html">�豸��Ϣ</a></li><li><a href="InstallDevice_new.html">�豸��װ</a></li><li><a href="pue.html">PUE</a></li><li><a href="power.html">�ܺ�</a></li><li><a href="user.html">�û�����</a></li><li><a href="room.html">��������</a></li><li><a href="type_list_all.html">�����ſ�</a></li></ul></div>';
	// ���ص�ǰȫ����
	this.window_url = window.location.href;
	this.apphtml = function() {
		var loca_href = this.window_url;
		$("." + this.interClass).before(this.html);
		var user_mssage = new reUser();
		if (user_mssage.role_type() == 1 || user_mssage.role_type() == 0) {
			var type_user = "����Ա�˺�"

		} else {
			var type_user = "��ͨ�˺�"
			// ��ͨ�˺�Ȩ��ɾ��������
			$(".nav_top_new li").eq(1).remove().end().eq(4).remove().end().eq(5).remove()
		};
		// ���Ӷ��������mapҳ��
		if (loca_href.indexOf("room_type=2")>-1) {
			$(".exit").after(' <a class="cur_po return_index" href="web.html" style="color:#fff">���ص�ͼ</a>')
		};
		$(".return_index").live('click', function(e) {
			e.preventDefault();
			var loca_href_a = $(this).attr('href');
			var sli = loca_href_a.split("&")
			var new_href = "";
			for (var i = 0; i < sli.length; i++) {
				if (sli[i].indexOf("transmit_room_ip")>-1 || sli[i].indexOf("transmit_room_port")>-1) {
					break;
				};
				if (sli[i].indexOf("role_type")>-1) {
					new_href = new_href+sli[i]
				}else{
					new_href = new_href+sli[i]+"&"
				};
			};
			window.location.href = new_href
		});
		$(".use_n").text(user_mssage.user_name());
		$(".role_type").text(type_user)
		$(".nav_top_new li a").each(function() {
			var src_link = $(this).attr("href")
			// �����ַ������ǰ�����ӵĵ�ַ����ó����Ӹ���
			if (loca_href.indexOf(src_link) > -1) {
				$(this).addClass('nav_on');
			};
		});
		// �����ַ�����Զ�ҳ�棬��ָ�������Ӹ���
		if (loca_href.indexOf("type_list.html") > -1 || loca_href.indexOf("history.html") > -1 || loca_href.indexOf("alert.html") > -1 || loca_href.indexOf("phone.html") > -1) {
			$(".nav_top_new li a").eq(0).addClass('nav_on');
		};
		if (loca_href.indexOf("web.html") > -1) {
			$(".nav_top_new ul").remove();
			$(".return_index").remove();
			$(".nav_top_new h1").text("���ض�������ϵͳ-���������չʾ")
		};

		function attr_gs(data) {

			if (data) {
				var param_value = data.param_value;
				$(".nav_top_new h1").text(param_value)
			} else {
				$(".nav_top_new h1").text("���ؿƼ�")
			};
		}
		var name_gs_data = {
			param_key: "gs_name"
		}
		DataHandle("GetSysParam", name_gs_data, attr_gs)
	};
}
// ����ͷ�� ��==========================

/*
������ Time:       �˳�ǰ�ľ���ʱ��
���ܣ� ��ʱ�˳���¼
*/

function TimeExit(Time) {
	window.setTimeout(function() {
		window.location.href = "../index.html";
	}, Time);
}


/*
    ������
    ����ֵ��
    ����:             �����û������ò�ͬ��Ȩ��
*/

function User() {
	var user_name;
	var user_id;
	//  user_name = $.query.get("UserName");        //�û���
	//   user_id = $.query.get("user_id");           //�û�ID

}

function Getip() {
	var addr = document.location.host;
	var IpAddr = (addr == "") ? "localhost" : document.location.host;
	//    var IpAddr = "192.168.2.251";
	IpAddr = IpAddr.split(":")[0];
	return (IpAddr);
}

$(function() {
	//���URL���������ͨ��������֤��¼����ת����¼ҳ��
	var Addr = window.location.href;
	var tmp = Addr.split("?");
	if (typeof tmp[1] == "undefined") {
		window.location.href = "../index.html";
	}
	//�ж��Ƿ�����
	var addr = document.location.href;
	// alert(addr)
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
			$.ajaxSetup({
				data: {
					"transmit_room_ip": transmit_room_ip,
					"transmit_room_port": transmit_room_port
				}
			});

			var img_src = $("#img_id").attr("src");
			if (img_src != undefined) {
				var img_e = img_src.split("..")
				$("#img_id").attr("src", "../images/upload_bg/" + transmit_room_ip + ".png")
			};


		};
	};
	User();
	alert_list();
	// ����setHock
	StartComet();
	// ���ù���ͷ��
	var new_header = new header("nav_top")
	new_header.apphtml();
	var chage_alert = function(SetHook) {
		$.each(SetHook, function(i, n) {
			// ʵʱˢ�¸澯
			if (n.alarm) {
				var alarm1 = n.alarm;
				var alarm_ui_dev_id1 = alarm1.ui_dev_id;
				var alarm_ui_prop_id1 = alarm1.ui_prop_id;
				var alarm_info = alarm1.alarm_info
				var ui_dev_name = alarm1.ui_dev_name
				var ui_prop_name = alarm1.ui_prop_name
				// alert(alarm_ui_prop_id)
				var alarm_x = parseInt($(".alert_msg a").text());
				alarm_x += 1;
				$(".alert_msg a").text(alarm_x);
				var text_and = $(".alert_msg a").text()
				$("body").append('<div class="alert_tc" alarm_x="' + alarm_ui_dev_id1 + alarm_ui_prop_id1 + '"><span class="guanbi_alert">X</span><h2>ʵʱ�澯��Ϣ</h2><div class="sb_alert">�澯�豸��<span>' + ui_dev_name + '</span></div><div class="sx_alert">�澯���ԣ�<span>' + ui_prop_name + '</span></div><div class="con_alert">�澯���ݣ�<span>' + alarm_info + '</span></div></div>');
				var hei = $(".alert_tc[alarm_x='" + alarm_ui_dev_id1 + alarm_ui_prop_id1 + "']").outerHeight() //.setTimeout()
				$(".alert_tc[alarm_x='" + alarm_ui_dev_id1 + alarm_ui_prop_id1 + "']").show().css('bottom', -hei).animate({
						"bottom": 0
					},
					800, function() {
						var t = setTimeout(function() {
							$(".alert_tc[alarm_x='" + alarm_ui_dev_id1 + alarm_ui_prop_id1 + "']").find('.guanbi_alert').click();
						}, 8000)
					});


			};
			if (n.alarm_remove) {
				var alarm_remove1 = n.alarm_remove
				var remove_ui_dev_id1 = n.ui_dev_id;
				var remove_ui_prop_id1 = n.ui_prop_id;
				var alarm_x = parseInt($(".alert_msg a").text());
				alarm_x -= 1;
				$(".alert_msg a").text(alarm_x);
				// var text_and = $(".alert_msg a").text()
				// $("body").append('<div class="alert_tc" alarm_x="'+text_and+'"><span class="guanbi_alert">X</span><h2>�澯���</h2><div class="sb_alert">����豸��<span>ups</span></div><div class="sx_alert">������ԣ�<span>ups</span></div></div>');
				// $(".alert_tc[alarm_x='"+text_and+"']").setTimeout()
			};
		})
	};
	b_callbacks.add(chage_alert);
	$(".guanbi_alert").live('click', function(e) {
		var this_ani = $(this).parent()
		var hei = $(this).parent().outerHeight();
		$(this).parent().animate({
				"bottom": -hei
			},
			800, function() {
				this_ani.remove();
			});
	});
})