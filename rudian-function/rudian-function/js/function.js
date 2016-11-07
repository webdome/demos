//添加特效
var tjmb = function(c) {
  $('<canvas id="canvas" width="360px" height="640px" style="display:none"></canvas>').appendTo($('.eles'));
  //var ctx = $('#canvas').get(0).getContext("2d");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var x1, y1, a = 30,
    timeout, totimes = 100,
    jiange = 30;
  canvas.width = $('.box_bg').width();
  canvas.height = $('.box_bg').height();
  var img = new Image();
  img.src = c;
  img.onload = function() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      $('.txc').slider({
        value: 100,
        slide: function(event, ui) {
          var tmd = ui.value / 100;
          $('#canvas').css('opacity', tmd);
          $('.txc').next().text('' + ui.value + '%');
        }
      })
      tapClip();
    }
    //使用clip来达到擦除效果
  function tapClip() {
    var hastouch = "ontouchstart" in window ? true : false,
      tapstart = hastouch ? "touchstart" : "mousedown",
      tapmove = hastouch ? "touchmove" : "mousemove",
      tapend = hastouch ? "touchend" : "mouseup";
    ctx.lineCap = "round";　　 //设置线条两端为圆弧
    ctx.lineJoin = "round";　　 //设置线条转折为圆弧
    ctx.lineWidth = a * 2;　　
    ctx.globalCompositeOperation = "destination-out";
    canvas.addEventListener(tapstart, function(e) {　　　　
      clearTimeout(timeout)
      e.preventDefault();
      x1 = hastouch ? e.targetTouches[0].pageX : e.offsetX;
      y1 = hastouch ? e.targetTouches[0].pageY : e.offsetY;
      ctx.save();
      ctx.beginPath()
      ctx.arc(x1, y1, 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
      canvas.addEventListener(tapmove, tapmoveHandler);
      canvas.addEventListener(tapend, function() {
        canvas.removeEventListener(tapmove, tapmoveHandler);　　　　　　
        timeout = setTimeout(function() {
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var dd = 0;
          for (var x = 0; x < imgData.width; x += 30) {
            for (var y = 0; y < imgData.height; y += 30) {
              var i = (y * imgData.width + x) * 4;
              if (imgData.data[i + 3] > 0) {
                dd++
              }
            }
          }
          if (dd / (imgData.width * imgData.height / 900) < 0.9999) {
            $(canvas).animate({
              'opacity': 0
            });
          }　　　　　　　
        }, 100)
      });

      function tapmoveHandler(e) {
        e.preventDefault()
        x2 = hastouch ? e.targetTouches[0].pageX : e.offsetX;
        y2 = hastouch ? e.targetTouches[0].pageY : e.offsetY;
        ctx.save();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore()
        x1 = x2;
        y1 = y2;
      }
    })
  }
}

//点击添加文本时左边图层的UI变动
// var zwkzq = function() {
//     zwdj();
//     $('.wzy .srz').first().css('background-color', '#2eb3e8');
//     $('.wzy .srz').first().find('.z-hz').css('color', '#fff');
//     $('.wzy .srz').first().find('.z-ht').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -78px no-repeat');
//   }
//点击添加图片时左边图层的UI变动
// var ztkzq = function() {
//     zwdj();
//     $('.tpy .srz').first().css('background-color', '#2eb3e8');
//     $('.tpy .srz').first().find('.z-hz').css('color', '#fff');
//     $('.tpy .srz').first().find('.z-hw').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -200px no-repeat');
//   }
//左边图层未点击时状态
var zwdj = function() {
    $('.ya-shi .srz').css('background-color', '#F0EFF4');
    $('.ya-shi .srz .z-hz').css('color', '#666');
    $('.ya-shi .z-ht').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -39px no-repeat');
    $('.ya-shi .z-hw').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -160px no-repeat');
  }
  //点击添加元素时左侧页面与图层切换
var ydcj = function() {
    $('.y-t div').eq(0).addClass('btc');
    $('.y-t div').eq(1).removeClass('btc');
    $('.tu-cen').hide();
    $('.ya-shi').show();
  }
  //调整背景颜色的透明度
