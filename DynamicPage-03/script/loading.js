// 文档结构载入完成后，显示Loading效果
$(function() {
	// begin
	loading_container = '<div id="loading_container" style="position:absolute;z-index:1000;width:100%;height:100%;padding:0;margin:0;text-align:center;background-color:#ffffff;"><div id="loading_circle_pos">';
	loading_container += '<div id="loading_circle">';
	loading_container += '<span id="outer"><span id="inner"></span></span>';
	loading_container += 'Loading';
	loading_container += '<div id="loading_slow">网速有点慢，请继续等待或 <a href="#" id="loading_refresh">重载</a> 网页。</div>';
	loading_container += '</div>';
	loading_container += '</div></div>';
	$("body").prepend(loading_container);
	setTimeout(function() {
			$("#loading_slow").fadeIn(500)
		},
		5000);
	$("#loading_refresh").click(function() {
		location.reload();
		return !1;
	});
	// end
	// 文档元素载入完成后，删除Loading效果
	// $(window).load(function(){
	// 	$("#loading_container").fadeOut(2000,function(){
	// 	$(this).remove();
	// 	myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
	// });


});