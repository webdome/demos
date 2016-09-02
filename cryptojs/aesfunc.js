//加密算法
function getAesString(data, key, iv) { 
    var key = CryptoJS.enc.Hex.parse(key);
    var iv = CryptoJS.enc.Latin1.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
}

//解密算法
function getDAesString(encrypted, key, iv) { 
    var key = CryptoJS.enc.Hex.parse(key);
    var iv = CryptoJS.enc.Latin1.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//加密函数
function getAES(data) { 
    var key = '1234567812345678'; //密钥
    var iv = 'Pkcs7'; //语法标准
    return getAesString(data, key, iv); //密文
}

//解密函数
function getDAes(secdata) { 
    var key = '1234567812345678';
    var iv = 'Pkcs7';
    return getDAesString(secdata, key, iv); //明文
}