$('#ysbt').slider({
  slide: function(event, ui) {
    var bjz = 1 - ui.value / 100;
    $('.box_bg').css('opacity', bjz);
    $(this).next().text(ui.value + "%");
    updataBgStorage('opacity', bjz);
  }
});
// 背景设置区初始化
function bgInit() {
  $('.cjz').css('background-color', '#999')
  $('.cjczd').text('裁剪');
  $('.sc-bt>span').text('上传背景');
  $('.hf-mr').text('恢复默认');
  $('.photo-clip-rotateLayer').removeAttr("style");
  $('.photo-clip-rotateLayer').find('img').remove();
  $('.sz-j').show();
  $('.pbys').hide();
  $('#ysbt').slider({
    value: 0
  });
  $('.tzsz').val('#fff');
  $('.sztt').css('background-color', '#fff');
  $('.box_bg').css('background-color', '#fff');
  $('.jdt-z').css('background-color', '#fff');
  $('.jbmt').text('0%');
  $('.cjzzc').show();
}
// 切换页面时背景设置区渲染
function bgRender(obj) {
  elemObj[obj.gpeid] = {
    "gpeid": obj.gpeid,
    "sysgpeid": obj.sysgpeid,
    "gpid": obj.gpid,
    "sysgpid": obj.sysgpid,
    "eleId": "0",
    "eleType": "525",
    "zIndex": "40",
    "backgroundColor": obj.backgroundColor,
    "backgroundImage": obj.backgroundImage,
    "opacity": obj.opacity,
    "animate": {}
  };
  $('.cjz').css('background-color', '#999')
  $('.cjczd').text('裁剪');
  $('.sz-j').show();
  $('.cjzzc').show();
  $('.photo-clip-rotateLayer').removeAttr("style");
  $('.photo-clip-rotateLayer').find('img').remove();
  $('.jbmt').text(Math.ceil(100 - obj.opacity * 100) + '%');
  $('.tzsz').val(obj.backgroundColor);
  $('.sztt').css('background-color', obj.backgroundColor);
  $('.box_bg').css('background-color', obj.backgroundColor);
  $('.jdt-z').css('background-color', obj.backgroundColor);
  $('#ysbt').slider({
    value: 100 - obj.opacity * 100
  });
  if (obj.backgroundImage) {
    $('.sc-bt>span').text('更换背景');
    $('.hf-mr').text('删除');
    $('.pbys').show();
  } else {
    $('.sc-bt>span').text('上传背景');
    $('.hf-mr').text('恢复默认');
    $('.pbys').hide();
  }
}
//增加下拉框的选项
$('.zjx-xa').on('click', function() {
    if ($('.bo-t1').length > 8) {
      return;
    } else {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      var shu = ($('.xx-hz').children().length === 0) ? 1 : $('.xx-hz').children().length + 1;
      var xuan = '<div class="bo-t1"><div class="xs">0/20</div><span class="xuanx">选项' + shu + '</span><input type="text" class="qs-r" maxlength="10" placeholder="请输入内容" style="margin-left:16px" id="' + inputTxt_id + '"><span class="yl-g"></span></div>';
      var xlxx = '<option value="请输入内容" id="' + inputTxt_id + '"></option>';
      $('.xx-hz').append(xuan);
      $('.xlkko').append(xlxx);
      // ***1022
      $('.eles li[data-cur="1"] .xlko').append(xlxx);
      $('.xx-sz').text($('.xx-hz').children().length + '/9');
      // $('.xlko').append(xlxx);
      // changetext();
      zcxhs();
    }
  })
  //删除下拉框选项// ***1022
var delatese = function() {
    $('.xx-hz').on('click', '.yl-g', function() {
      var index = $(this).parent().index();
      $(this).parent().remove();
      // $('.xlko option').eq(index).remove();
      var inputTxt_id = $(this).prev().attr('id');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      $('.eles li[data-cur="1"]' + ' #' + inputTxt_id).remove();
      delete elemObj[gpeid].inputTxt[inputTxt_id];
      elemObj[gpeid].dataStorage();
      $('.xlkko option').eq(index).remove();
      $('.xx-sz').text($('.xx-hz').children().length + '/9');
      // end
    })
  }
  //再次添加元素后右边操作区的初始化
var cstt = function() {
    $('.hk1').slider({
      value: 0
    });
    $('.hk1').next().text('0%');
    $('.fx1').slider({
      value: 0
    });
    $('.fx1').next().text('0%');
    $('.hk2').slider({
      value: 0
    });
    $('.hk2').next().text('0%');
    $('.hk3').slider({
      value: 0
    });
    $('.hk3').next().text('0°');
    $('.hk4').slider({
      value: 39
    });
    $('.hk4').next().text('28px');
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', "1px");
    $('.yan-s').css('display', 'none');
    $('.yyys, .syys').css({
      'display': 'none',
    });
    $('.byys').css({
      'display': 'none',
      'background-color': '#515151'
    });
    $('.tzsz').val('#515151'); //1103***
    $('.kzy-y').css('display', 'none');
    $('.hk5').slider({
      value: 20
    });
    $('.hk5').next().text('8px');
    $('.hk6').slider({
      value: 50
    });
    $('.hk6').next().text('0px');
    $('.hk7').slider({
      value: 60
    });
    $('.hk7').next().text('4px');
    $('.wk5').slider({
      value: 20
    });
    $('.wk5').next().text('8px');
    $('.wk6').slider({
      value: 50
    });
    $('.wk6').next().text('0px');
    $('.wk7').slider({
      value: 60
    });
    $('.wk7').next().text('4px');
    $('.hzb').text('0px');
    $('.zzb').text('0px');
    $('.thzb').text('0px');
    $('.tzzb').text('0px');
    //按钮
    $('.antj').val('').removeAttr('id'); // ***1022
    $('.dw-p').text('0px');
    $('.dw-x').text('0px');
    $('.dw-g').text('0px');
    $('.dw-k').text('0px');
    $('.bwj-z1').css('background-color', '#fff');
    $('.bwj-z2').css('background-color', '#333');
    $('.kzsps').hide();
    $('.ysko').css('background-color', '#2eb3e8');
    // 文本
    $('.wryh').val('微软雅黑');
    $('.ess').val('24px');
  }
  //再次操作选中图片时右边操作区对应的值
