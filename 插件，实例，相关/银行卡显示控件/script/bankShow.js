/*****
蒋维佳 06.07
银行卡输入
********/
$(function () {
	var copyCardHtml = "<div class='copyCard'></div>";
	var cardInputTop = $(".cardInput").offset().top;
	var cardInputLeft = $(".cardInput").offset().left;
	var cardInputHeight = $(".cardInput").outerHeight();
	$(".cardInput").keyup(function(e) {
		$(this).val($(this).val().replace(/\D/g,'').replace(/....(?!$)/g,'$& '));
		$(".copyCard").html($(this).val())
	}).focusout(function(e) {
		$(".copyCard").remove();
	}).focusin(function(e) {
		$("body").append(copyCardHtml);
		$(".copyCard").html($(this).val())
		cardInputTop = $(".cardInput").offset().top;
		cardInputLeft = $(".cardInput").offset().left;
		cardInputHeight = $(".cardInput").outerHeight();
		setCss ()
	});
    function setCss () {
    	$(".copyCard").css({
			'position': 'absolute',
			'display': 'block',
			'padding': '0 20px',
			'height': '40px',
			'line-height': '40px',
			'text-align': 'center',
			'color': '#fd7f2a',
		  	'background': '#ffedd9',
		  	'font-weight': 'bold',
		  	'font-size': '22px',
		  	'border': '1px solid #dcbf85',
			'left': cardInputLeft,
			'top':cardInputTop-43
		});
    }
})()