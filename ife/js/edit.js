$(function(){
	var init = (function () {
		var demo = {
			url :  "",
			imgUrl : ["income","clothes","food","living","transport","shopping","other"],
			describe : ["收入","衣服","饮食","住宿","交通","购物","其他"],
			width : $(window).width(),
			height : $(window).height(),
			storage : window.localStorage,
			type : $(".type img"),
			description : $(".description"),
			footer : $("footer"),
			result : $(".result"),
			data : ""
		};

		demo.model = {
			// add data into localStorage
			add : function () {
				demo.data += "\""+demo.description.attr("data-id")+"\":"+"\""+demo.result.html()+"\"";
				if(demo.result.html() != "0"){
					var date = new Date(),
					_times = date.getFullYear() +"/"+ (date.getMonth()+1) +"/"+ date.getDate();
					var storageObj = demo.storage.valueOf();
					for(var storageId in storageObj){}
					storageId = storageId ? storageId : -1;
					demo.data = "{\"time\":\""+_times+"\","+demo.data+"}";
					demo.storage.setItem(parseInt(storageId) + 1, demo.data);
					date = storageId = demo.storage = null;
					demo.data = "";
					alert("记账成功！");
					window.location.href = demo.url;
					return false;
				}
			}
		};

		// View
		demo.view = {
			start : function () {
				var arr = window.location.href.split("/");
				arr.splice(arr.length-1,1,"index.html");
				demo.url = arr.join("/");

				if(demo.height>demo.width){
					$("body").css("height",(demo.height-17)+"px");
				}
				this.initCalculate();

				$("section").on("touchstart", this.calculate);

				$(".publish").on("touchstart", demo.model.add);
			},

			initCalculate : function () {
				var app = {
					num1 : "0",
					num2 : "",
					result : 0,
					isOperator : "",
					regExp1 : /^0\.{1}\d+$/,
					regExp2: /^([0]\d+)$/
				};
				$(".result").html(0);

				$(".num").on("touchstart",function(){
					try{
						if(app.num1.indexOf('.') != -1) {
							if($(this).attr("data-value") == ".") {
								return;
							}
						}
					}catch(e){}
					if(app.isOperator && app.num1 && app.num2 == "") {
						app.num2 = app.num1;
						app.num1 = "";
						$(".result").html("");
					}
					app.result = $(".result").html();
					app.num1 = app.result += $(this).attr("data-value");
					$(".result").html(app.result);
					if(app.regExp1.test(app.result)){
						return;
					}
					if(app.regExp2.test(app.result)){
						app.num1 = app.result = $(this).attr("data-value");
						$(".result").html(app.num1);
					}

				});
				$(".operate").on("touchstart",function(){
					if(app.num1 && app.isOperator && app.num2){
						app.num1 = eval(app.num1 + app.isOperator + app.num2);
						$(".result").html(app.num1);
						app.num2 = "";
					}
					app.isOperator = $(this).attr("data-value");
					$(".result").html("0");
				});
				$(".equal").on("touchstart",function(){
					if (app.num2 == "" && app.isOperator == "" && app.num1 == "") {
						return;
					}
					app.num1 = eval(app.num1 + app.isOperator + app.num2);
					$(".result").html(app.num1);
					app.num2 = "";
					app.isOperator = "";
					isClear = true;
				});
				$(".clear").on("touchstart",function(){
					app.num1 = "0";
					$(".result").html(app.num1);
					app.num2 = "";
					app.isOperator = "";
				});
				$(".del").on("touchstart",function(){
					if(app.num1 == ""){
						return;
					}
					if(app.isOperator == ""){
						var str = $(".result").html();
						$(".result").html(str.substring(0,str.length-1));
						app.num1 = $(".result").html();
						str = null;
					}
					if(app.isOperator){
						var str = $(".result").html();
						$(".result").html(str.substring(0,str.length-1));
						app.num1 = $(".result").html();
						str = null;
					}
				});
			},

			calculate : function (event) {
				var nodeId = $(event.target.parentNode).attr("data-id");
				if(typeof nodeId != "string"){
					return;
				}
				if(demo.footer.css("display") != "none"){
					demo.data += "\""+demo.description.attr("data-id")+"\":"+"\""+demo.result.html()+"\",";
				}
				demo.type.attr("src","./img/"+demo.imgUrl[nodeId]+".png");
				demo.description.html(demo.describe[nodeId]).attr("data-id",nodeId);
				demo.footer.css("display","block");
				demo.result.html("0");
			}
		};

		// Controller
		demo.start = function () {
			demo.view.start();
		};

		return demo.start;
	}());
	// single entry
	init();
});