var cztfz = function(myz) {
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
    var wi = elemObj[gpeid].width;
    var wiz = wi.toFixed(0);
    var he = elemObj[gpeid].height;
    var hez = he.toFixed(0);
    var ro = parseInt(elemObj[gpeid].totalAngle);
    var roz = (ro / 3.6);
    var whz = wi >= he ? he : wi;
    var br = elemObj[gpeid].borderRadius;
    // var hk2z = Math.ceil((br / whz) * 200);
    // var xhk2z = Math.ceil((br / whz) * 100);
    // console.log(hk2z);
    $('.hk1').slider({
      value: op
    });
    $('.hk1').next().text('' + op + '%');
    $('.hk2').slider({
      value: br * 2
    });
    $('.hk2').next().text('' + br + '%');
    $('.hk3').slider({
      value: roz
    });
    $('.hk3').next().text('' + ro + '°');
    var leftz = elemObj[gpeid].positionLeft.toFixed(0);
    var topz = elemObj[gpeid].positionTop.toFixed(0);
    $('.hzb').text('' + leftz + 'px');
    $('.zzb').text('' + topz + 'px');
    $('.thzb').text('' + wiz + 'px');
    $('.tzzb').text('' + hez + 'px');
    if (myz.hasClass('box_shape')) {
      $('.kzsps').show();
      var fillz = elemObj[gpeid].fill;
      $('.ysko').css('background-color', fillz);
      $('.ggt-p').css('width', '273px');
      $('.cai-j').hide();
    } else if (myz.hasClass('box_graph')) {
      $('.ggt-p').css('width', '273px');
      $('.cai-j').hide();
    } else if (myz.hasClass('box_pic')) {
      $('.ggt-p').css('width', '130px');
      $('.cai-j').show();
    }
    if (elemObj[gpeid].boxShadowC == "#fff" && elemObj[gpeid].boxShadowX == 0 && elemObj[gpeid].boxShadowY == 0 && elemObj[gpeid].boxShadowS == 0) {
      $('.huii').removeClass('lv');
      $('.kgq-2').css('left', '1px');
      $('.yan-s').hide();
      $('.syys').hide();
      $('.kzy-y').hide();
    } else {
      $('.huii').addClass('lv');
      $('.kgq-2').css('left', '12px');
      $('.yan-s').show();
      $('.syys').show();
      $('.kzy-y').show();
      var bcz = elemObj[gpeid].boxShadowC;
      $('.syys').css('background-color', bcz);
      var bsz = elemObj[gpeid].boxShadowS;
      var bss = (bsz / 40 * 100).toFixed(0);
      $('.hk5').slider({
        value: bss
      });
      $('.hk5').next().text('' + bsz + 'px');
      var bxz = elemObj[gpeid].boxShadowX;
      var bxs = bxz + 20;
      bxs = (bxs / 40 * 100).toFixed(0);
      $('.hk6').slider({
        value: bxs
      });
      $('.hk6').next().text('' + bxz + 'px');
      var byz = elemObj[gpeid].boxShadowY;
      var bys = byz + 20;
      bys = (bys / 40 * 100).toFixed(0);
      $('.hk7').slider({
        value: bys
      });
      $('.hk7').next().text('' + byz + 'px');
    }

  }
  //再次操作选中文本时右边操作区对应的值
var czwfz = function() {
  var gpeid = $('.eles li[data-cur="1"]').attr('id');
  var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
  var ztlx = elemObj[gpeid].fontFamily;
  var ztdx = elemObj[gpeid].fontSize;
  $('.wryh').val(ztlx);
  $('.ess').val(ztdx + 'px');
  $('.hk1').slider({
    value: op
  });
  $('.hk1').next().text('' + op + '%');
  var ro = parseInt(elemObj[gpeid].totalAngle);
  var roz = (ro / 3.6);
  $('.hk3').slider({
    value: roz
  });
  $('.hk3').next().text('' + ro + '°');
  var li = elemObj[gpeid].lineHeight;
  var liz = (li / 72 * 100).toFixed(0);
  $('.hk4').slider({
    value: liz
  });
  $('.hk4').next().text('' + li + 'px');
  if (elemObj[gpeid].txtShadowC == "#fff" && elemObj[gpeid].txtShadowX == 0 && elemObj[gpeid].txtShadowY == 0 && elemObj[gpeid].txtShadowS == 0) {
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', '1px');
    $('.yan-s').hide();
    $('.yyys').hide();
    $('.kzy-y').hide();
  } else {
    $('.huii').addClass('lv');
    $('.kgq-2').css('left', '12px');
    $('.yan-s').show();
    $('.yyys').show();
    $('.kzy-y').show();
    var bcz = elemObj[gpeid].txtShadowC;

    $('.yyys').css('background-color', bcz);
    var bsz = elemObj[gpeid].txtShadowS;
    var bss = (bsz / 40 * 100).toFixed(0);
    $('.wk5').slider({
      value: bss
    });
    $('.wk5').next().text('' + bsz + 'px');
    var bxz = elemObj[gpeid].txtShadowX;
    var bxs = bxz + 20;
    bxs = (bxs / 40 * 100).toFixed(0);
    $('.wk6').slider({
      value: bxs
    });
    $('.wk6').next().text('' + bxz + 'px');
    var byz = elemObj[gpeid].txtShadowY;
    var bys = byz + 20;
    bys = (bys / 40 * 100).toFixed(0);
    $('.wk7').slider({
      value: bys
    });
    $('.wk7').next().text('' + byz + 'px');
  }
  var leftz = elemObj[gpeid].positionLeft;
  var topz = elemObj[gpeid].positionTop;
  $('.hzb').text('' + leftz + 'px');
  $('.zzb').text('' + topz + 'px');
}

