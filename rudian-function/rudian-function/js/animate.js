// 取出所有本地存储、页面、作品一起解析为待保存的gift对象
function saveGift() {
	var elemObjs = getStorage();
	var giftObj = {};
	var giftPageElements = [];
	var giftPages = [];
	var pages = $('.x-zk');
	var musicId = $('audio').attr('data-id') ? $('audio').attr('data-id') : 0;
	var gid = Number($('.cont-c').attr('gid'));
	var pageIndex = 1;
	$.each(elemObjs, function(key, value) {
		if (value.eleType == 296) {
			value.top = value.top * 2;
			value.left = value.left * 2;
		} else {
			value.top = (value.top + value.height / 2) * 2;
			value.left = (value.left + value.width / 2) * 2;
		}
		value.width = value.width * 2;
		value.height = value.height * 2;
		if (value.fontSize) {
			value.fontSize = value.fontSize * 2;
		}
		if (value.lineHeight) {
			value.lineHeight = value.lineHeight * 2;
		}
		if (value.boxShadow) {
			var boxshadow = value.boxShadow.split(' ');
			var boxshadowC = boxshadow[0];
			var boxshadowX = parseInt(boxshadow[1]) * 2;
			var boxshadowY = parseInt(boxshadow[2]) * 2;
			var boxshadowS = parseInt(boxshadow[3]) * 2;
			value.boxShadow = boxshadowC + ' ' + boxshadowX + 'px ' + boxshadowY + 'px ' + boxshadowS + 'px';
		}
		if (value.textShadow) {
			var textshadow = value.textShadow.split(' ');
			var textshadowC = textshadow[0];
			var textshadowX = parseInt(textshadow[1]) * 2;
			var textshadowY = parseInt(textshadow[2]) * 2;
			var textshadowS = parseInt(textshadow[3]) * 2;
			value.textShadow = textshadowC + ' ' + textshadowX + 'px ' + textshadowY + 'px ' + textshadowS + 'px';
		}
		if (value.path) {
			delete value.path;
		}
		var inputTxt = [];
		if (value.inputTxt) {
			$.each(value.inputTxt, function(i, txt) {
				inputTxt.push(txt);
			});
			value.inputTxt = inputTxt;
		}
		var ani_arr = [];
		var animates = value.animate;
		$.each(animates, function(ani_name, ani_obj) {
			ani_obj.duration = ani_obj.duration.replace('s', '');
			ani_obj.delay = ani_obj.delay.replace('s', '');
			ani_arr.push(ani_obj);
		})
		value.animate = ani_arr;
		giftPageElements.push(value);
	});
	var sysgid = Number($('.cont-c').attr('sysgid')) ? Number($('.cont-c').attr('sysgid')) : 0;
	$.each(pages, function(key, value) {
		var gpid = Number($(value).attr('id').replace('_zs', ''));
		var sysgpid = Number($(value).attr('sysgpid')) ? Number($(value).attr('sysgpid')) : 0;
		var obj = {
			"gpid": gpid,
			"sysgpid": sysgpid,
			"gid": gid,
			"sysgid": sysgid,
			"reOrder": pageIndex++,
			"modId": "0",
		};
		giftPages.push(obj);
	});
	giftObj.userId = JSON.parse(document.cookie.replace('user_msg=', '')).id;
	giftObj.gift = {
		"gid": gid,
		"sysgid": sysgid,
		"giftName": "自由创作",
		"isOpen": "82",
		"music": musicId,
	};
	giftObj.giftPages = giftPages;
	giftObj.giftPageElements = giftPageElements;
	return giftObj;
}
// 取出存储的元素全部样式 转化为json对象存储到数组中待用
function getStorage() {
	var objs = {};
	$.each(sessionStorage, function(key, value) {
		var obj = JSON.parse(value);
		var gpeid = obj.gpeid;
		objs[gpeid] = obj;
	});
	return objs;
	// console.log(objs);
}
// 更新图片本地存储
function updatePicStorage(key, value) {
	var num = $('.eles>li[data-cur="1"]').attr('id');
	elemObj[num][key] = value;
	elemObj[num].dataStorage();
}

function setStorage(obj) {
	$.each(obj, function(key, value) {
		window.sessionStorage.setItem(key, JSON.stringify(value));
	});
}
// 更新动画本地存储
function updataAniStorage() {
	var gpeid = $('.eles>li[data-cur="1"]').attr('id');
	elemObj[gpeid].dataStorage();
}
// 更新背景对象属性及本地存储
function updataBgStorage(key, value) {
	var gpeid = $('.eles>.box_bg').attr('id');
	elemObj[gpeid][key] = value;
	var bgStorage = JSON.parse(window.sessionStorage.getItem(gpeid));
	bgStorage[key] = value;
	bgStorage = JSON.stringify(bgStorage);
	window.sessionStorage.setItem(gpeid, bgStorage);
}
// 动画存储
function aniShowAndStorage(elem) {
	var ani_name = elem.parents('.dh-y').find(".don-ff option:selected").val();
	var gpeid = $('.eles>li[data-cur="1"]').attr('id');
	var ani_id = elem.parents('.' + gpeid).attr('id');
	var ani_dur = elem.parents('.dh-y').find('.zs-t:eq(0)>.ji-m').text();
	var ani_delay = elem.parents('.dh-y').find('.zs-t:eq(1)>.ji-m').text();
	var ani_count = elem.parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
	var ani_obj = {
		"element": gpeid,
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
	elemObj[gpeid].animate[ani_id] = ani_obj;
	updataAniStorage();
}