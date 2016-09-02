window.addEventListener('load', function () {
    var target = document.querySelector('#target');
    target.addEventListener('dragenter', function () {
        this.classList.remove('hover');
    });
    target.addEventListener('dragleave', function () {
        this.classList.add('hover');
    });
    target.addEventListener('dragover', function (e) {
        this.classList.remove('hover');
        e.preventDefault();
    });

    target.addEventListener('drop', function (e) {
        e.preventDefault();
        handleDrop(e.dataTransfer.files[0]);
    });

});
var handleDrop = function (f) {
    var reader = new FileReader(),
        name = f.name;
    reader.onload = function (e) {
        var data = e.target.result,
            workbook = XLSX.read(data, { type: 'binary' }),
            sheetName = workbook.SheetNames[0],
            sheet = workbook.Sheets[sheetName],
            table = document.createElement('table');
      
        for (var row = 1; ; row++) {
            if (sheet['A' + row] == null) {
                break;
            }
            var tr = document.createElement('tr');

            for (var col = 65; col <= 90; col++) {
                var c = String.fromCharCode(col);// get 'A', 'B', 'C' ... 
                var key = '' + c + row;
                if (sheet[key] == null) {
                    break;
                }
                var td = document.createElement('td');
                td.innerHTML = sheet[key]['w'];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        document.querySelector('#target').appendChild(table);
    };
    reader.readAsBinaryString(f);
}