//再次点击按钮操作区对应的值   1103***所有圆角用br赋值
var andyz = function() {
  var gpeid = $('.eles li[data-cur="1"]').attr('id');
  var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
  $('.fx1').slider({
    value: op
  });
  $('.fx1').next().text('' + op + '%');
  var br = elemObj[gpeid].borderRadius;
  $('.hk2').slider({
    value: br * 2
  });
  $('.hk2').next().text('' + br + '%');
  var ro = parseInt(elemObj[gpeid].totalAngle);
  var roz = (ro / 3.6);
  $('.hk3').slider({
    value: roz
  });
  $('.hk3').next().text('' + ro + '°');
  var bj = elemObj[gpeid].backgroundColor;
  var ys = elemObj[gpeid].color;
  $('.bwj-z1').css('background-color', bj);
  $('.bwj-z2').css('background-color', ys);
  if (elemObj[gpeid].boxShadowC == "#fff" && elemObj[gpeid].boxShadowX == 0 && elemObj[gpeid].boxShadowY == 0 && elemObj[gpeid].boxShadowS == 0) {
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', '1px');
    $('.yan-s').hide();
    $('.yyys').hide();
    $('.kzy-y').hide();
  } else {
    $('.huii').addClass('lv');
    $('.kgq-2').css('left', '12px');
    $('.yan-s').show();
    $('.yyys').show();
    $('.kzy-y').show();
    var bcz = elemObj[gpeid].boxShadowC;
    $('.byys').css('background-color', bcz);
    var bsz = elemObj[gpeid].boxShadowS;
    var bss = (bsz / 40 * 100).toFixed(0);
    $('.bk5').slider({
      value: bss
    });
    $('.bk5').next().text('' + bsz + 'px');
    var bxz = elemObj[gpeid].boxShadowX;
    var bxs = bxz + 20;
    bxs = (bxs / 40 * 100).toFixed(0);
    $('.bk6').slider({
      value: bxs
    });
    $('.bk6').next().text('' + bxz + 'px');
    var byz = elemObj[gpeid].boxShadowY;
    var bys = byz + 20;
    bys = (bys / 40 * 100).toFixed(0);
    $('.bk7').slider({
      value: bys
    });
    $('.bk7').next().text('' + byz + 'px');
  }
  var leftz = elemObj[gpeid].positionLeft.toFixed(0);
  var topz = elemObj[gpeid].positionTop;
  var wi = elemObj[gpeid].width;
  var wiz = wi.toFixed(0);
  var he = elemObj[gpeid].height;
  var hez = he.toFixed(0);
  $('.dw-p').text('' + leftz + 'px');
  $('.dw-x').text('' + topz + 'px');
  $('.dw-k').text('' + wiz + 'px');
  $('.dw-g').text('' + hez + 'px');
  var inputTxt_id = $('.eles li[data-cur="1"]').find('button').attr('id');
  var inputTxt = elemObj[gpeid].inputTxt[inputTxt_id];
  $('.antj').val(inputTxt).attr('id', inputTxt_id);
  // end
}

//显示下拉框输入内容的长度
var zcxhs = function() {
    $('.qs-r').on('focus', function() {
      $('.qs-r').on('keyup', function() {
        var cd = $(this).val().length * 2;
        $(this).parent().find('.xs').text(cd + "/20")
      })
    })
  }
  //改变下拉编辑框中间操作区相应的变化
$('.xlkko').on('change', function() {
    var dj = $(this)[0].selectedIndex;
    $('.eles li[data-cur="1"]').find('select option').eq(dj).attr('selected', 'selected');
  })
  //添加下拉框属性操作区初始化
var srck = function() {
    $('.fx1').slider({
      value: 0
    });
    $('.fx1').next().text('0%');
    $('.hk2').slider({
      value: 0
    });
    $('.hk2').next().text('0%');
    $('.bwj-z1').css('background-color', '#fff');
    $('.bwj-z2').css('background-color', '#333');
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', "1px");
    $('.yan-s').css('display', 'none');
    $('.xyys').css({
      'display': 'none',
      'background-color': '#515151'
    });
    $('.xk5').slider({
      value: 20
    });
    $('.xk5').next().text('8px');
    $('.xk6').slider({
      value: 50
    });
    $('.xk6').next().text('0px');
    $('.xk7').slider({
      value: 60
    });
    $('.xk7').next().text('4px');
    $('.dw-p').text('0px');
    $('.dw-x').text('0px');
    $('.dw-g').text('0px');
    $('.dw-k').text('0px');
    $('.kzy-y').css('display', 'none');
    // ***1022
    $('.xs').text('0/20');
    $('.bo-t1 .qs-r').val('').removeAttr('id');
    $('.xlkko option').text('请输入内容');
    $('.bo-t1:gt(2)').remove();
    $('.xx-sz').text('3/9');
    // end
  }
  // 下拉框再次点击  ***1022
