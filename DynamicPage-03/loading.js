// 文档结构载入完成后，显示Loading效果
$(function(){
	loading_container  = '<div id="loading_container" style="position:absolute;z-index:1000;width:100%;height:100%;padding:0;margin:0;text-align:center;background-color:#ffffff;"><div id="loading_circle_pos">';
	loading_container += '<div id="loading_circle">';
	loading_container += '<span id="outer"><span id="inner"></span></span>';
	loading_container += 'Loading';
	loading_container += '<div id="loading_slow">网速有点慢，请继续等待或 <a href="#" id="loading_refresh">重载</a> 网页。</div>';
	loading_container += '</div>';
	loading_container += '</div></div>';
	$("body").prepend(loading_container);
	setTimeout(function(){
		$("#loading_slow").fadeIn(500)
	},
	5000);
	$("#loading_refresh").click(function() {
		location.reload();
		return ! 1;
	});
});

	

