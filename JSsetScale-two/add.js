// 图片
$(document).delegate('#shapebtn', 'click', function(event) {
	event.preventDefault();
	event.stopPropagation();
	var box = $('<div class="box"><img src="1.png"/></div>');
	var container = $('<div class="container"></div>');
	var scale01 = $('<div class="scale01"></div>');
	var scale02 = $('<div class="scale02"></div>');
	var scale03 = $('<div class="scale03"></div>');
	var scale04 = $('<div class="scale04"></div>');
	var rotate = $('<div class="rotate"></div>');
	var bottom = $('<div class="bottom"></div>');
	var right = $('<div class="right"></div>');
	var left = $('<div class="left"></div>');
	var top = $('<div class="top"></div>');
	var line = $('<div class="line"></div>');
	var rightlist = $('<div class="rightList"><ul><li>上移一层</li><li>下移一层</li><li>置于最底层</li><li>置于最顶层</li></ul></div>');
	box.append(container);
	box.append(scale01);
	box.append(scale02);
	box.append(scale03);
	box.append(scale04);
	box.append(right);
	box.append(left);
	box.append(top);
	box.append(bottom);
	box.append(rotate);
	box.append(line);
	$("body").append(box);
	$("body").append(rightlist);
	new newBox(box, 200, 200, 10);
	// 点击隐藏显示操作点
	$(document).on('mousedown', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".box>div").hide();
	});
	$(".box").on('mousedown', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".box>div").hide();
		$(this).children().show();
	});
	var zIndex = 1;
	$(".rightList>ul>li").on('click', function() {
		event.preventDefault();
		event.stopPropagation();
		var i = $(this).index();
		console.log(i);
		if (i == 0) {
			zIndex++;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 1) {
			zIndex--;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 2) {
			zIndex = 1;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 3) {
			zIndex = 10;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		}
	});
});
// 图形
$(document).delegate('#picbtn', 'click', function(event) {
	event.preventDefault();
	event.stopPropagation();
	var box = $('<div class="box"></div>');
	var container = $('<div class="container"></div>');
	var scale01 = $('<div class="scale01"></div>');
	var scale02 = $('<div class="scale02"></div>');
	var scale03 = $('<div class="scale03"></div>');
	var scale04 = $('<div class="scale04"></div>');
	var rotate = $('<div class="rotate"></div>');
	var bottom = $('<div class="bottom"></div>');
	var right = $('<div class="right"></div>');
	var left = $('<div class="left"></div>');
	var top = $('<div class="top"></div>');
	var line = $('<div class="line"></div>');
	var rightlist = $('<div class="rightList"><ul><li>上移一层</li><li>下移一层</li><li>置于最底层</li><li>置于最顶层</li></ul></div>');
	box.append(container);
	box.append(scale01);
	box.append(scale02);
	box.append(scale03);
	box.append(scale04);
	box.append(right);
	box.append(left);
	box.append(top);
	box.append(bottom);
	box.append(rotate);
	box.append(line);
	$("body").append(box);
	$("body").append(rightlist);
	new newBox(box, 200, 200, 10);
	// 点击隐藏显示操作点
	$(document).on('mousedown', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".box>div").hide();
	});
	$(".box").on('mousedown', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".box>div").hide();
		$(this).children().show();
	});
	var zIndex = 1;
	$(".rightList>ul>li").on('click', function() {
		event.preventDefault();
		event.stopPropagation();
		var i = $(this).index();
		console.log(i);
		if (i == 0) {
			zIndex++;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 1) {
			zIndex--;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 2) {
			zIndex = 1;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		} else if (i == 3) {
			zIndex = 10;
			$(this).parent().parent().prev().css('z-index', zIndex).children().show();
		}
	});
});