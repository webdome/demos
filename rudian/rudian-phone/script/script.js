$(function() {
	// 页头 页脚
	if (document.getElementById('aboutus') || document.getElementById('case') || document.getElementById('news') || document.getElementById('joinus')) {
		var aboutus_nav_class = "";
		var case_nav_class = "";
		var news_nav_class = "";
		var joinus_nav_class = "";
		if (document.getElementById('aboutus')) {
			aboutus_nav_class = 'menu_cur';
		}
		if (document.getElementById('case')) {
			case_nav_class = 'menu_cur';
		}
		if (document.getElementById('news')) {
			news_nav_class = 'menu_cur';
		}
		if (document.getElementById('joinus')) {
			joinus_nav_class = 'menu_cur';
		}
		$('<header id="header"><div class="logo"></div><div class="share"></div><div id="menu"><div><ul><li class="close_btn"></li><li><a href="index.html">首页</a></li><li><a href="about.html" class="' + aboutus_nav_class + '">关于我们</a></li><li><a href="case.html" class="' + case_nav_class + '">案例分享</a></li><li><a href="news.html" class="' + news_nav_class + '">最新动态</a></li><li><a href="joinus.html" class="' + joinus_nav_class + '">加入我们</a></li></ul></div></div></header>').prependTo($('body'));
		$('<footer id="footer"><div class="contract"><h3>ADD</h3><p>安徽省合肥市蜀山区新华国际广场B座</p><h3>TEL</h3><p>0551-67888117</p><h3>E-MAIL</h3><p>rudian@rudian.com</p><h3>WEB</h3><p>www.rudian.com</p></div><div class="map"><img src="images/map.png"/></div><div class="copy">版权所有：入点科技</div></footer>').appendTo($('body'));
	}
	// 弹出菜单
	$(".share").on('click', function(e) {
		e.stopPropagation;
		$('#menu').css('height', window.innerHeight).show(300);
		$('body').css({
			'overflow': 'scroll',
			'overflow-y': 'hidden'
		});
	});
	$(".close_btn").on('click', function(e) {
		e.stopPropagation;
		$('#menu').hide(300);
		$('body').css({
			'overflow': 'scroll',
			'overflow-y': 'auto'
		});
	});
	// 点击单个新闻
	$(document).delegate('.one_news', 'click', function() {
		$('.one_news[class="one_news news_cur"]').addClass('news_already');
		$('.one_news').removeClass('news_cur');
		$(this).addClass('news_cur');
	});

	// 首页swiper
	function changeHeader(i, j) {
		if (swiper.activeIndex == i) {
			$('#header>.logo').css({
				'background': 'url(images/logo.png) no-repeat',
				'background-size': 'cover'
			});
			$('#header>.share').css({
				'background': 'url(images/menu-close.png) no-repeat',
				'background-size': 'cover'
			});
		}
		if (swiper.activeIndex == j) {
			$('#header>.logo')[0].style = '';
			$('#header>.share')[0].style = '';
		}
	}
	if (document.getElementById('index')) {
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			direction: 'vertical',
			height: window.innerHeight,
			onSlideNextStart: function(swiper) {
				changeHeader(3, 4);
			},
			onSlidePrevStart: function(swiper) {
				changeHeader(3, 2);
			}
		});
	}
})
