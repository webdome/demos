// 网页加载 请求素材库 并设置居中
$(function() {
	$(".ml_pic>img").each(function() {
		$(this).css({
			'margin-top': -($(this)[0].height / 2),
			'margin-left': -($(this)[0].width / 2),
		});
	});
})

// 点击素材库添加元素
// 存储创建的每个对象
var elemObj = {};
var zoneIndex = 11;
$('#material>div').on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// 隐藏画布区的所有操作点
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt').hide();
	$("#drawArea>ul>li").attr("data-cur", "0");
	if ($(this).hasClass('chartlet')) {
		var src = $(this).children().attr('src');
		var w = $(this).children().width();
		var h = $(this).children().height();
		var elem = $('<li class="box_graph" data-cur="1"></li>');
		var graph = $('<div class="graph"><img src="' + src + '" data-src="' + src + '"/></div>');
		var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
		elem.append(graph);
		elem.append(ctrl);
		$('#drawArea>ul').append(elem);
		elem.css({
			"position": 'absolute',
			"top": '0',
			"left": "0",
			"z-index": zoneIndex++,
			"width": w,
			"height": h,
		});
		elem.children().show();
		var oneElem = new newGraph(elem);
		// 取出元素对应ID 存入总对象中
		var num = 'graph_' + oneElem.num;
		elemObj[num] = oneElem;
	} else if ($(this).hasClass('ml_pic')) {
		var src = $(this).children().attr('src');
		var w = $(this).children().width();
		var h = $(this).children().height();
		var elem = $('<li class="box_pic" data-cur="1"></li>');
		var pic = $('<div class="pic"><img src="' + src + '" data-src="' + src + '"/></div>');
		var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
		elem.append(pic);
		elem.append(ctrl);
		$('#drawArea>ul').append(elem);
		elem.css({
			"position": 'absolute',
			"top": '0',
			"left": "0",
			"z-index": zoneIndex++,
			"width": w,
			"height": h,
		});
		elem.children().show();
		var oneElem = new newPic(elem);
		// 取出元素对应ID 存入总对象中
		var num = 'pic_' + oneElem.num;
		elemObj[num] = oneElem;
	} else if ($(this).hasClass('ml_txt')) {
		var txt = $(this).text();
		var elem = $('<li class="box_txt" data-cur="1"></li>');
		var pic = $('<div class="txt"><div>' + txt + '</div></div>');
		var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
		elem.append(pic);
		elem.append(ctrl);
		$('#drawArea>ul').append(elem);
		elem.css({
			"position": 'absolute',
			"top": '0',
			"left": "0",
			"z-index": zoneIndex++,
			"width": "320px",
		});
		elem.children().show();
		var oneElem = new newTxt(elem);
		// 取出元素对应ID 存入总对象中
		var num = 'txt_' + oneElem.num;
		elemObj[num] = oneElem;
	}
});

// 取消默认右键菜单事件
document.oncontextmenu = function(e) {
	e.preventDefault();
	e.stopPropagation();
};

// 点击空白区域隐藏操作点
$(document).on('mousedown', function(e) {
	// e.preventDefault();
	e.stopPropagation();
	$("#drawArea>ul>li").attr('data-cur', '0'); // 将当前激活项设置为空
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt').hide(); // 除了图片和文本以外的所有控制单元都隐藏
	// 文本框的处理
	$("#drawArea .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
});

// 点击哪个图形哪个的操作点就出现
$(document).delegate('#drawArea>ul>li', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// step 1
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt').hide(); // 将所有控制单元隐藏
	$("#drawArea>ul>li").attr('data-cur', '0'); // 将当前激活项清空
	// step 2
	$(this).children().show(); // 将点击的当前项控制单元显示
	$(this).attr('data-cur', '1'); // 将点击的当前项设置为激活项
});
// delete 按键删除元素
$(document).on("keydown", function(e) {
	e.stopPropagation();
	if (e.keyCode === 46) { // 如果键盘按的是delete键就删除当前激活项
		var num = $('#drawArea>ul>li[data-cur="1"]').attr('id');
		window.sessionStorage.removeItem(num); // 清除对应的本地存储
		delete elemObj[num]; // 删除元素总集合中对应的成员
		$('#drawArea>ul>li[data-cur="1"]').remove();
	}
});
// 刷新页面删除本地存储
$(function(){
	window.sessionStorage.clear();
});
	// 双击文本编辑