var ddxla = function() {
    $('.bo-t1').remove();
    $('.xlkko option').remove();
    var inputTxts = $('.eles li[data-cur="1"]').find('option');
    var index = 1;
    $.each(inputTxts, function(key, value) {
      var inputTxt_id = $(value).attr('id');
      var inputTxt = $(value).text();
      var length = inputTxt.length * 2;
      $('<div class="bo-t1"><div class="xs">0/20</div><span class="xuanx">选项' + (index++) + '</span><input type="text" class="qs-r" maxlength="10" placeholder="请输入内容" style="margin-left:16px"><span class="yl-g"></span></div>').appendTo($('.xx-hz'));
      $('<option></option>').appendTo($('.xlkko'));
      $('.xlkko option').eq(key).text(inputTxt);
      $('.xx-hz .qs-r').eq(key).val(inputTxt).attr('id', inputTxt_id);
      $('.bo-t1:eq(' + key + ') .xs').text(length + '/20');
      // 样式渲染
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
      var wi = elemObj[gpeid].width;
      var wiz = wi.toFixed(0);
      var he = elemObj[gpeid].height;
      var hez = he.toFixed(0);
      $('.fx1').slider({
        value: op
      });
      $('.fx1').next().text('' + op + '%');
      var whz = wi >= he ? he : wi;
      var br = elemObj[gpeid].borderRadius;
      // var hk2z = ((br / whz) * 200).toFixed(0);
      // var xhk2z = ((br / whz) * 100).toFixed(0);
      $('.hk2').slider({
        value: br * 2
      });
      $('.hk2').next().text('' + br + '%');
      var bj = elemObj[gpeid].backgroundColor;
      var ys = elemObj[gpeid].color;
      $('.bwj-z1').css('background-color', bj);
      $('.bwj-z2').css('background-color', ys);
      if (elemObj[gpeid].boxShadowC == "#fff" && elemObj[gpeid].boxShadowX == 0 && elemObj[gpeid].boxShadowY == 0 && elemObj[gpeid].boxShadowS == 0) {
        $('.huii').removeClass('lv');
        $('.kgq-2').css('left', '1px');
        $('.yan-s').hide();
        $('.yyys').hide();
        $('.kzy-y').hide();
      } else {
        $('.huii').addClass('lv');
        $('.kgq-2').css('left', '12px');
        $('.yan-s').show();
        $('.yyys').show();
        $('.kzy-y').show();
        var bcz = elemObj[gpeid].boxShadowC;
        $('.xyys').css('background-color', bcz);
        var bsz = elemObj[gpeid].boxShadowS;
        var bss = (bsz / 40 * 100).toFixed(0);
        $('.xk5').slider({
          value: bss
        });
        $('.xk5').next().text('' + bsz + 'px');
        var bxz = elemObj[gpeid].boxShadowX;
        var bxs = bxz + 20;
        bxs = (bxs / 40 * 100).toFixed(0);
        $('.xk6').slider({
          value: bxs
        });
        $('.xk6').next().text('' + bxz + 'px');
        var byz = elemObj[gpeid].boxShadowY;
        var bys = byz + 20;
        bys = (bys / 40 * 100).toFixed(0);
        $('.xk7').slider({
          value: bys
        });
        $('.xk7').next().text('' + byz + 'px');
      }
      var leftz = elemObj[gpeid].positionLeft.toFixed(0);
      var topz = elemObj[gpeid].positionTop;
      $('.dw-p').text(leftz + "px");
      $('.dw-x').text(topz + "px");
    });
  }
  //单多选框属性操作区初始化
var ddrc = function() {
    $('.fx1').slider({
      value: 0
    });
    $('.fx1').next().text('0%');
    $('.hk2').slider({
      value: 0
    });
    $('.hk2').next().text('0%');
    $('.dw-p').text('0px');
    $('.dw-x').text('0px');
    $('.dw-g').text('0px');
    $('.dw-k').text('0px');
    $('.bwj-z1').css('background-color', '#fff');
    $('.bwj-z2').css('background-color', '#333');
    $('.ddxsk').val('').removeAttr('id');
  }
  //单多选框的再次点击
var ddzcc = function() {
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
    var wi = elemObj[gpeid].width;
    var wiz = wi.toFixed(0);
    var he = elemObj[gpeid].height;
    var hez = he.toFixed(0);
    $('.fx1').slider({
      value: op
    });
    $('.fx1').next().text('' + op + '%');
    var whz = wi >= he ? he : wi;
    var br = elemObj[gpeid].borderRadius;
    // var hk2z = ((br / whz) * 200).toFixed(0);
    // var xhk2z = ((br / whz) * 100).toFixed(0);
    $('.hk2').slider({
      value: br * 2
    });
    $('.hk2').next().text('' + br + '%');
    var bj = elemObj[gpeid].backgroundColor;
    var ys = elemObj[gpeid].color;
    $('.bwj-z1').css('background-color', bj);
    $('.bwj-z2').css('background-color', ys);
    var leftz = elemObj[gpeid].positionLeft.toFixed(0);
    var topz = elemObj[gpeid].positionTop;
    var wi = elemObj[gpeid].width;
    var wiz = wi.toFixed(0);
    var he = elemObj[gpeid].height;
    var hez = he.toFixed(0);
    $('.dw-p').text('' + leftz + 'px');
    $('.dw-x').text('' + topz + 'px');
    $('.dw-k').text('' + wiz + 'px');
    $('.dw-g').text('' + hez + 'px');
    // ***1022
    var inputTxt_id = $('.eles li[data-cur="1"]').find('.ddxnr').attr('id');
    var inputTxt = elemObj[gpeid].inputTxt[inputTxt_id];
    $('.ddxsk').val(inputTxt).attr('id', inputTxt_id);
  }
  //互动页的重新点击
var hdxl = function() {
    $('.fx1').slider({
      value: 0
    });
    $('.fx1').next().text('0%');
    $('.hk2').slider({
      value: 0
    });
    $('.hk2').next().text('0%');
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', "1px");
    $('.yan-s').css('display', 'none');
    $('.dyys').css({
      'display': 'none',
    });
    $('.kzy-y').css('display', 'none');
    $('.dk5').slider({
      value: 20
    });
    $('.dk5').next().text('8px');
    $('.dk6').slider({
      value: 50
    });
    $('.dk6').next().text('0px');
    $('.dk7').slider({
      value: 60
    });
    $('.dk7').next().text('4px');
    $('.xd-h').css('background-color', '#fff');
    $('.xd-b').css('background-color', '#ff5448');
    $('.dw-p').text('0px');
    $('.dw-x').text('0px');
    $('.dw-g').text('100px');
    $('.dw-k').text('40px');
  }
  //再次点击互动页的操作
