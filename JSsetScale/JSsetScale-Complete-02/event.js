// 取消默认右键菜单事件
document.oncontextmenu = function(e) {
	e.preventDefault();
	e.stopPropagation();
};

// 点击空白区域隐藏操作点
$(document).on('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#drawArea>div").attr('data-cur', '0'); // 将当前激活项设置为空
	$("#drawArea>div>div").not('.pic,.txt').hide(); // 除了图片和文本以外的所有控制单元都隐藏
	// 文本框的处理
	$("#drawArea .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
});

// 点击哪个图形哪个的操作点就出现
$(document).delegate('#drawArea>div', 'mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	// step 1
	$("#drawArea>div>div").not('.pic,.txt').hide(); // 将所有控制单元隐藏
	$("#drawArea>div").attr('data-cur', '0'); // 将当前激活项清空
	// step 2
	$(this).children().show(); // 将点击的当前项控制单元显示
	$(this).attr('data-cur', '1'); // 将点击的当前项设置为激活项
	// 文本框的处理

});

// delete 按键删除元素
document.onkeydown = function(e) {
	e.stopPropagation();
	if (e.keyCode === 46) { // 如果键盘按的是delete键就删除当前激活项
		$('#drawArea>div[data-cur="1"]').remove();
	}
}

// 双击文本编辑
$(document).delegate('#drawArea .box_txt', 'dblclick', function(e) {
	console.log("我是txt");
	$(this).css('border', '1px dashed #2eb3e8').children('.container').hide();
	$(this).children('.txt').attr('data-edit', '1').children().attr('contenteditable', 'true').focus();
	document.execCommand("selectAll");
});	
$(document).delegate('#drawArea .txt>div', 'mousedown', function(e) {
	// e.preventDefault();
	e.stopPropagation();
	if ($(this).parent().attr('data-edit') == 0) {
		$("#drawArea>div>div").not('.pic,.txt').hide()
		$(this).parents(".box_txt").children().show();
	}
	$("#drawArea>div").attr('data-cur', '0')
	$(this).parents(".box_txt").attr('data-cur', '1');
});
