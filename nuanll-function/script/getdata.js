// 更新图片本地存储
function updatePicStorage(key, value) {
	var num = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	elemObj[num][key] = value;
	elemObj[num].dataStorage();
}
// 更新文本本地存储
// 每次修改样式属性都需要查找到对应的元素 对元素对应的对象进行修改 并更新本地存储
function updateTxtStorage(key, value) {
	if ($('#drawArea>ul>li[data-cur="1"]>.txt>div').attr("contenteditable") == "true") {
		var num = $('#drawArea>ul>li[data-cur="1"]').attr('id');
		elemObj[num][key] = value;
		elemObj[num].dataStorage();
	}
}
// 更新动画本地存储
function updataAniStorage() {
	var num = $('#drawArea>ul>li[data-cur="1"]').attr('id');
	elemObj[num].dataStorage();
}
// 图片裁切请求
function dataDeal(returnMsg, category) {
	switch (category) {
		case "picCut":
			/*begin*/
			$('#drawArea>ul>li[data-cur="1"]>.pic>img').attr("src", returnMsg);
			var num = $('#drawArea>ul>li[data-cur="1"]').attr('id');
			var calw = w / imgW * elemObj[num].width;
			var calh = h / imgH * elemObj[num].height
			$('#drawArea>ul>li[data-cur="1"]').css({
				'width': calw,
				'height': calh,
			});
			updatePicStorage("width", calw);
			updatePicStorage("height", calh);
			updatePicStorage("hwratio", calh / calw);
			updatePicStorage("whratio", calw / calh);
			/*end*/
			break;
	}
}

function getData(packets, interName, methName, category) {
	var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
	var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
	var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
	var packetsAES = CryptoJS.AES.encrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString();
	var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") + "]";
	var signMD5 = CryptoJS.MD5(sign).toString();
	$.ajax({
		url: 'http://192.168.1.9:8080/love/' + interName,
		type: 'get',
		dataType: 'json',
		data: {
			'op': methName,
			'packets': packetsAES,
			'sign': signMD5
		},
		success: function(res) {
			var returnCode = res.returnCode;
			var returnMsg = res.returnMsg;
			if (returnCode === "000") {
				returnMsg = CryptoJS.AES.decrypt(returnMsg, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.Pkcs7
				});
				returnMsg = returnMsg.toString(CryptoJS.enc.Utf8);
			}
			if (typeof dataDeal === "function") {
				dataDeal(returnMsg, category);
			} else {
				console.log("dataDeal is not defined");
			}
		}
	});
}