// 取出存储的元素全部样式 转化为json对象存储到数组中待用
function getStorage() {
	var objs = {};
	$.each(sessionStorage, function(key, value) {
		var obj = JSON.parse(value);
		var num = obj.gpeid;
		objs[num] = obj;
	});
	return objs;
	// console.log(objs);
}
// 更新动画本地存储
function updataAniStorage() {
	var num = $('.eles>li[data-cur="1"]').attr('id');
	elemObj[num].dataStorage();
}
// 动画存储
function aniShowAndStorage(elem) {
	var ani_name = elem.parents('.dh-y').find(".don-ff option:selected").val();
	var elem_id = $('.eles>li[data-cur="1"]').attr('id');
	var ani_id = elem.parents('.' + elem_id).attr('id');
	var ani_dur = elem.parents('.dh-y').find('.zs-t:eq(0)>.ji-m').text();
	var ani_delay = elem.parents('.dh-y').find('.zs-t:eq(1)>.ji-m').text();
	var ani_count = elem.parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
	var ani_obj = {
		"element": elem_id,
		"animation": ani_name,
		"start": 0,
		"type": 0,
		"duration": ani_dur,
		"delay": ani_delay,
		"count": ani_count,
		"timing": "ease",
		"direction": "normal",
		"status": "running",
		"finish": "none",
	};
	elemObj[elem_id].animate[ani_id] = ani_obj;
	updataAniStorage();
}
// ***动画设置--------------------
$(function() {
	// 触发方式

	// 动画方式
	$(document).delegate('.don-ff>select', 'change', function(e) {
		e.stopPropagation;
		var ani_name = $(this).parents('.dh-y').find(".don-ff option:selected").val();
		var elem_id = $('.eles>li[data-cur="1"]').attr('id');
		var ani_id = $(this).parents('.' + elem_id).attr('id');
		var ani_dur = $(this).parents('.dh-y').find('.zs-t:eq(0)>.ji-m').text();
		var ani_delay = $(this).parents('.dh-y').find('.zs-t:eq(1)>.ji-m').text();
		var ani_count = $(this).parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
		$('.eles>li[data-cur="1"]>div:eq(0)').css('animation', ani_name + " " + ani_dur + ' ease ' + ani_delay + ' ' + ani_count + ' backwards');
		// ***1021
		setTimeout(function() {
			$('.eles>li[data-cur="1"]>div:eq(0)')[0].style.animation = "";
		}, parseInt(ani_dur) * 1000 + 100);
		var ani_obj = {
			"element": elem_id,
			"animation": ani_name,
			"start": 0,
			"type": 0,
			"duration": ani_dur,
			"delay": ani_delay,
			"count": ani_count,
			"timing": "ease",
			"direction": "normal",
			"status": "running",
			"finish": "none",
		};
		elemObj[elem_id].animate[ani_id] = ani_obj;
		updataAniStorage();
	});
	// 动画方向
	
	// 动画时间
	// index 738
	// 动画延迟
	// index 750
	// 动画次数  （固定次数或循环）
	// index 760
});

// ***动画预览--------------------// ***1024
$(function() {
	$('.yl-dh').on('click', function(e) {
		e.stopPropagation;
		var elem_id = $('.eles>li[data-cur="1"]').attr('id');
		var animates = elemObj[elem_id].animate;
		var ani_dur = 0;
		var ani_elem = $('.eles>li[data-cur="1"]>div:eq(0)').clone();
		$.each(animates, function(key, value) {
			var box = $('<div style="width:100%;height:100%;"></div>');
			var one_dur = parseFloat(value.duration);
			var one_count = parseFloat(value.count);
			var one_delay = parseFloat(value.delay);
			var one_time = one_dur * one_count + one_delay;
			if (one_time > ani_dur) {
				ani_dur = one_time;
			}
			box.css('animation', value.animation + " " + value.duration + " ease " + value.delay + " " + value.count + " backwards");
			$('.eles>li[data-cur="1"]>div:eq(0)').wrap(box);
		});
		// 修复表单元素动画预览bug
		$('.input').parent().css('display','table');
		// 按照最大时间移除
		setTimeout(function() {
			$('.eles>li[data-cur="1"]>div:eq(0)').remove();
			$('.eles>li[data-cur="1"]').prepend(ani_elem);
		}, ani_dur * 1000 + 500);
	});
});

// ***删除元素---------------------
$(function() {
	// delete 按键删除元素
	$(document).on("keydown", function(e) {
		e.stopPropagation();
		if (e.keyCode === 46) { // 如果键盘按的是delete键就删除当前激活项
			var elem_id = $('.eles>li[data-cur="1"]').attr('id');
			window.sessionStorage.removeItem(elem_id); // 清除对应的本地存储
			delete elemObj[elem_id]; // 删除元素总集合中对应的成员
			$('.eles>li[data-cur="1"]').remove(); // 删除元素
			$('.srz[id*="'+elem_id+'"]').remove(); // 删除左侧对应图层  ***1021
		}
	});
});
