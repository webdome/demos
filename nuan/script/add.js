// 点击素材库添加元素
var zoneIndex = 1;
$("#material>div").on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// 隐藏画布区的所有操作点
	$("#drawArea>div>div").not('.pic,.txt').hide();
	// 克隆点击的元素 追加到画布区 设置为绝对定位
	var cloneElem = $(this).clone(false, true).appendTo('#drawArea').css({
		"position": 'absolute',
		"top": '0',
		"left": "0",
		"z-index": zoneIndex++
	});
	// 显示克隆元素的操作点 
	cloneElem.children().show();
	cloneElem.attr('data-cur', '1');
	if (cloneElem.children().eq(0).attr('class') == "container") {
		var one = new newGraph(cloneElem);
	} else if (cloneElem.children().eq(0).attr('class') == "pic") {
		var one = new newPic(cloneElem);
	} else if (cloneElem.children().eq(0).attr('class') == "txt") {
		var one = new newTxt(cloneElem);
	}
});