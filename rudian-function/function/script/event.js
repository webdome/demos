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
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt,.input').hide();
	$("#drawArea>ul>li").attr("data-cur", "0");
	if ($(this).hasClass('chartlet')) { // 贴图元素
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
	} else if ($(this).hasClass('ml_pic')) { // 图片元素
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
	} else if ($(this).hasClass('ml_txt')) { //文本元素
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
	} else if ($(this).hasClass('ml_input')) { // 表单元素
		var type = $(this).children().attr('class');
		var elem = $('<li class="box_input" data-cur="1"></li>');
		var input = $('<div class="input"><input type="' + type + '"/>' + type + '</div>')
		var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
		elem.append(input);
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
		var oneElem = new newInput(elem);
		var num = 'input_' + oneElem.num;
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
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt,.input').hide(); // 除了图片和文本以外的所有控制单元都隐藏
	// 文本框的处理
	$("#drawArea .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
});

// 点击哪个图形哪个的操作点就出现
$(document).delegate('#drawArea>ul>li', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// step 1
	$("#drawArea>ul>li>div").not('.graph,.pic,.txt,.input').hide(); // 将所有控制单元隐藏
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
$(function() {
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
		$("#drawArea>ul>li>div").not('.graph,.pic,.txt,.input').hide()
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
			console.log(imgW,imgH,boxH,boxH);
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

/*添加动画事件*/
$('#ani_add').on("mousedown", function(e) {
	e.stopPropagation;
	if ($('#drawArea>ul>li[data-cur="1"]').length) {
		// 获取当前激活元素 ID
		var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
		// 随机生成动画 ID
		var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
		// 创建动画选择功能区
		// 所有动画
		// bounce flash pulse rubberBand shake swing tada wobble jello bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flip flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight hinge rollIn rollOut zoomIn zoomInDown zoomInLeft zoomInRight zoomInUp zoomOut zoomOutDown zoomOutLeft zoomOutRight zoomOutUp slideInDown slideInLeft slideInRight slideInUp slideOutDown slideOutLeft slideOutRight slideOutUp
		var ani_one = $('<div class="' + elem_id + '" id="' + ani_id + '"><ul><li><label> 方式 </label><div><select class = "ani_sel"><optgroup label="无"><option value = "no"> 无 </option></optgroup><optgroup label = "强调"><option value = "bounce"> 弹跳 </option><option value = "flash"> 闪动 </option><option value = "pulse"> 脉冲 </option><option value = "rubberBand"> 橡皮筋 </option><option value = "shake"> 轻摇 </option><option value = "swing"> 摆动 </option><option value = "tada"> 嗒哒 </option><option value = "wobble"> 摇晃 </option><option value = "jello"> 果冻 </option></optgroup><optgroup label = "进入"><option value = "slideInDown"> 上移入 </option><option value = "slideInLeft"> 左移入 </option><option value = "slideInRight"> 右移入 </option><option value = "slideInUp"> 下移入 </option><option value = "fadeIn"> 淡入 </option><option value = "fadeInDown"> 上淡入 </option><option value = "fadeInDownBig"> 上淡入大 </option><option value = "fadeInLeft"> 左淡入 </option><option value = "fadeInLeftBig"> 左淡入大 </option><option value = "fadeInRight"> 右淡入 </option><option value = "fadeInRightBig"> 右淡入大 </option><option value = "fadeInUp"> 下淡入 </option><option value = "fadeInUpBig"> 下淡入大 </option><option value = "bounceIn"> 弹入 </option><option value = "bounceInDown"> 向下弹入 </option><option value = "bounceInUp"> 向上弹入 </option><option value = "bounceInLeft"> 从左弹入 </option><option value = "bounceInRight"> 从右弹入 </option><option value = "hinge"> 悬掉 </option><option value = "flip"> 翻转 </option><option value = "flipInX"> X翻转 </option><option value = "flipInY"> Y翻转 </option><option value = "lightSpeedIn"> 光速 </option><option value = "rotateIn"> 旋转 </option><option value = "rotateInDownLeft"> 左下旋转 </option><option value = "rotateInDownRight"> 右下旋转 </option><option value = "rotateInUpLeft"> 左上旋转 </option><option value = "rotateInUpRight"> 右上旋转 </option><option value = "slideninLeft"> 滑动 </option><option value = "zoomIn"> 放大 </option><option value = "zoomInDown"> 下放大 </option><option value = "zoomInLeft"> 左放大 </option><option value = "zoomInRight"> 右放大 </option><option value = "zoomInUp"> 上放大 </option><option value = "rollIn"> 滚入 </option></optgroup><optgroup label = "退出"><option value = "slideOutDown"> 上移出 </option><option value = "slideOutLeft"> 左移出 </option><option value = "slideOutRight"> 右移出 </option><option value = "slideOutUp"> 下移出 </option><option value = "fadeOut"> 淡出 </option><option value = "fadeOutDown"> 下淡出 </option><option value = "fadeOutDownBig"> 下淡出大 </option><option value = "fadeOutLeft"> 左淡出 </option><option value = "fadeOutLeftBig"> 左淡出大 </option><option value = "fadeOutRight"> 右淡出 </option><option value = "fadeOutRightBig"> 右淡出大 </option><option value = "fadeOutUp"> 上淡出 </option><option value = "fadeOutUpBig"> 上淡出大 </option><option value = "bounceOut"> 弹出 </option><option value = "bounceOutDown"> 下弹出 </option><option value = "bounceOutLeft"> 左弹出 </option><option value = "bounceOutRight"> 右弹出 </option><option value = "bounceOutUp"> 上弹出 </option><option value = "flipOutX"> X翻转 </option><option value = "flipOutY"> Y翻转 </option><option value = "lightSpeedOut"> 光速 </option><option value = "rotateOut"> 旋转 </option><option value = "rotateOutDownLeft"> 左下旋转 </option><option value = "rotateOutDownRight"> 右下旋转 </option><option value = "rotateOutUpLeft"> 左上旋转 </option><option value = "rotateOutUpRight"> 右上旋转 </option><option value = "slideInRight"> 滑动 </option><option value = "zoomOut"> 缩小 </option><option value = "zoomOutDown"> 下缩小 </option><option value = "zoomOutLeft"> 左缩小 </option><option value = "zoomOutRight"> 右缩小 </option><option value = "zoomOutUp"> 上缩小 </option><option value = "rollOut"> 滚出 </option></optgroup></select></div></li><li><label> 时间 </label><p><input type = "number" step="0.1" min="0" max="20" class="ani_dura" value="2"/></p></li><li><label> 延迟 </label><p><input type="number" step="0.1" min="0" max="20" class="ani_delay" value="0"/></p></li><li><label> 次数 </label><p><input type="number" step="1" min="0" max="20" class="ani_count" value="1"/></p></li><button class="ani_remove">删除</button></ul></div> ');
		$('#ani_all').append(ani_one);
		// 初始化动画为 undefined
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', 'undefined 2s ease 0s backwards');
		var ani_obj = {
			"element": elem_id,
			"animation": "undefined",
			"start": 0,
			"type": 0,
			"duration": "2s",
			"delay": "0s",
			"count": 1,
			"timing": "ease",
			"direction": "normal",
			"status": "running",
			"finish": "none",
		};
		// 将初始化的动画存入对应元素对象中 并且更新本地存储
		elemObj[elem_id].animate[ani_id] = ani_obj;
		updataAniStorage();
	}
});
$(document).delegate('#animate>div', 'mousedown', function(e) {
	e.stopPropagation();
});
// 选择动画方式 将动画属性存入对应元素对象中 并且更新本地存储
$(document).delegate('.ani_sel', 'change', function() {
	var ani_name = $(this).children().children("option:selected").val();
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr('id');
	var ani_dur = $('.ani_dura').val();
	$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', ani_name + " " + (ani_dur + "s") + ' ease 0s backwards');
	var ani_obj = {
		"element": elem_id,
		"animation": ani_name,
		"start": 0,
		"type": 0,
		"duration": "2s",
		"delay": "0s",
		"count": 1,
		"timing": "ease",
		"direction": "normal",
		"status": "running",
		"finish": "none",
	};
	elemObj[elem_id].animate[ani_id] = ani_obj;
	updataAniStorage();
	// 动画执行完成 清空animation
	setTimeout(function() {
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)>img')[0].style = "";
	}, ani_dur * 1000 + 100);

});
// 修改动画时间
$(document).delegate('.ani_dura', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_dura = $(this).val() + "s";
	elemObj[elem_id].animate[ani_id].duration = ani_dura;
	updataAniStorage();
});
// 修改动画延迟
$(document).delegate('.ani_delay', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_delay = $(this).val() + "s";
	elemObj[elem_id].animate[ani_id].delay = ani_delay;
	updataAniStorage();
});
// 修改动画次数
$(document).delegate('.ani_count', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_count = $(this).val();
	elemObj[elem_id].animate[ani_id].count = ani_count;
	updataAniStorage();
});
// 删除动画 并且将对应动画从对应元素对象中删除 更新本地存储
$(document).delegate('.ani_remove', 'mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	delete elemObj[elem_id].animate[ani_id];
	updataAniStorage();
	$(this).parents('.' + elem_id).remove();
});

