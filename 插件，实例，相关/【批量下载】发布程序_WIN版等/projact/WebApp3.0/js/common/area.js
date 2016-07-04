/// <reference path="url.js" />

$(function() {
	$(".menu").empty();

	GetAreaList();
});

//读取区域列表

function GetAreaList() {
	var newli;
	$.ajax({
		type: "get",
		data: {
			type: "1"
		},
		url: GetUrl("GetAreaList"),
		dataType: "jsonp",
		contentType: "application/json;charset=gb2312",
		success: function(data) {
			//返回值为area_id ,area_name,child;
			var area_id = data.area_id
			var child = data.child
			$(".menu").attr("area_id", area_id);
			$.each(child, function(j, k) {
				var area_id1 = k.area_id
				var child1 = k.child
				var area_name1 = k.area_name
				var file_path = k.file_path
				$(".menu").append("<li><a area_id='" + area_id1 + "' img_src='" + file_path + "'>" + area_name1 + "</a></li>");
				if (child1 != null) {
					ajax_qy(child1, area_id1)
				}
			})
			var img_src = $("#menu a").eq(0).attr("img_src");
			// $("#menu a").eq(0).click();
			$(".equipments_box_in").css({
				'background-image': 'url(../' + img_src + ')',
				'background-repeat': 'no-repeat',
				'background-size': '100% 100%'
			});
			
		},
		error: function() {
		}
	});

}

function ajax_qy(rechi, id_class) {
	$.each(rechi, function(o, s) {
		var area_name2 = s.area_name
		var child2 = s.child
		var area_id2 = s.area_id;
		var text = "<li><a area_id='" + area_id2 + "'>" + area_name2 + "</a></li>"
		if ($(".menu a[area_id='" + id_class + "']").next().text() == "") {
			$(".menu a[area_id='" + id_class + "']").parents("li").append("<ul></ul>");
		}
		$(".menu a[area_id='" + id_class + "']").next().append(text)
		if (child2 != null) {
			ajax_qy(child2, area_id2);
		}
	})

}