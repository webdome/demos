/**
 * 预览input file 图片
 */
$("#file").on('change', function(e) {
  var files = this.files;
  $.each(files, function(index, val) {
    var URL = window.URL || window.webkitURL;
    var blob = URL.createObjectURL(files[index]);
    $('<div class="box" style="background-image:url(' + blob + ');"></div>').appendTo('body');
  });
});