$(document).delegate('.box_txt', 'dblclick', function(e) {
	// 先将所有文本框 去边框 设置为不可编辑 失焦
	$("#drawArea .box_txt").css('border', '0');
	$('#drawArea .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
	// 双击文本框 隐藏移动单元 给大盒子加边框 
	$(this).css('border', '1px dashed #2eb3e8').children('.container').hide();
	// 将文本框设置为可编辑并且获得焦点
	$(this).children('.txt').attr('data-edit', '1').children().attr('contenteditable', 'true').focus();
	document.execCommand("selectAll");
	// 文本框高度设置到最大
	$(this).css("height", "initial");
});
// 失焦后再次点击
$(document).delegate('#drawArea .txt>div', 'mousedown', function(e) {
	// e.preventDefault();
	e.stopPropagation();
	if ($(this).parent().attr('data-edit') == 0) {
		// 文本框的处理
		$("#drawArea .box_txt").css('border', '0');
		$('#drawArea .box_txt .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
		$("#drawArea>ul>li>div").not('.graph,.pic,.txt').hide()
		$(this).parents(".box_txt").children().show();
	}
	$("#drawArea>ul>li").attr('data-cur', '0')
	$(this).parents(".box_txt").attr('data-cur', '1');
});

// 阻止裁切层冒泡
$(document).delegate('#cutlayer', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
});
// 裁切功能 Jcrop插件
function calCoord(c) {
	x = c.x;
	y = c.y;
	w = c.w;
	h = c.h;
};
function useCut() {
	var jcrop_api;
	$('#target').Jcrop({
		onChange: calCoord,
		onSelect: calCoord,
	}, function() {
		jcrop_api = this;
		var originalWidth = $("#target").width();
		var originalHeight = $("#target").height();
		jcrop_api.animateTo([0, 0, originalWidth, originalHeight]);
	});
};

// 功能区菜单
var sendSrc = "";
// 定义裁切页面 图片宽高 容器宽高 裁切起始点x,y 宽高w,h
var imgW, imgH, boxW, boxH, x, y, w, h;
$('#function>ul>li').on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	var i = $(this).index();
	var zIndex = $('#drawArea>ul>li[data-cur="1"]').css('z-index');
	if (i == 0) {
		$('#drawArea>ul>li[data-cur="1"]').css('z-index', ++zIndex);
	} else if (i == 1) {
		$('#drawArea>ul>li[data-cur="1"]').css('z-index', --zIndex);
	} else if (i == 2) {
		$('#drawArea>ul>li[data-cur="1"]').css('z-index', 100);
	} else if (i == 3) {
		$('#drawArea>ul>li[data-cur="1"]').css('z-index', 10);
	} else if (i == 4) {
		if ($('#drawArea>ul>li[data-cur="1"]>div:eq(0)').attr('class') == 'pic') {
			// 创建 裁切层
			var cutlayer = $('<div id="cutlayer"><div id="cl_top">图片裁切</div><div id="clr_middle"><div id="clm_left"><img src="" id="target" /></div><div id="clm_right">待定</div></div><div id="cl_bottom"><div>取消</div><div>确定</div></div></div>');
			cutlayer.appendTo($('body'));
			$("#cutlayer").show(300);
			// 取得当前需要裁切对象的图片地址 放入裁切区
			var src = $('#drawArea>ul>li[data-cur="1"]>div:eq(0)>img').attr("data-src");
			sendSrc = src.split("/").pop();
			$("#target").attr("src", src);
			// 检查图片的大小 实现居中布局
			imgW = $("#target").width();
			imgH = $("#target").height();
			boxW = $("#clm_left").width();
			boxH = $("#clm_left").height();
			if (imgW > boxW) {
				$("#target").css({
					'width': boxW,
					'height': boxW * imgH / imgW,
				});
				$(".jcrop-holder>div:eq(0)").css({
					'width': boxW,
					'height': boxW * imgH / imgW,
					'position': 'absolute',
					'top': '0',
					'left': '0',
				});
				$('.jcrop-holder>.jcrop-tracker').css({
					'width': boxW + 4,
					'height': boxW * imgH / imgW + 4,
				});
				$(".jcrop-holder>img").css({
					'width': boxW,
					'height': boxW * imgH / imgW,
				});
				$(".jcrop-holder>div:eq(0)>div:eq(0)>img").css({
					'width': boxW,
					'height': boxW * imgH / imgW,
				});
			} else if (imgH > boxH) {
				$("#target").css({
					'width': boxH * imgW / imgH,
					'height': boxH,
				});
				$(".jcrop-holder>div:eq(0)").css({
					'width': boxH * imgW / imgH,
					'height': boxH,
					'position': 'absolute',
					'top': '0',
					'left': '0',
				});
				$('.jcrop-holder>.jcrop-tracker').css({
					'width': boxH * imgW / imgH + 4,
					'height': boxH + 4,
				});
				$(".jcrop-holder>img").css({
					'width': boxH * imgW / imgH,
					'height': boxH,
				});
				$(".jcrop-holder>div:eq(0)>div:eq(0)>img").css({
					'width': boxH * imgW / imgH,
					'height': boxH,
				});
			}
			useCut();
			if (imgW > boxW) {
				$(".jcrop-holder").css({
					'width': boxW,
					'height': boxW * imgH / imgW,
					'position': 'absolute',
					'top': '50%',
					'margin-top': -(boxW * imgH / imgW / 2),
					'background-color': '#ccc',
				});
			} else if (imgH > boxH) {
				$(".jcrop-holder").css({
					'width': boxH * imgW / imgH,
					'height': boxH,
					'margin': 'auto',
				});
			} else {
				$(".jcrop-holder").css({
					'position': 'absolute',
					'top': '50%',
					'left': '50%',
					'margin-top': -(imgH / 2),
					'margin-left': -(imgW / 2),
				});
			}
		}
	} else if (i == 5) {
		sessionStorage.clear();
	} else if (i == 6) {
		// 取出存储的元素全部样式 转化为json对象存储到数组中待用
		var objs = {};
		$.each(sessionStorage, function(key, value) {
			var obj = JSON.parse(value);
			var num = obj.gpeid;
			objs[num] = obj;
		});
		console.log(objs);
	}
});

