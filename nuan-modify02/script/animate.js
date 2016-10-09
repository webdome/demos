$('#ani_add').on("mousedown", function(e) {
	e.stopPropagation;
	if ($('#drawArea>ul>li[data-cur="1"]').length) {
		// 获取当前激活元素 ID
		var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
		// 随机生成动画 ID
		var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
		// 创建动画选择功能区
		// 所有动画
		// bounce flash pulse rubberBand shake swing tada wobble jello bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flip flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight hinge rollIn rollOut zoomIn zoomInDown zoomInLeft zoomInRight zoomInUp zoomOut zoomOutDown zoomOutLeft zoomOutRight zoomOutUp slideInDown slideInLeft slideInRight slideInUp slideOutDown slideOutLeft slideOutRight slideOutUp
		var ani_one = $('<div class="' + elem_id + '" id="' + ani_id + '"><ul><li><label> 方式 </label><div><select class = "ani_sel"><optgroup label="无"><option value = "no"> 无 </option></optgroup><optgroup label = "强调"><option value = "bounce"> 弹跳 </option><option value = "flash"> 闪动 </option><option value = "pulse"> 脉冲 </option><option value = "rubberBand"> 橡皮筋 </option><option value = "shake"> 轻摇 </option><option value = "swing"> 摆动 </option><option value = "tada"> 嗒哒 </option><option value = "wobble"> 摇晃 </option><option value = "jello"> 果冻 </option></optgroup><optgroup label = "进入"><option value = "slideInDown"> 上移入 </option><option value = "slideInLeft"> 左移入 </option><option value = "slideInRight"> 右移入 </option><option value = "slideInUp"> 下移入 </option><option value = "fadeIn"> 淡入 </option><option value = "fadeInDown"> 上淡入 </option><option value = "fadeInDownBig"> 上淡入大 </option><option value = "fadeInLeft"> 左淡入 </option><option value = "fadeInLeftBig"> 左淡入大 </option><option value = "fadeInRight"> 右淡入 </option><option value = "fadeInRightBig"> 右淡入大 </option><option value = "fadeInUp"> 下淡入 </option><option value = "fadeInUpBig"> 下淡入大 </option><option value = "bounceIn"> 弹入 </option><option value = "bounceInDown"> 向下弹入 </option><option value = "bounceInUp"> 向上弹入 </option><option value = "bounceInLeft"> 从左弹入 </option><option value = "bounceInRight"> 从右弹入 </option><option value = "hinge"> 悬掉 </option><option value = "flip"> 翻转 </option><option value = "flipInX"> X翻转 </option><option value = "flipInY"> Y翻转 </option><option value = "lightSpeedIn"> 光速 </option><option value = "rotateIn"> 旋转 </option><option value = "rotateInDownLeft"> 左下旋转 </option><option value = "rotateInDownRight"> 右下旋转 </option><option value = "rotateInUpLeft"> 左上旋转 </option><option value = "rotateInUpRight"> 右上旋转 </option><option value = "slideninLeft"> 滑动 </option><option value = "zoomIn"> 放大 </option><option value = "zoomInDown"> 下放大 </option><option value = "zoomInLeft"> 左放大 </option><option value = "zoomInRight"> 右放大 </option><option value = "zoomInUp"> 上放大 </option><option value = "rollIn"> 滚入 </option></optgroup><optgroup label = "退出"><option value = "slideOutDown"> 上移出 </option><option value = "slideOutLeft"> 左移出 </option><option value = "slideOutRight"> 右移出 </option><option value = "slideOutUp"> 下移出 </option><option value = "fadeOut"> 淡出 </option><option value = "fadeOutDown"> 下淡出 </option><option value = "fadeOutDownBig"> 下淡出大 </option><option value = "fadeOutLeft"> 左淡出 </option><option value = "fadeOutLeftBig"> 左淡出大 </option><option value = "fadeOutRight"> 右淡出 </option><option value = "fadeOutRightBig"> 右淡出大 </option><option value = "fadeOutUp"> 上淡出 </option><option value = "fadeOutUpBig"> 上淡出大 </option><option value = "bounceOut"> 弹出 </option><option value = "bounceOutDown"> 下弹出 </option><option value = "bounceOutLeft"> 左弹出 </option><option value = "bounceOutRight"> 右弹出 </option><option value = "bounceOutUp"> 上弹出 </option><option value = "flipOutX"> X翻转 </option><option value = "flipOutY"> Y翻转 </option><option value = "lightSpeedOut"> 光速 </option><option value = "rotateOut"> 旋转 </option><option value = "rotateOutDownLeft"> 左下旋转 </option><option value = "rotateOutDownRight"> 右下旋转 </option><option value = "rotateOutUpLeft"> 左上旋转 </option><option value = "rotateOutUpRight"> 右上旋转 </option><option value = "slideInRight"> 滑动 </option><option value = "zoomOut"> 缩小 </option><option value = "zoomOutDown"> 下缩小 </option><option value = "zoomOutLeft"> 左缩小 </option><option value = "zoomOutRight"> 右缩小 </option><option value = "zoomOutUp"> 上缩小 </option><option value = "rollOut"> 滚出 </option></optgroup></select></div></li><li><label> 时间 </label><p><input type = "number" step="0.1" min="0" max="20" class="ani_dura" value="2"/></p></li><li><label> 延迟 </label><p><input type="number" step="0.1" min="0" max="20" class="ani_delay" value="0"/></p></li><li><label> 次数 </label><p><input type="number" step="1" min="0" max="20" class="ani_count" value="1"/></p></li><button class="ani_remove">删除</button></ul></div> ');
		$('#ani_all').append(ani_one);
		// 初始化动画为 undefined
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', 'undefined 2s ease 0s backwards');
		var ani_obj = {
			"element": elem_id,
			"animation": "undefined",
			"start": 0,
			"type": 0,
			"duration": "2s",
			"delay": "0s",
			"count": 1,
			"timing": "ease",
			"direction": "normal",
			"status": "running",
			"finish": "none",
		};
		// 将初始化的动画存入对应元素对象中 并且更新本地存储
		elemObj[elem_id].animate[ani_id] = ani_obj;
		updataAniStorage();
	}
});
$(document).delegate('#animate>div', 'mousedown', function(e) {
	e.stopPropagation();
});
// 选择动画方式 将动画属性存入对应元素对象中 并且更新本地存储
$(document).delegate('.ani_sel', 'change', function() {
	var ani_name = $(this).children().children("option:selected").val();
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr('id');
	var ani_dur = $('.ani_dura').val();
	$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', ani_name + " " + (ani_dur + "s") + ' ease 0s backwards');
	var ani_obj = {
		"element": elem_id,
		"animation": ani_name,
		"start": 0,
		"type": 0,
		"duration": "2s",
		"delay": "0s",
		"count": 1,
		"timing": "ease",
		"direction": "normal",
		"status": "running",
		"finish": "none", 
	};
	elemObj[elem_id].animate[ani_id] = ani_obj;
	updataAniStorage();
	// 动画执行完成 清空style
	setTimeout(function() {
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)>img')[0].style = "";
	}, ani_dur * 1000 + 100);

});
// 修改动画时间
$(document).delegate('.ani_dura', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_dura = $(this).val() + "s";
	elemObj[elem_id].animate[ani_id].duration = ani_dura;
	updataAniStorage();
});
// 修改动画延迟
$(document).delegate('.ani_delay', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_delay = $(this).val() + "s";
	elemObj[elem_id].animate[ani_id].delay = ani_delay;
	updataAniStorage();
});
// 修改动画次数
$(document).delegate('.ani_count', 'change', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	var ani_count = $(this).val();
	elemObj[elem_id].animate[ani_id].count = ani_count;
	updataAniStorage();
});
// 删除动画 并且将对应动画从对应元素对象中删除 更新本地存储
$(document).delegate('.ani_remove', 'mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var ani_id = $(this).parents('.' + elem_id).attr("id");
	delete elemObj[elem_id].animate[ani_id];
	updataAniStorage();
	$(this).parents('.' + elem_id).remove();
});

