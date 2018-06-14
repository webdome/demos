(function() {
    var quality = 7;
    // 绑定事件
    document.querySelector('input').onchange = function() {
        var files = this.files;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].name;
            name = name.substring(name.lastIndexOf('.')).toLowerCase();
            console.log(name);
            if (name == ".png" || name == ".jpg" || name == ".jpeg") {
                localResizeIMG(files[i]);
            } else if (name == '.gif') {
                var URL = window.URL || window.webkitURL;
                var blob = URL.createObjectURL(files[i]);
                demo_report('gif图无需压缩', blob);
            } else {
                var URL = window.URL || window.webkitURL;
                var blob = URL.createObjectURL(files[i]);
                alert('不支持该格式');
            }
        }
    };
    // 页面展示
    function demo_report(title, src, size) {
        var img = new Image(),
            li = document.createElement('li'),
            size = size ? (size / 1024).toFixed(2) + 'KB' : '';

        img.onload = function() {
            var content = '<ul>' +
                '<li>' + title + '（' + img.width + ' X ' + img.height + '）</li>' +
                '<li class="text-cyan">' + size + '</li>' +
                '</ul>';

            li.className = 'item';
            li.innerHTML = content;
            li.appendChild(img);
            document.querySelector('#report').appendChild(li);
        };
        img.src = src;
    }
    // 压缩操作
    function localResizeIMG(file) {
        lrz(file, {
            width: 640,
            quality: quality
        }, function(results) {
            console.log(results);
            report = document.querySelector('#report');
            demo_report('客户端预压的图片', results.base64, results.base64.length * quality/10);
        });
    }
})();