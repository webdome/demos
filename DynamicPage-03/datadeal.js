function dataDeal(returnMsg, category) {
	switch (category) {
		case "gift":
			/*begin*/
			// console.log(returnMsg);
			// console.log(returnMsg.gift);
			var obj01 = returnMsg.gift;
			$("title").text(obj01.giftName);
			// console.log(returnMsg.giftPages);
			var obj02 = returnMsg.giftPages;
			// console.log(returnMsg.giftPageElements);
			var obj03 = returnMsg.giftPageElements;
			// pageJs 为帧页面动画js代码
			var pageJs = "var swiperAnimateParam_main1 = {";
			// 循环页面
			for (var i = 0; i < obj02.length; i++) {
				// pageBox 为帧页面容器
				var pageBox = $('<div class="swiper-slide"></div>');
				var contentBox = $('<div class="contentBox"></div>');
				var bgBox = $('<div class="bgBox"></div>');
				// pageHtml 为帧页面html内容
				var pageHtml = "";
				pageJs += "slide_" + (i + 1) + ":{";
				// 循环页面内的元素
				for (var j = 0; j < obj03.length; j++) {
					// 查找对应帧页面的页面内元素
					if (obj02[i].id == obj03[j].giftPageId) {
						var n = j;
						if (n < 10 && n > 0) {
							n = '0' + n;
						} else if (n == 0) {
							n = '01';
						}
						// 如果元素存在动画 就创建对应js代码
						if (obj03[j].effect) {
							pageJs += 'animate_' + n +
								':{element:"main1_ani_' + n +
								'",animation:"' + obj03[j].effect + '",duration:"' +
								obj03[j].duration + 's",delay:"' + obj03[j].delay + 's"},';
						}
						// 如果该元素是文字 则创建p
						if (obj03[j].ele.eleType == 296) {
							// 获取元素的样式
							var width = obj03[j].width + 'px';
							var left = obj03[j].left + 'px';
							var top = obj03[j].top-40 + 'px';
							var zIndex = obj03[j].zIndex;
							var fonts = parseFloat(parseFloat(obj03[j].fontSize)*100)+'px';
							var color = obj03[j].color;
							var fontw = obj03[j].fontWeight;
							pageHtml += '<p class="main1_ani_' + n + '" style="width:' +
								width + ';top:' + top + ';left:' + left +
								';z-index:' + zIndex + ';font-size:' + fonts +
								';color:' + color + ';font-weight:' + fontw + ';">' +
								obj03[j].ele.path + '</p>';
						} else {
							// 如果该元素是图片 则创建img 或者 background-image
							if (obj03[j].ele.eleType == 62) {
								// 获取元素的样式
								var width = obj03[j].width + 'px';
								var left = obj03[j].left + 'px';
								var top = obj03[j].top-40 + 'px';
								var zIndex = obj03[j].zIndex;
								pageHtml += '<img class="main1_ani_' + n +
									'" src="http://119.90.34.85:81/image/' + obj03[j].ele.path +
									'" style="width:' + width + ';top:' + top +
									';left:' + left + ';z-index:' + zIndex + ';"/>';
							} else if (obj03[j].isbg) {
								bgBox.css('background',
									'url("http://119.90.34.85:81/image/' +
									obj03[j].ele.path + '") no-repeat');
							}
						}
					}
				}
				// 每个帧页面循环完后 封闭js对象 将帧页面html附加到页面上
				pageJs += '},';
				contentBox.append(pageHtml);
				pageBox.append(bgBox);
				pageBox.append(contentBox);
				$(".swiper-wrapper").append(pageBox);
			}
			// 帧页面全部循环完后 封闭全部js代码 创建script标签加入js代码添加到页面
			// 载入Swiper动画控制器初始化文件，与swiper.animate.js文件同时使用
			pageJs += '};';
			var js = document.createElement('script');
			js.text = pageJs;
			document.body.appendChild(js);
			// 在文档结构加载完成之后，载入swiper幻灯片，并初始化所有的动画控制器
			callback();
			/*end*/
			break;
	}
}