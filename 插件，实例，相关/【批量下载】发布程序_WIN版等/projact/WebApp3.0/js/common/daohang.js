//导航
(function($) {
	$(function() {
		$(".menu li").live("mouseover", function() {
			//e.stopPropagation();
			//$(".menu ul").stop(true,false);
			$(this).children("ul").stop(true, true)
			$(this).children("ul").fadeIn(200);
			$(this).find("a").first().addClass("over_hander")

		});
		$(".menu li").live("mouseleave", function() {
			//e.stopPropagation();
			//$(".menu ul").stop(false,true)
			$(this).children("ul").fadeOut(200);
			$(this).find("a").first().removeClass("over_hander")
		});

		//==========================================
		$("#menu .menu li a").live("click", function() {
			$(".location").empty();
			$(".location").append("当前区域：<a href=\"javascript:void(0)\" area_id='0' class=\"all_arra\">所有区域</a>")
			$(".menu li a.over_hander").each(
				function() {
					var area_id = $(this).attr("area_id")
					var text_t = $(this).text()
					$(".location").append(" <span>></span> <a href=\"javascript:void(0)\" area_id = \"" + area_id + "\">" + text_t + "</a>");
				}
			);
			// $(".equipments_box .box_li").parent().hide();
			$("#child_area .quyu_list").hide();
			$("#myApp li").hide();
			var area_id = $(this).attr("area_id");
			// $(".equipments_box .box_li[area_id='" + area_id + "']").parent().show();
			$("#child_area .quyu_list[parent_area_id='" + area_id + "']").show();
			$("#myApp li div[area_id='" + area_id + "']").parent().show();
			$(this).next().find("a").each(
				function() {
					var id_qx = $(this).attr("area_id");
					//alert(id_qx)
					// $(".equipments_box .box_li[area_id='" + id_qx + "']").parent().show();
					$("#myApp li div[area_id='" + id_qx + "']").parent().show();
				}
			);
			if ($(".list_table").hasClass("on_chose")) {
				$(".list_map").click();
				$(".equipments_box .box_li").parent().hide();
				$(".equipments_box .box_li[area_id='" + area_id + "']").parent().show();
				$(".list_table").click();
			} else {
				$(".equipments_box .box_li").parent().hide();
				$(".equipments_box .box_li[area_id='" + area_id + "']").parent().show();
			};
			//读取区域图片
			var this_idarea = $(this).attr("area_id");
			DataHandle("GetAreaBG", {
				area_id: this_idarea
			}, bg_area)

			function bg_area(data) {
				var file_path = data.file_path;
				$(".bg_area, #myApp, .equipments_box_in").css({
					'background-image': 'url(../' + file_path + ')',
					'background-repeat': 'no-repeat',
					'background-size': '100% 100%'
				});
				$(".all_equipments #img_id").attr("src","../" + file_path);
				var move = new moveDiv(".drag", "#img_id");
				move.move_area();
				move.move_set();
				$(window).resize(function() {
					move.move_area();
					move.move_set();
				});
			}
			$("#menu .menu ul").hide();
		});
		//==========================================
		$(".location a").live("click", function() {
			var id_area = $(this).attr("area_id");
			$(this).nextAll().remove();
			var html = $(".location").html();
			$(".menu li a[area_id='" + id_area + "']").click();
			$(".location").html(html);
		});
		$(".location a.all_arra").live("click", function() {
			// $(".equipments_box .box_li").parent().hide();
			$(".quyu_item .quyu_list").hide();
			$(".quyu_item .quyu_list[parent_area_id='0']").show();
			$("#myApp li").show();
			// $(".bg_area, #myApp, .all_equipments").css("background-image", "none");
		})

	});
})(jQuery);