function getData(packets, interName, methName, category) {
	var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
	var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
	var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
	var packetsAES = CryptoJS.AES.encrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString();
	var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") +
		"]";
	var signMD5 = CryptoJS.MD5(sign).toString();
	$.ajax({
		// url: 'http://192.168.1.7:8080/love/' + interName,
		url: 'http://119.90.34.86:8080/love/' + interName,
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
				returnMsg = JSON.parse(returnMsg.toString(CryptoJS.enc.Utf8));
			}
			if (typeof dataDeal === "function") {
				dataDeal(returnMsg, category);
			} else {
				console.log("dataDeal is not defined");
			}
		}
	});
}