// 预览动画
/*$("#ani_pre").on('mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var animate = elemObj[elem_id].animate;
	var time = 0;
	$('#drawArea>ul>li[data-cur="1"]>div:eq(0)>img')[0].style="";
	$.each(animate, function(key, value) {
		console.log(value);
		setTimeout(function() {
			$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().css('animation', value.animation + " " + value.duration + " ease " + value.delay + " backwards");
		}, time);
		time += (parseFloat(value.duration) * 1000 + 500);
	});
});*/
// 预览动画 同时执行
$("#ani_pre").on('mousedown', function() {
	var elem_id = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	var animate = elemObj[elem_id].animate;
	var ani_dur = 0;
	$.each(animate, function(key, value) {
		var box = $('<div></div>');
		var one = parseFloat(value.duration);
		if (one > ani_dur) {
			ani_dur = one;
		}
		box.css('animation', value.animation + " " + value.duration + " ease " + value.delay + " " + value.count + " backwards");
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().wrap(box);
	});
	// 按照最大时间移除
	setTimeout(function(){
		var img = $('#drawArea>ul>li[data-cur="1"]>div:eq(0) img').clone();
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').children().remove();
		$('#drawArea>ul>li[data-cur="1"]>div:eq(0)').append(img);
	},ani_dur*1000);
});