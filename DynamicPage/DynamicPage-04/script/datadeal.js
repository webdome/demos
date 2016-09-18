function dataDeal(returnMsg, category) {
	switch (category) {
		case "gift":
			/*begin*/
			console.log(returnMsg.gift);
			var obj01 = returnMsg.gift;
			$("title").text(obj01.giftName);
			console.log(returnMsg.giftPages);
			var obj02 = returnMsg.giftPages;
			console.log(returnMsg.giftPageElements);
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
					if (obj02[i].id == obj03[j].giftPageId) {
						var n = j;
						if (n < 10 && n > 0) {
							n = '0' + n;
						} else if (n == 0) {
							n = '01';
						}
						if (obj03[j].effect) {
							pageJs += 'animate_' + n +
								':{element:"main1_ani_' + n +
								'",animation:"' + obj03[j].effect + '",duration:"' +
								obj03[j].duration + 's",delay:"' + obj03[j].delay + 's"},';
						}
						if (obj03[j].ele.eleType == 296) {
							var width = obj03[j].width / 100 + 'rem';
							var pleft = obj03[j].left / 100 + 'rem';
							var ptop = obj03[j].top / 100 + 'rem';
							var zIndex = obj03[j].zIndex;
							var fonts = obj03[j].fontSize;
							var color = obj03[j].color;
							var fontw = obj03[j].fontWeight;
							pageHtml += '<p class="main1_ani_' + n + '" style="width:' +
								width + ';top:' + ptop + ';left:' + pleft +
								';z-index:' + zIndex + ';font-size:' + fonts +
								';color:' + color + ';font-weight:' + fontw + ';">' +
								obj03[j].ele.path + '</p>';
						} else {
							if (obj03[j].isbg == 1) {
								bg.css('background-image',
									'url("http://119.90.34.85:81/image/' +
									obj03[j].ele.path + '")');
							} else if (obj03[j].ele.eleType == 62) {
								var width = obj03[j].width / 100 + 'rem';
								var pleft = obj03[j].left / 100 + 'rem';
								var ptop = obj03[j].top / 100 + 'rem';
								var zIndex = obj03[j].zIndex;
								pageHtml += '<img class="main1_ani_' + n +
									'" src="http://119.90.34.85:81/image/' + obj03[j].ele.path +
									'" style="width:' + width + ';top:' + ptop +
									';left:' + pleft + ';z-index:' + zIndex + ';"/>';
							}
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
			$('body').prepend(container);
			pageJs += '};';
			var js = document.createElement('script');
			js.text = pageJs;
			document.body.appendChild(js);
			callback();
			/*end*/
			break;
	}
}