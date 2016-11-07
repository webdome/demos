// 只有在制作页预览才能看到这个XX
$('.ysch').on('click', function(e) {
	e.stopPropagation;
	$(parent.document.getElementById('giftData')).remove();
	$(parent.document.getElementById("giftPreview")).remove();
});
// 在全局范围内创建主动画控制器与子动画控制器
var myAC_main1 = new animateControl("main1_ani_");
// 在文档结构加载完成之后，载入swiper幻灯片，并初始化所有的动画控制器
function callback() {
	var mySwiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		grabCursor: true,
		loop: true,
		nextButton: '.swiper-button-next',
		onInit: function(swiper) {
			myAC_main1.init(swiperAnimateParam_main1, swiper);
			myAC_main1.play();
		},
		onSlideChangeEnd: function(swiper) {
			myAC_main1.play();
			// 进度条
			var index = swiper.activeIndex - 1;
			$('.slide_progress>ul>li').css('background-color', '#fff');
			if (index == $('.slide_progress>ul>li').length) {
				$('.slide_progress>ul>li:eq(0)').css('background-color', '#2eb3e8');
			} else {
				$('.slide_progress>ul>li:eq(' + index + ')').css('background-color', '#2eb3e8');
			}
		},
	});
	// 文档元素载入完成后，删除Loading效果
	$("#loading_container").fadeOut(500, function() {
		$(this).remove();
		myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
	});
	$('.anl').click(function() {
		mySwiper.slidePrev();
	});
	$('.anr').click(function() {
		mySwiper.slideNext();
	});
}
// 获取设备信息
var device = window.navigator.appVersion.match(/(Android)|(iPhone)/);
if (device != null) {
	var isPhone = 1;
} else {
	var isPhone = 0;
}
// 判断PC端还是移动端
if (isPhone == 1) {
	var target = $('#giftPreview_phone');
	$('#giftPreview_phone').show();
	setScale();
}
if (isPhone == 0) {
	var target = $('#giftPreview');
	$('.ysch').hide();
	$('.bjsc').show();
}

