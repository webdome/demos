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



{"gpeid":"txt_4368025795","sysgpeid":"","gpid":"1","sysgpid":"","eleType":"296","index":"101","opacity":"1","line-height":"28","left":"131","top":"20.5","zIndex":"","width":"262","height":"41","rotaAngle":"0","fontSize":"24px","fontFamily":"Microsoft YaHei","color":"#515151","fontWeight":"400","fontStyle":"normal","tex-shadow":"#515151 0 4 8","fontDirection":"none","textAlign":"left","fontText":"请输入文本","animate":{"ani_3196813920":{"element":"txt_4368025795","animation":"tada","start":0,"type":0,"duration":"2s","delay":"0s","count":"1","timing":"ease","direction":"normal","status":"running","finish":"none"}}}

{"gpeid":"pic_6673709493","sysgpeid":"","gpid":"1","sysgpid":"","eleType":"62","opacity":"1","border-radius":"0","box-shadow":"#515151 0 4 8","left":"127.5","top":"265","zIndex":"","width":"255","height":"530","rotaAngle":"0","fontSize":"","fontFamily":"","color":"","fontWeight":"","textShadow":"","fontDirection":"","textAlign":"","fontText":"","animate":{"ani_7826054820":{"element":"pic_6673709493","animation":"rubberBand","start":0,"type":0,"duration":"2s","delay":"0s","count":"1","timing":"ease","direction":"normal","status":"running","finish":"none"}}}