window.onload = function() {
    // 初始化一个摇动事件
    var myShakeEvent = new Shake({
        threshold: 15
    });
    var audio = document.getElementById("audio");
    var result = document.getElementById("result");
    // 启动摇动事件
    myShakeEvent.start();
    // 监听摇动事件
    window.addEventListener('shake', shakeEventDidOccur, false);
    // 监听事件的回调函数
    function shakeEventDidOccur() {
        result.className = "result";
        var arr = ['iphone 100', 'Mercedes-Benz S600', 'Audi A8', 'BMW 740li'];
        var num = Math.floor(Math.random() * 4);
        audio.currentTime = 0;
        audio.play();
        result.innerHTML = "恭喜您，摇得" + arr[num] + "！";
        setTimeout(function() {
            result.className = "result result-show";
        }, 600);
        
    }
};