var rhdxl = function() {
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
    $('.fx1').slider({
      value: op
    });
    $('.fx1').next().text('' + op + '%');
    var wi = elemObj[gpeid].width;
    var wiz = wi.toFixed(0);
    var he = elemObj[gpeid].height;
    var hez = he.toFixed(0);
    var whz = wi >= he ? he : wi;
    var br = elemObj[gpeid].borderRadius;
    // var hk2z = ((br / whz) * 200).toFixed(0);
    // var xhk2z = ((br / whz) * 100).toFixed(0);
    $('.hk2').slider({
      value: br * 2
    });
    $('.hk2').next().text('' + br + '%');
    var bg = elemObj[gpeid].backgroundColor;
    var co = elemObj[gpeid].fill;
    $('.xd-h').css('background-color', bg);
    $('.xd-b').css('background-color', co);
    var leftz = elemObj[gpeid].positionLeft.toFixed(0);
    var topz = elemObj[gpeid].positionTop;
    var wi = elemObj[gpeid].width;
    var wiz = wi.toFixed(0);
    var he = elemObj[gpeid].height;
    var hez = he.toFixed(0);
    $('.dw-p').text('' + leftz + 'px');
    $('.dw-x').text('' + topz + 'px');
    $('.dw-k').text('' + wiz + 'px');
    $('.dw-g').text('' + hez + 'px');
    if (elemObj[gpeid].boxShadowC == "#fff" && elemObj[gpeid].boxShadowX == 0 && elemObj[gpeid].boxShadowY == 0 && elemObj[gpeid].boxShadowS == 0) {
      $('.huii').removeClass('lv');
      $('.kgq-2').css('left', '1px');
      $('.yan-s').hide();
      $('.dyys').hide();
      $('.kzy-y').hide();
    } else {
      $('.huii').addClass('lv');
      $('.kgq-2').css('left', '12px');
      $('.yan-s').show();
      $('.dyys').show();
      $('.kzy-y').show();
      var bcz = elemObj[gpeid].boxShadowC;
      $('.dyys').css('background-color', bcz);
      var bsz = elemObj[gpeid].boxShadowS;
      var bss = (bsz / 40 * 100).toFixed(0);
      $('.dk5').slider({
        value: bss
      });
      $('.dk5').next().text('' + bsz + 'px');
      var bxz = elemObj[gpeid].boxShadowX;
      var bxs = bxz + 20;
      bxs = (bxs / 40 * 100).toFixed(0);
      $('.dk6').slider({
        value: bxs
      });
      $('.dk6').next().text('' + bxz + 'px');
      var byz = elemObj[gpeid].boxShadowY;
      var bys = byz + 20;
      bys = (bys / 40 * 100).toFixed(0);
      $('.dk7').slider({
        value: bys
      });
      $('.dk7').next().text('' + byz + 'px');
    }
  }
  //动画的添加与删除 1104***
