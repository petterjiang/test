//��ʷ��¼
var UiDevID; //Ӧ���豸ID
var PageIndex = 0; //�ڼ�ҳ
var PageSize = 15; //ÿҳ������
var BeginTime; //��ʼʱ��
var EndTime; //����ʱ��

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
$(function() {
	selet();

	function date() {
		var date = new Date(); //���ڶ���
		var now = "";
		now = date.getFullYear() + "-"; //��Ӣ�ľ�����
		now = now + (date.getMonth() + 1) + "-"; //ȡ�µ�ʱ��ȡ���ǵ�ǰ��-1�����ȡ��ǰ��+1�Ϳ�����
		now = now + date.getDate() + " ";
		return now;
	}
	$("#time1, #time2").val(date())
	$("#time1, #time2").live("click", function(e) {
		e.stopPropagation();
		WdatePicker()
	});
	// ����ѡ��˵�



	function date_3() {
		var date = new Date(); //���ڶ���
		var now = "";
		now = date.getFullYear() + "-"; //��Ӣ�ľ�����
		now = now + (date.getMonth() + 1) + "-"; //ȡ�µ�ʱ��ȡ���ǵ�ǰ��-1�����ȡ��ǰ��+1�Ϳ�����
		now = now + (date.getDate() - 1) + " ";
		return now;
	}
	// Ĭ�ϼ���
	var begin_time1 = date_3() + " " + "00:00:00"
	var end_time1 = date() + " " + "23:59:59"

		function moren(data) {
			var val = ""
			var text = "��" + date_3() + "��" + date() + "������"
			var data_nabo = []
			var time_his = []
			$.each(data, function(i, x) {
				// var error_msg = x.error_msg
				var prop_value = x.prop_value //:����ֵ
				var rec_time = x.rec_time //:��¼ʱ��
				var prop_value1 = parseFloat(prop_value)
				time_his[i] = rec_time;
				data_nabo.push(prop_value1)
			});
			tubiao(time_his, data_nabo, val, text) //����ͼ�꺯��
		}
	var data_moren = {
		ui_dev_id: 1,
		ui_prop_id: 0,
		page_index: 0,
		page_size: 250,
		begin_time: begin_time1,
		end_time: end_time1
	}
	DataHandle("GetHisData", data_moren, moren)


	// ��ȡ�����б�

	function GetUiDevTypeList(data) {
		$.each(data, function(index, n) {

			var ui_dev_type = n.ui_dev_type;
			var ui_dev_type_name = n.ui_dev_type_name;
			$(".type_select ul").append('<li pro_value="' + ui_dev_type + '">' + ui_dev_type_name + '</li>')
			// alert(ui_dev_type_name)
		});
	}
	DataHandle("GetUiDevTypeList", {}, GetUiDevTypeList, loading)

	// ������ͻ�ȡ�豸�б�
	$(".type_select .tiaojian_list li").live('click', function() {
		var ui_dev_type = $(this).attr("pro_value")
		$('.shebei_select ul, .shuxing_select ul').empty();
		$('.shebei_select p').removeAttr('pro_value').text("��ѡ��")
		$('.shuxing_select p').removeAttr('pro_value').text("��ѡ��")

		function GetUiDevList(data) {
			$.each(data, function(index, n) {
				var ui_dev_id = n.ui_dev_id;
				var ui_dev_name = n.ui_dev_name;
				$('.shebei_select ul').append('<li pro_value="' + ui_dev_id + '">' + ui_dev_name + '</li>')
			});
		}
		DataHandle("GetUiDevList", {
			ui_dev_type: ui_dev_type
		}, GetUiDevList, loading)
	});
	// ����豸��ȡ�豸�����б�
	$(".shebei_select .tiaojian_list li").live('click', function(event) {
		var ui_dev_id = $(this).attr("pro_value")
		$('.shuxing_select ul').empty();
		$('.shuxing_select p').removeAttr('pro_value').text("��ѡ��")

		function GetUiDevPropList(data) {
			$.each(data, function(index, n) {
				var ui_prop_id = n.ui_prop_id;
				var ui_prop_name = n.ui_prop_name;
				$('.shuxing_select ul').append('<li pro_value="' + ui_prop_id + '">' + ui_prop_name + '</li>')
			});
		}
		DataHandle("GetUiDevPropList", {
			ui_dev_id: ui_dev_id
		}, GetUiDevPropList, loading)

	});


	//�����ѯ������Ϣ
	$(".cx").live("click", cx_bj);

	function cx_bj() {
		// ui_dev_id:Ӧ���豸ID
		// ui_prop_id:Ӧ������ID
		// page_index:�ڼ�ҳ
		// page_size:ÿҳ������

		var ui_dev_id = $(".shebei_select p").attr("pro_value")
		var ui_prop_id = $(".shuxing_select p").attr("pro_value")
		var page_index = 0
		var page_size = 20
		var begin_time1 = $("#time1").val() //:��ʼʱ��
		var end_time1 = $("#time2").val() //:����ʱ��
		begin_time = begin_time1 + " " + "00:00:00"
		end_time = end_time1 + " " + "23:59:59"
		// alert(end_time)
		var enddTime = (new Date(end_time)).getTime() - (new Date(begin_time)).getTime()
		if (ui_dev_id == undefined || ui_prop_id == undefined) {
			alert("ѡ��Ҫ��ѯ���豸����")
			return false;
		};
		//��ȡ��ʷ��¼
		var data = {
			ui_dev_id: ui_dev_id,
			ui_prop_id: ui_prop_id,
			page_index: 0,
			page_size: 250,
			begin_time: begin_time,
			end_time: end_time
		}
		var timg_fen = begin_time1.split("-")
		var text = begin_time1 + "��" + end_time1 + "������"
		var val = $(".shuxing_select p").text()
		var data_nabo = [];

		function GetHisData(data) {
			// var data_nabo1 = [1,2.3,32,34,123,12,21,,2,3,4,1,,2,3,1,2,3,4,,2,3,]
			var time_his = [];
			$.each(data, function(i, n) {
				// var error_msg = x.error_msg
				var prop_value = n.prop_value //:����ֵ
				var rec_time = n.rec_time //:��¼ʱ��
				var prop_value1 = parseFloat(prop_value)
				time_his[i] = rec_time;
				data_nabo.push(prop_value1)

			});
			// alert(val)
			tubiao(time_his, data_nabo, val, text) //����ͼ�꺯��

		}

		DataHandle("GetHisData", data, GetHisData)

	}


});

function tubiao(time_his, data_nabo, val, text) { //ͼ��������  ����1��x�����飬 ����2��y������ ����3������
	$('#content_id').highcharts({
		chart: {
			zoomType: 'x',
			spacingRight: 20
		},
		title: {
			text: text
		},
		xAxis: {
			categories: time_his
		},
		yAxis: {
			title: {
				text: ''
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
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
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
			name: val,
			data: data_nabo
		}]
	});
}