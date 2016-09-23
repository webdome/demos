// 取消默认右键菜单事件
document.oncontextmenu = function(e) {
	e.preventDefault();
};
$(document).delegate('img', 'drag', function(e) {
	e.preventDefault();
});
// 点击空白区域隐藏操作点
$(document).on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#drawArea>div").attr('data-cur', '0');
	$("#drawArea>div>div").not('.pic').hide();
	$(".rightList").hide();
});
// 点击哪个图形哪个的操作点就出现
$(document).delegate('#drawArea>div', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#drawArea>div>div").not('.pic').hide();
	$("#drawArea>div").attr('data-cur', '0');
	$(this).children().show();
	$(this).attr('data-cur', '1');
	$(".rightList").hide();
});

// delete 按键删除元素
document.onkeydown = function(e) {
	e.stopPropagation();
	if (e.keyCode === 46) {
		$('#drawArea>div[data-cur="1"]').remove();
	}
}

/*
// 右键菜单每一项对应一个事件
$(document).delegate('.rightList>ul>li', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	var box = $(this).parents(".rightList").prev();
	var boxi = box.index(".box");
	var zIndex = !!box[0].style.zIndex == false ? 1 : box[0].style.zIndex / 1;
	var listi = $(this).index();
	if (listi == 0) {
		box[0].style.zIndex = ++zIndex;
	} else if (listi == 1) {
		box[0].style.zIndex = --zIndex;
	} else if (listi == 2) {
		box[0].style.zIndex = 0;
	} else if (listi == 3) {
		box[0].style.zIndex = 50;
	}
});*/

