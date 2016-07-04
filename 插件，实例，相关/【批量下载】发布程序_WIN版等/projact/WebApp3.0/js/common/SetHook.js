var addrss = window.location.href;

//SetHook挂钩====================================
var b_callbacks = $.Callbacks();
var StartComet = function() {
	$.ajax({
		type: "get",
		timeout: 12000,
		url: GetUrl("SetHook"),
		dataType: "jsonp",
		contentType: "application/json;charset=gb2312",
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			XMLHttpRequest = null;
			StartComet();
		},
		complete: function(XMLHttpRequest, textStatus) {
			XMLHttpRequest = null
		},
		success: function(SetHook) { //alert(1)
			if (SetHook) {
				b_callbacks.fire(SetHook); //
			}
			//var a = SetHook.ui_dev_prop.prop_value
			//var id = SetHook.ui_dev_prop.prop_value
			StartComet();
		}
	})
}