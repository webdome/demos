var components = {
  comfirm: '<div class="popconfirm"><div><div class="txt">xxxxxx</div><div class="btn"><div class="no">取消</div><div class="yes">确定</div></div></div></div>',
  notify: '<div class="poptip"><div>xxxxxx</div></div>',
  loading: '<div class="loading"><div class="loadEffect"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>',
};
var popFunc = {
  popConfirm: function(txt, yesFun, noFun) {
    $(components.comfirm).appendTo('body');
    $('.popconfirm .txt').text(txt);
    $('.popconfirm .yes').off("click");
    $('.popconfirm .yes').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (yesFun) {
        yesFun();
      }
      $('.popconfirm').hide().remove();
    });
    $('.popconfirm .no').off("click");
    $('.popconfirm .no').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (noFun) {
        noFun();
      }
      $('.popconfirm').hide().remove();
    });
    $('.popconfirm').show();
  },
  popNotify: function(txt, func) {
    $(components.notify).appendTo('body');
    $('.poptip>div').html(txt);
    $('.poptip').fadeIn().delay(600).fadeOut(function() {
      if (func) {
        func();
      }
      $('.poptip').remove();
    });
  },
  popLoading: function() {
    $(components.loading).appendTo('body');
  },
  removeLoading: function() {
    $('.loading').remove();
  }
};

