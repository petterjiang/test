/*****
蒋维佳 05.08
弹出层
********/

function myPopUp () {
}

myPopUp.prototype = {
	msg:{
			type: 1 ,                //1:
            areawidth: 410,          //默认410，弹出层宽度
            title: '温馨提示',    	//头部title信息
            shade: 0.5,              //遮罩透明度
            bgway: 1 ,               //1:默认没有背景， 2：感叹， 3:正确背景 4:其他
            content: '<div style="padding:50px;">这是一个非常普通的页面层，传入了自定义的html</div>',
                                     //中间HTML内容
            button:['确定','取消']   //按钮名字，最多两个，默认两个。
        }
	,
	open:function (setMsg) {
		var thisObj = this;
		$.extend(this.msg, setMsg);//自定义setMsg扩展默认msg
		var button="";
		for (var i=0; i<this.msg.button.length ; i++)
		{
			button+='<a id="popbotton'+(i+1)+'">'+this.msg.button[i]+'</a>'
		} 
		var shade = '<div id="fade"></div>'
		var bgclass = "nobg";
		if (this.msg.bgway == 2) {
			bgclass = "alertBg"
		};
		if (this.msg.bgway == 3) {
			bgclass = "rightBg"
		};
		var bgway = '<div class="'+bgclass+'"></div>'
		var addHtml = shade+'<div id="popUp"><div class="popBorder"></div><div class="popCont"><span class="popClose"></span><h2>'+this.msg.title+'</h2>'+bgway+this.msg.content+'<div class="buttonPop">'+button+'</div></div></div>'
		$("body").append(addHtml);

		//获取浮层高，定位浮层
		var popHeight = $("#popUp").outerHeight();
		$("#popUp").css({
			'width': this.msg.areawidth+16,
			'margin-left':-(this.msg.areawidth+16)/2,
			'margin-top':-popHeight/2
		});

		$("#fade").css('opacity', this.msg.shade);

		$(".popClose").click(function(event) {
			thisObj.closePop();
		});
	} ,
	//关闭弹出层，并且遗忘代码
	closePop:function () {
		$("#popUp").hide().remove();
		$("#fade").hide().remove();
	}
}
var PubJs = new myPopUp();


