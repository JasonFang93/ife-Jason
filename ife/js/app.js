"use strict";

$(function(){
	var entry = (function() {
		var app = {
			menu : $(".menu"),
			imgUrl : ["income","clothes","food","living","transport","shopping","other"],
			describe : ["收入","衣服","饮食","住宿","交通","购物","其他"],
			storage : window.localStorage,
			data : [],
			totalIncome : 0,
			totalExpenditure : 0,
			totalSurplusage : 0,
			monthData : {
				income : [0,0,0,0,0,0,0,0,0,0,0,0],
				expenditure : [0,0,0,0,0,0,0,0,0,0,0,0]
			}
		};
		// Model
		app.model = {
			getData : function (callback) {
				var i,
					j,
					_temp,
					_str = app.storage.valueOf();

				for (i in _str) {
					var _data = {},
						_list = [],
						_type = [],
						_url = [],
					_income = 0,
					_expenditure = 0;
					_temp = JSON.parse(_str[i]);
					for (j in _temp) {
						if (_temp[j] !== "0" && j !== "time") {
							if (j !== "0") {
								_expenditure += parseInt(_temp[j], 10);
							}
							_list[j] = _temp[j];
							_type[j] = app.describe[j];
							_url[j] = app.imgUrl[j];
						}
						_income = _temp["0"] ? parseInt(_temp["0"]) : 0;
						_data.type = _type;
						_data.url = _url;
						_data.list = _list;
						_data.money = _income - _expenditure;
						_data.time = _temp["time"];
					}
					if (typeof callback === "function" && _data.list) {
						_data.index = i;
						callback(_data);
					}
					
				}
			},

			total : function (_data) {
				var _month = _data.time.split("/")[1];
				for( var i=1; i<7; i++) {
					if (_data.list[i]){
						app.data[i] = app.data[i] ? app.data[i] : 0;
						app.data[i] += parseInt(_data.list[i], 10);
					}

				}
				if(_data.list[0]){
					app.totalIncome += parseInt(_data.list[0], 10);
					app.monthData.income[parseInt(_month, 10) - 1] += parseInt(_data.list[0], 10);
					app.monthData.expenditure[parseInt(_month, 10) - 1] += parseInt(_data.list[0], 10) - parseInt(_data.money, 10);
				}
				app.totalSurplusage += parseInt(_data.money, 10);
				app.totalExpenditure = app.totalIncome - app.totalSurplusage;
			}
		};

		// View
		app.view = {
			start : function () {
				// get datas from localStorage
				app.model.getData(function (_data) {
					// // artTemplate transfer 1
					var html = template("tpl", _data);
					$("#lists").append(html);
					app.model.total(_data);
				});

				// artTemplate transfer 2 
				var html = template("total-data", app);
				$("#charts").append(html);

				// left button of index page
				$(".btn-menu").on("click", function () {
					if(app.menu.css("display") === "none"){
						$(this).find("img").attr("src", "./img/close1.png");
						app.menu.css("display", "block");
					}else{
						$(this).find("img").attr("src", "./img/menu.png");
						app.menu.css("display", "none");
					}
				});
				
				$(".menus").on("click", this.tabMenu);

				$(".menu-statistics").on("click", this.showChart);

				// show the operation by touchmove
				$(".touch").on("touchmove", function (e) {
					e.stopPropagation();
					$(this).next().css("display", "block");
				});

				// close the operation
				$(".operation").on("click", function () {
					$(".operation").css("display", "none");
				});

				// delete data
				$(".delete").on("click", function () {
					var index = $(this).attr("data-id");
					app.storage.removeItem(index);
					alert("删除数据成功！");
					window.location = window.location.hash;
				});
			},

			//tabs change
			tabMenu : function () {
				$(".menus").removeClass("active");
				$(this).addClass("active");
				$(".btn-menu").find("img").attr("src", "./img/menu.png");
				$(".menu").css("display", "none");
				if ($(this).hasClass("menu-list")) {
					$("#lists").css("display", "block");
					$("#charts").css("display", "none");
				} else {
					$("#lists").css("display", "none");
					$("#charts").css("display", "block");
				}
			},

			//show the pie and line
			showChart : function () {
				$("#pie").css({"width": "94%","height": "300px"});
				$("#line").css({"width": "100%","height": "300px"});
				var _data = app,
					arr = [],
					i,
					temp = {};

				var pie = echarts.init($("#pie")[0]),
					line = echarts.init($("#line")[0]);
				var option = {
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        data: ["衣服","饮食","住宿","交通","购物","其他"]
				    },
				    toolbox: {
				        show : true
				    },
				    calculable : true,
				    series : [
				        {
				            name:'收支统计',
				            type:'pie',
				            center: ['50%', '58%'],
				            radius : ['50%', '70%'],
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : false
				                    },
				                    labelLine : {
				                        show : false
				                    }
				                },
				                emphasis : {
				                    label : {
				                        show : true,
				                        position : 'center',
				                        textStyle : {
				                            fontSize : '30',
				                            fontWeight : 'bold'
				                        }
				                    }
				                }
				            },
				            data:[
				                {value: _data.data[1], name: '衣服'},
				                {value: _data.data[2], name: '饮食'},
				                {value: _data.data[3], name: '住宿'},
				                {value: _data.data[4], name: '交通'},
				                {value: _data.data[5], name: '购物'},
				                {value: _data.data[6], name: '其他'}
				            ]
				        }
				    ]
				};
				var options = {
				    tooltip : {
				        trigger: 'axis'
				    },
				    legend: {
				        data:['收入', '支出']
				    },
				    toolbox: {
				        show : true
				    },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series : [
				        {
				            name:'收入',
				            type:'line',
				            data: _data.monthData.income
				        },
				        {
				            name:'支出',
				            type:'line',
				            data: _data.monthData.expenditure
				        }
				    ]
				};
				pie.setOption(option);
				line.setOption(options);
			}
		};

		// Controller
		app.start = function () {
			app.view.start();
		};

		return app.start;
	}());
	// single entry
	entry();
});