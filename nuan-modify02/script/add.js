// 点击素材库添加元素
var zoneIndex = 11;
$('#material>div').on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	if ($(this).hasClass('graph')) {
		var src = $(this).children().attr(src);
		var elem = $('<li class="box_graph"></li>');
		var graph = $('<div class="graph"><img src="'+src+'" data-src="'+src+'"/></div>');
		var ctrl = $('<div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
		elem.append(graph);
		elem.append(ctrl);
		$('#drawArea>ul').append(elem);
	}else if ($(this).hasClass('pic')) {

	}else if ($(this).hasClass('txt')) {

	}
});







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

/*<div class="container"></div>
<div class="bottomRight"></div>
<div class="bottomLeft"></div>
<div class="topLeft"></div>
<div class="topRight"></div>
<div class="rightc"></div>
<div class="leftc"></div>
<div class="topc"></div>
<div class="bottomc"></div>
<div class="rotate"></div>
<div class="line"></div>*/
/*<div class="pic">
    <img src="http://192.168.1.12:8080/picture/yq0KZFXxC92ACnwgAAArvIvwkPI428.png"  data-src="http://192.168.1.12:8080/picture/yq0KZFXxC92ACnwgAAArvIvwkPI428.png"/>
</div>
<div class="container"></div>
<div class="bottomRight"></div>
<div class="bottomLeft"></div>
<div class="topLeft"></div>
<div class="topRight"></div>
<div class="rightc"></div>
<div class="leftc"></div>
<div class="topc"></div>
<div class="bottomc"></div>
<div class="rotate"></div>
<div class="line"></div>*/
/*<div class="txt" data-edit = "0">
    <div contenteditable="false">请输入文本</div>
</div>
<div class="container"></div>
<div class="bottomRight"></div>
<div class="bottomLeft"></div>
<div class="topLeft"></div>
<div class="topRight"></div>
<div class="rightc"></div>
<div class="leftc"></div>
<div class="topc"></div>
<div class="bottomc"></div>
<div class="rotate"></div>
<div class="line"></div>*/