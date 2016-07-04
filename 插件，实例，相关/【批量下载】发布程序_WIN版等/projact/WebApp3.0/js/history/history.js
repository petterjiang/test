//历史记录
var UiDevID; //应用设备ID
var PageIndex = 0; //第几页
var PageSize = 15; //每页的条数
var BeginTime; //开始时间
var EndTime; //结束时间

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
		var date = new Date(); //日期对象
		var now = "";
		now = date.getFullYear() + "-"; //读英文就行了
		now = now + (date.getMonth() + 1) + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
		now = now + date.getDate() + " ";
		return now;
	}
	$("#time1, #time2").val(date())
	$("#time1, #time2").live("click", function(e) {
		e.stopPropagation();
		WdatePicker()
	});
	// 下拉选择菜单



	function date_3() {
		var date = new Date(); //日期对象
		var now = "";
		now = date.getFullYear() + "-"; //读英文就行了
		now = now + (date.getMonth() + 1) + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
		now = now + (date.getDate() - 1) + " ";
		return now;
	}
	// 默认加载
	var begin_time1 = date_3() + " " + "00:00:00"
	var end_time1 = date() + " " + "23:59:59"

		function moren(data) {
			var val = ""
			var text = "从" + date_3() + "到" + date() + "的数据"
			var data_nabo = []
			var time_his = []
			$.each(data, function(i, x) {
				// var error_msg = x.error_msg
				var prop_value = x.prop_value //:属性值
				var rec_time = x.rec_time //:记录时间
				var prop_value1 = parseFloat(prop_value)
				time_his[i] = rec_time;
				data_nabo.push(prop_value1)
			});
			tubiao(time_his, data_nabo, val, text) //调用图标函数
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


	// 读取类型列表

	function GetUiDevTypeList(data) {
		$.each(data, function(index, n) {

			var ui_dev_type = n.ui_dev_type;
			var ui_dev_type_name = n.ui_dev_type_name;
			$(".type_select ul").append('<li pro_value="' + ui_dev_type + '">' + ui_dev_type_name + '</li>')
			// alert(ui_dev_type_name)
		});
	}
	DataHandle("GetUiDevTypeList", {}, GetUiDevTypeList, loading)

	// 点击类型获取设备列表
	$(".type_select .tiaojian_list li").live('click', function() {
		var ui_dev_type = $(this).attr("pro_value")
		$('.shebei_select ul, .shuxing_select ul').empty();
		$('.shebei_select p').removeAttr('pro_value').text("请选择")
		$('.shuxing_select p').removeAttr('pro_value').text("请选择")

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
	// 点击设备获取设备属性列表
	$(".shebei_select .tiaojian_list li").live('click', function(event) {
		var ui_dev_id = $(this).attr("pro_value")
		$('.shuxing_select ul').empty();
		$('.shuxing_select p').removeAttr('pro_value').text("请选择")

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


	//点击查询报警信息
	$(".cx").live("click", cx_bj);

	function cx_bj() {
		// ui_dev_id:应用设备ID
		// ui_prop_id:应用属性ID
		// page_index:第几页
		// page_size:每页的条数

		var ui_dev_id = $(".shebei_select p").attr("pro_value")
		var ui_prop_id = $(".shuxing_select p").attr("pro_value")
		var page_index = 0
		var page_size = 20
		var begin_time1 = $("#time1").val() //:开始时间
		var end_time1 = $("#time2").val() //:结束时间
		begin_time = begin_time1 + " " + "00:00:00"
		end_time = end_time1 + " " + "23:59:59"
		// alert(end_time)
		var enddTime = (new Date(end_time)).getTime() - (new Date(begin_time)).getTime()
		if (ui_dev_id == undefined || ui_prop_id == undefined) {
			alert("选择要查询的设备！！")
			return false;
		};
		//读取历史记录
		var data = {
			ui_dev_id: ui_dev_id,
			ui_prop_id: ui_prop_id,
			page_index: 0,
			page_size: 250,
			begin_time: begin_time,
			end_time: end_time
		}
		var timg_fen = begin_time1.split("-")
		var text = begin_time1 + "到" + end_time1 + "的数据"
		var val = $(".shuxing_select p").text()
		var data_nabo = [];

		function GetHisData(data) {
			// var data_nabo1 = [1,2.3,32,34,123,12,21,,2,3,4,1,,2,3,1,2,3,4,,2,3,]
			var time_his = [];
			$.each(data, function(i, n) {
				// var error_msg = x.error_msg
				var prop_value = n.prop_value //:属性值
				var rec_time = n.rec_time //:记录时间
				var prop_value1 = parseFloat(prop_value)
				time_his[i] = rec_time;
				data_nabo.push(prop_value1)

			});
			// alert(val)
			tubiao(time_his, data_nabo, val, text) //调用图标函数

		}

		DataHandle("GetHisData", data, GetHisData)

	}


});

function tubiao(time_his, data_nabo, val, text) { //图标插件函数  参数1：x轴数组， 参数2：y轴数组 参数3：标题
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