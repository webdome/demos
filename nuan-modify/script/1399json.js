var data = {"returnCode":"000","returnMsg":"LzxDLpBsZ87oQsTHW1Pa7eKGcAzxXmIhWzjmDov62K1Yxg3QklBAyVUNndW5l6joBC23c8ieCamTB/aENpGj6jZvmDNQSoQaBkWJcbmx3XE="}
var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
var returnMsg = data.returnMsg;
var returnMsg = CryptoJS.AES.decrypt(returnMsg, key, {
	mode: CryptoJS.mode.ECB,
	padding: CryptoJS.pad.Pkcs7
});
returnMsg = returnMsg.toString(CryptoJS.enc.Utf8);
// 处理
console.log(returnMsg);
