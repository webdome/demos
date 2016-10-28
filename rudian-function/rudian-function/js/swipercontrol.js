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
			// 如果页面中未使用Loading效果，则必须取消本行代码的注释，以开启myAC_main1主动画控制器中动画的播放
		},
		onSlideChangeEnd: function(swiper) {
			myAC_main1.play();
		},
	});
	// // 文档元素载入完成后，删除Loading效果
	// $("#loading_container").fadeOut(500, function() {
	// 	$(this).remove();
	// 	myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
	// });
	$('.anl').click(function() {
		mySwiper.slidePrev();
	})
	$('.anr').click(function() {
		mySwiper.slideNext();
	})
}