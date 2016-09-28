// 点击素材库添加元素
var zoneIndex = 1;
$("#material>div").on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// 隐藏画布区的所有操作点
	$("#drawArea>div>div").not('.pic,.txt').hide();
	// 克隆点击的元素 追加到画布区 设置为绝对定位
	var cloneElem = $(this).clone(false, true).appendTo('#drawArea').css({
		"position": 'absolute',
		"top": '0',
		"left": "0",
		"z-index": zoneIndex++
	});
	// 显示克隆元素的操作点 
	cloneElem.children().show();
	cloneElem.attr('data-cur', '1');
	if (cloneElem.children().eq(0).attr('class') == "container") {
		var one = new newGraph(cloneElem);
	} else if (cloneElem.children().eq(0).attr('class') == "pic") {
		var one = new newPic(cloneElem);
	} else if (cloneElem.children().eq(0).attr('class') == "txt") {
		var one = new newTxt(cloneElem);
	}
});
// 取消默认右键菜单事件
document.oncontextmenu = function(e) {
	e.preventDefault();
	e.stopPropagation();
};

// 点击空白区域隐藏操作点
$(document).on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#drawArea>div").attr('data-cur', '0'); // 将当前激活项设置为空
	$("#drawArea>div>div").not('.pic,.txt').hide(); // 除了图片和文本以外的所有控制单元都隐藏
	// 文本框的处理
	$("#drawArea .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
	$(".rightList").hide();
});

// 点击哪个图形哪个的操作点就出现
$(document).delegate('#drawArea>div', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// step 1
	$("#drawArea>div>div").not('.pic,.txt').hide(); // 将所有控制单元隐藏
	$("#drawArea>div").attr('data-cur', '0'); // 将当前激活项清空
	// step 2
	$(this).children().show(); // 将点击的当前项控制单元显示
	$(this).attr('data-cur', '1'); // 将点击的当前项设置为激活项
});
// delete 按键删除元素
document.onkeydown = function(e) {
	e.stopPropagation();
	if (e.keyCode === 46) { // 如果键盘按的是delete键就删除当前激活项
		$('#drawArea>div[data-cur="1"]').remove();
	}
}

// 双击文本编辑
$(document).delegate('#drawArea .box_txt', 'dblclick', function(e) {
	// 先将所有文本框 去边框 设置为不可编辑 失焦
	$("#drawArea .box_txt").css('border', '0');
	$('#drawArea .box_txt .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
	// 双击文本框 隐藏移动单元 给大盒子加边框 
	$(this).css('border', '1px dashed #2eb3e8').children('.container').hide();
	// 将文本框设置为可编辑并且获得焦点
	$(this).children('.txt').attr('data-edit', '1').children().attr('contenteditable', 'true').focus();
	document.execCommand("selectAll");
});
// 失焦后再次点击
$(document).delegate('#drawArea .txt>div', 'mousedown', function(e) {
	// e.preventDefault();
	e.stopPropagation();
	if ($(this).parent().attr('data-edit') == 0) {
		// 文本框的处理
		$("#drawArea .box_txt").css('border', '0');
		$('#drawArea .box_txt .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
		$("#drawArea>div>div").not('.pic,.txt').hide()
		$(this).parents(".box_txt").children().show();
	}
	$("#drawArea>div").attr('data-cur', '0')
	$(this).parents(".box_txt").attr('data-cur', '1');
});
// 裁切功能
function calCoord(c) {
	x = c.x;
	y = c.y;
	w = c.w;
	h = c.h;
};

function useCut() {
	var jcrop_api, x, y, w, h, originalWidth, originalHeight;
	$('#target').Jcrop({
		onChange: calCoord,
		onSelect: calCoord,
	}, function() {
		jcrop_api = this;
		// originalWidth = $("#target").width();
		// originalHeight = $("#target").height();
		jcrop_api.animateTo([0, 0, 100, 100]);
	});
};

// 右键菜单
var zIndex = 1;
var sendSrc = "";
var imgW, imgH, boxW, boxH;
$('#function>ul>li').on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	var i = $(this).index();
	if (i == 0) {
		zIndex++;
		$('#drawArea>div[data-cur="1"]').css('z-index', zIndex);
	} else if (i == 1) {
		zIndex--;
		$('#drawArea>div[data-cur="1"]').css('z-index', zIndex);
	} else if (i == 2) {
		zIndex = 1;
		$('#drawArea>div[data-cur="1"]').css('z-index', zIndex);
	} else if (i == 3) {
		zIndex = 10;
		$('#drawArea>div[data-cur="1"]').css('z-index', zIndex);
	} else if (i == 4) {
		if ($('#drawArea>div[data-cur="1"]>div:eq(0)').attr('class') == 'pic') {
			var cutlayer = $('<div id="cutlayer"><div id="cl_top">图片裁切</div><div id="clr_middle"><div id="clm_left"><img src="" id="target" /></div><div id="clm_right">待定</div></div><div id="cl_bottom"><div>取消</div><div>确定</div></div></div>');
			cutlayer.appendTo($('body'));
			$("#cutlayer").show(300);
			$(".rightList").hide();
			var src = $('#drawArea>div[data-cur="1"]>div:eq(0)>img').attr("data-src");
			sendSrc = src.split("/").pop();
			$("#target").attr("src", src);
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
	} else if(i == 5){
		sessionStorage.clear();
	}else if (i == 6) {
		// var str = window.localStorage.getItem();
		// json = JSON.parse(str);
		// console.log(sessionStorage);
		var arr = [];
		$.each(sessionStorage,function(key,value){
			var obj = JSON.parse(value);
			arr.push(obj);
		});
		console.log(arr);
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