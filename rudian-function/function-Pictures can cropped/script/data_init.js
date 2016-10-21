{
	"userId": "当前登录用户id",
	"gift": {
		"gid": "作品的id",
		"sysgid": "系统作品的id",
		"giftName ": "作品名称 ",
		"isOpen ": "公开81or82 ",
		"music ": "背景音乐id "
	},
	"giftPages": [{
		"gpid": "页面的id",
		"sysgpid": "系统页面的id",
		"gid": "作品id",
		"sysgid": "系统作品id",
		"reOrder": "页面排序",
		"modId": "模板id原创传0",
	}, {}],
	"giftPageElements": [{
		"gpeid": "元素的id",
		"sysgpeid": "系统的元素id",
		"gpid": "页面的id",
		"sysgpid": "系统页面的id",
		"eleType": "62图片296文本", //405录音406摇一摇407擦一擦408点一点409贴图
		"left": "X坐标", //元素中心点
		"top": "Y坐标", //元素中心点
		"zIndex": "Z轴顺序",
		"width": "宽度",
		"height": "高度",
		"rotaAngle": "旋转角度",
		"fontSize": "字号",
		"fontFamily": "字体",
		"color": "颜色",
		"fontWeight": "加粗",
		"textShadow": "阴影",
		"fontDirection": "文字方向",
		"textAlign": "对齐",
		"fontText": "文本内容",
		"animate": [{}, {}]
	}, {}]
}

// animation
{
	"element": "ani_01",
	"animation": "fadeIn",
	"start": 0,
	"type": 0,
	"duration": "1s",
	"delay": "0s",
	"count": 1,
	"timing": "ease",
	"direction": "normal",
	"status": "running",
	"finish": "none",
},


// 修改选中文字方法
/*function getSelectedText() {
	if (window.getSelection) {
		return window.getSelection().toString();
	} else if (document.getSelection) {
		return document.getSelection();
	} else if (document.selection) {
		return document.selection.createRange().text;
	}
}*/
/*if (selectedTxt = getSelectedText()) {
			var fontFamily = $(this).text();
			var wrapBox = $('<span>' + selectedTxt + '</span>');
			wrapBox.css('font-family', fontFamily);
			var newText = wrapBox[0].outerHTML;
			var target = $('#drawArea>ul>li>.txt>div[contenteditable="true"]')[0];
			target.innerHTML = target.innerHTML.replace(selectedTxt, newText);
		};*/
		/*var fontFamily = $(this).text();
		if (selectedTxt = unescape(getSelectedText())) {
			var txtbox = $('#drawArea>ul>li>.txt>div[contenteditable="true"]')[0];
			txtbox.innerHTML = txtbox.innerHTML.replace(selectedTxt, '<span>' + selectedTxt + '</span>');
			$(txtbox).children('span:contains("'+selectedTxt+'")').css('font-family',fontFamily);
		}*/
		/*var fontFamily = $(this).text();
		var z = window.getSelection().getRangeAt(0);
		var t = z.toString();
		var temp = document.createElement("span");
		temp.style.fontFamily = fontFamily;
		temp.innerHTML = t;
		z.deleteContents();
		z.insertNode(temp);*/



