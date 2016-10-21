$(function() {
	/*屏幕高度适应*/
	if (document.getElementById("index")) {
		var h = window.innerHeight;
		var w = window.innerWidth;
		$(".swiper-wrapper").css({
			'width': w + 'px',
			'height': h + 'px'
		});
		$(window).on('resize', function() {
			var h = window.innerHeight;
			var w = window.innerWidth;
			if (w<=1024) {
				w = 1024; 
			}
			$(".swiper-wrapper").css({
				'width': w + 'px',
				'height': h + 'px'
			});
		});
	}
	/*所有页面导航栏右侧按钮点击事件 开始*/
	$(".page_box").on('click', function() {
		event.preventDefault();
		if ($(this).attr("data-s") == 0) {
			$(".page_one").css({
				"animation": 'one 0.5s ease-in-out 1',
				"-moz-animation": 'one 0.5s ease-in-out 1',
				"-webkit-animation": 'one 0.5s ease-in-out 1',
				"-o-animation": 'one 0.5s ease-in-out 1',
				"animationFillMode": 'forwards'
			});
			$(".page_two").css({
				"animation": 'two 0.25s ease-in-out 0.25s 1',
				"animationFillMode": 'forwards'
			});
			$(".page_three").css({
				"animation": 'three 0.5s ease-in-out 1',
				"animationFillMode": 'forwards'
			});
			$(this).attr("data-s", "1");
			$(".page_share").slideDown(500);
		} else if ($(this).attr("data-s") == 1) {
			$(".page_one").css({
				"animation": 'one_back 0.3s ease-in-out 1',
				"animationFillMode": 'forwards'
			});
			$(".page_two").css({
				"animation": 'two_back 0.3s ease-in-out 1',
				"animationFillMode": 'forwards'
			});
			$(".page_three").css({
				"animation": 'three_back 0.3s ease-in-out 1',
				"animationFillMode": 'forwards'
			});
			$(this).attr("data-s", "0");
			$(".page_share").slideUp(300);
		}
	});
	/*所有页面导航栏右侧按钮点击事件 结束*/

	/*------------------首页动画效果 开始----------------------*/
	if (document.getElementById("index")) {

		// 导航栏文字下划线 鼠标移入效果
		$("#nav>div>ul>li>a").hover(function() {
			if (!$(this).hasClass('nav_link_up')) {
				$(this).addClass('nav_link_show');
			}
		}, function() {
			if (!$(this).hasClass('nav_link_up')) {
				$(this).removeClass('nav_link_show');
			}
		});
		// 导航栏文字下划线 点击效果 ---结合swiper的分页器实现
		$("#nav>div>ul>li>a").click(function(e) {
			e.preventDefault();
			var i = $("#nav>div>ul>li>a").index($(this));
			$("#nav>div>ul>li>a").removeClass('nav_link_up nav_link_show').addClass('nav_link_down');
			$(this).removeClass('nav_link_down').addClass('nav_link_up');
			$(".swiper-pagination>span:eq(" + i + ")").trigger('click');
		});

		// 第二屏 图标动画 悬停样式
		$(".mi_move").hover(function() {
			$(this).removeClass('mi_move mi_show').addClass('mi_stop');
			$(this).prev().hide();
		}, function() {
			$(this).removeClass('mi_stop').addClass('mi_move mi_show');
			$(this).prev().show();
		});

		// 第三屏 案例点击切换效果
		var cnum = 0;
		$(".arrowright").click(function() {
			$("#index_case_box>div:eq(" + cnum + ")")
				.removeClass("zoomInRight zoomInLeft")
				.addClass('zoomOutLeft');
			cnum++;
			if (cnum > 2) {
				cnum = 2;
			}
			$("#index_case_box>div:eq(" + cnum + ")")
				.removeClass("zoomOutLeft zoomOutRight")
				.addClass('zoomInRight');
		});
		$(".arrowleft").click(function() {
			$("#index_case_box>div:eq(" + cnum + ")")
				.removeClass("zoomInRight zoomInLeft")
				.addClass('zoomOutRight');
			cnum--;
			if (cnum < 0) {
				cnum = 0;
			}
			$("#index_case_box>div:eq(" + cnum + ")")
				.removeClass("zoomOutLeft zoomOutRight")
				.addClass('zoomInLeft');
		});
		// 第三屏 案例拖动切换效果
		// var cmove = false;
		// var bx = 0;
		// $("#index_case_box").on('mousedown', function(event) {
		// 	event.preventDefault();
		// 	cmove = true;
		// 	bx = event.offsetX;
		// });
		// $("#index_case_box").on('mousemove', function(event) {
		// 	event.preventDefault();
		// 	if (cmove && event.offsetX - bx < -400) {
		// 		$("#index_case_box>div:eq(" + cnum + ")")
		// 			.removeClass("zoomInRight zoomInLeft")
		// 			.addClass('zoomOutLeft');
		// 		cnum++;
		// 		if (cnum > 2) {
		// 			cnum = 2;
		// 		}
		// 		$("#index_case_box>div:eq(" + cnum + ")")
		// 			.removeClass("zoomOutLeft zoomOutRight")
		// 			.addClass('zoomInRight');
		// 	}
		// 	if (cmove && event.offsetX - bx > 400) {
		// 		$("#index_case_box>div:eq(" + cnum + ")")
		// 			.removeClass("zoomInRight zoomInLeft")
		// 			.addClass('zoomOutRight');
		// 		cnum--;
		// 		if (cnum < 0) {
		// 			cnum = 0;
		// 		}
		// 		$("#index_case_box>div:eq(" + cnum + ")")
		// 			.removeClass("zoomOutLeft zoomOutRight")
		// 			.addClass('zoomInLeft');
		// 	}
		// 	$("#index_case_box").on('mouseup', function(event) {
		// 		event.preventDefault();
		// 		cnum = false;
		// 	});
		// });
		// 第四屏 文字悬停/点击效果
		$(".sec4_txt").hover(function() {
			if (!$(this).hasClass('sec4_txt_cur')) {
				$(".sec4_txt").css("transition-delay", "0s")
				$(this).addClass('sec4_txt_hover');
			}
		}, function() {
			$(this).removeClass('sec4_txt_hover');
		}).click(function() {
			$(".sec4_txt").removeClass('sec4_txt_cur');
			$(this).addClass('sec4_txt_cur')
		});;

		// 第五屏 职位悬停效果
		$("#sec5_middle>div>h2").hover(function() {
			$(this).addClass('sec5_txt_hover');
		}, function() {
			$(this).removeClass('sec5_txt_hover');
		});
		// 第五屏 职位点击效果
		$("#sec5_middle>div>h2").click(function() {
			$("#sec5_middle>div>h2").not($(this)).css({
				'transition-delay': '0.3s',
				'opacity': 1,
				'transform': 'scale(1)'
			}).next("div").css({
				'opacity': 0,
				'transform': 'scale(0)'
			}).removeClass('sec5_txt_cur');
			$(this).css({
				'opacity': 0,
				'transform': 'scale(0)'
			}).next("div").css({
				'opacity': 1,
				'transform': 'scale(1)'
			}).addClass('sec5_txt_cur');
		});
	}
	// 第一屏 背景canvas-------------
	if (document.getElementById("index")) {

		var canvas = document.getElementById('sec1_bg'),
			ctx = canvas.getContext('2d'),
			w = canvas.width = window.innerWidth,
			h = canvas.height = window.innerHeight,

			hue = 217,
			stars = [],
			count = 0,
			maxStars = 1300; //星星数量

		var canvas2 = document.createElement('canvas'),
			ctx2 = canvas2.getContext('2d');
		canvas2.width = 100;
		canvas2.height = 100;
		var half = canvas2.width / 2,
			gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
		gradient2.addColorStop(0.025, '#CCC');
		gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
		gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
		gradient2.addColorStop(1, 'transparent');

		ctx2.fillStyle = gradient2;
		ctx2.beginPath();
		ctx2.arc(half, half, half, 0, Math.PI * 2);
		ctx2.fill();

		// End cache

		function random(min, max) {
			if (arguments.length < 2) {
				max = min;
				min = 0;
			}

			if (min > max) {
				var hold = max;
				max = min;
				min = hold;
			}

			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function maxOrbit(x, y) {
			var max = Math.max(x, y),
				diameter = Math.round(Math.sqrt(max * max + max * max));
			return diameter / 2;
			//星星移动范围，值越大范围越小，
		}

		var Star = function() {

			this.orbitRadius = random(maxOrbit(w, h));
			this.radius = random(60, this.orbitRadius) / 8;
			//星星大小
			this.orbitX = w / 2;
			this.orbitY = h / 2;
			this.timePassed = random(0, maxStars);
			this.speed = random(this.orbitRadius) / 900000;
			//星星移动速度
			this.alpha = random(2, 10) / 10;

			count++;
			stars[count] = this;
		}

		Star.prototype.draw = function() {
			var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
				y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
				twinkle = random(10);

			if (twinkle === 1 && this.alpha > 0) {
				this.alpha -= 0.05;
			} else if (twinkle === 2 && this.alpha < 1) {
				this.alpha += 0.05;
			}

			ctx.globalAlpha = this.alpha;
			ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
			this.timePassed += this.speed;
		}

		for (var i = 0; i < maxStars; i++) {
			new Star();
		}

		function animation() {
			ctx.globalCompositeOperation = 'source-over';
			ctx.globalAlpha = 0.5; //尾巴
			ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
			ctx.fillRect(0, 0, w, h)

			ctx.globalCompositeOperation = 'lighter';
			for (var i = 1, l = stars.length; i < l; i++) {
				stars[i].draw();
			};

			window.requestAnimationFrame(animation);
		}

		animation();
	}
	// 首页 第二屏canvas----------------
	if (document.getElementById("index")) {
		// 遮罩层
		var h = window.innerHeight;
		var w = window.innerWidth;
		$("#sec2_bgcover").css({
			'width': w + 'px',
			'height': h + 'px'
		});
		// canvas 满屏显示
		var h = window.innerHeight;
		var w = window.innerWidth;
		var c = document.getElementById("sec2_bg");
		c.setAttribute('width', w);
		c.setAttribute('height', h);
		// 碰撞的小球
		var canvas = document.getElementById("sec2_bg");
		var cxt = canvas.getContext("2d");
		var maxNum = 15;
		var ballArray = new Array();
		var maxX = canvas.width;
		var maxY = canvas.height;
		// 生成指定个数的随机小球 各项属性 位置 半径 颜色 速度 并存入ballArray数组中
		for (var n = 0; n < maxNum; n++) {
			var r = Math.floor(Math.random() * (50 - 20 + 1) + 20);
			var x = {
				x: getRandomNumber(r, maxX - r),
				y: getRandomNumber(r, maxY - r),
				r: r,
				vX: getRandomNumber(0.3, 0.8),
				vY: getRandomNumber(0.3, 0.8),
				color: getRandomColor(),
				// color: "rgba(0,0,255,0.4)",
			}
			ballArray.push(x);
		}
	}
	// 随机数函数
	function getRandomNumber(min, max) {
		return (min + Math.floor(Math.random() * (max - min + 1)))
	}
	// 随机颜色函数
	function getRandomColor() {
		return (function(m, s, c) {
			return (c ? arguments.callee(m, s, c - 1) : '#') +
				s[m.floor(m.random() * 16)]
		})(Math, '0123456789abcdef', 5)
	}
	// 画球函数
	function draw() {
		// 填充画布
		cxt.fillStyle = "rgba(97,109,181,0.6)";
		cxt.globalAlpha = 0.8;
		cxt.fillRect(0, 0, canvas.width, canvas.height);
		// 遍历球数组
		for (i in ballArray) {
			var x = i;
			// 定义球运动的速度
			ballArray[i].x += ballArray[i].vX;
			ballArray[i].y += ballArray[i].vY;
			// 限定球运动的范围 如果到达边界则反向运动
			if (ballArray[i].x >= maxX - r) {
				ballArray[i].x = maxX - r;
				ballArray[i].vX = -ballArray[i].vX;
			}
			if (ballArray[i].x <= r) {
				ballArray[i].x = r;
				ballArray[i].vX = -ballArray[i].vX;
			}
			if (ballArray[i].y >= maxY - r) {
				ballArray[i].y = maxY - r;
				ballArray[i].vY = -ballArray[i].vY;
			}
			if (ballArray[i].y <= r) {
				ballArray[i].y = r;
				ballArray[i].vY = -ballArray[i].vY;
			}
			// 设定 碰撞参数
			for (var j = 0; j < maxNum; j++)
				if (j !== x) {
					if (Math.round(Math.pow(ballArray[x].x - ballArray[j].x, 2) +
							Math.pow(ballArray[x].y - ballArray[j].y, 2)) <=
						Math.round(Math.pow(r + r, 2))) {

						var tempX = ballArray[x].vX;
						var tempY = ballArray[x].vY;
						ballArray[x].vX = ballArray[j].vX;
						ballArray[j].vX = tempX;
						ballArray[x].vY = ballArray[j].vY;
						ballArray[j].vY = tempY;
					}
				}
				// 将参数设定好的球画到画布
			cxt.beginPath();
			cxt.fillStyle = ballArray[i].color;
			cxt.arc(ballArray[i].x, ballArray[i].y, ballArray[i].r, 0, Math.PI * 2, true);
			cxt.closePath();
			cxt.fill();

		}
		// 更新球的位置
		setTimeout(function() {
			draw();
		}, 1);
	}
	/*最新动态背景------------*/

	/*首页 屏幕进入动画效果-------------------*/
	// 首屏进入时 动画效果
	if (document.getElementById("index")) {
		$('.secm1').css({
			'transition-delay': '0.2s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		$('.secm2').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		$('.secm3').css({
			'transition-delay': '1s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
	}
	// 首页全屏滚动效果
	// 动画封装 
	// 第一屏 进入效果
	function firstIn(elem) {
		elem.find('.secm1').css({
			'transition-delay': '0.8s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.secm2').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.secm3').css({
			'transition-delay': '0.2s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
	}
	// 第一屏 退出动画
	function firstOut(elem) {
		elem.find('.secm1').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.secm2').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
		elem.find('.secm3').css({
			'transition-delay': '0s',
			'transform': 'translateY(400px)',
			'opacity': '0'
		});
	}
	// 第二屏 进入效果
	function secondIn(elem) {
		draw();
		elem.find('h1').css({
			'transition-delay': '0.4s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.blueline').css({
			'opacity': '1'
		});
		elem.find('p').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px) rotate(0deg)',
			'opacity': '1'
		});
		elem.find('#profession>.m_icon').css({
			'transition-delay': '0.8s',
			'transform': 'translate(0px,0px) rotate(0deg)',
			'opacity': '1'
		});
		elem.find('#resource>.m_icon').css({
			'transition-delay': '1s',
			'transform': 'translateY(0px) rotate(0deg)',
			'opacity': '1'
		});
		elem.find('#attitude>.m_icon').css({
			'transition-delay': '1.2s',
			'transform': 'translate(0px,0px)',
			'opacity': '1'
		});
		elem.find('.m_icon~h2').css({
			'transition-delay': '1s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
		elem.find('#sec2_bgcover').css({
			'opacity': '1'
		});
		elem.find('.more').css({
			'opacity': '1'
		});
	}

	// 第二屏 退出动画
	function secondOut(elem) {
		elem.find('h1').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.blueline').css({
			'opacity': '0'
		});
		elem.find('p').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
		elem.find('#profession>.m_icon').css({
			'transition-delay': '0s',
			'transform': 'translate(-200px,200px) rotate(360deg)',
			'opacity': '0'
		});
		elem.find('#resource>.m_icon').css({
			'transition-delay': '0s',
			'transform': 'translateY(200px) rotate(360deg)',
			'opacity': '0'
		});
		elem.find('#attitude>.m_icon').css({
			'transition-delay': '0s',
			'transform': 'translate(200px,200px) rotate(360deg)',
			'opacity': '0'
		});
		elem.find('.m_icon~h2').css({
			'transition-delay': '0s',
			'transform': 'translateY(400px)',
			'opacity': '0'
		});
		elem.find('#sec2_bgcover').css({
			'opacity': '0.5'
		});
		elem.find('.more').css({
			'opacity': '0'
		});
	}
	// 第三屏 进入效果
	function threeIn(elem) {
		elem.find('h1').css({
			'transition-delay': '0.4s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.blueline').css({
			'opacity': '1'
		});
		elem.find('p').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.arrowleft,.arrowright').css({
			'transition-delay': '0.8s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
		elem.find('.case_01,.case_02').css({
			'transition-delay': '1s',
			'transform': 'scale(1) translateX(0px)',
			'opacity': '1'
		});
		elem.find('.case_03,.case_04').css({
			'transition-delay': '1s',
			'transform': 'scale(1) translateX(0px)',
			'opacity': '1'
		});
		elem.find('.more').css({
			'opacity': '1'
		});
	}
	// 第三屏 退出效果
	function threeOut(elem) {
		elem.find('h1').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.blueline').css({
			'opacity': '0'
		});
		elem.find('p').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.arrowleft,.arrowright').css({
			'transform': 'translateY(-400px)',
			'transition-delay': '0s',
			'opacity': '0'
		});
		elem.find('.case_01,.case_02').css({
			'transition-delay': '0s',
			'transform': 'scale(0.2) translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.case_03,.case_04').css({
			'transition-delay': '0s',
			'transform': 'scale(0.2) translateX(400px)',
			'opacity': '0'
		});
		elem.find('.more').css({
			'opacity': '0'
		});
	}
	// 第四屏 进入效果
	function fourIn(elem) {
		elem.find('h1').css({
			'transition-delay': '0.4s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.blueline').css({
			'opacity': '1'
		});
		elem.find('p').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.sec4_middle>div>img').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.sec4_des').css({
			'transition-delay': '0.8s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
		elem.find('.sec4_txt').css({
			'transition-delay': '1s',
			'transform': 'scale(1)',
			'opacity': '1'
		});
		elem.find('.sec4_txt>div').css({
			'transition-delay': '1s',
			'transform': 'translateX(0px) scale(1)',
			'opacity': '1'
		});
		elem.find('.sec4_txt>p').css({
			'transition-delay': '1.2s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.more').css({
			'opacity': '1'
		});
	}
	// 第四屏 退出效果
	function fourOut(elem) {
		elem.find('#sec4_main>h1').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('#sec4_main>.blueline').css({
			'opacity': '0'
		});
		elem.find('#sec4_main>p').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
		elem.find('.sec4_middle>div>img').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.sec4_des').css({
			'transition-delay': '0s',
			'transform': 'translateY(-400px)',
			'opacity': '0'
		});
		elem.find('.sec4_txt').css({
			'transition-delay': '0s',
			'transform': 'scale(0)',
			'opacity': '0'
		});
		elem.find('.sec4_txt>div').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px) scale(0)',
			'opacity': '0'
		});
		elem.find('.sec4_txt>p').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
		elem.find('.more').css({
			'opacity': '0'
		});
	}
	// 第五屏 进入效果
	function fiveIn(elem) {
		elem.find('h1').css({
			'transition-delay': '0.4s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.blueline').css({
			'opacity': '1'
		});
		elem.find('p').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('#sec5_middle').css({
			'transition-delay': '1s',
			'transform': 'translateY(0px)',
			'opacity': '1'
		});
	}
	// 第五屏 退出效果
	function fiveOut(elem) {
		elem.find('#sec5_main>h1').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('#sec5_main>.blueline').css({
			'opacity': '0'
		});
		elem.find('#sec5_main>p').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
		elem.find('#sec5_middle').css({
			'transition-delay': '0s',
			'transform': 'translateY(200px)',
			'opacity': '0'
		});

	}
	// 第六屏 进入效果
	function sixIn(elem) {
		elem.find('.message').css({
			'transition-delay': '0.6s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
		elem.find('.message_icon').css({
			'transition-delay': '0.8s',
			'transform': 'translateX(0px)',
			'opacity': '1'
		});
	}
	// 第六屏 退出效果
	function sixOut(elem) {
		elem.find('.message').css({
			'transition-delay': '0s',
			'transform': 'translateX(-400px)',
			'opacity': '0'
		});
		elem.find('.message_icon').css({
			'transition-delay': '0s',
			'transform': 'translateX(400px)',
			'opacity': '0'
		});
	}
	/*首页 全屏滚动 进入 退出效果  ------swiper插件实现*/
	if (document.getElementById("index")) {
		var swiper = new Swiper('.swiper-container', {
			direction: 'vertical',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 0,
			mousewheelControl: true,
			speed: 1000,
			preventClicks: true,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			// 向下滚动触发
			onSlideNextStart: function(swiper) {
				for (var i = 0, len = swiper.slides.length; i < len; i++) {
					var slide = $(swiper.slides[i]);
					// 获取滑动的前一屏 判断是第几屏 执行不同的撤退动画效果
					if (slide.is('.swiper-slide-prev')) {
						var num = slide.attr('data-p');
						// 如果是第一屏 执行代码----------------------------
						if (num == 1) {
							// 第一屏 退出动画
							firstOut(slide);
							// 第二屏 进入效果
							secondIn(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_two']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第二屏 执行代码----------------------------
						if (num == 2) {
							// 第二屏 退出动画
							secondOut(slide);
							// 第三屏 进入动画
							threeIn(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_three']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第三屏 执行代码----------------------------
						if (num == 3) {
							// 第三屏 退出动画
							threeOut(slide);
							// 第四屏 进入动画
							fourIn(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_four']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第四屏 执行代码----------------------------
						if (num == 4) {
							// 第四屏 退出动画
							fourOut(slide);
							// 第五屏 进入动画
							fiveIn(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_five']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第五屏 执行代码----------------------------
						if (num == 5) {
							// 第五屏 退出动画
							fiveOut(slide);
							// 打开状态就收回
							$("#sec5_middle>div>h2").css({
								'opacity': 1,
								'transform': 'scale(1)'
							}).next("div").css({
								'opacity': 0,
								'transform': 'scale(0)'
							}).removeClass('sec5_txt_cur');
							// 第六屏 进入动画
							sixIn(slide.next());
						}
					}
				}
			},
			// 向上滚动触发
			onSlidePrevStart: function(swiper) {
				for (var i = 0, len = swiper.slides.length; i < len; i++) {
					var slide = $(swiper.slides[i]);
					// 获取滑动的前一屏 判断是第几屏 执行不同的撤退动画效果
					if (slide.is('.swiper-slide-active')) {
						var num = slide.attr('data-p');
						// 如果是第一屏 执行代码----------------------------
						if (num == 1) {
							// 第一屏 进入动画
							firstIn(slide);
							// 第二屏 退出动画
							secondOut(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_one']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第二屏 执行代码----------------------------
						if (num == 2) {
							// 第二屏 进入动画
							secondIn(slide);
							// 第三屏 退出动画
							threeOut(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_two']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第三屏 执行代码----------------------------
						if (num == 3) {
							// 第三屏 进入动画
							threeIn(slide);
							// 第四屏 退出动画
							fourOut(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_three']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第四屏 执行代码----------------------------
						if (num == 4) {
							// 第四屏 进入动画
							fourIn(slide);
							// 第五屏 退出动画
							fiveOut(slide.next());
							// 打开状态就收回
							$("#sec5_middle>div>h2").css({
								'opacity': 1,
								'transform': 'scale(1)'
							}).next("div").css({
								'opacity': 0,
								'transform': 'scale(0)'
							}).removeClass('sec5_txt_cur');
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_four']").addClass('nav_link_up').removeClass('nav_link_down');
						}
						// 如果是第五屏 执行代码----------------------------
						if (num == 5) {
							// 第五屏 进入动画
							fiveIn(slide);
							// 第六屏 退出动画
							sixOut(slide.next());
							$("#nav>div>ul>li>a").removeClass('nav_link_up').addClass('nav_link_down');
							$("#nav>div>ul>li>a[href='#section_five']").addClass('nav_link_up').removeClass('nav_link_down');
						}
					}
				}
			},
		});
	}
	/*最后一屏水波纹效果*/
	if (document.getElementById("index")) {
		$('#section_six').ripples({
			resolution: 512,
			dropRadius: 20, //px
			perturbance: 0.04,
		});
		setInterval(function() {
			var $el = $('#section_six');
			var x = Math.random() * $el.outerWidth();
			var y = Math.random() * $el.outerHeight();
			var dropRadius = 10;
			var strength = 0.04 + Math.random() * 0.04;

			$el.ripples('drop', x, y, dropRadius, strength);
		}, 3000);
	}
	/*-------------首页效果结束----------------------*/
	/*关于我们 加入我们 底部地图 开始*/
	if (document.getElementById("joinus") || document.getElementById("aboutus")) {
		var map = new BMap.Map("map"); // 创建地图实例  
		var point = new BMap.Point(117.238181, 31.843144); // 创建点坐标  
		map.centerAndZoom(point, 22); // 初始化地图，设置中心点坐标和地图级别  
		var marker = new BMap.Marker(point); // 创建标注
		map.addOverlay(marker); // 将标注添加到地图中
		marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	}
	/*关于我们 加入我们 底部地图 结束*/
	/*--------关于我们开始--------*/

	/*--------关于我们结束--------*/
	/*--------案例分享开始--------*/
	/*案例点击效果*/
	if (document.getElementById("caseshare")) {

		$(".case_box_one").on('click', function() {
			event.preventDefault();
			$("#case_show").css('transform', 'scale(1)');
		});
		$(".cs_des>span").on('click', function() {
			event.preventDefault();
			$("#case_show").css('transform', 'scale(0)');
		});
		$(".case_box_one").hover(function() {
			$(this).css('transform', 'scale(1.1)');
		}, function() {
			$(this).css('transform', 'none');
		});
	}
	/*--------案例分享结束--------*/
	/*--------加入我们开始--------*/
	/*--------加入我们结束--------*/

	// 时间监控
	var asd = (chrome.loadTimes().firstPaintTime - chrome.loadTimes().startLoadTime) * 1000;
	console.log(asd);

})