var ancs = function(self) {
  // ***删除动画页元素
  $('.dh-y').remove();
  // end
  // ***取出激活项的所有动画 渲染到动画区
  var gpeid = self.attr('id');
  var animates = elemObj[gpeid].animate;
  if (animates == '{}') {
    return;
  }
  var n = 1;
  $.each(animates, function(key, value) {
    var ani_name = value.animation;
    var ani_dur = value.duration;
    var ani_delay = value.delay;
    var ani_count = value.count;
    if (value.count == 'infinite') {
      ani_count = 1;
    }
    var one_animate = '<div class="dh-y ' + gpeid + '" id="' + key + '"><div class="dh-y1"><span class="zhx hx-j"></span><span class="dh-z">动画' + (n++) + '</span><span class="xh-x"></span></div><div class="dh-cz"><div class="chu-f"><span class="chu-fz">触发</span><select class="chu-fj"><option>进入页面</option><option>单击</option></select></div><div class="don-ff"><span class="chu-fz">动画</span><select class="input input--dropdown js--animations"><optgroup label="无"><option value = "no"> 无 </option></optgroup><optgroup label = "强调"><option value = "bounce"> 弹跳 </option><option value = "flash"> 闪动 </option><option value = "pulse"> 脉冲 </option><option value = "rubberBand"> 橡皮筋 </option><option value = "shake"> 轻摇 </option><option value = "swing"> 摆动 </option><option value = "tada"> 嗒哒 </option><option value = "wobble"> 摇晃 </option><option value = "jello"> 果冻 </option><option value = "flip"> 翻转 </option></optgroup><optgroup label = "进入"><option value = "slideInDown"> 上移入 </option><option value = "slideInLeft"> 左移入 </option><option value = "slideInRight"> 右移入 </option><option value = "slideInUp"> 下移入 </option><option value = "fadeIn"> 淡入 </option><option value = "fadeInDown"> 上淡入 </option><option value = "fadeInDownBig"> 上淡入大 </option><option value = "fadeInLeft"> 左淡入 </option><option value = "fadeInLeftBig"> 左淡入大 </option><option value = "fadeInRight"> 右淡入 </option><option value = "fadeInRightBig"> 右淡入大 </option><option value = "fadeInUp"> 下淡入 </option><option value = "fadeInUpBig"> 下淡入大 </option><option value = "bounceIn"> 弹入 </option><option value = "bounceInDown"> 向下弹入 </option><option value = "bounceInUp"> 向上弹入 </option><option value = "bounceInLeft"> 从左弹入 </option><option value = "bounceInRight"> 从右弹入 </option><option value = "hinge"> 悬掉 </option><option value = "flipInX"> X翻转 </option><option value = "flipInY"> Y翻转 </option><option value = "lightSpeedIn"> 光速 </option><option value = "rotateIn"> 旋转 </option><option value = "rotateInDownLeft"> 左下旋转 </option><option value = "rotateInDownRight"> 右下旋转 </option><option value = "rotateInUpLeft"> 左上旋转 </option><option value = "rotateInUpRight"> 右上旋转 </option><option value = "slideInLeft"> 滑动 </option><option value = "zoomIn"> 放大 </option><option value = "zoomInDown"> 下放大 </option><option value = "zoomInLeft"> 左放大 </option><option value = "zoomInRight"> 右放大 </option><option value = "zoomInUp"> 上放大 </option><option value = "rollIn"> 滚入 </option></optgroup><optgroup label = "退出"><option value = "slideOutDown"> 上移出 </option><option value = "slideOutLeft"> 左移出 </option><option value = "slideOutRight"> 右移出 </option><option value = "slideOutUp"> 下移出 </option><option value = "fadeOut"> 淡出 </option><option value = "fadeOutDown"> 下淡出 </option><option value = "fadeOutDownBig"> 下淡出大 </option><option value = "fadeOutLeft"> 左淡出 </option><option value = "fadeOutLeftBig"> 左淡出大 </option><option value = "fadeOutRight"> 右淡出 </option><option value = "fadeOutRightBig"> 右淡出大 </option><option value = "fadeOutUp"> 上淡出 </option><option value = "fadeOutUpBig"> 上淡出大 </option><option value = "bounceOut"> 弹出 </option><option value = "bounceOutDown"> 下弹出 </option><option value = "bounceOutLeft"> 左弹出 </option><option value = "bounceOutRight"> 右弹出 </option><option value = "bounceOutUp"> 上弹出 </option><option value = "flipOutX"> X翻转 </option><option value = "flipOutY"> Y翻转 </option><option value = "lightSpeedOut"> 光速 </option><option value = "rotateOut"> 旋转 </option><option value = "rotateOutDownLeft"> 左下旋转 </option><option value = "rotateOutDownRight"> 右下旋转 </option><option value = "rotateOutUpLeft"> 左上旋转 </option><option value = "rotateOutUpRight"> 右上旋转 </option><option value = "slideInRight"> 滑动 </option><option value = "zoomOut"> 缩小 </option><option value = "zoomOutDown"> 下缩小 </option><option value = "zoomOutLeft"> 左缩小 </option><option value = "zoomOutRight"> 右缩小 </option><option value = "zoomOutUp"> 上缩小 </option><option value = "rollOut"> 滚出 </option></optgroup></select><select class="zc-j"><option>中心</option><option>↑</option><option>→</option><option>↓</option><option>←</option></select></div><div class="zs-t"><span class="chu-fz">时间</span><span class="cjt-j aiti" style="border:none"></span><span class="ji-m">' + ani_dur + '</span></div><div class="zs-t"><span class="chu-fz">延迟</span><span class="cjt-j delay"  style="border:none"></span><span class="ji-m">' + ani_delay + '</span></div><div class="zs-t"><span class="chu-fz">次数</span><span class="cjt-j time" style="border:none"></span><span class="ji-m">' + ani_count + '</span></div><div class="sx-dhc7"><span class="yin-y">循环</span><span class="xun-h"><span class="kgq-2"></span></span></div></div></div>';
    if (value.count == 'infinite') {
      one_animate = one_animate.replace('class="xun-h"', 'class="xun-h lv"').replace('class="kgq-2"', 'class="kgq-2" style="left:12px;"');
    }
    one_animate = one_animate.replace('value = "' + ani_name + '"', 'value="' + ani_name + '" selected');
    $(one_animate).appendTo($('.sx-sxc'));
    // 找到对应id的动画设置栏  设置滑块的功能与滑块的位置
    // 动画时间滑块
    $('#' + key + ' .aiti').parents('.dh-y').find('.aiti').next().text(ani_dur + "s");
    $('#' + key + ' .aiti').slider({
      value: parseFloat(ani_dur) * 10,
      step: 1,
      slide: function(event, ui) {
        event.stopPropagation();
        var ms = (ui.value / 10).toFixed(1);
        $(this).parents('.dh-y').find('.aiti').next().text(ms + "s");
        var elem = $(this);
        aniShowAndStorage(elem);
      }
    });
    // 动画延迟滑块
    $('#' + key + ' .delay').parents('.dh-y').find('.delay').next().text(ani_delay + "s");
    $('#' + key + ' .delay').slider({
      value: parseFloat(ani_delay) * 10,
      step: 1,
      slide: function(event, ui) {
        event.stopPropagation();
        var cs = (ui.value / 10).toFixed(1);
        $(this).parents('.dh-y').find('.delay').next().text(cs + "s");
        var elem = $(this);
        aniShowAndStorage(elem);
      }
    });
    // 动画次数滑块
    $('#' + key + ' .time').slider({
      value: parseFloat(ani_count) * 10,
      step: 10,
      slide: function(event, ui) {
        event.stopPropagation();
        var ms = ui.value / 10;
        $(this).parents('.dh-y').find('.time').next().text(ms);
        var elem = $(this);
        aniShowAndStorage(elem);
      }
    });
    if (value.count == 'infinite') {
      $('#' + key + ' .time').slider('disable');
    }
  });
}