// 预览动画 顺序浏览
/*$("#ani_pre").on('mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var animate = elemObj[elem_id].animate;
	var time = 0;
	$('#drawArea>ul>li[data-cur="1"]>div:eq(0)>img')[0].style="";
	$.each(animate, function(key, value) {
		console.log(value);
		setTimeout(function() {
			$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', value.animation + " " + value.duration + " ease " + value.delay + " backwards");
		}, time);
		time += (parseFloat(value.duration) * 1000 + 500);
	});
});*/
// 预览动画 同时执行
// 动画预览总时间为所有动画中 次数乘以时间加上延迟时间 最大的那个
// 
$("#ani_pre").on('mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var animate = elemObj[elem_id].animate;
	var ani_dur = 0;
	$.each(animate, function(key, value) {
		var box = $('<div></div>');
		var one_dur = parseFloat(value.duration);
		var one_count = parseFloat(value.count);
		var one_delay = parseFloat(value.delay);
		var one_time = one_dur * one_count + one_delay;
		if (one_time > ani_dur) {
			ani_dur = one_time;
		}
		box.css('animation', value.animation + " " + value.duration + " ease " + value.delay + " " + value.count + " backwards");
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().wrap(box);
	});
	// 按照最大时间移除
	setTimeout(function() {
		var img = $('#drawArea>ul>li[data-cur="1"]>div:eq(0) img').clone();
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().remove();
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').append(img);
	}, ani_dur * 1000 + 500);
});

// 删除所有动画
$('#ani_clear').on('mousedown', function() {
	if (!$('#drawArea>ul>li[data-cur="1"]').length) {
		return;
	}
	$('#ani_all').children().remove();
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	elemObj[elem_id].animate = {};
	updataAniStorage();
});