//裁切页面按钮事件
$(document).delegate('#cl_bottom>div:eq(0)', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#cutlayer").remove();
});
$(document).delegate('#cl_bottom>div:eq(1)', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	if (imgW > boxW) {
		x = x * imgW / boxW;
		y = y * imgW / boxW;
		w = w * imgW / boxW;
		h = h * imgW / boxW;
	} else if (imgH > boxH) {
		x = x * imgH / boxH;
		y = y * imgH / boxH;
		w = w * imgH / boxH;
		h = h * imgH / boxH;
	}
	getData({
		"filePath": sendSrc,
		"x": x,
		"y": y,
		"w": w,
		"h": h
	}, "picUploadService.do", "pictureCut", "picCut");
	$("#cutlayer").remove();
});


// 字体设置
$("#txt_style>ul>li").on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
});
$("#txt_style>ul>li>ul>li").on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	var i = $(this).parent().parent().index();
	var target = $('#drawArea>ul>li>.txt>div[contenteditable="true"]');
	if (i == 0) {
		var fontFamily = $(this).text();
		target.css("font-family", fontFamily);
		updateTxtStorage("fontFamily", fontFamily);
	} else if (i == 1) {
		var fontSize = $(this).text();
		target.css("font-size", fontSize);
		updateTxtStorage("fontSize", fontSize);
	} else if (i == 2) {
		var color = $(this).text();
		target.css("color", color);
		updateTxtStorage("color", color);
	} else if (i == 3) {
		var fontWeight = $(this).text();
		target.css("font-weight", fontWeight);
		updateTxtStorage("fontWeight", fontWeight);
	} else if (i == 4) {
		var fontStyle = $(this).text();
		target.css("font-style", fontStyle);
		updateTxtStorage("fontStyle", fontStyle);
	} else if (i == 5) {
		var textDecoration = $(this).text();
		target.css("text-decoration", textDecoration);
		updateTxtStorage("textDecoration", textDecoration);
	} else if (i == 6) {
		var textDecoration = $(this).text();
		target.css("text-decoration", textDecoration);
		updateTxtStorage("textDecoration", textDecoration);
	} else if (i == 7) {
		var textAlign = $(this).text();
		target.css("text-align", textAlign);
		updateTxtStorage("textAlign", textAlign);
	} else if (i == 8) {
		var lineHeight = $(this).text();
		target.css("line-height", lineHeight);
		updateTxtStorage("lineHeight", lineHeight);
	} else if (i == 9) {
		var letterSpacing = $(this).text();
		target.css("letter-spacing", letterSpacing);
		updateTxtStorage("letterSpacing", letterSpacing);
	} else if (i == 10) {

	} else if (i == 11) {

	}
});