//输入框的重新点击
var sekcd = function() {
    $('.fx1').slider({
      value: 0
    });
    $('.fx1').next().text('0%');
    $('.hk2').slider({
      value: 0
    });
    $('.hk2').next().text('0%');
    $('.xh-h').css('background-color', '#fff');
    $('.xh-b').css('background-color', '#515151');
    $('.ryys').css({
      'background-color': '#515151'
    });
    $('.kzy-y').css('display', 'none');
    $('.rk5').slider({
      value: 20
    });
    $('.rk5').next().text('8px');
    $('.rk6').slider({
      value: 50
    });
    $('.rk6').next().text('0px');
    $('.rk7').slider({
      value: 60
    });
    $('.huii').removeClass('lv');
    $('.huii .kgq-2').css('left', '1px');
    $('.rk7').next().text('4px');
    $('.baku').removeClass('lv');
    $('.ryys').css('display', 'none');
    $('.baku .kgq-2').css('left', '1px');
    $('.yan-s').css('display', 'none');
    $('.ra-h').css('display', 'none');
    $('.srk5').slider({
      value: 0
    })
    $('.srk5').next().text('0px');
    $('.dw-p').text('0px');
    $('.dw-x').text('0px');
    $('.dw-k').text('0px');
    $('.dw-g').text('0px');
  }
  //输入框的再次点击
var srkrd = function() {
  var gpeid = $('.eles li[data-cur="1"]').attr('id');
  var op = ((1 - elemObj[gpeid].opacity) * 100).toFixed(0);
  var wi = elemObj[gpeid].width;
  var wiz = wi.toFixed(0);
  var he = elemObj[gpeid].height;
  var hez = he.toFixed(0);
  $('.fx1').slider({
    value: op
  });
  $('.fx1').next().text('' + op + '%');
  var whz = wi >= he ? he : wi;
  var br = elemObj[gpeid].borderRadius;
  // var hk2z = ((br / whz) * 200).toFixed(0);
  // var xhk2z = ((br / whz) * 100).toFixed(0);
  $('.hk2').slider({
    value: br * 2
  });
  $('.hk2').next().text('' + br + '%');
  var bj = elemObj[gpeid].backgroundColor;
  var ys = elemObj[gpeid].color;
  $('.xh-h').css('background-color', bj);
  $('.xh-b').css('background-color', ys);
  if (elemObj[gpeid].boxShadowC == "#fff" && elemObj[gpeid].boxShadowX == 0 && elemObj[gpeid].boxShadowY == 0 && elemObj[gpeid].boxShadowS == 0) {
    $('.huii').removeClass('lv');
    $('.kgq-2').css('left', '1px');
    $('.yan-s').hide();
    $('.ryys').hide();
    $('.kzy-y').hide();
  } else {
    $('.huii').addClass('lv');
    $('.kgq-2').css('left', '12px');
    $('.yan-s').show();
    $('.ryys').show();
    $('.kzy-y').show();
    var bcz = elemObj[gpeid].boxShadowC;
    $('.ryys').css('background-color', bcz);
    var bsz = elemObj[gpeid].boxShadowS;
    var bss = (bsz / 40 * 100).toFixed(0);
    $('.rk5').slider({
      value: bss
    });
    $('.rk5').next().text('' + bsz + 'px');
    var bxz = elemObj[gpeid].boxShadowX;
    var bxs = bxz + 20;
    bxs = (bxs / 40 * 100).toFixed(0);
    $('.rk6').slider({
      value: bxs
    });
    $('.rk6').next().text('' + bxz + 'px');
    var byz = elemObj[gpeid].boxShadowY;
    var bys = byz + 20;
    bys = (bys / 40 * 100).toFixed(0);
    $('.rk7').slider({
      value: bys
    });
    $('.rk7').next().text('' + byz + 'px');
  }
  if (elemObj[gpeid].borderSize == 1 && elemObj[gpeid].borderColor == "#fff") {
    $('.baku').removeClass('lv');
    $('.ryys').hide();
    $('.baku .kgq-2').css('left', '1px');
    $('.yan-s').hide();
    $('.ra-h').hide();
    $('.kzy-z').hide();
  } else {
    $('.baku').addClass('lv');
    $('.baku .kgq-2').css('left', '12px');
    $('.yan-s').show();
    $('.ra-h').show();
    $('.kzy-z').show();
    var brc = elemObj[gpeid].borderColor;
    $('.ra-h').css('background-color', brc);
    var brz = elemObj[gpeid].borderSize;
    var brzz = brz * 5;
    $('.srk5').slider({
      value: brzz
    })
    $('.srk5').next().text(brz + 'px');
  }
  var leftz = elemObj[gpeid].positionLeft.toFixed(0);
  var topz = elemObj[gpeid].positionTop;
  var wi = elemObj[gpeid].width;
  var wiz = wi.toFixed(0);
  var he = elemObj[gpeid].height;
  var hez = he.toFixed(0);
  $('.dw-p').text('' + leftz + 'px');
  $('.dw-x').text('' + topz + 'px');
  $('.dw-k').text('' + wiz + 'px');
  $('.dw-g').text('' + hez + 'px');
  var inputTxt_id = $('.eles li[data-cur="1"]').find('textarea').attr('id');
  var inputTxt = elemObj[gpeid].inputTxt[inputTxt_id];
  $('.wbsr').val(inputTxt).attr('id', inputTxt_id);
}