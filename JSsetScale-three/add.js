// 点击素材库添加元素
$("#material>div").on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#drawArea>div>div").not('.pic').hide();
	var cloneElem = $(this).clone(false, true).appendTo('#drawArea').css({
		"position": 'absolute',
		"top": '0',
		"left":"0"
	});
	cloneElem.children().show();
	cloneElem.attr('data-cur', '1');
	new newBox(cloneElem);
});