// 设置meta:vp
function setScale() {
	if (window.top !== window) {
		return;
	}
	var pageScale = 1;
	var width = document.documentElement.clientWidth || 640;
	var height = document.documentElement.clientHeight || 1008;
	if (width / height >= 640 / 1008) {
		pageScale = height / 1008;
	} else {
		pageScale = width / 640;
	}
	var content = 'width=640, initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ', user-scalable=no';
	document.getElementById('viewport').setAttribute('content', content);
}
// 作品预览页 渲染
function dataDeal(returnCode, returnMsg, category, isPhone) {
	switch (category) {
		// 获取单个作品 并且预览
		case "gift_preview":
			console.log(returnMsg);
			var obj01 = returnMsg.gift;
			$(".ciho").text(obj01.giftname);
			var obj02 = returnMsg.giftPages;
			var obj03 = returnMsg.giftPageElements;
			// 创建 container wrapper  外层容器
			var container = $('<div class="swiper-container"></div>');
			var wrapper = $('<div class="swiper-wrapper"></div>');
			// 创建 页面动画js代码
			var pageJs = "var swiperAnimateParam_main1 = {";
			// 循环遍历创建 slide page content 三层容器 以及 bg main 背景容器和内容容器
			for (var i = 0; i < obj02.length; i++) {
				$('<li></li>').appendTo($(target).find('.slide_progress>ul')); //进度条
				var slide = $('<div class="swiper-slide"></div>');
				var page = $('<div class="page"></div>');
				var content = $('<div class="content"></div>');
				var bg = $('<div class="bg"></div>');
				var main = $('<div class="main"></div>');
				var pageHtml = '';
				pageJs += "slide_" + (i + 1) + ":{";
				for (var j = 0; j < obj03.length; j++) {
					if (obj02[i].id == obj03[j].giftpageid) {
						var n = j;
						if (n < 10 && n > 0) {
							n = '0' + n;
						} else if (n == 0) {
							n = '01';
						}
						// 渲染动画JS
						if (obj03[j].animate.length) {
							for (var a = 0; a < obj03[j].animate.length; a++) {
								pageJs += 'animate_' + n + ':{element:"main1_ani_' + n + '",animation:"' + obj03[j].animate[a].animation + '",duration:"' + obj03[j].animate[a].duration + 's",delay:"' + obj03[j].animate[a].delay + 's"},';
							}
						}
						var top = obj03[j].top - obj03[j].height / 2;
						var left = obj03[j].left - obj03[j].width / 2;
						// 文本渲染
						if (obj03[j].eletype == 296) {
							pageHtml += '<p class="main1_ani_' + n + '" style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + obj03[j].top + 'px;left:' + obj03[j].left + 'px;z-index:' + obj03[j].zindex + ';line-height:' + obj03[j].lineheight + 'px;font-size:' + obj03[j].fontsize + 'px;font-family:' + obj03[j].fontfamily + ';font-style:' + obj03[j].fontstyle + ';color:' + obj03[j].color + ';font-weight:' + obj03[j].fontweight + ';transform:rotate(' + obj03[j].rotaangle + 'deg);text-align:' + obj03[j].textalign + ';text-shadow:' + obj03[j].textshadow + ';text-decoration:' + obj03[j].textdecoration + ';padding:10px 20px;box-sizing:border-box;">' + obj03[j].path + '</p>';
						} else if (obj03[j].eletype == 525) {
							if (!obj03[j].backgroundimage) {
								bg.css({
									"background-color": obj03[j].backgroundcolor,
									"opacity": obj03[j].opacity
								});
							} else {
								bg.css({
									'background-image': 'url("http://106.3.37.173:81/image/' + obj03[j].backgroundimage + '")',
									"opacity": obj03[j].opacity
								});
							}
							// 图片
						} else if (obj03[j].eletype == 62) {
							pageHtml += '<img class="main1_ani_' + n + '" src="http://106.3.37.173:81/image/' + obj03[j].path + '" style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;z-index:' + obj03[j].zindex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);border-radius:' + obj03[j].borderradius + '%;"/>';
						} else if (obj03[j].eletype == 409) {
							// 贴图
							pageHtml += '<img class="main1_ani_' + n + '" src="http://106.3.37.173:81/map/' + obj03[j].path + '" style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;z-index:' + obj03[j].zindex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);border-radius:' + obj03[j].borderradius + '%;"/>';
						} else if (obj03[j].eletype == 470) {
							// 图形
							pageHtml += obj03[j].graph.replace('<svg ', '<svg style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderradius + '%;box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);z-index:' + obj03[j].zindexz + ';"').replace('<path ', '<path style="fill:' + obj03[j].backgroundcolor + ';"');
						} else if (obj03[j].eletype == 520) {
							// 输入框
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaangle + 'deg);"><textarea style="width:100%;height:100%;margin:0;padding:0;display:block;background-color:transparent;resize:none;box-shadow:' + obj03[j].boxshadow + ';color:' + obj03[j].color + ';position: relative;z-index: 170;border-radius:' + obj03[j].borderradius + '%;" placeholder=' + JSON.parse(obj03[j].path)[0] + '></textarea><div style="border:' + obj03[j].border + ';background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';position: absolute;top:0;left:0;right:0;bottom:0;z-index:160;"></div></div>';
							// 复选框
						} else if (obj03[j].eletype == 521) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;display:table;transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><input type="checkbox" style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;"/><span style="position:relative;z-index:170;">' + JSON.parse(obj03[j].path)[0] + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + '%;box-shadow:' + obj03[j].boxshadow + ';"></div></div></div>';
							// 单选
						} else if (obj03[j].eletype == 522) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;display:table;transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><input type="radio" style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;"/><span style="position:relative;z-index:170;">' + JSON.parse(obj03[j].path)[0] + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + '%;box-shadow:' + obj03[j].boxshadow + ';"></div></div></div>';
							// 多选
						} else if (obj03[j].eletype == 523) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaangle + 'deg);"><button style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;outline:0;width:100%;height:100%;">' + JSON.parse(obj03[j].path)[0] + '</button><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + '%;box-shadow:' + obj03[j].boxshadow + ';"></div></div>';
							// 下拉框
						} else if (obj03[j].eletype == 524) {
							var box = $('<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + '%;box-shadow:' + obj03[j].boxshadow + ';"></div></div>');
							var select = $('<select style="width:100%;height:100%;position:relative;z-index:170;color:' + obj03[j].color + ';border:0;background-color:transparent;outline:0;"></select>');
							var inputTxt = JSON.parse(obj03[j].path);
							for (var t = 0; t < inputTxt.length; t++) {
								$('<option>' + inputTxt[t] + '</option>').appendTo(select);
							}
							select.appendTo(box);
							pageHtml += box[0].outerHTML;
							// 互动
						}else if (obj03[j].eletype == 527 || obj03[j].eletype == 528 || obj03[j].eletype == 529 || obj03[j].eletype == 530) {
							pageHtml += '<div style="text-align:center;display:table;width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zindex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="width:100%;height:100%;display:table-cell;vertical-align:middle;box-shadow:' + obj03[j].boxshadow + ';">' + obj03[j].graph.replace('<path ', '<path style="fill:' + obj03[j].color + ';"').replace('<svg ', '<svg style="position:relative;z-index:170;width:68px;height:56px;"') + '<span style="position:relative;z-index:170;font-size:60px;color:' + obj03[j].color + ';display:' + obj03[j].display + ';">0</span><div style="background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderradius + '%;position:absolute;top:0;left:0;right:0;bottom:0;z-index:160;"></div></div></div>';
						}
					}
				}
				pageJs += '},';
				main.append(pageHtml);
				content.append(bg);
				content.append(main);
				page.append(content);
				slide.append(page);
				wrapper.append(slide);
				container.append(wrapper);
			}
			$(target).prepend(container);
			// 进度条宽度
			var pagecount = $(target).find('.slide_progress>ul>li').length;
			$('.slide_progress>ul>li').css('width', 'calc(100%/' + pagecount + ')');
			$('<div class="swiper-button-next"></div>').appendTo($(target));
			pageJs += '};';
			var js = document.createElement('script');
			js.text = pageJs;
			document.body.appendChild(js);
			// 启动swiper及动画 删除loading效果
			callback();
			// 生成并插入二维码
			$('#qrcode').qrcode({
				width: 200,
				height: 200,
				text: window.location.href
			});
			// 背景音乐渲染
			if (obj01.mpath != 'bg') {
				$('<div><audio src="' + obj01.mpath + '" loop="loop"></audio><span id="audio"></span></div>').appendTo(target);
				if (isPhone) { // 移动端 放大音乐按钮
					$('#audio').css({
						'width': '80px',
						'height': '80px',
					});
				}
				$('audio')[0].play();
				$('#audio').on('click', function(e) {
					e.stopPropagation;
					if ($('audio')[0].paused) {
						$('audio')[0].play();
						$('#audio').css('animation', 'rota 10s linear infinite');
					} else {
						$('audio')[0].pause();
						$('#audio').css('animation', 'none');
					}
				});
			}
			break;
	}
}
// 制作页预览 渲染
function dataDeal2(returnMsg, category, isPhone) {
	switch (category) {
		// 获取单个作品 并且预览
		case "gift_preview":
			console.log(returnMsg);
			var obj01 = returnMsg.gift;
			$(".ciho").text(obj01.giftname);
			var obj02 = returnMsg.giftPages;
			var obj03 = returnMsg.giftPageElements;
			// 创建 container wrapper  外层容器
			var container = $('<div class="swiper-container"></div>');
			var wrapper = $('<div class="swiper-wrapper"></div>');
			// 创建 页面动画js代码
			var pageJs = "var swiperAnimateParam_main1 = {";
			// 循环遍历创建 slide page content 三层容器 以及 bg main 背景容器和内容容器
			for (var i = 0; i < obj02.length; i++) {
				var slide = $('<div class="swiper-slide"></div>');
				var page = $('<div class="page"></div>');
				var content = $('<div class="content"></div>');
				var bg = $('<div class="bg"></div>');
				var main = $('<div class="main"></div>');
				var pageHtml = '';
				pageJs += "slide_" + (i + 1) + ":{";
				for (var j = 0; j < obj03.length; j++) {
					if (obj03[j].remove) {
						return;
					}
					if (obj02[i].gpid == obj03[j].gpid) {
						var n = j;
						if (n < 10 && n > 0) {
							n = '0' + n;
						} else if (n == 0) {
							n = '01';
						}
						// 渲染动画JS
						if (obj03[j].animate.length) {
							for (var a = 0; a < obj03[j].animate.length; a++) {
								pageJs += 'animate_' + n + ':{element:"main1_ani_' + n + '",animation:"' + obj03[j].animate[a].animation + '",duration:"' + obj03[j].animate[a].duration + 's",delay:"' + obj03[j].animate[a].delay + 's"},';
							}
						}
						var top = obj03[j].top - obj03[j].height / 2;
						var left = obj03[j].left - obj03[j].width / 2;
						// 文本渲染
						if (obj03[j].eleType == 296) {
							pageHtml += '<p class="main1_ani_' + n + '" style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + obj03[j].top + 'px;left:' + obj03[j].left + 'px;z-index:' + obj03[j].zIndex + ';font-size:' + obj03[j].fontSize + 'px;font-family:' + obj03[j].fontFamily + ';color:' + obj03[j].color + ';font-weight:' + obj03[j].fontWeight + ';font-style:' + obj03[j].fontStyle + ';transform:rotate(' + obj03[j].rotaAngle + 'deg);text-align:' + obj03[j].textAlign + ';text-shadow:' + obj03[j].textShadow + ';line-height:' + obj03[j].lineHeight + 'px;word-break:break-word;box-sizing:border-box;text-decoration:' + obj03[j].textDecoration + ';">' + obj03[j].fontText + '</p>';
						} else if (obj03[j].eleType == 525) {
							if (!obj03[j].backgroundImage) {
								bg.css({
									"background-color": obj03[j].backgroundColor,
									"opacity": obj03[j].opacity
								});
							} else {
								bg.css({
									'background-image': 'url(' + obj03[j].backgroundImage + ')',
									"opacity": obj03[j].opacity
								});
							}
							// 图片
						} else if (obj03[j].eleType == 62) {
							var src = $(parent.document).find('.sc-tp .tu-p[data-id="' + obj03[j].eleId + '"]').attr('data-url');
							pageHtml += '<img class="main1_ani_' + n + '" src=' + src + ' style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;z-index:' + obj03[j].zIndex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxShadow + ';transform:rotate(' + obj03[j].rotaAngle + 'deg);border-radius:' + obj03[j].borderRadius + '%;"/>';
							// 贴图
						} else if (obj03[j].eleType == 409) {
							var src = $(parent.document).find('.tie-z .tu-p[data-id="' + obj03[j].eleId + '"]').attr('data-url');
							pageHtml += '<img class="main1_ani_' + n + '" src=' + src + ' style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;z-index:' + obj03[j].zIndex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxShadow + ';transform:rotate(' + obj03[j].rotaAngle + 'deg);border-radius:' + obj03[j].borderRadius + '%;"/>';
							// 图形
						} else if (obj03[j].eleType == 470) {
							var svg = $(parent.document).find('.xing-z .tu-p[data-id="' + obj03[j].eleId + '"]').html();
							pageHtml += svg.replace('<svg ', '<svg style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;top:' + top + 'px;left:' + left + 'px;opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderRadius + '%;box-shadow:' + obj03[j].boxShadow + ';transform:rotate(' + obj03[j].rotaAngle + 'deg);z-index:' + obj03[j].zIndexz + ';"').replace('<path ', '<path style="fill:' + obj03[j].fill + ';"');
							// 输入框
						} else if (obj03[j].eleType == 520) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><textarea style="width:100%;height:100%;margin:0;padding:0;display:block;background-color:transparent;resize:none;box-shadow:' + obj03[j].boxShadow + ';color:' + obj03[j].color + ';position: relative;z-index: 170;border-radius:' + obj03[j].borderRadius + '%;" placeholder=' + obj03[j].inputTxt[0] + '></textarea><div style="border-size:' + obj03[j].borderSize + ';border-color:' + obj03[j].borderColor + ';background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';position: absolute;top:0;left:0;right:0;bottom:0;z-index:160;"></div></div>';
							// 复选框
						} else if (obj03[j].eleType == 521) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;display:table;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><div style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><input type="checkbox" style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;"/><span style="position:relative;z-index:170;">' + obj03[j].inputTxt[0] + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderRadius + '%;box-shadow:' + obj03[j].boxShadow + ';"></div></div></div>';
							// 单选框
						} else if (obj03[j].eleType == 522) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;display:table;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><div style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><input type="radio" style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;"/><span style="position:relative;z-index:170;">' + obj03[j].inputTxt[0] + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderRadius + '%;box-shadow:' + obj03[j].boxShadow + ';"></div></div></div>';
							// 按钮
						} else if (obj03[j].eleType == 523) {
							pageHtml += '<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><button style="color:' + obj03[j].color + ';position:relative;z-index:170;border:0;background-color:transparent;outline:0;width:100%;height:100%;">' + obj03[j].inputTxt[0] + '</button><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderRadius + '%;box-shadow:' + obj03[j].boxShadow + ';"></div></div>';
							// 下拉框
						} else if (obj03[j].eleType == 524) {
							var box = $('<div style="width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderRadius + '%;box-shadow:' + obj03[j].boxShadow + ';"></div></div>');
							var select = $('<select style="width:100%;height:100%;position:relative;z-index:170;color:' + obj03[j].color + ';border:0;background-color:transparent;outline:0;"></select>');
							for (var t = 0; t < obj03[j].inputTxt.length; t++) {
								$('<option>' + obj03[j].inputTxt[t] + '</option>').appendTo(select);
							}
							select.appendTo(box);
							pageHtml += box[0].outerHTML;
							// 互动
						} else if (obj03[j].eleType == 527 || obj03[j].eleType == 528 || obj03[j].eleType == 529 || obj03[j].eleType == 530) {
							var svg = $(parent.document).find('.xzs-t>div[data-id="'+obj03[j].eleId+'"]').html();
							pageHtml += '<div style="text-align:center;display:table;width:' + obj03[j].width + 'px;height:' + obj03[j].height + 'px;z-index:' + obj03[j].zIndex + ';top:' + top + 'px;left:' + left + 'px;transform:rotate(' + obj03[j].rotaAngle + 'deg);"><div style="width:100%;height:100%;display:table-cell;vertical-align:middle;box-shadow:' + obj03[j].boxShadow + ';">' + svg.replace('<path ', '<path style="fill:' + obj03[j].color + ';"').replace('<svg ', '<svg style="position:relative;z-index:170;width:68px;height:56px;"') + '<span style="position:relative;z-index:170;font-size:60px;color:' + obj03[j].color + ';display:' + obj03[j].display + ';">0</span><div style="background-color:' + obj03[j].backgroundColor + ';opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderRadius + '%;position:absolute;top:0;left:0;right:0;bottom:0;z-index:160;"></div></div></div>';
							// 擦一擦
						}else if (obj03[j].eleType == 407) {

							// 摇一摇
						}else if (obj03[j].eleType == 406) {

						}
					}
				}
				pageJs += '},';
				main.append(pageHtml);
				content.append(bg);
				content.append(main);
				page.append(content);
				slide.append(page);
				wrapper.append(slide);
				container.append(wrapper);
			}
			$(target).prepend(container);
			$('<div class="swiper-button-next"></div>').appendTo($(target));
			pageJs += '};';
			var js = document.createElement('script');
			js.text = pageJs;
			document.body.appendChild(js);
			// 启动swiper及动画
			callback();
			// 背景音乐渲染
			if (obj01.music) {
				var src = $(parent.document).find('#' + obj01.music).attr('data-url');
				$('<div><audio src=' + src + ' loop="loop"></audio><span id="audio"></span></div>').appendTo(target);
				$('audio')[0].play();
				$('#audio').on('click', function(e) {
					e.stopPropagation;
					if ($('audio')[0].paused) {
						$('audio')[0].play();
						$('#audio').css('animation', 'rota 10s linear infinite');
					} else {
						$('audio')[0].pause();
						$('#audio').css('animation', 'none');
					}
				});
			}
			break;
	}
}
// 数据解密------------------------
function getData(packets, interName, methName, category, isPhone) {
	var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
	var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
	var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
	var packetsAES = CryptoJS.AES.encrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString();
	var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") + "]";
	var signMD5 = CryptoJS.MD5(sign).toString();
	$.ajax({
		url: 'http://106.3.37.173:8080/love/' + interName,
		// url: 'http://192.168.1.10:8080/love/' + interName,
		type: 'get',
		dataType: 'json',
		data: {
			'op': methName,
			'packets': packetsAES,
			'sign': signMD5
		},
		success: function(res) {
			var returnCode = res.returnCode;
			var returnMsg = res.returnMsg;
			if (returnCode === "000") {
				returnMsg = CryptoJS.AES.decrypt(returnMsg, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.Pkcs7
				});
				try {
					returnMsg = JSON.parse(returnMsg.toString(CryptoJS.enc.Utf8));
				} catch (err) {
					returnMsg = returnMsg.toString(CryptoJS.enc.Utf8);
				}
			}
			if (typeof dataDeal === "function") {
				dataDeal(returnCode, returnMsg, category, isPhone);
			} else {
				console.log("dataDeal is not defined");
			}
		}
	});
}
// 获取作品ID 展示作品  获取失败则为制作页浏览
try {
	var gift_id = window.location.href.match(/gift_id=(\d+)/g).join('').split('=')[1];
	getData({
		"gid": gift_id,
	}, 'giftsService.do', 'getGiftDetail', 'gift_preview', isPhone);
	// 作品预览页 loading 效果  、 制作页预览无此效果
	$(function() {
		loading_container = '<div id="loading_container" style="position:absolute;z-index:1000;width:100%;height:100%;padding:0;margin:0;text-align:center;background-color:#ffffff;"><div id="loading_circle_pos">';
		loading_container += '<div id="loading_circle">';
		loading_container += '<span id="outer"><span id="inner"></span></span>';
		loading_container += 'Loading';
		loading_container += '<div id="loading_slow">网速有点慢，请继续等待或 <a href="#" id="loading_refresh">重载</a> 网页。</div>';
		loading_container += '</div>';
		loading_container += '</div></div>';
		$(target).prepend(loading_container);
		setTimeout(function() {
				$("#loading_slow").fadeIn(500)
			},
			5000);
		$("#loading_refresh").click(function() {
			location.reload();
			return !1;
		});
	});
} catch (err) {
	$('.ysch').show();
	$('.gnyky').hide();
	$('.gnykz').css({
		"float": "inherit",
		"margin": "auto"
	});
	var giftData = window.localStorage.getItem('giftData');
	var giftObj = JSON.parse(giftData);
	dataDeal2(giftObj, 'gift_preview', isPhone);
}