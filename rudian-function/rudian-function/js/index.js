// 声明单页面所有元素集合
var elemObj = {};
$(function() {
  // 默认生成一个单页面
  var idz = Math.floor(Math.random() * 10000);
  var tcy = '<div class="x-zk" page-cur="1" id="' + idz + '_zs" style="border:2px solid #2eb3e8"><span class="paixu">1</span><span class="b-jq"></span><span class="x-sc" style="display:block"></span><span class="x-jz" style="display:block"></span></div>';
  var ele = '<ul class="eles" id="view" gid="' + idz + '"></ul>';
  $('.cont-zc').prepend(ele);
  $('.btcd').append(tcy);
  // 属性与动画设置页面切换
  $('.sx-dht').on('click', 'div', function(e) {
    e.stopPropagation;
    if ($(this).hasClass('btc')) {
      $(this).siblings().addClass('btc');
      $(this).removeClass('btc');
      $(this).parent().next().toggle()
      $(this).parent().next().next().toggle();
    } else {
      return;
    }
  });
  // 点击形状 请求形状分类
  $('#shape').on('click', function(e) {
    e.stopPropagation;
    getData({}, "elementsService.do", 'getShapeProperty', "shape_list");
  });
  // 切换形状类型
  $('.xing-z .sc-yys').on('click', 'div', function(e) {
    e.stopPropagation;
    $('.xing-z .sc-yys div').removeClass('c_y');
    $(this).addClass('c_y');
    getData({
      'property': $(this).attr('data-id'),
      'pageSize': '24',
      'pageNo': '1',
    }, "elementsService.do", 'getShape', "shape_one");
  });
  // 左测页面和图层的转换
  $('.y-t').on('click', 'div', function() {
    if ($(this).hasClass('btc')) {
      $('.y-t div').addClass('btc');
      $(this).removeClass('btc')
      $(this).parent().next().children().toggle()
    } else {
      return;
    }
  })

  // 左侧添加页面
  $('.t-j').on('click', function() {
      var idz = Math.floor(Math.random() * 10000);
      var alb = $('.btcd .x-zk').length + 1;
      if ($('.btcd .x-zk').length == 0) {
        var tcy1 = '<div class="x-zk" page-cur="1" id="' + idz + '_zs" style="border:2px solid #2eb3e8"><span class="paixu">1</span><span class="b-jq"></span><span class="x-sc" style="display:block"></span><span class="x-jz" style="display:block"></span></div>';
        $('.btcd').append(tcy1);
      } else {
        var tcy = '<div class="x-zk" page-cur="0" id="' + idz + '_zs"><span class="paixu">' + alb + '</span><span class="b-jq"></span><span class="x-sc"></span><span class="x-jz"></span></div>';
        $('.btcd').append(tcy);
      }
      var ele = '<ul class="eles" id="view" gid="' + idz + '"></ul>'
      $('.cont-zc').prepend(ele);
    })
    //删除一个页面
  $('.btcd').on('click', '.x-sc', function() {
      $(this).parent().remove();
      var gid = $(this).parent().attr('id').replace('_zs', '');
      $('.cont-zc ul[gid=' + gid + ']').remove();
    })
    //选中左边页面时
  $('.btcd').on('click', '.x-zk', function() {
      $('.btcd .x-zk').css('border', '2px solid #efeff4');
      $('.btcd .x-zk .x-sc').css('display', 'none');
      $('.btcd .x-zk .x-jz').css('display', 'none');
      $('.btcd .x-zk').attr('page-cur', '0');
      $(this).attr('page-cur', '1');
      $(this).css('border', '2px solid #2eb3e8').find('.x-sc, .x-jz').css('display', 'block');

    })
    // 下拉箭头的转换
  $('.ar-j').on('click', function() {
    if ($(this).hasClass('ar-r')) {
      $(this).removeClass('ar-r').addClass('ar-rx');
      $(this).parent().next().slideDown()
    } else {
      $(this).removeClass('ar-rx').addClass('ar-r');
      $(this).parent().next().slideUp()
    }
  })



  // 大的页面切换
  // 文本页面的跳转
  $('.yz-f1').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.sx-dh').show();
    ydcj();
    cstt();
    var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
    var cj = ($('.eles').find('.wb')) ? ($('.eles .wb').length + 150) : 150;
    var zhi = ($('.eles .wb').length === 0) ? 1 : $('.eles .wb').length + 1;
    var elem = $('<li class="box_txt wb" data-cur="1" giftpageid="' + giftpageid + '" id="wb' + zhi + '" style="width:262px;top:0;left:0;z-index:' + cj + '"></li>');
    var pic = $('<div class="txt"><div>请输入文本</div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(pic);
    elem.append(ctrl);
    $('.eles').append(elem);
    // ***删除动画页元素
    $('.dh-y').remove();
    // end
    var oneElem = new newTxt(elem);
    // 取出元素对应ID 存入总对象中
    var num = 'txt_' + oneElem.num;
    elemObj[num] = oneElem;
    elemObj[num].index = cj;
    elemObj[num].dataStorage();
    var tmx = '<li class="srz sr-xl1" id="' + num + '-sh"><span class="z-ht"></span><span class="z-hz">请插入文本</span></li>';
    $('.wzy').prepend(tmx);
    zwkzq();
    $('.wzy').sortable({
      axis: "y",
      stop: function(event, ui) {
        var lijh = $('.wzy li');
        var tmpz = lijh.length - 1;
        for (var i = 0; i < lijh.length; i++) {
          var tnum = lijh.eq(i).attr('id').replace('-sh', '');
          $('#' + lijh.eq(i).attr('id').replace('-sh', '')).css('z-index', tmpz + 150);
          elemObj[tnum].index = tmpz + 150;
          elemObj[tnum].dataStorage();
          tmpz--;
        }
      }
    });
    $('.sr-xl1').parent().slideDown();
    $('.sr-xl1').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
    return false;
  })



  // 双击编辑文本框
  $('.eles').on('dblclick', '.box_txt', function() {
      $('.eles .box_txt').css('border', '0');
      $('.eles .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
      $(this).css('border', '1px dashed #2eb3e8').children('.container').hide();
      $(this).children('.txt').attr('data-edit', '1').children().attr('contenteditable', 'true').focus();
      $(this).css("height", "initial");
      document.execCommand("selectAll");
    })
    //点击输入文本
  $('.eles').on('click', '.box_txt .txt>div', function(e) {
    // e.preventDefault();
    // ***1021
    if ($(this).parent().attr('data-edit') == 1) {
      e.stopPropagation();
    }
    // end
    if ($(this).parent().attr('data-edit') == 0) {
      // 文本框的处理
      $(".eles li .box_txt").css('border', '0');
      $('.eles li .box_txt .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
      $(".eles>li>div").not('.graph,.pic,.txt,.input,.shape').hide()
      $(this).parents(".box_txt").children().show();
    }
    $(".eles li").attr('data-cur', '0')
    $(this).parents(".box_txt").attr('data-cur', '1');
  });
  // 文本框失焦保存文本内容 ***1022
  $('.eles').on('blur', '.box_txt .txt>div', function(e) {
    e.stopPropagation;
    var txt = $(this).text();
    var elem_id = $(this).parents("li").attr('id');
    elemObj[elem_id].fontText = txt;
    elemObj[elem_id].dataStorage();
  });
  // end
  // 背景页面的跳转
  $('.yz-f2').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.be-jin').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
    })
    // 图片页面的跳转  ***1021
  $('.yz-f3').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.sc-tp').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
      // 发送请求
      getData({
        "uId": "1",
        "pageSize": "12",
        "pageNo": "1",
      }, "elementsService.do", 'getPicture', "pic_list");
    })
    // 贴图、形状页面的跳转  ***1021
  $('.yz-f4').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.txtx').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
      // 发送请求  1024  贴图分类 并且默认发送第一分类请求
      getData({}, "elementsService.do", 'getMapProperty', "graph_class");
    })
    // 切换贴图类型  ***1024
  $('.tie-z .sc-yys').on('click', 'div', function(e) {
    e.stopPropagation;
    $('.tie-z .sc-yys div').removeClass('c_y');
    $(this).addClass('c_y');
    getData({
      "property": $(this).attr('data-id'),
      "pageSize": "24",
      "pageNo": "1",
    }, "elementsService.do", 'getMapPing', "graph_list");
  });
  // 全部贴图滚动加载
  // var graph_page = 2;
  // $('.tu-ce>div').on('scroll', function(e) {
  //   // var class_id = $('.stl-c').attr('data-id');
  //   if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
  //     getData({
  //       "pageSize": "24",
  //       "pageNo": graph_page++,
  //     }, "elementsService.do", 'getMapPing', "graph_list");
  //   }
  // });
  // 音乐页面的跳转
  $('.yz-f5').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.sc-yy').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
      if ($('.yy-lb').text('')) {
        // addm();
      } else {
        return;
      }
      // ***1020 请求音乐列表
      getData({
        "flgId": "6",
        "parId": "0",
      }, "elementsService.do", 'getMusicCate', "music_list");
    })
    // 特效页面的跳转
  $('.yz-f6').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.cy-y').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
    })
    // 表单页面的跳转
  $('.yz-f7').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.sh_rk').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
    })
    //表单添加按钮
  $('.gz_k2').on('click', function(e) {
      $('.cont-y .zx').hide();
      $('.aa-nn').show();
      var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      cstt();
      e.stopPropagation();
      $('.eles li').attr('data-cur', '0');
      var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
      var elem = $('<li class="box_input bt form" data-cur="1" giftpageid="' + giftpageid + '" style="top:0;left:0;width:100px;height:40px;z-index:' + cj + '"></li>');
      var input = $('<div class="input btu"><button>请命名</button></div>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      elem.append(input);
      elem.append(ctrl);
      $('.eles').append(elem);
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      var oneElem = new newInput(elem);
      var num = 'input_' + oneElem.num;
      elemObj[num] = oneElem;
      // changebutton();
    })
    //单选框的添加
  $('.gz_k3').on('click', function() {
      $('.cont-y .zx').hide();
      $('.dx-k').show();
      var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      ddrc();
      var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
      var elem = $('<li class="box_input dak" data-cur="1" giftpageid="' + giftpageid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
      var input = $('<div class="input bdxan"><input type="radio" disabled="disabled" value="选项一"/><span class="ddxnr">选项一</span></div>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      elem.append(input);
      elem.append(ctrl);
      $('.eles').append(elem);
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      var oneElem = new newInput(elem);
      var num = 'input_' + oneElem.num;
      elemObj[num] = oneElem;
    })
    //多选框的添加
  $('.gz_k4').on('click', function() {
      $('.cont-y .zx').hide();
      $('.dx-k').show();
      var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      ddrc();
      var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
      var elem = $('<li class="box_input dax form" data-cur="1" giftpageid="' + giftpageid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
      var input = $('<div class="input bsxan"><input type="checkbox" disabled="disabled" value="选项一"/><span class="ddxnr">选项一</span></div>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      elem.append(input);
      elem.append(ctrl);
      $('.eles').append(elem);
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      var oneElem = new newInput(elem);
      var num = 'input_' + oneElem.num;
      elemObj[num] = oneElem;
    })
    //下拉框的添加
  $('.gz_k5').on('click', function() {
      $('.cont-y .zx').hide();
      $('.gt-mm').show();
      var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      srck();
      // ***1022
      var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
      var elem = $('<li class="box_input xla form" data-cur="1" giftpageid="' + giftpageid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
      var input = $('<div class="input selc"></div>');
      var select = $('<select class="xlko"></select>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      $('.xx-hz .bo-t1').remove();
      for (var i = 0; i < 3; i++) {
        var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
        $('<option value="请输入内容" id="' + inputTxt_id + '"></option>').appendTo(select);
        $('<div class="bo-t1"><div class="xs">0/20</div><span class="xuanx">选项' + (i + 1) + '</span><input type="text" class="qs-r" maxlength="10" placeholder="请输入内容" style="margin-left:16px"  id="' + inputTxt_id + '"><span class="yl-g"></span></div>').appendTo($('.xx-hz'));
      }
      input.append(select);
      // end
      elem.append(input);
      elem.append(ctrl);
      $('.eles').append(elem);
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      // addselect();
      delatese();
      // changetext();
      zcxhs();
      var oneElem = new newInput(elem);
      var num = 'input_' + oneElem.num;
      elemObj[num] = oneElem;
    })
    // 互动页面的跳转
  $('.yz-f8').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.tjx-h').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
  })

  $('.k-j4').on('click', function() {
    $('.zhe-z5').fadeIn(400);
  })
  $('.qu1').on('click', function() {
    $('.zhe-z5').fadeOut(400);
  })

  // 添加图片 / 贴纸
  $('.tp-sj .tu-ce,.tie-z .tu-ce').on('click', '.tu-p', function(e) {
      e.stopPropagation();
      ydcj();
      $('.cont-y .zx').hide();
      $('.pic-sd').show();
      var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      var src = $(this).attr('data-url');
      var cj = ($('.eles').find('.tp')) ? ($('.eles .tp').length + 50) : 50;
      var zhi = ($('.eles .tp').length === 0) ? 1 : $('.eles .tp').length + 1;
      var elem = $('<li class="box_pic tp" data-cur="1" giftpageid="' + giftpageid + '" style="top:0;left:0;z-index:' + cj + '"></li>');
      var pic = $('<div class="pic"><img src="' + src + '" data-src="' + src + '"/></div>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      elem.append(pic);
      elem.append(ctrl);
      $('.eles').append(elem);
      /* ***1021 */ // 1024
      var w = $(this).children('img')[0].width;
      var h = $(this).children('img')[0].height;
      elem.css({
        "width": w / 5,
        "height": h / 5,
      });
      $('.thzb').text(h / 5 + "px");
      $('.tzzb').text(w / 5 + "px");
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      var oneElem = new newPic(elem);
      // 取出元素对应ID 存入总对象中
      var num = 'pic_' + oneElem.num;
      elemObj[num] = oneElem;
      var tmx = '<li class="srz sr-xl2" id="' + num + '-xh"><span class="z-hw"></span><span class="z-hz">请插入图片</span></li>';
      $('.tpy').prepend(tmx);
      ztkzq();
      $('.tpy').sortable({
        axis: "y",
        stop: function() {
          var lijh = $('.tpy li');
          var tmpz = lijh.length - 1;
          for (var i = 0; i < lijh.length; i++) {
            var tnum = lijh.eq(i).attr('id').replace('-xh', '');
            $('#' + lijh.eq(i).attr('id').replace('-xh', '')).css('z-index', tmpz + 50);
            elemObj[tnum].index = tmpz + 50;
            elemObj[tnum].dataStorage();
            tmpz--;
          }
        }
      });
      $('.sr-xl2').parent().slideDown();
      $('.sr-xl2').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
      return false;
    })
    // bedit();
    // 添加形状
  $('.xing-z .tu-ce').on('click', '.tu-p', function(e) {
    e.stopPropagation();
    ydcj();
    cstt();
    $('.cont-y .zx').hide();
    $('.pic-sd').show();
    $('.eles li').attr('data-cur', '0')
    var giftpageid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    var oneshape = $(this).html();
    var cj = ($('.eles').find('.tp')) ? ($('.eles .tp').length + 50) : 50;
    var zhi = ($('.eles .tp').length === 0) ? 1 : $('.eles .tp').length + 1;
    var elem = $('<li class="box_shape tp" data-cur="1" giftpageid="' + giftpageid + '" style="z-index:' + cj + ';top:0;left:0;width:80px;height80px;"></li>');
    var shape = $('<div class="shape">' + oneshape + '</div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(shape);
    elem.append(ctrl);
    $('.eles').append(elem);
    // ***删除动画页元素
    $('.dh-y').remove();
    // end
    var oneElem = new newShape(elem);
    // // 取出元素对应ID 存入总对象中
    var num = 'shape_' + oneElem.num;
    elemObj[num] = oneElem;
    var tmx = '<li class="srz sr-xl2" id="' + num + '-xh"><span class="z-hw"></span><span class="z-hz">请插入图片</span></li>';
    $('.tpy').prepend(tmx);
    ztkzq();
    $('.tpy').sortable({
      axis: "y",
      stop: function() {
        var lijh = $('.tpy li');
        var tmpz = lijh.length - 1;
        for (var i = 0; i < lijh.length; i++) {
          var tnum = lijh.eq(i).attr('id').replace('-xh', '');
          $('#' + lijh.eq(i).attr('id').replace('-xh', '')).css('z-index', tmpz + 50);
          elemObj[tnum].index = tmpz + 50;
          elemObj[tnum].dataStorage();
          tmpz--;
        }
      }
    });
    $('.sr-xl2').parent().slideDown();
    $('.sr-xl2').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
    return false;
  })

  // 选择歌曲作为背景音乐
  $('.yy-lb').on('click', 'li', function() {
      $('.yy-lb li').removeClass('lb-t1');
      $(this).addClass('lb-t1');
      var text = $(this).find('.lb-gm').text();
      $('#yybbz').html("<marquee scrollamount='4'>" + text + "</marquee>").css('color', '#2eb3e8');
      if ($(this).find('.sg-zt').hasClass('sg-zt3')) {
        $('.yy-lb li .sg-zt').removeClass('sg-zt1').addClass('sg-zt2')
        $('.yy-lb li .bfzi').removeClass('bfxn');
        $(this).find('.sg-zt3').removeClass('sg-zt2 sg-zt3').addClass('sg-zt4');
        $(this).find('.bfxh').removeClass('bfxh').addClass('bfxn');
        $('.muy').removeClass('mumr_f mumr_z').addClass('mumr_b');
        // $('#yybbz').wrap('marquee');
      } else {
        if ($('.yy-lb li .sg-zt').hasClass('sg-zt1')) {
          $('.yy-lb li .sg-zt1').removeClass('sg-zt1').addClass('sg-zt2')
        } else if ($('.yy-lb li .sg-zt').hasClass('sg-zt4')) {
          $('.yy-lb li .sg-zt4').removeClass('sg-zt4').addClass('sg-zt3')
          $('.yy-lb li .bfxn').removeClass('bfxn').addClass('bfxh');
        }
        $(this).find('.sg-zt').removeClass('sg-zt2').addClass('sg-zt1');
        $('.muy').removeClass('mumr_f mumr_b').addClass('mumr_z');
      }
    })
    // 点击播放音乐
  $('.yy-lb').on('click', '.sg-zt', function(e) {
      e.stopPropagation();
      index = $(this).parent().index();
      if ($(this).hasClass('sg-zt3')) {
        $(this).removeClass('sg-zt3').addClass('sg-zt2');
        $(this).prev().find('.bfzi').removeClass('bfxh')
        $('audio')[0].pause()
      } else if ($(this).hasClass('sg-zt2')) {
        if ($('.yy-lb li .sg-zt').hasClass('sg-zt4')) {
          $('.yy-lb li .sg-zt4').removeClass('sg-zt4').addClass('sg-zt1')
          $('.yy-lb li .bfzi').removeClass('bfxn');
          $('.muy').removeClass('mumr_b').addClass('mumr_z');
        } else if ($('.yy-lb li .sg-zt').hasClass('sg-zt1')) {
          $('.yy-lb li .sg-zt1').removeClass('sg-zt2');
        }
        $('.yy-lb li .bfxh').removeClass('bfxh');
        $('.yy-lb li .sg-zt3').removeClass('sg-zt3').addClass('sg-zt2');
        $(this).removeClass('sg-zt2').addClass('sg-zt3');
        $(this).prev().find('.bfzi').addClass('bfxh');
        $('audio')[0].src = $(this).parent().attr('data-url');
        $('audio')[0].play();
      } else if ($(this).hasClass('sg-zt1')) {
        $('.yy-lb li .bfzi').removeClass('bfxh');
        $('.yy-lb li .sg-zt').removeClass('sg-zt3').addClass('sg-zt2');
        $(this).removeClass('sg-zt1 sg-zt2 sg-zt3').addClass('sg-zt4');
        $(this).prev().find('.bfzi').addClass('bfxn');
        $('audio')[0].src = $(this).parent().attr('data-url');
        $('audio')[0].play();
        // $('#yybbz').wrap('marquee');
        $('.muy').removeClass('mumr_z mumr_f').addClass('mumr_b');
      } else if ($(this).hasClass('sg-zt4')) {
        $(this).removeClass('sg-zt4').addClass('sg-zt1');
        $(this).prev().find('.bfzi').removeClass('bfxn');
        $('audio')[0].pause();
        $('.muy').removeClass('mumr_b mumr_f').addClass('mumr_z');
      }
    })
    // 表头暂停与播放音乐
  $('.muy').on('click', function() {
      if ($(this).hasClass('mumr_z')) {
        $(this).removeClass('mumr_z').addClass('mumr_b');
        $()
        $('.yy-lb li .sg-zt').removeClass('sg-zt3').addClass('sg-zt2');
        $('.lb-t1').find('.sg-zt').removeClass('sg-zt1').addClass('sg-zt4');
        $('audio')[0].src = $('.lb-t1').attr('data-url');
        $('audio')[0].play();
      } else {
        $(this).removeClass('mumr_b').addClass('mumr_z');
        $('.lb-t1').find('.sg-zt').removeClass('sg-zt4').addClass('sg-zt1');
        $('audio')[0].pause();

      }
    })
    // 关闭音乐
  $('.zt-yy').on('click', function() {
    $('.yy-lb .sg-zt').removeClass('sg-zt3').addClass('sg-zt2');
    $('audio')[0].pause();
  })

  // 切换音乐风格
  $('.sc-yy .sc-yys').on('click', '.fg', function() {
      index = $(this).index();
      $('.sc-yy .sc-yys .fg').removeClass('stl-c').addClass('stl');
      $(this).removeClass('stl').addClass('stl-c');
      $('.yy-lb').empty();
      var class_id = $(this).attr('data-id');
      getData({
        "name": "",
        "parId": class_id,
        "pageSize": "24",
        "pageNo": "1"
      }, "elementsService.do", 'getMusic', "music_list_one");

    })
    // ***1020 滚动加载更多音乐
  var music_page = 2;
  $('.yyhz').on('scroll', function(e) {
    var class_id = $('.stl-c').attr('data-id');
    if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
      getData({
        "name": "",
        "parId": class_id,
        "pageSize": "24",
        "pageNo": music_page++,
      }, "elementsService.do", 'getMusic', "music_list_one");
    }
  });
  // 特效的处理
  var cyc = [{
    id: 10001,
    src: 'images/tx/tx1.jpg'
  }, {
    id: 10002,
    src: 'images/tx/tx2.jpg'
  }, {
    id: 10003,
    src: 'images/tx/tx3.jpg'
  }, {
    id: 10004,
    src: 'images/tx/tx4.jpg'
  }, {
    id: 10005,
    src: 'images/tx/tx5.jpg'
  }, {
    id: 10006,
    src: 'images/tx/tx2.jpg'
  }, {
    id: 10007,
    src: 'images/tx/tx5.jpg'
  }, {
    id: 10008,
    src: 'images/tx/tx3.jpg'
  }, {
    id: 10009,
    src: 'images/tx/tx4.jpg'
  }];
  $.each(cyc, function(i, v) {
      $('<div class="tex-x" style="background-image:url(' + v.src + ')"></div>').appendTo($('.ge-q .tu-ce'));
    })
    // 添加特效到制作页面
  $('.ge-q .tu-ce').on('click', 'div', function() {
    var index = $(this).css('backgroundImage');
    index = index.replace('url("', '');
    index = index.replace('")', '');
    if ($('.eles').children().is($('#canvas'))) {
      $('.eles').find($('#canvas')).remove();
      tjmb(index);
    } else {
      tjmb(index);
    }
  })


  // 添加动画
  $('.tj-dh').on('click', function() {
      var bg = $(this).closest('div').parent();
      if (bg.find('.dh-y').length > 8) {
        return;
      } else {
        // ***随机生成动画id 找到激活项id 声明动画对象 存入元素对象动画属性中 更新缓存
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        var elem_id = $('.eles>li[data-cur="1"]').attr('id');
        var ani_obj = {
          "element": elem_id,
          "animation": "undefined",
          "start": 0,
          "type": 0,
          "duration": "2s",
          "delay": "0s",
          "count": 1,
          "timing": "ease",
          "direction": "normal",
          "status": "running",
          "finish": "none",
        };
        elemObj[elem_id].animate[ani_id] = ani_obj;
        updataAniStorage();
        // ***end     
        var dhs = (bg.find('.dh-y')) ? (bg.find('.dh-y').length + 1) : 1;
        var tjdh = '<div class="dh-y ' + elem_id + '" id="' + ani_id + '"><div class="dh-y1"><span class="zhx hx-j"></span><span class="dh-z">动画' + dhs + '</span><span class="xh-x"></span></div><div class="dh-cz"><div class="chu-f"><span class="chu-fz">触发</span><select class="chu-fj"><option>进入页面</option><option>单击</option></select></div><div class="don-ff"><span class="chu-fz">动画</span><select class="input input--dropdown js--animations"><optgroup label="无"><option value = "no"> 无 </option></optgroup><optgroup label = "强调"><option value = "bounce"> 弹跳 </option><option value = "flash"> 闪动 </option><option value = "pulse"> 脉冲 </option><option value = "rubberBand"> 橡皮筋 </option><option value = "shake"> 轻摇 </option><option value = "swing"> 摆动 </option><option value = "tada"> 嗒哒 </option><option value = "wobble"> 摇晃 </option><option value = "jello"> 果冻 </option></optgroup><optgroup label = "进入"><option value = "slideInDown"> 上移入 </option><option value = "slideInLeft"> 左移入 </option><option value = "slideInRight"> 右移入 </option><option value = "slideInUp"> 下移入 </option><option value = "fadeIn"> 淡入 </option><option value = "fadeInDown"> 上淡入 </option><option value = "fadeInDownBig"> 上淡入大 </option><option value = "fadeInLeft"> 左淡入 </option><option value = "fadeInLeftBig"> 左淡入大 </option><option value = "fadeInRight"> 右淡入 </option><option value = "fadeInRightBig"> 右淡入大 </option><option value = "fadeInUp"> 下淡入 </option><option value = "fadeInUpBig"> 下淡入大 </option><option value = "bounceIn"> 弹入 </option><option value = "bounceInDown"> 向下弹入 </option><option value = "bounceInUp"> 向上弹入 </option><option value = "bounceInLeft"> 从左弹入 </option><option value = "bounceInRight"> 从右弹入 </option><option value = "hinge"> 悬掉 </option><option value = "flip"> 翻转 </option><option value = "flipInX"> X翻转 </option><option value = "flipInY"> Y翻转 </option><option value = "lightSpeedIn"> 光速 </option><option value = "rotateIn"> 旋转 </option><option value = "rotateInDownLeft"> 左下旋转 </option><option value = "rotateInDownRight"> 右下旋转 </option><option value = "rotateInUpLeft"> 左上旋转 </option><option value = "rotateInUpRight"> 右上旋转 </option><option value = "slideninLeft"> 滑动 </option><option value = "zoomIn"> 放大 </option><option value = "zoomInDown"> 下放大 </option><option value = "zoomInLeft"> 左放大 </option><option value = "zoomInRight"> 右放大 </option><option value = "zoomInUp"> 上放大 </option><option value = "rollIn"> 滚入 </option></optgroup><optgroup label = "退出"><option value = "slideOutDown"> 上移出 </option><option value = "slideOutLeft"> 左移出 </option><option value = "slideOutRight"> 右移出 </option><option value = "slideOutUp"> 下移出 </option><option value = "fadeOut"> 淡出 </option><option value = "fadeOutDown"> 下淡出 </option><option value = "fadeOutDownBig"> 下淡出大 </option><option value = "fadeOutLeft"> 左淡出 </option><option value = "fadeOutLeftBig"> 左淡出大 </option><option value = "fadeOutRight"> 右淡出 </option><option value = "fadeOutRightBig"> 右淡出大 </option><option value = "fadeOutUp"> 上淡出 </option><option value = "fadeOutUpBig"> 上淡出大 </option><option value = "bounceOut"> 弹出 </option><option value = "bounceOutDown"> 下弹出 </option><option value = "bounceOutLeft"> 左弹出 </option><option value = "bounceOutRight"> 右弹出 </option><option value = "bounceOutUp"> 上弹出 </option><option value = "flipOutX"> X翻转 </option><option value = "flipOutY"> Y翻转 </option><option value = "lightSpeedOut"> 光速 </option><option value = "rotateOut"> 旋转 </option><option value = "rotateOutDownLeft"> 左下旋转 </option><option value = "rotateOutDownRight"> 右下旋转 </option><option value = "rotateOutUpLeft"> 左上旋转 </option><option value = "rotateOutUpRight"> 右上旋转 </option><option value = "slideInRight"> 滑动 </option><option value = "zoomOut"> 缩小 </option><option value = "zoomOutDown"> 下缩小 </option><option value = "zoomOutLeft"> 左缩小 </option><option value = "zoomOutRight"> 右缩小 </option><option value = "zoomOutUp"> 上缩小 </option><option value = "rollOut"> 滚出 </option></optgroup></select><select class="zc-j"><option>中心</option><option>↑</option><option>→</option><option>↓</option><option>←</option></select></div><div class="zs-t"><span class="chu-fz">时间</span><span class="cjt-j aiti" style="border:none"></span><span class="ji-m">2s</span></div><div class="zs-t"><span class="chu-fz">延迟</span><span class="cjt-j delay"  style="border:none"></span><span class="ji-m">0s</span></div><div class="zs-t"><span class="chu-fz">次数</span><span class="cjt-j time" style="border:none"></span><span class="ji-m">1</span></div><div class="sx-dhc7"><span class="yin-y">循环</span><span class="huii xun-h"><span class="kgq-2"></span></span></div></div></div>';
        bg.append(tjdh);
        // 动画设置滑块 功能 启动 同时存储初始化动画
        //动画时间
        $('.aiti').slider({
            value: 10,
            step: 5,
            slide: function(event, ui) {
              event.stopPropagation();
              var ms = ui.value / 5;
              $(this).parents('.dh-y').find('.aiti').next().text(ms + "s");
              var elem = $(this);
              aniShowAndStorage(elem);
            }
          })
          //动画延迟
        $('.delay').slider({
            step: 5,
            slide: function(event, ui) {
              event.stopPropagation();
              var cs = ui.value / 5;
              $(this).parents('.dh-y').find('.delay').next().text(cs + "s");
              var elem = $(this);
              aniShowAndStorage(elem);
            }
          })
          //动画次数
        $('.time').slider({
            value: 5,
            step: 5,
            slide: function(event, ui) {
              event.stopPropagation();
              var ms = ui.value / 5;
              $(this).parents('.dh-y').find('.time').next().text(ms);
              var elem = $(this);
              aniShowAndStorage(elem);
            }
          })
          //动画的循环
        $(document).delegate('.xun-h', 'click', function() {
          if ($(this).hasClass('lv')) {
            $(this).removeClass('lv')
            $(this).find('.kgq-2').css('left', '1px');
            // 循环为否时 次数设置为指定次数
            var elem_id = $('.eles>li[data-cur="1"]').attr('id');
            var ani_id = $(this).parents('.' + elem_id).attr('id');
            var ani_count = $(this).parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
            elemObj[elem_id].animate[ani_id].count = ani_count;
            updataAniStorage();
          } else {
            $(this).addClass('lv')
            $(this).find('.kgq-2').css('left', '12px');
            // 循环为是时 次数设置为infinite
            var elem_id = $('.eles>li[data-cur="1"]').attr('id');
            var ani_id = $(this).parents('.' + elem_id).attr('id');
            elemObj[elem_id].animate[ani_id].count = "infinite";
            updataAniStorage();
          }
        });
      }
    })
    //删除动画
  $('.sx-sxc').on('click', '.xh-x', function() {
      // ***删除动画时 删除对应元素对象中的对应动画  更新缓存
      var elem_id = $('.eles>li[data-cur="1"]').attr('id');
      var ani_id = $(this).parents('.dh-y').attr('id');
      delete elemObj[elem_id].animate[ani_id];
      elemObj[elem_id].dataStorage();
      $(this).parent().parent().remove();
    })
    // 点击下拉外
  $('.sx-sxc').on('click', '.dh-y1', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if ($(this).next().css('display') === "none") {
        $(this).find('.zhx').removeClass('hx-j').addClass('hx-x');
        // $('.dh-y1').next().slideUp();
        $(this).next().slideDown();
      } else {
        $(this).find('.zhx').removeClass('hx-x').addClass('hx-j');
        $(this).next().slideUp();
      }
    })
    // 点击下拉内
  $('.sx-sxc').on('click', '.hx', function(e) {
    e.stopPropagation();
    if ($(this).hasClass('hx-j')) {
      $(this).removeClass('hx-j').addClass('hx-x');
      $(this).next().slideDown();
    } else {
      $(this).removeClass('hx-x').addClass('hx-j');
      $(this).next().slideUp();
    }
  });
  $('.sx-dhc1').on('click', '.hx', function(e) {
      e.stopPropagation();
      if ($(this).hasClass('hx-j')) {
        $(this).removeClass('hx-j').addClass('hx-x');
        $(this).next().slideDown();
      } else {
        $(this).removeClass('hx-x').addClass('hx-j');
        $(this).next().slideUp();
      }
    })
    //点击中间区域所有操作区的元素去除编辑框
  $('.cont-c').on('click', function(e) {
      // e.preventDefault();
      e.stopPropagation();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
      $('.cont-y .zx').hide();
      $('.be-jin').show();
      // ***删除动画页元素
      $('.dh-y').remove();
      // end
      $(".eles .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
      zwdj();
    })
    //点击左侧---左中右三边的联动
  $('.ya-shi').on('click', '.srz', function(e) {
      e.stopPropagation();
      zwdj();
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
      $('.eles li').attr('data-cur', '0');
      $(this).css('background-color', '#2eb3e8');
      $(this).find('.z-hz').css('color', '#fff');
      $(this).attr('data-cur', '1');
      if ($(this).hasClass('sr-xl1')) {
        $('.cont-y .zx').hide();
        $('.sx-dh').show();
        $(this).find('.z-ht').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -78px no-repeat');
        $('.eles li').attr('data-cur', '0');
        $('#' + $(this).attr('id').replace('-sh', '')).attr('data-cur', '1');
        $('#' + $(this).attr('id').replace('-sh', '')).children().show();
        czwfz()
      } else if ($(this).hasClass('sr-xl2')) {
        $('.cont-y .zx').hide();
        $('.pic-sd').show();
        $(this).find('.z-hw').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -200px no-repeat')
        $('.eles li').attr('data-cur', '0');
        $('#' + $(this).attr('id').replace('-xh', '')).attr('data-cur', '1');
        $('#' + $(this).attr('id').replace('-xh', '')).children().show();
        cztfz();
      }
      // 1024
      var self = $(this);
      ancs(self);
    })
    //点击中间---左中右三边的联动
  $('.cont-c .eles').on('click', 'li', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape').hide();
    $(this).attr('data-cur', '1');
    $(this).children().show();
    zwdj();
    if ($(this).hasClass('wb')) {
      $('.cont-y .zx').hide();
      $('.sx-dh').show();
      $('#' + $(this).attr('id') + '-sh').css('background-color', '#2eb3e8');
      $('#' + $(this).attr('id') + '-sh').find('.z-hz').css('color', '#fff');
      $('#' + $(this).attr('id') + '-sh').find('.z-ht').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -78px no-repeat');
      czwfz();
    } else if ($(this).hasClass('tp')) {
      $('.cont-y .zx').hide();
      $('.pic-sd').show();
      $('#' + $(this).attr('id') + '-xh').css('background-color', '#2eb3e8');
      $('#' + $(this).attr('id') + '-xh').find('.z-hz').css('color', '#fff');
      $('#' + $(this).attr('id') + '-xh').find('.z-hw').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -200px no-repeat');
      cztfz();
    } else if ($(this).hasClass('bt')) {
      $('.cont-y .zx').hide();
      $('.aa-nn').show();
      andyz();
    } else if ($(this).hasClass('dak')) {
      $('.cont-y .zx').hide();
      $('.dx-k').show();
      ddzcc();
    } else if ($(this).hasClass('dax')) {
      $('.cont-y .zx').hide();
      $('.dx-k').show();
      ddzcc();
    } else if ($(this).hasClass('xla')) {
      $('.cont-y .zx').hide();
      $('.gt-mm').show();
      ddxla();
    }
    // 1024
    var self = $(this);
    ancs(self);
  })

  /* ***1021裁剪功能 */
  // 裁切功能 Jcrop插件
  function calCoord(c) {
    send_x = c.x;
    send_y = c.y;
    send_w = c.w;
    send_h = c.h;
  };

  function useCut() {
    var jcrop_api;
    $('#cut_target').Jcrop({
      onChange: calCoord,
      onSelect: calCoord,
    }, function() {
      jcrop_api = this;
      var originalWidth = $("#cut_target").width();
      var originalHeight = $("#cut_target").height();
      jcrop_api.animateTo([0, 0, originalWidth, originalHeight]);
    });
  };
  //裁剪页面的跳转
  var sendSrc = "";
  $('.cai-j').on('click', function(e) {
      e.stopPropagation;
      // 创建 裁切层
      if ($('.eles>li[data-cur="1"]').length == 0) {
        return;
      }
      $('.xtie-ts').children('.ti-z').remove();
      $('<div class="ti-z"><img src="" id="cut_target" style="vertical-align:middle;"/></div>').prependTo($('.xtie-ts'));
      $('.zjzzp').show(300);
      // 取得当前需要裁切对象的图片地址 放入裁切区
      var src = $('.eles>li[data-cur="1"]>div:eq(0)>img').attr("data-url");
      // 取出图片名称 待用
      sendSrc = src.split("/").pop();
      $("#cut_target").attr("src", src);
      // 检查图片的大小 实现居中布局
      imgW = $("#cut_target").width();
      imgH = $("#cut_target").height();
      boxW = $(".ti-z").width();
      boxH = $(".ti-z").height();
      if (imgW > boxW) {
        $("#cut_target").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
        });
        $(".jcrop-holder>div:eq(0)").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
          'position': 'absolute',
          'top': '0',
          'left': '0',
        });
        $('.jcrop-holder>.jcrop-tracker').css({
          'width': boxW + 4,
          'height': boxW * imgH / imgW + 4,
        });
        $(".jcrop-holder>img").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
        });
        $(".jcrop-holder>div:eq(0)>div:eq(0)>img").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
        });
      } else if (imgH > boxH) {
        $("#cut_target").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
        });
        $(".jcrop-holder>div:eq(0)").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
          'position': 'absolute',
          'top': '0',
          'left': '0',
        });
        $('.jcrop-holder>.jcrop-tracker').css({
          'width': boxH * imgW / imgH + 4,
          'height': boxH + 4,
        });
        $(".jcrop-holder>img").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
        });
        $(".jcrop-holder>div:eq(0)>div:eq(0)>img").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
        });
      }
      useCut();
      if (imgW > boxW) {
        $(".jcrop-holder").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
          'position': 'absolute',
          'top': '50%',
          'margin-top': -(boxW * imgH / imgW / 2),
          'background-color': '#ccc',
        });
      } else if (imgH > boxH) {
        $(".jcrop-holder").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
          'margin': 'auto',
        });
      } else {
        $(".jcrop-holder").css({
          'position': 'absolute',
          'top': '50%',
          'left': '50%',
          'margin-top': -(imgH / 2),
          'margin-left': -(imgW / 2),
        });
      }
    })
    // 点击确定 发送请求 裁切
  $('.dj-jd').on('click', function() {
    if (imgW > boxW) {
      send_x = send_x * imgW / boxW;
      send_y = send_y * imgW / boxW;
      send_w = send_w * imgW / boxW;
      send_h = send_h * imgW / boxW;
    } else if (imgH > boxH) {
      send_x = send_x * imgH / boxH;
      send_y = send_y * imgH / boxH;
      send_w = send_w * imgH / boxH;
      send_h = send_h * imgH / boxH;
    }
    getData({
      "filePath": sendSrc,
      "x": send_x,
      "y": send_y,
      "w": send_w,
      "h": send_h
    }, "picUploadService.do", "pictureCut", "picCut");
    $('.zjzzp').hide(200);
  });
  // 点击取消 隐藏裁切层
  $('.dj-jc').on('click', function() {
      $('.zjzzp').hide(200);
    })
    /* end */
    //互动的恢复默认
  $('.h_mr').on('click', function() {
      $('.zhe-z4').fadeIn();
    })
    //确定后退出
  $('.tip-qd4').on('click', function() {
      $('.zhe-z4').fadeOut(400);
    })
    //取消后退出
  $('.tip-qx4').on('click', function() {
    $('.zhe-z4').fadeOut(400);
  })


  //点击上传背景
  $('#file').change(function() {
      $('.sc-bt span').text('更换背景');
      $('.hf-mr').text('删除');
      $('.sz-j').hide();
      $('.cjz').css('background-color', '#0A7197')
      $('.cjczd').text('确定裁剪');
      $('.pbys').show();
      $('.cjzzc').hide();
    })
    //背景图片的恢复默认
  $('.hf-mr').on('click', function() {
      if ($(this).text() === '删除') {
        $('.zhe-z1').show();
      } else if ($(this).text() === '恢复默认') {
        $('.eles').css('background-color', '#fff');
        $('.jdt-z').css('background-color', '#fff');
        $('#ysbt').slider({
          value: 100
        });
        $('.jbmt').text('100%');
      }
    })
    //确定删除背景图片
  $('.tip-qd').on('click', function() {
      $('.cjz').css('background-color', '#999')
      $('.cjczd').text('裁剪');
      $('.eles').css('background-image', '');
      $('.photo-clip-rotateLayer').removeAttr("style");
      $('.photo-clip-rotateLayer').find('img').remove();
      $('.zhe-z1').hide();
      $('.sz-j').show();
      $('.sc-bt span').text('上传背景');
      $('.hf-mr').text('恢复默认');
      $('.pbys').hide();
      $('#ysbt').slider({
        value: 100
      });
      $('.jbmt').text('100%');
      $('.cjzzc').show();
    })
    //取消删除背景图片
  $('.tip-qx').on('click', function() {
      $('.zhe-z1').fadeOut();
    })
    //裁剪区无照片时不能裁剪
  $('#clipBtn').on('click', function() {
      if ($(this).text() === "裁剪") {
        $('.elels').css('background-image', '');
      }
    })
    //取消提示框消失
  $('.tip-qx').on('click', function() {
      $('.zhe-z1').hide();
    })
    //设置背景颜色
  $('.jdt-z').on('click', function() {
      $('.tsq').fadeToggle(200);
    })
    //文本字体的样式
  $('.sx-dhc2').on('click', 'span', function(e) {
      e.stopPropagation();
      var font = $('.eles li[data-cur="1"]').find('.txt');
      var num = $('.eles li[data-cur="1"]').attr('id');
      //文本字体的加粗
      if ($(this).hasClass('bt-b')) {
        if (font.css('font-weight') == 400) {
          font.css('font-weight', 'bold');
          elemObj[num].fontWeight = 'bold';
          elemObj[num].dataStorage();
        } else {
          font.css('font-weight', 400);
          elemObj[num].fontWeight = 400;
          elemObj[num].dataStorage();
        }
        //文本字体的倾斜
      } else if ($(this).hasClass('bt-i')) {
        if (font.css('font-style') == 'normal') {
          font.css('font-style', 'italic');
          elemObj[num].fontStyle = "italic";
          elemObj[num].dataStorage();
        } else {
          font.css('font-style', 'normal');
          elemObj[num].fontStyle = "normal";
          elemObj[num].dataStorage();
        }
        //文本字体的下划线
      } else if ($(this).hasClass('bt-u')) {
        if (font.css('text-decoration') == 'none') {
          font.css('text-decoration', 'underline');
          elemObj[num].textDecoration = "underline";
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'line-through') {
          font.css('text-decoration', 'underline line-through');
          elemObj[num].textDecoration = "underline line-height";
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'underline line-through') {
          font.css('text-decoration', 'line-through');
          elemObj[num].textDecoration = 'line-through';
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'underline') {
          font.css('text-decoration', 'none');
          elemObj[num].textDecoration = "underline";
          elemObj[num].dataStorage();
        }
        //文本字体的中划线
      } else if ($(this).hasClass('bt-s')) {
        if (font.css('text-decoration') == 'none') {
          font.css('text-decoration', 'line-through');
          elemObj[num].textDecoration = "line-through";
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'line-through') {
          font.css('text-decoration', 'none');
          elemObj[num].textDecoration = "none";
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'underline') {
          font.css('text-decoration', 'underline line-through');
          elemObj[num].textDecoration = "underline line-through";
          elemObj[num].dataStorage();
        } else if (font.css('text-decoration') == 'underline line-through') {
          font.css('text-decoration', 'underline');
          elemObj[num].textDecoration = "underline";
          elemObj[num].dataStorage();
        }
        //文本文字的左对齐
      } else if ($(this).hasClass('bt-z')) {
        font.css('text-align', 'left');
        elemObj[num].textAlign = "left";
        elemObj[num].dataStorage();
        //文本文字的居中
      } else if ($(this).hasClass('bt-c')) {
        font.css('text-align', 'center');
        elemObj[num].textAlign = "center";
        elemObj[num].dataStorage();
        //文本文字的右对齐
      } else if ($(this).hasClass('bt-y')) {
        font.css('text-align', 'right');
        elemObj[num].textAlign = "right";
        elemObj[num].dataStorage();
      }
    })
    //设置文本的颜色
  $('.wbys').minicolors({
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          $('.eles li[data-cur="1"]').find('.txt').css('color', log);
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].color = log;
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //文本字体类型的设置
  $('.wryh').change(function(e) {
      var cur = $('.eles li[data-cur="1"]')
      var num = cur.attr('id');
      var val = $(this).find('option:selected').val();
      e.stopPropagation();
      cur.find('.txt>div').css('font-family', val);
      elemObj[num].fontFamily = "叶根友毛笔行书";
      elemObj[num].dataStorage();
    })
    //文本字体大小的设置
  $('.ess').change(function(e) {
      e.stopPropagation();
      var cur = $('.eles li[data-cur="1"]');
      var val = $(this).find('option:selected').val();
      var num = cur.attr('id');
      cur.find('.txt>div').css('font-size', val);
      elemObj[num].fontSize = val;
      elemObj[num].dataStorage();
    })
    //设置文本图片的阴影
    //阴影的添加
  $('.huii').on('click', function(e) {
      e.stopPropagation();
      var cur = $('.eles li[data-cur="1"]');
      var num = cur.attr('id');
      var font = cur.find('.txt');
      var fonp = cur.find('img');
      var fonb = cur.find('button');
      var fons = cur.find('select');
      if ($(this).hasClass('lv')) {
        $(this).removeClass('lv')
        $(this).find('.kgq-2').css('left', '1px');
        $(this).nextAll().hide();
        $(this).parent().next().slideUp(400);
        if (cur.hasClass('wb')) {
          font.css('text-shadow', '#515151 0px 0px 0px');
          elemObj[num].txtShadowC = "#fff";
          elemObj[num].txtShadowX = 0;
          elemObj[num].txtShadowY = 0;
          elemObj[num].txtShadowS = 0;
          elemObj[num].dataStorage();
        } else if (cur.hasClass('tp') || cur.hasClass('bt') || cur.hasClass('xla')) {
          fonp.css('box-shadow', '#515151 0px 0px 0px');
          fonb.css('box-shadow', '#515151 0px 0px 0px');
          fons.css('box-shadow', '#515151 0px 0px 0px');
          elemObj[num].boxShadowC = "#fff";
          elemObj[num].boxShadowX = 0;
          elemObj[num].boxShadowY = 0;
          elemObj[num].boxShadowS = 0;
          elemObj[num].dataStorage();
        }
      } else {
        $(this).addClass('lv')
        $(this).find('.kgq-2').css('left', '12px');
        $(this).nextAll().show();
        $(this).parent().next().slideDown(400);
        if (cur.hasClass('wb')) {
          font.css('text-shadow', '#515151 0px 4px 8px');
          elemObj[num].txtShadowC = "#fff";
          elemObj[num].txtShadowX = 0;
          elemObj[num].txtShadowY = 4;
          elemObj[num].txtShadowS = 8;
          elemObj[num].dataStorage();
        } else if (cur.hasClass('tp') || cur.hasClass('bt') || cur.hasClass('xla')) {
          fonp.css('box-shadow', '#515151 0px 4px 8px');
          fonb.css('box-shadow', '#515151 0px 4px 8px');
          fons.css('box-shadow', '#515151 0px 4px 8px');
          elemObj[num].boxShadowC = "#fff";
          elemObj[num].boxShadowX = 0;
          elemObj[num].boxShadowY = 4;
          elemObj[num].boxShadowS = 8;
          elemObj[num].dataStorage();
        }
      }
    })
    //设置文本阴影的颜色
  $('.wzyys').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.wxz-z').text();
          xz = xz.replace("px", "");
          var yz = $('.wyz-z').text();
          yz = yz.replace("px", "");
          var sz = $('.wsz-z').text();
          sz = sz.replace("px", "");
          $('.yyys').css('background-color', log);
          $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + log + ' ' + xz + 'px ' + yz + 'px ' + sz + 'px');
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].txtShadowC = '' + log + '';
          elemObj[num].txtShadowX = '' + xz + '';
          elemObj[num].txtShadowY = '' + yz + '';
          elemObj[num].txtShadowS = '' + sz + '';
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置文本阴影的大小
  $('.wk5').slider({
      value: 20,
      slide: function(event, ui) {
        var bjz = (ui.value * 0.4).toFixed(0);
        var xz = $('.wxz-z').text();
        xz = xz.replace("px", "");
        var yz = $('.wyz-z').text();
        yz = yz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + xz + 'px ' + yz + 'px ' + bjz + 'px');
        $(this).next().text(bjz + 'px');
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].txtShadowC = '' + cz + '';
        elemObj[num].txtShadowX = '' + xz + '';
        elemObj[num].txtShadowY = '' + yz + '';
        elemObj[num].txtShadowS = '' + bjz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置文本阴影的X轴偏移
  $('.wk6').slider({
      value: 50,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var yz = $('.wyz-z').text();
        yz = yz.replace("px", "");
        var sz = $('.wsz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + bjz + 'px ' + yz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].txtShadowC = '' + cz + '';
        elemObj[num].txtShadowX = '' + bjz + '';
        elemObj[num].txtShadowY = '' + yz + '';
        elemObj[num].txtShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置文本阴影的Y轴偏移
  $('.wk7').slider({
      value: 60,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var xz = $('.wxz-z').text();
        xz = xz.replace("px", "");
        var sz = $('.wsz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + xz + 'px ' + bjz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].txtShadowC = '' + cz + '';
        elemObj[num].txtShadowX = '' + xz + '';
        elemObj[num].txtShadowY = '' + bjz + '';
        elemObj[num].txtShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置图片阴影的颜色
  $('.tzyys').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.sxz-z').text();
          xz = xz.replace("px", "");
          var yz = $('.syz-z').text();
          yz = yz.replace("px", "");
          var sz = $('.ssz-z').text();
          sz = sz.replace("px", "");
          $('.yyys').css('background-color', log);
          $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + log + ' ' + xz + 'px ' + yz + 'px ' + sz + 'px');
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].boxShadowC = '' + log + '';
          elemObj[num].boxShadowX = '' + xz + '';
          elemObj[num].boxShadowY = '' + yz + '';
          elemObj[num].boxShadowS = '' + sz + '';
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置图片阴影的大小
  $('.hk5').slider({
      value: 20,
      slide: function(event, ui) {
        var bjz = (ui.value * 0.4).toFixed(0);
        var xz = $('.sxz-z').text();
        xz = xz.replace("px", "");
        var yz = $('.syz-z').text();
        yz = yz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + xz + 'px ' + yz + 'px ' + bjz + 'px');
        $(this).next().text(bjz + 'px');
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + xz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + bjz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置图片阴影X轴的偏移
  $('.hk6').slider({
      value: 50,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var yz = $('.syz-z').text();
        yz = yz.replace("px", "");
        var sz = $('.ssz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + bjz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置图片阴影Y轴的偏移
  $('.hk7').slider({
      value: 60,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var xz = $('.sxz-z').text();
        xz = xz.replace("px", "");
        var sz = $('.ssz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.yyys').css('background-color');
        $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + xz + 'px ' + bjz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + xz + '';
        elemObj[num].boxShadowY = '' + bjz + '';
        elemObj[num].boxShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //选中框的对齐
  $('.wz-tb').on('click', 'span', function(e) {
      var BW = $('.eles').width();
      var BH = $('.eles').height();
      var num = $('.eles li[data-cur="1"]').attr('id');
      var leftz = elemObj[num].positionLeft;
      var topz = elemObj[num].positionTop;
      var w = elemObj[num].width;
      var h = elemObj[num].height;
      var szl = BW - w;
      var czt = BH - h;
      e.stopPropagation();
      //文本框的左对齐
      if ($(this).hasClass('wz-t1')) {
        $('.eles li[data-cur="1"]').css({
          'left': 0,
          'top': topz
        })
        $('.hzb').text('0px');
        $('.zzb').text('' + topz + 'px');
        $('.dw-p').text('0px');
        $('.dw-x').text('' + topz + 'px');
        elemObj[num].positionLeft = 0;
        elemObj[num].positionTop = topz;
        elemObj[num].dataStorage();
        //文本框的水平居中
      } else if ($(this).hasClass('wz-t2')) {
        var sjz = szl / 2;
        $('.eles li[data-cur="1"]').css({
          'left': sjz,
          'top': topz
        });
        $('.hzb').text('' + sjz + 'px');
        $('.zzb').text('' + topz + 'px');
        $('.dw-p').text('' + sjz + 'px');
        $('.dw-x').text('' + topz + 'px');
        elemObj[num].positionLeft = sjz;
        elemObj[num].positionTop = topz;
        elemObj[num].dataStorage();
        //文本框的右对齐
      } else if ($(this).hasClass('wz-t3')) {
        $('.eles li[data-cur="1"]').css({
          'left': szl,
          'top': topz
        })
        $('.hzb').text('' + szl + 'px');
        $('.zzb').text('' + topz + 'px');
        $('.dw-p').text('' + szl + 'px');
        $('.dw-x').text('' + topz + 'px');
        elemObj[num].positionLeft = szl;
        elemObj[num].positionTop = topz;
        elemObj[num].dataStorage();
        //文本框的上对齐
      } else if ($(this).hasClass('wz-t4')) {
        $('.eles li[data-cur="1"]').css({
          'left': leftz,
          'top': 0
        })
        $('.hzb').text('' + leftz + 'px');
        $('.zzb').text('0px');
        $('.dw-p').text('' + leftz + 'px');
        $('.dw-x').text('0px');
        elemObj[num].positionLeft = leftz;
        elemObj[num].positionTop = 0;
        elemObj[num].dataStorage();
        //文本框的垂直居中
      } else if ($(this).hasClass('wz-t5')) {
        var cjz = (BH - h) / 2;
        $('.eles li[data-cur="1"]').css({
          'left': leftz,
          'top': cjz
        })
        $('.hzb').text('' + leftz + 'px');
        $('.zzb').text('' + cjz + 'px');
        $('.dw-p').text('' + leftz + 'px');
        $('.dw-x').text('' + cjz + 'px');
        elemObj[num].positionLeft = leftz;
        elemObj[num].positionTop = cjz;
        elemObj[num].dataStorage();
        //文本框的下对齐
      } else if ($(this).hasClass('wz-t6')) {
        $('.eles li[data-cur="1"]').css({
          'left': leftz,
          'top': czt
        })
        $('.hzb').text('' + leftz + 'px');
        $('.zzb').text('' + czt + 'px');
        $('.dw-p').text('' + leftz + 'px');
        $('.dw-x').text('' + czt + 'px');
        elemObj[num].positionLeft = leftz;
        elemObj[num].positionTop = topz;
        elemObj[num].dataStorage();
      }
    })
    //设置选中元素的的背景色(表单)
  $('.szbjs').minicolors({
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          $('.eles li[data-cur="1"]').find('button').css('background-color', log);
          $('.eles li[data-cur="1"]').find('select').css('background-color', log);
          $('.eles li[data-cur="1"]').find('.bdxan').css('background-color', log);
          $('.eles li[data-cur="1"]').find('.bsxan').css('background-color', log);
          $('.bwj-z1').css('background-color', log);
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].backgroundColor = log;
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置选中元素的字体色(表单)
  $('.szzts').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          $('.eles li[data-cur="1"]').find('button').css('color', log);
          $('.eles li[data-cur="1"]').find('select').css('color', log);
          $('.eles li[data-cur="1"]').find('.bdxan').css('color', log);
          $('.eles li[data-cur="1"]').find('.bsxan').css('color', log);
          $('.bwj-z2').css('background-color', log);
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].color = log;
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置选中元素的透明度
  $('.hk1').slider({
    value: 100,
    slide: function(event, ui) {
      var bjz = ui.value / 100;
      $('.eles li[data-cur="1"]>div').eq(0).css('opacity', bjz);
      $(this).next().text(ui.value + "%");
      var num = $('.eles li[data-cur="1"]').attr('id');
      elemObj[num].opacity = bjz;
      elemObj[num].dataStorage();

    }
  });
  //设置选中元素的圆角
  $('.hk2').slider({
    slide: function(event, ui) {
      var elw = $('.eles li[data-cur="1"]').width();
      var elh = $('.eles li[data-cur="1"]').height();
      var syz = elw >= elh ? elh : elw;
      syz = (syz / 200).toFixed(2);
      var bjz = (ui.value * syz).toFixed(0) + 'px';
      var cbjz = Number((ui.value * syz).toFixed(0));
      $('.eles li[data-cur="1"]').find('img').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('button').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('select').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.input').css('border-radius', bjz);
      var yjxsz = (ui.value * 0.5).toFixed(0) + '%';
      $(this).next().text(yjxsz);
      var num = $('.eles li[data-cur="1"]').attr('id');
      elemObj[num].borderRadius = cbjz;
      elemObj[num].dataStorage();
    }
  });
  //设置选中元素的旋转角度
  $('.hk3').slider({
      slide: function(event, ui) {
        var bjz = (ui.value * 3.6).toFixed(0);
        $('.eles li[data-cur="1"]').css('transform', 'rotate(' + bjz + 'deg)');
        $(this).next().text(bjz + '°');
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].totalAngle = bjz;
        elemObj[num].dataStorage();
      }
    })
    //设置选中字体的行高
  $('.hk4').slider({
    value: 39,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.72).toFixed(0) + "px";
      var bjzz = (ui.value * 0.72).toFixed(0);
      $('.eles li[data-cur="1"]').find('.txt').css('line-height', bjz);
      $(this).next().text(bjz);
      var num = $('.eles li[data-cur="1"]').attr('id');
      elemObj[num].lineHeight = bjzz;
      elemObj[num].dataStorage();
    }
  })

  // ***1022
  //单选/多选 文字显示存储
  $('.ddxsk').on('focus', function() {
    if (!$(this).attr('id')) {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      $(this).attr('id', inputTxt_id);
      $('.eles li[data-cur="1"]').find('.ddxnr').attr('id', inputTxt_id);
    }
    $('.ddxsk').on('keyup', function() {
      $('.eles li[data-cur="1"]').find('.ddxnr').text($(this).val());
    })
  })
  $('.ddxsk').on('blur', function() {
    var inputTxt_id = $(this).attr('id');
    var elem_id = $('.eles li[data-cur="1"]').attr('id');
    var inputTxt = $(this).val();
    elemObj[elem_id].inputTxt[inputTxt_id] = inputTxt;
    elemObj[elem_id].dataStorage();
  });
  //按钮 文字显示存储  
  $('.antj').on('focus', function() {
    if (!$(this).attr('id')) {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      $(this).attr('id', inputTxt_id);
      $('.eles li[data-cur="1"]').find('button').attr('id', inputTxt_id);
    }
    $('.antj').on('keyup', function() {
      $('.eles li[data-cur="1"]').find('button').text($(this).val());
    })
  })
  $('.antj').on('blur', function() {
    var inputTxt_id = $(this).attr('id');
    var elem_id = $('.eles li[data-cur="1"]').attr('id');
    var inputTxt = $(this).val();
    elemObj[elem_id].inputTxt[inputTxt_id] = inputTxt;
    elemObj[elem_id].dataStorage();
  });
  // 下拉列表 文字显示存储
  $('.xx-hz').on('keyup', '.qs-r', function() {
    var inputTxt_id = $(this).attr('id');
    var index = $(this).parent().index();
    var elem_id = $('.eles li[data-cur="1"]').attr('id');
    var inputtxt = $(this).val();
    $('.xlkko option:eq(' + index + ')').text($(this).val());
    $('.eles li[data-cur="1"]' + ' #' + inputTxt_id).text($(this).val());
    if (inputtxt.length == 0) {
      delete elemObj[elem_id].inputTxt[inputTxt_id];
      elemObj[elem_id].dataStorage();
      return;
    }
    elemObj[elem_id].inputTxt[inputTxt_id] = inputtxt;
    elemObj[elem_id].dataStorage();
  });
  // end
  //设置按钮的颜色
  //设置按钮阴影的颜色
  $('.bzyys').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.bxz-z').text();
          xz = xz.replace("px", "");
          var yz = $('.byz-z').text();
          yz = yz.replace("px", "");
          var sz = $('.bsz-z').text();
          sz = sz.replace("px", "");
          $('.byys').css('background-color', log);
          $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + log + ' ' + xz + 'px ' + yz + 'px ' + sz + 'px');
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].boxShadowC = '' + log + '';
          elemObj[num].boxShadowX = '' + xz + '';
          elemObj[num].boxShadowY = '' + yz + '';
          elemObj[num].boxShadowS = '' + sz + '';
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置按钮阴影的大小
  $('.bk5').slider({
      value: 20,
      slide: function(event, ui) {
        var bjz = (ui.value * 0.4).toFixed(0);
        var xz = $('.bxz-z').text();
        xz = xz.replace("px", "");
        var yz = $('.byz-z').text();
        yz = yz.replace("px", "");
        var cz = $('.byys').css('background-color');
        $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + xz + 'px ' + yz + 'px ' + bjz + 'px');
        $(this).next().text(bjz + 'px');
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + xz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + bjz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置按钮阴影X轴的偏移
  $('.bk6').slider({
      value: 50,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var yz = $('.byz-z').text();
        yz = yz.replace("px", "");
        var sz = $('.bsz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.byys').css('background-color');
        $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + bjz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置图片阴影Y轴的偏移
  $('.bk7').slider({
      value: 60,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var xz = $('.bxz-z').text();
        xz = xz.replace("px", "");
        var sz = $('.bsz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.byys').css('background-color');
        $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + xz + 'px ' + bjz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + xz + '';
        elemObj[num].boxShadowY = '' + bjz + '';
        elemObj[num].boxShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置下拉框的颜色
    //设置按钮阴影的颜色
  $('.xzyys').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.xxz-z').text();
          xz = xz.replace("px", "");
          var yz = $('.xyz-z').text();
          yz = yz.replace("px", "");
          var sz = $('.xsz-z').text();
          sz = sz.replace("px", "");
          $('.xyys').css('background-color', log);
          $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + log + ' ' + xz + 'px ' + yz + 'px ' + sz + 'px');
          var num = $('.eles li[data-cur="1"]').attr('id');
          elemObj[num].boxShadowC = '' + log + '';
          elemObj[num].boxShadowX = '' + xz + '';
          elemObj[num].boxShadowY = '' + yz + '';
          elemObj[num].boxShadowS = '' + sz + '';
          elemObj[num].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置按钮阴影的大小
  $('.xk5').slider({
      value: 20,
      slide: function(event, ui) {
        var bjz = (ui.value * 0.4).toFixed(0);
        var xz = $('.xxz-z').text();
        xz = xz.replace("px", "");
        var yz = $('.xyz-z').text();
        yz = yz.replace("px", "");
        var cz = $('.xyys').css('background-color');
        $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + xz + 'px ' + yz + 'px ' + bjz + 'px');
        $(this).next().text(bjz + 'px');
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + xz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + bjz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置按钮阴影X轴的偏移
  $('.xk6').slider({
      value: 50,
      slide: function(event, ui) {
        var bjz = ((ui.value - 50) * 0.4).toFixed(0);
        var yz = $('.xyz-z').text();
        yz = yz.replace("px", "");
        var sz = $('.xsz-z').text();
        sz = sz.replace("px", "");
        var cz = $('.xyys').css('background-color');
        $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + 'px ' + sz + 'px');
        $(this).next().text(bjz + "px");
        var num = $('.eles li[data-cur="1"]').attr('id');
        elemObj[num].boxShadowC = '' + cz + '';
        elemObj[num].boxShadowX = '' + bjz + '';
        elemObj[num].boxShadowY = '' + yz + '';
        elemObj[num].boxShadowS = '' + sz + '';
        elemObj[num].dataStorage();
      }
    })
    //设置图片阴影Y轴的偏移
  $('.xk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.xxz-z').text();
      xz = xz.replace("px", "");
      var sz = $('.xsz-z').text();
      sz = sz.replace("px", "");
      var cz = $('.xyys').css('background-color');
      $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + xz + 'px ' + bjz + 'px ' + sz + 'px');
      $(this).next().text(bjz + "px");
      var num = $('.eles li[data-cur="1"]').attr('id');
      elemObj[num].boxShadowC = '' + cz + '';
      elemObj[num].boxShadowX = '' + xz + '';
      elemObj[num].boxShadowY = '' + bjz + '';
      elemObj[num].boxShadowS = '' + sz + '';
      elemObj[num].dataStorage();
    }
  })



})