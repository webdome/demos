// // 刷新页面删除本地存储 
$(function() {
  window.sessionStorage.clear();
});
// 声明单页面所有元素集合
var elemObj = {};
$(function() {
  // 默认生成一个单页面
  var bg_id = 'bg_' + Math.floor(Math.random() * 10000000000);
  var gpid = Math.floor(Math.random() * 10000);
  var gid = Math.floor(Math.random() * 10000);
  $('.cont-c').attr('gid', gid);
  $('.x-zk').attr('id', gpid + '_zs');
  $('.eles').attr('gpid', gpid);
  $('.box_bg').attr('id', bg_id);
  $('.box_bg').attr('gpid', gpid);
  // 初始化一个背景 
  elemObj[bg_id] = {
    "gpeid": bg_id,
    "sysgpeid": "0",
    "gpid": gpid,
    "sysgpid": "0",
    "eleId": "0",
    "eleType": "525",
    "zIndex": "40",
    "backgroundColor": "#fff",
    "backgroundImage": "",
    "opacity": 1,
    "animate": {}
  };
  window.sessionStorage.setItem(bg_id, JSON.stringify(elemObj[bg_id]));
  var gpid = $('.eles').attr('gpid');
  // 属性与动画设置页面切换
  $('.sx-dht').on('click', 'div', function(e) {
    e.stopPropagation;
    if ($(this).hasClass('btc')) {
      $(this).siblings().addClass('btc');
      $(this).removeClass('btc');
      $(this).parent().next().toggle();
      $(this).parent().next().next().toggle();
    }
  });
  // 点击形状 请求形状分类
  $('#shape').on('click', function(e) {
    e.stopPropagation;
    $('.xing-z .tu-ce').empty();
    getData({}, "elementsService.do", 'getShapeProperty', "shape_list");
  });
  // 切换形状类型
  $('.xing-z .sc-yys').on('click', 'div', function(e) {
    e.stopPropagation;
    $('.xing-z .sc-yys div').removeClass('c_y');
    $(this).addClass('c_y');
    $('.xing-z .tu-ce').empty();
    getData({
      'property': $(this).attr('data-id'),
      'pageSize': '24',
      'pageNo': '1',
    }, "elementsService.do", 'getShape', "shape_one");
  });
  // 全部形状滚动加载  
  var shape_page = 2;
  $('.xing-z .tu-ce').on('scroll', function(e) {
    if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
      if ($('.tu-ce>div:last').hasClass("no_more")) {
        return;
      } else {
        getData({
          'property': $('.xing-z .sc-yys .c_y').attr('data-id'),
          'pageSize': '24',
          'pageNo': shape_page++,
        }, "elementsService.do", 'getShape', "shape_one");
      }
    }
  });
  // 左测页面和图层的转换
  $('.y-t').on('click', 'div', function() {
    if ($(this).hasClass('btc')) {
      $('.y-t div').addClass('btc');
      $(this).removeClass('btc')
      $(this).parent().next().children().toggle()
    }
  });
  // 左侧添加页面  
  $('.t-j').on('click', function(e) {
    e.stopPropagation;
    var gpid = Math.floor(Math.random() * 10000);
    var alb = $('.btcd .x-zk').length + 1;
    var bg_id = 'bg_' + Math.floor(Math.random() * 10000000000);
    // 左侧页面及图层变化
    $('.btcd .x-zk').css('border', '2px solid #efeff4');
    $('.btcd .x-zk .x-sc').css('display', 'none');
    $('.btcd .x-zk .x-jz').css('display', 'none');
    $('.btcd .x-zk').attr('page-cur', '0');
    $('.cont-y .zx').hide();
    $('.be-jin').show();
    $('.sr-xl').empty();
    $('.ar-j').removeClass('ar-rx').addClass('ar-r');
    // 还原背景设置区
    bgInit();
    if ($('.btcd .x-zk').length == 0) {
      var tcy1 = '<div class="x-zk" page-cur="1" id="' + gpid + '_zs" style="border:2px solid #2eb3e8"><span class="paixu">1</span><span class="b-jq"></span><span class="x-sc" style="display:block"></span><span class="x-jz" style="display:block"></span></div>';
      $('.btcd').append(tcy1);
    } else {
      var tcy = '<div class="x-zk" page-cur="1" id="' + gpid + '_zs" style="border:2px solid #2eb3e8"><span class="paixu">' + alb + '</span><span class="b-jq"></span><span class="x-sc" style="display:block"></span><span class="x-jz" style="display:block"></span></div>';
      $('.btcd').append(tcy);
    }
    var ele = '<ul class="eles" gpid="' + gpid + '"><p class="box_bg view" id="' + bg_id + '" gpid="' + gpid + '"></p></ul>'
    $('.eles').replaceWith(ele);
    // 清空操作对象集合 不同页面添加时避免对象冲突
    elemObj = {};
    elemObj[bg_id] = {
      "gpeid": bg_id,
      "sysgpeid": "0",
      "gpid": gpid,
      "sysgpid": "0",
      "eleId": "0",
      "eleType": "525",
      "zIndex": "40",
      "backgroundColor": "#fff",
      "backgroundImage": "",
      "opacity": 1,
      "animate": {},
    };
    window.sessionStorage.setItem(bg_id, JSON.stringify(elemObj[bg_id]));
  });
  //左侧删除一个页面
  $('.btcd').on('click', '.x-sc', function(e) {
    e.stopPropagation;
    $(this).parent().remove();
    var gpid = $(this).parent().attr('id').replace('_zs', '');
    if ($(this).parent().attr('page-cur') == 1) { // 如果是当前页面 则同时清空操作区对象集合
      $('.eles').remove();
      elemObj = {};
    }
    // 移除页面中所有元素
    var elemObjs = getStorage();
    $.each(elemObjs, function(gpeid, obj) {
      $.each(obj, function(property, value) {
        if (value == gpid) {
          window.sessionStorage.removeItem(gpeid); // 清除对应的本地存储
        }
      });
    });
  });
  //左侧页面点击画布区对应元素可操作
  $('.btcd').on('click', '.x-zk', function(e) {
    e.stopPropagation;
    $('.btcd .x-zk').css('border', '2px solid #efeff4');
    $('.btcd .x-zk .x-sc').css('display', 'none');
    $('.btcd .x-zk .x-jz').css('display', 'none');
    $('.btcd .x-zk').attr('page-cur', '0');
    $(this).attr('page-cur', '1');
    $(this).css('border', '2px solid #2eb3e8').find('.x-sc, .x-jz').css('display', 'block');
    $('.cont-y .zx').hide();
    $('.be-jin').show();
    $('.sr-xl').empty();
    // 清空操作对象集合 渲染时重新存入 避免对象冲突
    elemObj = {};
    var self = $(this);
    // 渲染对应页面的元素
    rendering(self);
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    // end
  });
  // 左侧图层区下拉箭头的转换
  $('.ar-j').on('click', function(e) {
    e.stopPropagation;
    if ($(this).hasClass('ar-r')) {
      $(this).removeClass('ar-r').addClass('ar-rx');
      $(this).parent().next().slideDown()
    } else {
      $(this).removeClass('ar-rx').addClass('ar-r');
      $(this).parent().next().slideUp()
    }
  });
  // 背景页面的跳转
  $('.yz-f2').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.be-jin').show();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    })
    // 图片页面的跳转  
  $('.yz-f3').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.sc-tp').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    // 发送请求 图片分类
    $('.xc-tou').empty();
    $('.tp-sj>.tu-ce>div').remove();
    getData({}, 'elementsService.do', 'getPictureProperty', 'pic_class');
  });
  // 用户自己的图库
  $('.xc-tou').on('click', '.own_pic', function(e) {
    e.stopPropagation;
    $('.xc-tou>div').removeClass('c_y');
    $(this).addClass('c_y');
    $('.tp-sj .no_more').remove();
    $('<div class="jia-t"><span class="jia-hx"></span><span>上传图片</span></div>').appendTo($('.tp-sj .tu-ce'));
    $('.tp-sj .tu-p').remove();
    var uid = JSON.parse(document.cookie.replace('user_msg=', '')).id;
    getData({
      "uId": uid,
      "pageSize": "36",
      "pageNo": "1",
    }, "elementsService.do", 'getPicture', "pic_list");
  });
  // 公开的图库
  $('.xc-tou').on('click', '.public_pic', function(e) {
    e.stopPropagation;
    $('.xc-tou>div').removeClass('c_y');
    $(this).addClass('c_y');
    $('.jia-t').remove();
    $('.tp-sj .no_more').remove();
    $('.tp-sj .tu-p').remove();
    var id = $(this).attr('data-id');
    getData({
      'id': id,
      'pageSize': '36',
      'pageNo': '1'
    }, 'elementsService.do', 'getPictureProList', 'pic_list');
  });
  //  图片滚动加载
  var pic_opage = 2;
  var pic_ppage = 2;
  $('.tp-sj .tu-ce').on('scroll', function(e) {
    if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
      if ($('.tp-sj .tu-ce>div:last').hasClass("no_more")) {
        return;
      } else {
        if ($('.xc-tou>.c_y').hasClass('own_pic')) {
          var uid = JSON.parse(document.cookie.replace('user_msg=', '')).id;
          getData({
            "uId": uid,
            "pageSize": "12",
            "pageNo": pic_opage++,
          }, "elementsService.do", 'getPicture', "pic_list");
        } else {
          var id = $('.xc-tou>.c_y').attr('data-id');
          getData({
            'id': id,
            'pageSize': '12',
            'pageNo': pic_ppage++
          }, 'elementsService.do', 'getPictureProList', 'pic_list');
        }
      }
    }
  });
  // 贴图、形状页面的跳转  
  $('.yz-f4').on('click', function(e) {
      $('.eles .xz').hide();
      $('.cont-y .zx').hide();
      $('.txtx').show();
      e.stopPropagation();
      $('.eles li').attr('data-cur', '0');
      $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
      // 发送请求  贴图分类 并且默认发送第一分类请求
      $('.tie-z .sc-yys').empty();
      $('.tie-z .tu-ce').empty();
      // end
      getData({}, "elementsService.do", 'getMapProperty', "graph_class");
    })
    // 切换贴图类型  
  $('.tie-z .sc-yys').on('click', 'div', function(e) {
    e.stopPropagation;
    $('.tie-z .sc-yys div').removeClass('c_y');
    $(this).addClass('c_y');
    $('.tie-z .tu-ce').empty();
    getData({
      "property": $(this).attr('data-id'),
      "pageSize": "24",
      "pageNo": "1",
    }, "elementsService.do", 'getMapPing', "graph_list");
  });
  // 全部贴图滚动加载  
  var graph_page = 2;
  $('.tie-z .tu-ce').on('scroll', function(e) {
    if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
      if ($('.tie-z .tu-ce>div:last').hasClass("no_more")) {
        return;
      } else {
        getData({
          "property": $('.tie-z .sc-yys .c_y').attr('data-id'),
          "pageSize": "24",
          "pageNo": graph_page++,
        }, "elementsService.do", 'getMapPing', "graph_list");
      }
    }
  });
  // 音乐页面的跳转
  $('.yz-f5').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.sc-yy').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    // 请求音乐列表
    getData({
      "flgId": "6",
      "parId": "0",
    }, "elementsService.do", 'getMusicCate', "music_list");
  });
  // 特效页面的跳转
  $('.yz-f6').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.cy-y').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
  });
  // 表单页面的跳转
  $('.yz-f7').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.sh_rk').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
  });
  // 添加文本
  $('.yz-f1').on('click', function(e) {
    e.stopPropagation();
    // 切换到图层操作区
    ydcj();
    // 右侧操作区初始化
    cstt();
    // 取得激活的页面的gpid 标记添加元素的隶属关系
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    var zIndex = ($('.eles').find('.wb')) ? ($('.eles .wb').length + 150) : 150;
    var elem = $('<li class="box_txt wb" data-cur="0" gpid="' + gpid + '" style="width:262px;top:0;left:0;z-index:' + zIndex + '"></li>');
    var txt = $('<div class="txt"><div>请输入文本</div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(txt);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    // end
    var oneElem = new newTxt(elem);
    // 取出元素对应ID 存入总对象中
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    elemObj[gpeid].zIndex = zIndex;
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    // end
    elemObj[gpeid].dataStorage();
    // 添加左侧图层 初始化样式
    var tmx = '<li class="srz sr-xl1" id="' + gpeid + '-sh"><span class="z-ht"></span><span class="z-hz">请插入文本</span><span class="cllf"></span></li>';
    $('.wzy').prepend(tmx);
    zwdj();
    // 图层可拖动
    $('.wzy').sortable({
      axis: "y",
      stop: function(event, ui) {
        var lijh = $('.wzy li');
        var tmpz = lijh.length - 1;
        for (var i = 0; i < lijh.length; i++) {
          var gpeid = lijh.eq(i).attr('id').replace('-sh', '');
          $('#' + lijh.eq(i).attr('id').replace('-sh', '')).css('z-index', tmpz + 150);
          elemObj[gpeid].zIndex = tmpz + 150;
          elemObj[gpeid].dataStorage();
          tmpz--;
        }
      }
    });
    $('.sr-xl1').parent().slideDown();
    $('.sr-xl1').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
    return false;
  });
  // 双击编辑文本框
  $('.cont-zc').on('dblclick', '.eles .box_txt', function() {
      $('.eles .box_txt').css('border', '0');
      $('.eles .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
      $(this).css('border', '1px dashed #2eb3e8').children('.container').hide();
      $(this).children('.txt').attr('data-edit', '1').children().attr('contenteditable', 'true').focus();
      $(this).css("height", "initial");
      document.execCommand("selectAll");
    })
    //点击输入文本
  $('.cont-zc').on('click', '.eles .box_txt .txt>div', function(e) {
    // 
    if ($(this).parent().attr('data-edit') == 1) {
      e.stopPropagation();
    }
    if ($(this).parent().attr('data-edit') == 0) {
      // 文本框的处理
      $(".eles li .box_txt").css('border', '0');
      $('.eles li .box_txt .txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
      $(".eles>li>div").not('.graph,.pic,.txt,.input,.shape,.hd').hide()
      $(this).parents(".box_txt").children().show();
    }
    $(".eles li").attr('data-cur', '0')
    $(this).parents(".box_txt").attr('data-cur', '1');
  });
  // 文本框失焦保存文本内容 
  $('.cont-zc').on('blur', '.eles .box_txt .txt>div', function(e) {
    e.stopPropagation;
    var txt = $(this).text();
    var gpeid = $(this).parents("li").attr('id');
    elemObj[gpeid].fontText = txt;
    elemObj[gpeid].dataStorage();
  });
  // 添加输入框   
  $('.gz_k1').on('click', function(e) {
    e.stopPropagation;
    sekcd();
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    ddrc();
    var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
    var elem = $('<li class="box_input area form" data-cur="0" gpid="' + gpid + '" style="width:200px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
    var input = $('<div class="input bdsr"><textarea name="" id="" cols="30" rows="10" style="width: 100%;height: 100%;position:relative;z-index:170;margin:0;padding:0;display:block;background-color:transparent;resize:none;line-height:38px" disabled></textarea><div class="arcg"></div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(input);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    var oneElem = new newInput(elem);
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    $('.dw-k').text('200px');
    $('.dw-g').text('80px');
    elemObj[gpeid].width = 200;
    elemObj[gpeid].height = 80;
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 520;
    elemObj[gpeid].dataStorage();
  });
  //按钮的添加
  $('.gz_k2').on('click', function(e) {
      e.stopPropagation;
      var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
      cstt();
      e.stopPropagation();
      $('.eles li').attr('data-cur', '0');
      var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
      var elem = $('<li class="box_input bt form" data-cur="0" gpid="' + gpid + '" style="top:0;left:0;width:100px;height:40px;z-index:' + cj + '"></li>');
      var input = $('<div class="input btu"><button>请命名</button><div class="anbc"></div></div>');
      var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
      elem.append(input);
      elem.append(ctrl);
      $('.eles').append(elem);
      // 初始化动画页
      $('.dh-y').remove();
      var oneElem = new newInput(elem);
      var gpeid = oneElem.gpeid;
      elemObj[gpeid] = oneElem;
      $('.dw-k').text('100px');
      $('.dw-g').text('40px');
      // 添加gpid区分不同页面 
      elemObj[gpeid].gpid = gpid;
      elemObj[gpeid].eleType = 523;
      elemObj[gpeid].dataStorage();
    })
    //单选框的添加
  $('.gz_k3').on('click', function(e) {
    e.stopPropagation;
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    ddrc();
    var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
    var elem = $('<li class="box_input dak form" data-cur="0" gpid="' + gpid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
    var input = $('<div class="input bdxan"><input type="radio" disabled="disabled" value="选项一"/ style="position:relative;z-index:170"><span class="ddxnr">选项一</span><div class="dxbc"></div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(input);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    var oneElem = new newInput(elem);
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    $('.dw-k').text('100px');
    $('.dw-g').text('40px');
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 522;
    elemObj[gpeid].dataStorage();
  });
  //多选框的添加
  $('.gz_k4').on('click', function(e) {
    e.stopPropagation;
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    ddrc();
    var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
    var elem = $('<li class="box_input dax form" data-cur="0" gpid="' + gpid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
    var input = $('<div class="input bdsr"><input type="checkbox" disabled="disabled" value="选项一"/ style="position:relative;z-index:170"><span class="ddxnr">选项一</span><div class="arcg"></div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(input);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    var oneElem = new newInput(elem);
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    $('.dw-k').text('100px');
    $('.dw-g').text('40px');
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 521;
    elemObj[gpeid].dataStorage();
  });
  //下拉框的添加
  $('.gz_k5').on('click', function(e) {
    e.stopPropagation;
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    srck();
    var cj = ($('.eles').find('.form')) ? ($('.eles .form').length + 100) : 100;
    var elem = $('<li class="box_input xla form" data-cur="0" gpid="' + gpid + '" style="width:100px;height:40px;top:0;left:0;z-index:' + cj + '"></li>');
    var input = $('<div class="input selc"><div class="xlbc"></div></div>');
    var select = $('<select class="xlko"></select>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    $('.xx-hz .bo-t1').remove();
    var xltxt = [];
    for (var i = 0; i < 3; i++) {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      $('<option value="请输入内容" id="' + inputTxt_id + '"></option>').appendTo(select);
      $('<div class="bo-t1"><div class="xs">0/20</div><span class="xuanx">选项' + (i + 1) + '</span><input type="text" class="qs-r" maxlength="10" placeholder="请输入内容" style="margin-left:16px"  id="' + inputTxt_id + '"><span class="yl-g"></span></div>').appendTo($('.xx-hz'));
      xltxt.push(inputTxt_id);
    }
    input.append(select);
    // end
    elem.append(input);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    delatese();
    zcxhs();
    var oneElem = new newInput(elem);
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    // 
    $('.dw-k').text('100px');
    $('.dw-g').text('40px');
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 524;
    elemObj[gpeid].inputTxt[xltxt[0]] = "请输入内容";
    elemObj[gpeid].inputTxt[xltxt[1]] = "请输入内容";
    elemObj[gpeid].inputTxt[xltxt[2]] = "请输入内容";
    elemObj[gpeid].dataStorage();
  });
  // 互动页面的跳转
  $('.yz-f8').on('click', function(e) {
    e.stopPropagation();
    $('.cont-y .zx').hide();
    $('.tjx-h').show();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
  });
  $('.k-j4').on('click', function() {
    $('.zhe-z5').fadeIn(400);
  });
  $('.qu1').on('click', function() {
    $('.zhe-z5').fadeOut(400);
  });
  // 更换图片  
  $('.ggt-p').on('click', function(e) {
    e.stopPropagation;
    var elem_class = $('.eles>li[data-cur="1"]>div:eq(0)').attr('class');
    $('.pic-sd').hide();
    if (elem_class == "pic") {
      $('.sc-tp').show();
    } else if (elem_class == "graph") {
      $('.txtx').show();
      $('.xing-z').hide();
      $('.tie-z').show();
    } else if (elem_class == "shape") {
      $('.txtx').show();
      $('.tie-z').hide();
      $('.xing-z').show();
    }
  });
  // end
  // 添加图片 / 贴纸
  $('.tp-sj .tu-ce,.tie-z .tu-ce').on('click', '.tu-p', function(e) {
    e.stopPropagation();
    // 更换图片
    if ($('.eles>li[data-cur="1"]').length == 1) {
      var src = $(this).attr('data-url');
      var eleId = $(this).attr('data-id');
      var w = $(this).children('img')[0].width;
      var h = $(this).children('img')[0].height;
      var gpeid = $('.eles>li[data-cur="1"]').attr('id');
      $('.eles>li[data-cur="1"]>div:eq(0)>img').attr({
        'src': src,
        'data-src': src,
      });
      $('.eles>li[data-cur="1"]').css({
        "width": w / 4,
        "height": h / 4,
      });
      elemObj[gpeid].width = w / 4;
      elemObj[gpeid].height = h / 4;
      elemObj[gpeid].path = src;
      elemObj[gpeid].eleId = eleId;
      elemObj[gpeid].dataStorage();
      return;
    }
    // end
    ydcj();
    cstt();
    if ($(this).parent().parent().hasClass('tie-z')) {
      $('.ggt-p').css('width', '273px');
      $('.cai-j').hide();
    } else if ($(this).parent().parent().hasClass('tp-sj')) {
      $('.ggt-p').css('width', '130px');
      $('.cai-j').show();
    }
    $('.kzsps').hide();
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    var src = $(this).attr('data-url');
    var cj = ($('.eles').find('.tp')) ? ($('.eles .tp').length + 50) : 50;
    // 
    if ($(this).parents('.tp-sj').length == 1) {
      var li_class = 'box_pic';
      var div_class = 'pic';
    } else if ($(this).parents('.tie-z').length == 1) {
      var li_class = 'box_graph';
      var div_class = 'graph';
    }
    var elem = $('<li class="' + li_class + ' tp" data-cur="0" gpid="' + gpid + '" style="top:0;left:0;z-index:' + cj + '"></li>');
    var pic = $('<div class="' + div_class + '"><img src="' + src + '" data-src="' + src + '"/></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(pic);
    elem.append(ctrl);
    $('.eles').append(elem);
    /*  */ //
    var w = $(this).children('img')[0].width;
    var h = $(this).children('img')[0].height;
    elem.css({
      "width": w / 4,
      "height": h / 4,
    });
    $('.thzb').text(h / 4 + "px");
    $('.tzzb').text(w / 4 + "px");
    // 初始化动画页
    $('.dh-y').remove();
    // end
    if ($(this).parents('.tp-sj').length == 1) {
      var oneElem = new newPic(elem);
      var gpeid = oneElem.gpeid;
    } else if ($(this).parents('.tie-z').length == 1) {
      var oneElem = new newGraph(elem);
      var gpeid = oneElem.gpeid;
    }
    elemObj[gpeid] = oneElem;
    // 
    elemObj[gpeid].path = src;
    var eleId = $(this).attr('data-id');
    elemObj[gpeid].eleId = eleId;
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].dataStorage();
    // end
    var tmx = '<li class="srz sr-xl2" id="' + gpeid + '-xh"><span class="z-hw"></span><span class="z-hz">请插入图片</span><span class="cllf"></span></li>';
    $('.tpy').prepend(tmx);
    zwdj();
    $('.tpy').sortable({
      axis: "y",
      stop: function() {
        var lijh = $('.tpy li');
        var tmpz = lijh.length - 1;
        for (var i = 0; i < lijh.length; i++) {
          var gpeid = lijh.eq(i).attr('id').replace('-xh', '');
          $('#' + lijh.eq(i).attr('id').replace('-xh', '')).css('z-index', tmpz + 50);
          elemObj[gpeid].zIndex = tmpz + 50;
          elemObj[gpeid].dataStorage();
          tmpz--;
        }
      }
    });
    $('.sr-xl2').parent().slideDown();
    $('.sr-xl2').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
    return false;
  });
  // bedit();
  // 添加形状
  $('.xing-z .tu-ce').on('click', '.tu-p', function(e) {
    e.stopPropagation();
    // 更换形状
    if ($('.eles>li[data-cur="1"]').length == 1) {
      var svg = $(this).html();
      var eleId = $(this).attr('data-id');
      var gpeid = $('.eles>li[data-cur="1"]').attr('id');
      elemObj[gpeid].eleId = eleId;
      elemObj[gpeid].path = svg;
      elemObj[gpeid].dataStorage();
      var borderRadius = elemObj[gpeid].borderRadius;
      var boxShadowC = elemObj[gpeid].boxShadowC;
      var boxShadowS = elemObj[gpeid].boxShadowS;
      var boxShadowX = elemObj[gpeid].boxShadowX;
      var boxShadowY = elemObj[gpeid].boxShadowY;
      svg = svg.replace('<svg ', '<svg style="border-radius:' + borderRadius + '%;box-shadow:' + boxShadowC + ' ' + boxShadowX + 'px ' + boxShadowY + 'px ' + boxShadowS + 'px;"');
      $('.eles>li[data-cur="1"]>div:eq(0)').html(svg);
      var log = $('.kzsps .tzsz').val();
      $('.eles li[data-cur="1"]').find('.cls-1').css('fill', log);
      return;
    }
    // end
    ydcj();
    cstt();
    $('.cont-y .zx').hide();
    $('.pic-sd').show();
    $('.cai-j').hide();
    $('.ggt-p').css('width', '273px');
    $('.kzsps').show();
    $('.eles li').attr('data-cur', '0')
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    var oneshape = $(this).html();
    var cj = ($('.eles').find('.tp')) ? ($('.eles .tp').length + 50) : 50;
    var elem = $('<li class="box_shape tp" data-cur="0" gpid="' + gpid + '" style="z-index:' + cj + ';top:0;left:0;width:80px;height80px;"></li>');
    var shape = $('<div class="shape">' + oneshape + '</div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(shape);
    elem.append(ctrl);
    $('.eles').append(elem);
    // 初始化动画页
    $('.dh-y').remove();
    // end
    var oneElem = new newShape(elem);
    // // 取出元素对应ID 存入总对象中
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    // 
    elemObj[gpeid].path = oneshape;
    var eleId = $(this).attr('data-id');
    elemObj[gpeid].eleId = eleId;
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].dataStorage();
    // end
    var tmx = '<li class="srz sr-xl2" id="' + gpeid + '-xh"><span class="z-hw"></span><span class="z-hz">请插入图片</span><span class="cllf"></span></li>';
    $('.tpy').prepend(tmx);
    zwdj();
    $('.tpy').sortable({
      axis: "y",
      stop: function() {
        var lijh = $('.tpy li');
        var tmpz = lijh.length - 1;
        for (var i = 0; i < lijh.length; i++) {
          var gpeid = lijh.eq(i).attr('id').replace('-xh', '');
          $('#' + lijh.eq(i).attr('id').replace('-xh', '')).css('z-index', tmpz + 50);
          elemObj[gpeid].zIndex = tmpz + 50;
          elemObj[gpeid].dataStorage();
          tmpz--;
        }
      }
    });
    $('.sr-xl2').parent().slideDown();
    $('.sr-xl2').parent().prev().find('.ar-j').removeClass('ar-r').addClass('ar-rx');
    return false;
  });

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
  });
  // 点击播放音乐
  $('.yy-lb').on('click', '.sg-zt', function(e) {
    e.stopPropagation();
    var index = $(this).parent().index();
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
      $('audio').attr('data-id', $(this).parent().attr('id'));
      $('audio')[0].play();
    } else if ($(this).hasClass('sg-zt1')) {
      $('.yy-lb li .bfzi').removeClass('bfxh');
      $('.yy-lb li .sg-zt').removeClass('sg-zt3').addClass('sg-zt2');
      $(this).removeClass('sg-zt1 sg-zt2 sg-zt3').addClass('sg-zt4');
      $(this).prev().find('.bfzi').addClass('bfxn');
      $('audio')[0].src = $(this).parent().attr('data-url');
      $('audio').attr('data-id', $(this).parent().attr('id'));
      $('audio')[0].play();
      // $('#yybbz').wrap('marquee');
      $('.muy').removeClass('mumr_z mumr_f').addClass('mumr_b');
    } else if ($(this).hasClass('sg-zt4')) {
      $(this).removeClass('sg-zt4').addClass('sg-zt1');
      $(this).prev().find('.bfzi').removeClass('bfxn');
      $('audio')[0].pause();
      $('.muy').removeClass('mumr_b mumr_f').addClass('mumr_z');
    }
  });
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
  });

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

  });
  // 1026 滚动加载更多音乐
  var music_page = 2;
  $('.yyhz').on('scroll', function(e) {
    var class_id = $('.stl-c').attr('data-id');
    if (e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight) {
      if ($('.yy-lb').children("h2").hasClass("no_more") || $('.stl-c').attr('data-id') == '402') {
        return;
      } else {
        getData({
          "name": "",
          "parId": class_id,
          "pageSize": "24",
          "pageNo": music_page++,
        }, "elementsService.do", 'getMusic', "music_list_one");
      }
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
    $('.yxj-yx').show();
    var index = $(this).css('backgroundImage');
    index = index.replace('url("', '');
    index = index.replace('")', '');
    var elem = $('<li class="box_pic tx" data-cur="0"  style="width:100%;height:100%;top:0;left:0;z-index:1000"></li>');
    var pic = $('<div class="pic" style="width:100%;height:100%"><img src="' + index + '" data-src="' + index + '"></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(pic);
    elem.append(ctrl);
    $('.eles').append(elem);
    var oneElem = new newPic(elem);
    var num = 'pic_' + oneElem.num;
    elemObj[num] = oneElem;
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 407;
    elemObj[num].dataStorage();
  });
  //特效的显示
  $('.yxj-yx').on('click', function(e) {
    e.stopPropagation();
    $('canvas').show();
    $('.eles .zx').hide();
    $('.cy-y').show()
  });
  //移除特效擦一擦
  $('.ysxc-1').on('click', function(e) {
    e.stopPropagation();
    $(this).parent().hide();
    $('canvas').remove();
  });
  // ***动画设置--------------------
  // 动画方式
  $(document).delegate('.don-ff>select', 'change', function(e) {
    e.stopPropagation;
    var ani_name = $(this).parents('.dh-y').find(".don-ff option:selected").val();
    var gpeid = $('.eles>li[data-cur="1"]').attr('id');
    var ani_id = $(this).parents('.' + gpeid).attr('id');
    var ani_dur = $(this).parents('.dh-y').find('.zs-t:eq(0)>.ji-m').text();
    var ani_delay = $(this).parents('.dh-y').find('.zs-t:eq(1)>.ji-m').text();
    var ani_count = $(this).parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
    $('.eles>li[data-cur="1"]>div:eq(0)').css('animation', ani_name + " " + ani_dur + ' ease ' + ani_delay + ' ' + ani_count + ' backwards');
    // ***1021
    setTimeout(function() {
      $('.eles>li>div:eq(0)')[0].style.animation = "";
    }, parseInt(ani_dur) * 1000 + 100);
    var ani_obj = {
      "element": gpeid,
      "animation": ani_name,
      "start": 0,
      "type": 0,
      "duration": ani_dur,
      "delay": ani_delay,
      "count": ani_count,
      "timing": "ease",
      "direction": "normal",
      "status": "running",
      "finish": "none",
    };
    elemObj[gpeid].animate[ani_id] = ani_obj;
    updataAniStorage();
  });
  // 动画方向 ?
  // 触发方式 ?
  // ***动画预览--------------------//
  $('.yl-dh').on('click', function(e) {
    e.stopPropagation;
    var gpeid = $('.eles>li[data-cur="1"]').attr('id');
    var animates = elemObj[gpeid].animate;
    var ani_dur = 0;
    var ani_elem = $('.eles>li[data-cur="1"]>div:eq(0)').clone();
    $.each(animates, function(key, value) {
      var box = $('<div style="width:100%;height:100%;"></div>');
      var one_dur = parseFloat(value.duration);
      var one_count = parseFloat(value.count);
      var one_delay = parseFloat(value.delay);
      var one_time = one_dur * one_count + one_delay;
      if (one_time > ani_dur) {
        ani_dur = one_time;
      }
      box.css('animation', value.animation + " " + value.duration + " ease " + value.delay + " " + value.count + " backwards");
      $('.eles>li[data-cur="1"]>div:eq(0)').wrap(box);
    });
    // 修复表单元素动画预览bug
    $('.input').parent().css('display', 'table');
    // 按照最大时间移除
    setTimeout(function() {
      $('.eles>li[data-cur="1"]>div:eq(0)').remove();
      $('.eles>li[data-cur="1"]').prepend(ani_elem);
    }, ani_dur * 1000 + 500);
  });
  // ***删除元素---------------------
  // delete 按键删除元素
  $(document).on("keydown", function(e) {
    e.stopPropagation();
    if (e.keyCode === 46) { // 如果键盘按的是delete键就删除当前激活项
      var gpeid = $('.eles>li[data-cur="1"]').attr('id');
      window.sessionStorage.removeItem(gpeid); // 清除对应的本地存储
      delete elemObj[gpeid]; // 删除元素总集合中对应的成员
      $('.eles>li[data-cur="1"]').remove(); // 删除元素
      $('.srz[id*="' + gpeid + '"]').remove(); // 删除左侧对应图层  ***1021
    }
  });
  // 添加动画
  $('.tj-dh').on('click', function() {
    var bg = $(this).closest('div').parent();
    if (bg.find('.dh-y').length > 8) {
      return;
    } else {
      // 随机生成动画id 找到激活项id 声明动画对象 存入元素对象动画属性中 更新缓存
      var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
      var gpeid = $('.eles>li[data-cur="1"]').attr('id');
      var ani_obj = {
        "element": gpeid,
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
      elemObj[gpeid].animate[ani_id] = ani_obj;
      updataAniStorage();
      // end     
      var dhs = (bg.find('.dh-y')) ? (bg.find('.dh-y').length + 1) : 1;
      var tjdh = '<div class="dh-y ' + gpeid + '" id="' + ani_id + '"><div class="dh-y1"><span class="zhx hx-j"></span><span class="dh-z">动画' + dhs + '</span><span class="xh-x"></span></div><div class="dh-cz"><div class="chu-f"><span class="chu-fz">触发</span><select class="chu-fj"><option>进入页面</option><option>单击</option></select></div><div class="don-ff"><span class="chu-fz">动画</span><select class="input input--dropdown js--animations"><optgroup label="无"><option value = "no"> 无 </option></optgroup><optgroup label = "强调"><option value = "bounce"> 弹跳 </option><option value = "flash"> 闪动 </option><option value = "pulse"> 脉冲 </option><option value = "rubberBand"> 橡皮筋 </option><option value = "shake"> 轻摇 </option><option value = "swing"> 摆动 </option><option value = "tada"> 嗒哒 </option><option value = "wobble"> 摇晃 </option><option value = "jello"> 果冻 </option></optgroup><optgroup label = "进入"><option value = "slideInDown"> 上移入 </option><option value = "slideInLeft"> 左移入 </option><option value = "slideInRight"> 右移入 </option><option value = "slideInUp"> 下移入 </option><option value = "fadeIn"> 淡入 </option><option value = "fadeInDown"> 上淡入 </option><option value = "fadeInDownBig"> 上淡入大 </option><option value = "fadeInLeft"> 左淡入 </option><option value = "fadeInLeftBig"> 左淡入大 </option><option value = "fadeInRight"> 右淡入 </option><option value = "fadeInRightBig"> 右淡入大 </option><option value = "fadeInUp"> 下淡入 </option><option value = "fadeInUpBig"> 下淡入大 </option><option value = "bounceIn"> 弹入 </option><option value = "bounceInDown"> 向下弹入 </option><option value = "bounceInUp"> 向上弹入 </option><option value = "bounceInLeft"> 从左弹入 </option><option value = "bounceInRight"> 从右弹入 </option><option value = "hinge"> 悬掉 </option><option value = "flip"> 翻转 </option><option value = "flipInX"> X翻转 </option><option value = "flipInY"> Y翻转 </option><option value = "lightSpeedIn"> 光速 </option><option value = "rotateIn"> 旋转 </option><option value = "rotateInDownLeft"> 左下旋转 </option><option value = "rotateInDownRight"> 右下旋转 </option><option value = "rotateInUpLeft"> 左上旋转 </option><option value = "rotateInUpRight"> 右上旋转 </option><option value = "slideninLeft"> 滑动 </option><option value = "zoomIn"> 放大 </option><option value = "zoomInDown"> 下放大 </option><option value = "zoomInLeft"> 左放大 </option><option value = "zoomInRight"> 右放大 </option><option value = "zoomInUp"> 上放大 </option><option value = "rollIn"> 滚入 </option></optgroup><optgroup label = "退出"><option value = "slideOutDown"> 上移出 </option><option value = "slideOutLeft"> 左移出 </option><option value = "slideOutRight"> 右移出 </option><option value = "slideOutUp"> 下移出 </option><option value = "fadeOut"> 淡出 </option><option value = "fadeOutDown"> 下淡出 </option><option value = "fadeOutDownBig"> 下淡出大 </option><option value = "fadeOutLeft"> 左淡出 </option><option value = "fadeOutLeftBig"> 左淡出大 </option><option value = "fadeOutRight"> 右淡出 </option><option value = "fadeOutRightBig"> 右淡出大 </option><option value = "fadeOutUp"> 上淡出 </option><option value = "fadeOutUpBig"> 上淡出大 </option><option value = "bounceOut"> 弹出 </option><option value = "bounceOutDown"> 下弹出 </option><option value = "bounceOutLeft"> 左弹出 </option><option value = "bounceOutRight"> 右弹出 </option><option value = "bounceOutUp"> 上弹出 </option><option value = "flipOutX"> X翻转 </option><option value = "flipOutY"> Y翻转 </option><option value = "lightSpeedOut"> 光速 </option><option value = "rotateOut"> 旋转 </option><option value = "rotateOutDownLeft"> 左下旋转 </option><option value = "rotateOutDownRight"> 右下旋转 </option><option value = "rotateOutUpLeft"> 左上旋转 </option><option value = "rotateOutUpRight"> 右上旋转 </option><option value = "slideInRight"> 滑动 </option><option value = "zoomOut"> 缩小 </option><option value = "zoomOutDown"> 下缩小 </option><option value = "zoomOutLeft"> 左缩小 </option><option value = "zoomOutRight"> 右缩小 </option><option value = "zoomOutUp"> 上缩小 </option><option value = "rollOut"> 滚出 </option></optgroup></select><select class="zc-j"><option>中心</option><option>↑</option><option>→</option><option>↓</option><option>←</option></select></div><div class="zs-t"><span class="chu-fz">时间</span><span class="cjt-j aiti" style="border:none"></span><span class="ji-m">2s</span></div><div class="zs-t"><span class="chu-fz">延迟</span><span class="cjt-j delay"  style="border:none"></span><span class="ji-m">0s</span></div><div class="zs-t"><span class="chu-fz">次数</span><span class="cjt-j time" style="border:none"></span><span class="ji-m">1</span></div><div class="sx-dhc7"><span class="yin-y">循环</span><span class="xun-h"><span class="kgq-2"></span></span></div></div></div>';
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
        //动画的循环  1026
      $('.sx-sxc').on('click', '.xun-h', function(e) {
        e.stopPropagation;
        if ($(this).hasClass('lv')) {
          $(this).removeClass('lv')
          $(this).find('.kgq-2').css('left', '1px');
          // 循环为否时 次数设置为指定次数
          var gpeid = $('.eles>li[data-cur="1"]').attr('id');
          var ani_id = $(this).parents('.' + gpeid).attr('id');
          var ani_count = $(this).parents('.dh-y').find('.zs-t:eq(2)>.ji-m').text();
          elemObj[gpeid].animate[ani_id].count = ani_count;
          updataAniStorage();
        } else {
          $(this).addClass('lv')
          $(this).find('.kgq-2').css('left', '12px');
          // 循环为是时 次数设置为infinite
          var gpeid = $('.eles>li[data-cur="1"]').attr('id');
          var ani_id = $(this).parents('.' + gpeid).attr('id');
          elemObj[gpeid].animate[ani_id].count = "infinite";
          updataAniStorage();
        }
      });
    }
  });

  //删除动画
  $('.sx-sxc').on('click', '.xh-x', function() {
    // 删除动画时 删除对应元素对象中的对应动画  更新缓存
    var gpeid = $('.eles>li[data-cur="1"]').attr('id');
    var ani_id = $(this).parents('.dh-y').attr('id');
    delete elemObj[gpeid].animate[ani_id];
    elemObj[gpeid].dataStorage();
    $(this).parent().parent().remove();
  });
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
  });
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
  });
  //点击中间区域所有操作区的元素去除编辑框
  $('.cont-c').on('click', function(e) {
    // e.preventDefault();
    e.stopPropagation();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    $('.cont-y .zx').hide();
    $('.be-jin').show();
    $('canvas').hide();
    // 初始化动画页
    $('.dh-y').remove();
    // end
    $(".eles .box_txt").css('border', '0').children('.txt').attr('data-edit', '0').children().attr('contenteditable', 'false').blur();
    zwdj();
  });
  //点击左侧---左中右三边的联动
  $('.ya-shi').on('click', '.srz', function(e) {
    e.stopPropagation();
    zwdj();
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
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
    //
    var self = $(this);
    ancs(self);
  });
  //删除选中的元素 1029
  $('.wzy').on('click', '.cllf', function(e) {
    e.stopPropagation()
    var gpeid = $(this).parent().attr('id');
    gpeid = gpeid.replace('-sh', '');
    $(this).parent().remove();
    $('#' + gpeid + '').remove();
    window.sessionStorage.removeItem(gpeid); // 清除对应的本地存储
    delete elemObj[gpeid]; // 删除元素总集合中对应的成员
    if ($('.wzy li').length == 0) {
      $('.wzy').hide();
      $('.sr-w').find('.ar-j').removeClass('ar-rx').addClass('ar-r');
    }
  });
  $('.tpy').on('click', '.cllf', function(e) {
    e.stopPropagation()
    var gpeid = $(this).parent().attr('id');
    gpeid = gpeid.replace('-xh', '');
    $(this).parent().remove();
    $('#' + gpeid + '').remove();
    window.sessionStorage.removeItem(gpeid); // 清除对应的本地存储
    delete elemObj[gpeid]; // 删除元素总集合中对应的成员
    if ($('.tpy li').length == 0) {
      $('.tpy').hide();
      $('.sr-m').find('.ar-j').removeClass('ar-rx').addClass('ar-r');
    }
  });
  // end
  //点击中间---左中右三边的联动
  $('.cont-c').on('click', '.eles li', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
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
      $('.kzsps').hide();
      $('#' + $(this).attr('id') + '-xh').css('background-color', '#2eb3e8');
      $('#' + $(this).attr('id') + '-xh').find('.z-hz').css('color', '#fff');
      $('#' + $(this).attr('id') + '-xh').find('.z-hw').css('background', 'url(./images/zz/1-3-bjcj_03.png) 0px -200px no-repeat');
      var myz = $(this);
      cztfz(myz);
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
    } else if ($(this).hasClass('at')) {
      $('.cont-y .zx').hide();
      $('.tjx-h').show();
      rhdxl()
    } else if ($(this).hasClass('tx')) {
      $('.cont-y .zx').hide();
      $('.cy-y').show();
    } else if ($(this).hasClass('area')) {
      $('.cont-y .zx').hide();
      $('.sr_zz').show();
      srkrd();
    }
    var self = $(this);
    ancs(self);
  });

  /* 裁剪功能 */
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
      var src = $('.eles>li[data-cur="1"]>div:eq(0)>img').attr("data-src");
      // 取出图片名称 待用
      sendSrc = src.split("/").pop();
      $("#cut_target").attr("src", src);
      // 检查图片的大小 实现居中布局
      imgW = $("#cut_target").width();
      imgH = $("#cut_target").height();
      boxW = $(".ti-z").width();
      boxH = $(".ti-z").height();
      if (imgW > boxW && imgH < boxH) { //1026
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
      } else if (imgH > boxH && imgW < boxW) {
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
      } else if (imgH > boxH && imgW > boxW && imgH > imgW) {
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
      } else if (imgH > boxH && imgW > boxW && imgH <= imgW) {
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
      if (imgW > boxW && imgH < boxH) {
        $(".jcrop-holder").css({
          'width': boxW,
          'height': boxW * imgH / imgW,
          'position': 'absolute',
          'top': '50%',
          'margin-top': -(boxW * imgH / imgW / 2),
          'background-color': '#ccc',
        });
      } else if (imgH > boxH && imgW < boxW) {
        $(".jcrop-holder").css({
          'width': boxH * imgW / imgH,
          'height': boxH,
          'margin': 'auto',
        });
      } else if (imgH < boxH && imgW < boxW) {
        $(".jcrop-holder").css({
          'position': 'absolute',
          'top': '50%',
          'left': '50%',
          'margin-top': -(imgH / 2),
          'margin-left': -(imgW / 2),
        });
      } else if (imgH > boxH && imgW > boxW && imgH > imgW) {
        $(".jcrop-holder").css({
          'position': 'absolute',
          'top': '50%',
          'margin-top': -((boxW * imgH / imgW) / 2),
        });
      } else if (imgH > boxH && imgW > boxW && imgH <= imgW) {
        $(".jcrop-holder").css({
          'position': 'absolute',
          'left': '50%',
          'margin-left': -((boxH * imgW / imgH) / 2),
        });
      }
    })
    // 点击确定 发送请求 裁切
  $('.dj-jd').on('click', function() {
    if (imgW > boxW && imgH < boxH) {
      send_x = send_x * imgW / boxW;
      send_y = send_y * imgW / boxW;
      send_w = send_w * imgW / boxW;
      send_h = send_h * imgW / boxW;
    } else if (imgH > boxH && imgW < boxW) {
      send_x = send_x * imgH / boxH;
      send_y = send_y * imgH / boxH;
      send_w = send_w * imgH / boxH;
      send_h = send_h * imgH / boxH;
    } else if (imgH > boxH && imgW > boxW && imgH > imgW) {
      send_x = send_x * imgW / boxW;
      send_y = send_y * imgH / ((imgH / imgW) * boxW);
      send_w = send_w * imgW / boxW;
      send_h = send_h * imgH / ((imgH / imgW) * boxW);
    } else if (imgH > boxH && imgW > boxW && imgH <= imgW) {
      send_x = send_x * imgW / ((imgW / imgH) * boxH);
      send_y = send_y * imgH / boxH;
      send_w = send_w * imgW / ((imgW / imgH) * boxH);
      send_h = send_h * imgH / boxH;
    }
    var uid = JSON.parse(document.cookie.replace('user_msg=', '')).id;
    getData({
      'uId': uid,
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
  });
  /* end */
  //互动的恢复默认
  $('.h_mr').on('click', function() {
    $('.zhe-z4').fadeIn();
  });
  //确定后退出
  $('.tip-qd4').on('click', function() {
    $('.zhe-z4').fadeOut(400);
  });
  //取消后退出
  $('.tip-qx4').on('click', function() {
    $('.zhe-z4').fadeOut(400);
  });


  //点击上传背景
  $('#file').change(function() {
    $('.sc-bt span').text('更换背景');
    $('.hf-mr').text('删除');
    $('.sz-j').hide();
    $('.cjz').css('background-color', '#0A7197')
    $('.cjczd').text('确定裁剪');
    $('.pbys').show();
    $('.cjzzc').hide();
  });
  //背景颜色恢复默认
  $('.hf-mr').on('click', function() {
    if ($(this).text() === '删除') {
      $('.zhe-z1').show();
    } else if ($(this).text() === '恢复默认') {
      $('.box_bg').css('background-color', '#fff');
      $('.jdt-z').css('background-color', '#fff');
      $('#ysbt').slider({
        value: 0
      });
      $('.jbmt').text('0%');
      updataBgStorage('backgroundColor', '#fff');
      updataBgStorage('opacity', 1);
    }
  });
  //确定删除背景图片
  $('.tip-qd').on('click', function() {
    $('.cjz').css('background-color', '#999')
    $('.cjczd').text('裁剪');
    $('.box_bg').css('background-image', '');
    $('.photo-clip-rotateLayer').removeAttr("style");
    $('.photo-clip-rotateLayer').find('img').remove();
    $('.zhe-z1').hide();
    $('.sz-j').show();
    $('.sc-bt span').text('上传背景');
    $('.hf-mr').text('恢复默认');
    $('.pbys').hide();
    $('#ysbt').slider({
      value: 0
    });
    $('.jbmt').text('0%');
    $('.cjzzc').show();
    updataBgStorage('backgroundImage', '');
  });
  //取消删除背景图片
  $('.tip-qx').on('click', function() {
    $('.zhe-z1').fadeOut();
  });
  //裁剪区无照片时不能裁剪
  $('#clipBtn').on('click', function() {
    if ($(this).text() === "裁剪") {
      $('.box_bg').css('background-image', '');
    }
  });
  //取消提示框消失
  $('.tip-qx').on('click', function() {
    $('.zhe-z1').hide();
  });
  //设置背景颜色
  $('.jdt-z').on('click', function() {
    $('.tsq').fadeToggle(200);
  });
  //文本字体的样式
  $('.sx-dhc2').on('click', 'span', function(e) {
    e.stopPropagation();
    var font = $('.eles li[data-cur="1"]').find('.txt');
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    //文本字体的加粗
    if ($(this).hasClass('bt-b')) {
      if (font.css('font-weight') == 400) {
        font.css('font-weight', 'bold');
        elemObj[gpeid].fontWeight = 'bold';
        elemObj[gpeid].dataStorage();
      } else {
        font.css('font-weight', 400);
        elemObj[gpeid].fontWeight = 400;
        elemObj[gpeid].dataStorage();
      }
      //文本字体的倾斜
    } else if ($(this).hasClass('bt-i')) {
      if (font.css('font-style') == 'normal') {
        font.css('font-style', 'italic');
        elemObj[gpeid].fontStyle = "italic";
        elemObj[gpeid].dataStorage();
      } else {
        font.css('font-style', 'normal');
        elemObj[gpeid].fontStyle = "normal";
        elemObj[gpeid].dataStorage();
      }
      //文本字体的下划线
    } else if ($(this).hasClass('bt-u')) {
      if (font.css('text-decoration') == 'none') {
        font.css('text-decoration', 'underline');
        elemObj[gpeid].textDecoration = "underline";
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'line-through') {
        font.css('text-decoration', 'underline line-through');
        elemObj[gpeid].textDecoration = "underline line-height";
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'underline line-through') {
        font.css('text-decoration', 'line-through');
        elemObj[gpeid].textDecoration = 'line-through';
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'underline') {
        font.css('text-decoration', 'none');
        elemObj[gpeid].textDecoration = "underline";
        elemObj[gpeid].dataStorage();
      }
      //文本字体的中划线
    } else if ($(this).hasClass('bt-s')) {
      if (font.css('text-decoration') == 'none') {
        font.css('text-decoration', 'line-through');
        elemObj[gpeid].textDecoration = "line-through";
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'line-through') {
        font.css('text-decoration', 'none');
        elemObj[gpeid].textDecoration = "none";
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'underline') {
        font.css('text-decoration', 'underline line-through');
        elemObj[gpeid].textDecoration = "underline line-through";
        elemObj[gpeid].dataStorage();
      } else if (font.css('text-decoration') == 'underline line-through') {
        font.css('text-decoration', 'underline');
        elemObj[gpeid].textDecoration = "underline";
        elemObj[gpeid].dataStorage();
      }
      //文本文字的左对齐
    } else if ($(this).hasClass('bt-z')) {
      font.css('text-align', 'left');
      elemObj[gpeid].textAlign = "left";
      elemObj[gpeid].dataStorage();
      //文本文字的居中
    } else if ($(this).hasClass('bt-c')) {
      font.css('text-align', 'center');
      elemObj[gpeid].textAlign = "center";
      elemObj[gpeid].dataStorage();
      //文本文字的右对齐
    } else if ($(this).hasClass('bt-y')) {
      font.css('text-align', 'right');
      elemObj[gpeid].textAlign = "right";
      elemObj[gpeid].dataStorage();
    }
  });
  //设置文本的颜色
  $('.wbys').minicolors({
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        $('.eles li[data-cur="1"]').find('.txt').css('color', log);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].color = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //文本字体类型的设置
  $('.wryh').change(function(e) {
    var cur = $('.eles li[data-cur="1"]')
    var gpeid = cur.attr('id');
    var val = $(this).find('option:selected').val();
    e.stopPropagation();
    cur.find('.txt>div').css('font-family', val);
    elemObj[gpeid].fontFamily = "叶根友毛笔行书";
    elemObj[gpeid].dataStorage();
  });
  //文本字体大小的设置
  $('.ess').change(function(e) {
    e.stopPropagation();
    var cur = $('.eles li[data-cur="1"]');
    var val = $(this).find('option:selected').val();
    var gpeid = cur.attr('id');
    cur.find('.txt>div').css('font-size', val);
    cur.find('.txt').css('line-height', val);
    val = parseInt(val);
    $('.hk4').slider({
      value: val / 72 * 100
    });
    $('.hk4').next().text(val + "px");
    elemObj[gpeid].lineHeight = val;
    elemObj[gpeid].fontSize = val;
    elemObj[gpeid].dataStorage();
  });
  //设置文本图片的阴影
  //阴影的添加
  $('.sx-dhc .huii,.gm-mx .huii,.qhm-y .huii,.sr_zz .huii').on('click', function(e) {
    e.stopPropagation();
    var cur = $('.eles li[data-cur="1"]');
    var gpeid = cur.attr('id');
    var font = cur.find('.txt');
    var fonp = cur.find('img');
    var fonv = cur.find('.shape svg');
    var fonb = cur.find('button');
    var fons = cur.find('select');
    var fond = cur.find('.hd');
    var fonr = cur.find('.bdsr');
    if ($(this).hasClass('lv')) {
      $(this).removeClass('lv')
      $(this).find('.kgq-2').css('left', '1px');
      $(this).nextAll().hide();
      $(this).parent().next().slideUp(400);
      if (cur.hasClass('wb')) {
        font.css('text-shadow', '#fff 0px 0px 0px');
        elemObj[gpeid].txtShadowC = "#fff";
        elemObj[gpeid].txtShadowX = 0;
        elemObj[gpeid].txtShadowY = 0;
        elemObj[gpeid].txtShadowS = 0;
        elemObj[gpeid].dataStorage();
      } else if (cur.hasClass('tp') || cur.hasClass('bt') || cur.hasClass('xla') || cur.hasClass('at') || cur.hasClass('area')) {
        fonp.css('box-shadow', '#fff 0px 0px 0px');
        fonb.css('box-shadow', '#fff 0px 0px 0px');
        fons.css('box-shadow', '#fff 0px 0px 0px');
        fonv.css('box-shadow', '#fff 0px 0px 0px');
        fond.css('box-shadow', '#fff 0px 0px 0px');
        fonr.css('box-shadow', '#fff 0px 0px 0px');
        elemObj[gpeid].boxShadowC = "#fff";
        elemObj[gpeid].boxShadowX = 0;
        elemObj[gpeid].boxShadowY = 0;
        elemObj[gpeid].boxShadowS = 0;
        elemObj[gpeid].dataStorage();
      }
    } else {
      $(this).addClass('lv')
      $(this).find('.kgq-2').css('left', '12px');
      $(this).nextAll().show();;
      $(this).next().next().css('background-color', '#515151');
      $(this).parent().next().slideDown(400);
      if (cur.hasClass('wb')) {
        font.css('text-shadow', '#515151 0px 4px 8px');
        elemObj[gpeid].txtShadowC = "#515151";
        elemObj[gpeid].txtShadowX = 0;
        elemObj[gpeid].txtShadowY = 4;
        elemObj[gpeid].txtShadowS = 8;
        elemObj[gpeid].dataStorage();
      } else if (cur.hasClass('tp') || cur.hasClass('bt') || cur.hasClass('xla') || cur.hasClass('at') || cur.hasClass('area')) {
        fonp.css('box-shadow', '#515151 0px 4px 8px');
        fonb.css('box-shadow', '#515151 0px 4px 8px');
        fons.css('box-shadow', '#515151 0px 4px 8px');
        fonv.css('box-shadow', '#515151 0px 4px 8px');
        fond.css('box-shadow', '#515151 0px 4px 8px');
        fonr.css('box-shadow', '#515151 0px 4px 8px');
        elemObj[gpeid].boxShadowC = "#515151";
        elemObj[gpeid].boxShadowX = 0;
        elemObj[gpeid].boxShadowY = 4;
        elemObj[gpeid].boxShadowS = 8;
        elemObj[gpeid].dataStorage();
      }
    }
  });
  //设置文本阴影的颜色
  $('.wzyys').minicolors({
    position: 'right',
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        var xz = $('.wxz-z').text();
        var yz = $('.wyz-z').text();
        var sz = $('.wsz-z').text();
        $('.yyys').css('background-color', log);
        $('.sx-dh .sztt').css('background-color', log);
        $('.sx-dh .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].txtShadowC = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置文本阴影的大小
  $('.wk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.wxz-z').text();
      var yz = $('.wyz-z').text();
      var cz = $('.sx-dh .tzsz').val();
      $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].txtShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置文本阴影的X轴偏移
  $('.wk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.wyz-z').text();
      var sz = $('.wsz-z').text();
      var cz = $('.sx-dh .tzsz').val();
      $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].txtShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置文本阴影的Y轴偏移
  $('.wk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.wxz-z').text();
      var sz = $('.wsz-z').text();
      var cz = $('.sx-dh .tzsz').val();
      $('.eles li[data-cur="1"]').find('.txt').css('text-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].txtShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置图片阴影的颜色
  $('.tzyys').minicolors({
    position: 'right',
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        var xz = $('.sxz-z').text();
        var yz = $('.syz-z').text();
        var sz = $('.ssz-z').text();
        $('.syys').css('background-color', log);
        $('.pic-sd .sztt').css('background-color', log);
        $('.pic-sd .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
        $('.eles li[data-cur="1"]').find('svg').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].boxShadowC = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置图片阴影的大小
  $('.hk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.sxz-z').text();
      var yz = $('.syz-z').text();
      var cz = $('.pic-sd .tzsz').val();
      $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $('.eles li[data-cur="1"]').find('svg').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置图片阴影X轴的偏移
  $('.hk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.syz-z').text();
      var sz = $('.ssz-z').text();
      var cz = $('.pic-sd .tzsz').val();
      $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $('.eles li[data-cur="1"]').find('svg').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置图片阴影Y轴的偏移
  $('.hk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.sxz-z').text();
      var sz = $('.ssz-z').text();
      var cz = $('.pic-sd .tzsz').val();
      $('.eles li[data-cur="1"]').find('img').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $('.eles li[data-cur="1"]').find('svg').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //选中框的对齐
  $('.wz-tb').on('click', 'span', function(e) {
    var BW = $('.eles').width();
    var BH = $('.eles').height();
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var leftz = elemObj[gpeid].positionLeft;
    var topz = elemObj[gpeid].positionTop;
    var w = elemObj[gpeid].width;
    var h = elemObj[gpeid].height;
    var szl = Number((BW - w).toFixed(0));
    var czt = Number((BH - h).toFixed(0));
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
      elemObj[gpeid].positionLeft = 0;
      elemObj[gpeid].positionTop = topz;
      elemObj[gpeid].dataStorage();
      //文本框的水平居中
    } else if ($(this).hasClass('wz-t2')) {
      var sjz = Number((szl / 2).toFixed(0));
      $('.eles li[data-cur="1"]').css({
        'left': sjz,
        'top': topz
      });
      $('.hzb').text('' + sjz + 'px');
      $('.zzb').text('' + topz + 'px');
      $('.dw-p').text('' + sjz + 'px');
      $('.dw-x').text('' + topz + 'px');
      elemObj[gpeid].positionLeft = sjz;
      elemObj[gpeid].positionTop = topz;
      elemObj[gpeid].dataStorage();
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
      elemObj[gpeid].positionLeft = szl;
      elemObj[gpeid].positionTop = topz;
      elemObj[gpeid].dataStorage();
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
      elemObj[gpeid].positionLeft = leftz;
      elemObj[gpeid].positionTop = 0;
      elemObj[gpeid].dataStorage();
      //文本框的垂直居中
    } else if ($(this).hasClass('wz-t5')) {
      var cjz = Number((BH - h) / 2);
      $('.eles li[data-cur="1"]').css({
        'left': leftz,
        'top': cjz
      })
      $('.hzb').text('' + leftz + 'px');
      $('.zzb').text('' + cjz + 'px');
      $('.dw-p').text('' + leftz + 'px');
      $('.dw-x').text('' + cjz + 'px');
      elemObj[gpeid].positionLeft = leftz;
      elemObj[gpeid].positionTop = cjz;
      elemObj[gpeid].dataStorage();
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
      elemObj[gpeid].positionLeft = leftz;
      elemObj[gpeid].positionTop = topz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置选中元素的的背景色(表单)
  $('.szbjs').minicolors({
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        $('.eles li[data-cur="1"]').find('.anbc').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.xlbc').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.dxbc').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.dubc').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.fxbc').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.arcg').css('background-color', log);
        $('.bwj-z1').css('background-color', log);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].backgroundColor = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
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
        $('.eles li[data-cur="1"]').find('textarea').css('color', log);
        $('.bwj-z2').css('background-color', log);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].color = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置选中元素的透明度
  $('.hk1').slider({
    slide: function(event, ui) {
      var bjz = (100 - ui.value) / 100;
      $('.eles li[data-cur="1"]>div').eq(0).css('opacity', bjz);
      $(this).next().text(ui.value + "%");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].opacity = bjz;
      elemObj[gpeid].dataStorage();

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
      var cbjz = Number(Math.round(ui.value * syz));
      cbjz = cbjz / syz / 2;
      $('.eles li[data-cur="1"]').find('img').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('svg').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.anbc').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.xlbc').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.dxbc').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.dubc').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.fxbc').css('border-radius', bjz);
      $('.eles li[data-cur="1"]').find('.arcg').css('border-radius', bjz);
      var yjxsz = (ui.value * 0.5).toFixed(0) + '%';
      $(this).next().text(yjxsz);
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].borderRadius = Math.round(cbjz);
      elemObj[gpeid].dataStorage();
    }
  });
  //设置选中元素的旋转角度
  $('.hk3').slider({
    slide: function(event, ui) {
      var bjz = (ui.value * 3.6).toFixed(0);
      $('.eles li[data-cur="1"]').css('transform', 'rotate(' + bjz + 'deg)');
      $(this).next().text(bjz + '°');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].totalAngle = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置选中字体的行高
  $('.hk4').slider({
    value: 39,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.72).toFixed(0) + "px";
      var bjzz = (ui.value * 0.72).toFixed(0);
      $('.eles li[data-cur="1"]').find('.txt').css('line-height', bjz);
      $(this).next().text(bjz);
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].lineHeight = bjzz;
      elemObj[gpeid].dataStorage();
    }
  });
  //单选/多选 文字显示存储
  $('.ddxsk').on('focus', function() {
    if (!$(this).attr('id')) {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      $(this).attr('id', inputTxt_id);
      $('.eles li[data-cur="1"]').find('.ddxnr').attr('id', inputTxt_id);
    }
    $('.ddxsk').on('keyup', function() {
      $('.eles li[data-cur="1"]').find('.ddxnr').text($(this).val());
    });
  });
  $('.ddxsk').on('blur', function() {
    var inputTxt_id = $(this).attr('id');
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var inputTxt = $(this).val();
    elemObj[gpeid].inputTxt[inputTxt_id] = inputTxt;
    elemObj[gpeid].dataStorage();
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
    });
  });
  $('.antj').on('blur', function() {
    var inputTxt_id = $(this).attr('id');
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var inputTxt = $(this).val();
    elemObj[gpeid].inputTxt[inputTxt_id] = inputTxt;
    elemObj[gpeid].dataStorage();
  });
  //下拉列表 文字显示存储
  $('.xx-hz').on('keyup', '.qs-r', function() {
    var inputTxt_id = $(this).attr('id');
    var index = $(this).parent().index();
    var gpeid = $('.eles li[data-cur="1"]').attr('id');
    var inputtxt = $(this).val();
    $('.xlkko option:eq(' + index + ')').text($(this).val());
    $('.eles li[data-cur="1"]' + ' #' + inputTxt_id).text($(this).val());
    if (inputtxt.length == 0) {
      delete elemObj[gpeid].inputTxt[inputTxt_id];
      elemObj[gpeid].dataStorage();
      return;
    }
    elemObj[gpeid].inputTxt[inputTxt_id] = inputtxt;
    elemObj[gpeid].dataStorage();
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
        var yz = $('.byz-z').text();
        var sz = $('.bsz-z').text();
        $('.byys').css('background-color', log);
        $('.aa-nn .sztt').css('background-color', log);
        $('.aa-nn .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].boxShadowC = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置按钮阴影的大小
  $('.bk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.bxz-z').text();
      var yz = $('.byz-z').text();
      var cz = $('.aa-nn .tzsz').val();
      $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置按钮阴影X轴的偏移
  $('.bk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.byz-z').text();
      var sz = $('.bsz-z').text();
      var cz = $('.aa-nn .tzsz').val();
      $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz + '');
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置按钮阴影Y轴的偏移
  $('.bk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.bxz-z').text();
      var sz = $('.bsz-z').text();
      var cz = $('.aa-nn .tzsz').val();
      $('.eles li[data-cur="1"]').find('button').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置下拉框的颜色
  $('.xzyys').minicolors({
    position: 'right',
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        var xz = $('.xxz-z').text();
        var yz = $('.xyz-z').text();
        var sz = $('.xsz-z').text();
        $('.xyys').css('background-color', log);
        $('.gt-mm .sztt').css('background-color', log);
        $('.gt-mm .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz + '');
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].boxShadowC = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置下拉框阴影的大小
  $('.xk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.xxz-z').text();
      var yz = $('.xyz-z').text();
      var cz = $('.gt-mm .tzsz').val();
      $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置下拉框阴影X轴的偏移
  $('.xk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.xyz-z').text();
      var sz = $('.xsz-z').text();
      var cz = $('.gt-mm .tzsz').val();
      $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置下拉框阴影Y轴的偏移
  $('.xk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.xxz-z').text();
      var sz = $('.xsz-z').text();
      var cz = $('.gt-mm .tzsz').val();
      $('.eles li[data-cur="1"]').find('select').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置互动阴影的颜色
  $('.dzyys').minicolors({
    position: 'right',
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        var xz = $('.dxz-z').text();
        var yz = $('.dyz-z').text();
        var sz = $('.dsz-z').text();
        $('.dyys').css('background-color', log);
        $('.tjx-h .sztt').css('background-color', log);
        $('.tjx-h .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('.hd').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].boxShadowC = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //设置互动阴影的大小
  $('.dk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.dxz-z').text();
      var yz = $('.dyz-z').text();
      var cz = $('.tjx-h .tzsz').val();
      $('.eles li[data-cur="1"]').find('.hd').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置互动阴影X轴的偏移
  $('.dk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.dyz-z').text();
      var sz = $('.dsz-z').text();
      var cz = $('.tjx-h .tzsz').val();
      $('.eles li[data-cur="1"]').find('.hd').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置互动阴影Y轴的偏移
  $('.dk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.dxz-z').text();
      xz = xz.replace("px", "");
      var sz = $('.dsz-z').text();
      sz = sz.replace("px", "");
      var cz = $('.tjx-h .tzsz').val();
      $('.eles li[data-cur="1"]').find('.hd').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置输入框阴影的颜色
  $('.rzyys').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.rxz-z').text();
          var yz = $('.ryz-z').text();
          var sz = $('.rsz-z').text();
          $('.ryys').css('background-color', log);
          $('.sr_zz .sx-dhc7:eq(0) .sztt').css('background-color', log);
          $('.sr_zz .sx-dhc7:eq(0) .tzsz').val(log);
          $('.eles li[data-cur="1"]').find('.bdsr').css('box-shadow', '' + log + ' ' + xz + ' ' + yz + ' ' + sz);
          var gpeid = $('.eles li[data-cur="1"]').attr('id');
          elemObj[gpeid].boxShadowC = log;
          elemObj[gpeid].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置输入框阴影的大小
  $('.rk5').slider({
    value: 20,
    slide: function(event, ui) {
      var bjz = (ui.value * 0.4).toFixed(0);
      var xz = $('.rxz-z').text();
      var yz = $('.ryz-z').text();
      var cz = $('.sr_zz .sx-dhc7:eq(0) .tzsz').val();
      $('.eles li[data-cur="1"]').find('.bdsr').css('box-shadow', '' + cz + ' ' + xz + ' ' + yz + ' ' + bjz + 'px');
      $(this).next().text(bjz + 'px');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowS = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置输入框阴影X轴的偏移
  $('.rk6').slider({
    value: 50,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var yz = $('.ryz-z').text();
      var sz = $('.rsz-z').text();
      var cz = $('.sr_zz .sx-dhc7:eq(0) .tzsz').val();
      $('.eles li[data-cur="1"]').find('.bdsr').css('box-shadow', '' + cz + ' ' + bjz + 'px ' + yz + ' ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowX = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置输入框阴影Y轴的偏移
  $('.rk7').slider({
    value: 60,
    slide: function(event, ui) {
      var bjz = ((ui.value - 50) * 0.4).toFixed(0);
      var xz = $('.rxz-z').text();
      var sz = $('.rsz-z').text();
      var cz = $('.sr_zz .sx-dhc7:eq(0) .tzsz').val();
      $('.eles li[data-cur="1"]').find('.bdsr').css('box-shadow', '' + cz + ' ' + xz + ' ' + bjz + 'px ' + sz);
      $(this).next().text(bjz + "px");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].boxShadowY = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //设置输入框的边框
  $('.baku').on('click', function(e) {
      e.stopPropagation();
      var cur = $('.eles li[data-cur="1"]');
      var gpeid = cur.attr('id');
      var el = cur.find('.arcg');
      if ($(this).hasClass('lv')) {
        $(this).removeClass('lv');
        $(this).find('.kgq-2').css('left', '1px');
        $(this).nextAll().hide();
        $(this).parent().next().slideUp(400);
        el.css('border', '1px solid #fff');
        elemObj[gpeid].borderSize = 1;
        elemObj[gpeid].borderColor = "#fff";
        elemObj[gpeid].dataStorage();
      } else {
        $(this).addClass('lv');
        $(this).find('.kgq-2').css('left', '12px');
        $(this).nextAll().show();
        $(this).next().next().css('background-color', '#515151');
        $(this).parent().next().slideDown(400);
        el.css('border', '1px solid #515151');
        elemObj[gpeid].borderSize = 1;
        elemObj[gpeid].borderColor = "#515151";
        elemObj[gpeid].dataStorage();
      }
    })
    //设置输入框边框的大小
  $('.srk5').slider({
      value: 5,
      step: 5,
      slide: function(event, ui) {
        var bjz = Number(ui.value / 5);
        var cz = $('.sr_zz .sx-dhc7:eq(1) .tzsz').val();
        $('.eles li[data-cur="1"]').find('.arcg').css('border', bjz + 'px solid ' + cz);
        $(this).next().text(bjz + "px");
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].borderSize = bjz;
        elemObj[gpeid].dataStorage();
      }
    })
    //设置输入框边框的颜色
  $('.srbjs').minicolors({
      position: 'right',
      change: function(hex, opacity) {
        var log;
        try {
          log = hex ? hex : 'transparent';
          if (opacity) log += ', ' + opacity;
          var xz = $('.srsz-z').text();
          $('.ra-h').css('background-color', log);
          $('.sr_zz .sx-dhc7:eq(1) .sztt').css('background-color', log);
          $('.sr_zz .sx-dhc7:eq(1) .tzsz').val(log);
          $('.eles li[data-cur="1"]').find('.arcg').css('border', xz + ' solid  ' + log);
          var gpeid = $('.eles li[data-cur="1"]').attr('id');
          elemObj[gpeid].borderColor = log;
          elemObj[gpeid].dataStorage();
        } catch (e) {}
      },
      theme: 'default'
    })
    //设置输入框的内容
  $('.wbsr').on('focus', function() {
    if (!$(this).attr('id')) {
      var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
      $(this).attr('id', inputTxt_id);
      $('.eles li[data-cur="1"]').find('textarea').attr('id', inputTxt_id);
    }
    $('.wbsr').on('keyup', function() {
      $('.eles li[data-cur="1"]').find('textarea').attr('placeholder', $(this).val());
      var inputTxt_id = $(this).attr('id');
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      var inputTxt = $(this).val();
      elemObj[gpeid].inputTxt[inputTxt_id] = inputTxt;
      elemObj[gpeid].dataStorage();
    });
  });
  //shape颜色控制器
  $('.spcsz').minicolors({
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        $('.ysko').css('background-color', log);
        $('.kzsps .sztt').css('background-color', log);
        $('.kzsps .tzsz').val(log);
        $('.eles li[data-cur="1"]').find('.cls-1').css('fill', log);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].backgroundColor = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //互动页颜色控制器
  $('.hdcsz').minicolors({
    position: 'right',
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        $('.ysko').css('background-color', log);
        $('.eles li[data-cur="1"]').find('.cls-2').css('fill', log);
        $('.eles li[data-cur="1"]').find('.hdzt').css('color', log);
        var gpeid = $('.eles li[data-cur="1"]').attr('id');
        elemObj[gpeid].backgroundColor = log;
        elemObj[gpeid].color = log;
        elemObj[gpeid].dataStorage();
      } catch (e) {}
    },
    theme: 'default'
  });
  //互动界面的处理
  $('.xzs-t').on('click', 'div', function(e) {
    e.stopPropagation();
    hdxl();
    var src = $(this).find('img').attr('src');
    $('.eles li').attr('data-cur', '0');
    $('.eles li>div').not('.graph,.pic,.txt,.input,.shape,.hd').hide();
    var gpid = $('.btcd .x-zk[page-cur="1"]').attr('id').replace('_zs', '');
    var oneactive = $(this).html();
    var elem = $('<li class="box_act at" data-cur="0" gpid="' + gpid + '" style="top:0;left:0;width:100px;height:40px;display:table;z-index:160"></li>');
    var pic = $('<div class="hd">' + oneactive + '<span class="hdzt">0</span><div class="fxbc"></div></div>');
    var ctrl = $('<div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div>');
    elem.append(pic);
    elem.append(ctrl);
    $('.eles').append(elem);
    var oneElem = new newInput(elem);
    var gpeid = oneElem.gpeid;
    elemObj[gpeid] = oneElem;
    // 添加gpid区分不同页面 
    elemObj[gpeid].gpid = gpid;
    elemObj[gpeid].eleType = 526; // 1101***
    elemObj[gpeid].dataStorage();
  });
  //设置选中元素的背景透明度
  $('.fx1').slider({
    slide: function(event, ui) {
      var bjz = (100 - ui.value) / 100;
      $('.eles li[data-cur="1"]>div').eq(0).find('.fxbc').css('opacity', bjz);
      $('.eles li[data-cur="1"]>div').eq(0).find('.anbc').css('opacity', bjz);
      $('.eles li[data-cur="1"]>div').eq(0).find('.dxbc').css('opacity', bjz);
      $('.eles li[data-cur="1"]>div').eq(0).find('.dubc').css('opacity', bjz);
      $('.eles li[data-cur="1"]>div').eq(0).find('.xlbc').css('opacity', bjz);
      $('.eles li[data-cur="1"]>div').eq(0).find('.arcg').css('opacity', bjz);
      $(this).next().text(ui.value + "%");
      var gpeid = $('.eles li[data-cur="1"]').attr('id');
      elemObj[gpeid].opacity = bjz;
      elemObj[gpeid].dataStorage();
    }
  });
  //布满的处理
  $('.bm-y').on('click', function(e) {
    e.stopPropagation();
    var num = $('.eles li[data-cur="1"]').attr('id');
    var wi = elemObj[num].width;
    var he = elemObj[num].height;
    $('.eles li[data-cur="1"]').css({
      'width': he,
      'height': wi,
      'text-align': "center"
    });
    $('.eles li[data-cur="1"]').find('.hdzt').css('display', 'block');
    elemObj[num].width = he;
    elemObj[num].height = wi;
    elemObj[num].dataStorage();
    if ($('.eles .at').length == 0) {
      return;
    }
    $(this).css('background-color', '#2eb3e8');
    $('.bm-z').css('background-color', '#bbb');
  });
  $('.bm-z').on('click', function(e) {
    e.stopPropagation();
    var num = $('.eles li[data-cur="1"]').attr('id');
    var wi = elemObj[num].width;
    var he = elemObj[num].height;
    $('.eles li[data-cur="1"]').css({
      'width': he,
      'height': wi,
    });
    $('.eles li[data-cur="1"]').find('.hdzt').css('display', 'inline');
    elemObj[num].width = he;
    elemObj[num].height = wi;
    elemObj[num].textAlign = "left";
    elemObj[num].dataStorage();
    if ($('.eles .at').length == 0) {
      return;
    }
    $(this).css('background-color', '#2eb3e8');
    $('.bm-y').css('background-color', '#bbb');
  });
  // 作品保存
  $('.k-j2').on('click', function(e) {
    e.stopPropagation;
    var giftObj = saveGift();
    if (giftObj.giftPageElements.length < 2) {
      alert('页面为空无法保存');
      return;
    }
    // 保存请求
    getData(giftObj, 'giftsService.do', 'saveGift3', 'saveGift');
  });

  // 图片上传
  $('.tu-ce').on('click', '.jia-t', function(e) {
    e.stopPropagation;
    $('#picUpload').show(200);
  });
  $('.content').on('click', '.cancel_upload', function(e) {
    e.stopPropagation;
    $('#picUpload').hide(200);
  });
  // 初始化插件 配置参数
  $("#demo").zyUpload({
    width: "650px", // 宽度
    height: "400px", // 宽度
    itemWidth: "120px", // 文件项的宽度
    itemHeight: "100px", // 文件项的高度
    url: "http://106.3.37.173:8080/love/elementsService.do?op=addPictures", // 上传文件的路径
    multiple: true, // 是否可以多个文件上传
    dragDrop: true, // 是否可以拖动上传文件
    del: true, // 是否可以删除文件
    finishDel: false, // 是否在上传文件完成后删除预览
    /* 外部获得的回调接口 */
    /*    onSelect: function(files, allFiles) { // 选择文件的回调方法
          // console.info("当前选择了以下文件：");
          // console.info(files);
          // console.info("之前没上传的文件：");
          // console.info(allFiles);
        },
        onDelete: function(file, surplusFiles) { // 删除一个文件的回调方法
          // console.info("当前删除了此文件：");
          // console.info(file);
          // console.info("当前剩余的文件：");
          // console.info(surplusFiles);
        },
        onSuccess: function(file) { // 文件上传成功的回调方法
          // console.info("此文件上传成功：");
          // console.info(file);
        },
        onFailure: function(file) { // 文件上传失败的回调方法
          // console.info("此文件上传失败：");
          // console.info(file);
        },
        onComplete: function(responseInfo) { // 上传完成的回调方法
          // console.info("文件上传完成");
          // console.info(responseInfo);
        }*/
  });
  //制作页预览
  $('.k-j1').on('click', function(e) {
    e.stopPropagation;
    var giftObj = saveGift();
    if (giftObj.giftPageElements.length < 2) {
      alert('页面为空无法预览');
      return;
    }
    var giftData = JSON.stringify(giftObj);
    window.localStorage.setItem('giftData', giftData);
    $('audio')[0].pause();
    $('<iframe src="giftShow.html" frameborder="0" style="width:100%;height:100%;z-index:3000;position:absolute;top:0;left:0;display:none;" id="giftPreview"></iframe>').insertBefore($('.g-box'));
    $('#giftPreview').show(300);
  });
  //特效擦一擦
  $('.ghtp').on('click', function(e) {
      e.stopPropagation();
      $('.cont-y .zx').hide();
      $('.sc-tp').show();
      $('.tp-sj .tu-p').remove();
      getData({
        "uId": "129",
        "pageSize": "36",
        "pageNo": "1",
      }, "elementsService.do", 'getPicture', "pic_list");
    })
    //改变特效图的透明度
  $('.txc').slider({
      slide: function(event, ui) {
        var tmd = 1 - ui.value / 100;
        $('.eles li[data-cur="1"]').find('img').css('opacity', tmd);
        $('.txc').next().text('' + ui.value + '%');
      }
    })
    //删除擦一擦效果
  $('.ysxc-2').on('click', function(e) {
      e.stopPropagation();
      $(this).parent().hide();
      $('.tx').remove();
    })
    //摇一摇效果
  $('.dh-jh').on('click', 'div', function(e) {
      e.stopPropagation();
      var elem = $('<li class="box_yy" style="position:absolute;top:0;left:0;width:100%;height:100%"><div class="yytx" style="width:100%;height:100%"></div></li>');
      $('.eles').append(elem);
      $('.yxj-ys').show();
      $('.yytx').snowfall({
        image: "images/yyytp/qipao.png",
        flakeCount: 20,
        minSize: 15, //15
        maxSize: 72 //72
      });
      $('.txqr').slider({
        value: 50,
        slide: function(event, ui) {
          event.stopPropagation();
          $('.yytx').snowfall('clear');
          var cs = ((100 - ui.value) / 2.5).toFixed(0);
          $('.yytx').snowfall({
            image: "images/yyytp/qipao.png",
            flakeCount: cs,
            minSize: 10,
            maxSize: 80
          });
        }
      })
      $('.txdx').slider({
        value: 50,
        slide: function(event, ui) {
          event.stopPropagation();
          $('.yytx').snowfall('clear');
          var cs = (100 - ui.value);
          $('.yytx').snowfall({
            image: "images/yyytp/qipao.png",
            flakeCount: 40,
            minSize: 10,
            maxSize: cs
          });
        }
      })
    })
    //删除特效摇一摇
  $('.ysxc-1').on('click', function(e) {
    e.stopPropagation();
    $(this).parent().hide()
    $('.box_yy').remove();
  });
  // 背景图片裁剪
  var clipArea = new bjj.PhotoClip("#clipArea", {
    size: [160, 252],
    outputSize: [320, 504],
    file: "#file",
    // view: ".view",
    ok: "#clipBtn",
    loadStart: function(e) {
      // console.log(e);
    },
    loadComplete: function(e) {
      // console.log(this);
    },
    clipFinish: function(dataURL) {
      // console.log(dataURL);
      $('.view').css('background-image', 'url("' + dataURL + '")');
      updataBgStorage('backgroundImage', dataURL);
    }
  });
  // 背景颜色选择
  $('#top-left').minicolors({
    change: function(hex, opacity) {
      var log;
      try {
        log = hex ? hex : 'transparent';
        if (opacity) log += ', ' + opacity;
        $('.tzsz').val(log);
        $('.sztt').css('background-color', log);
        $('.box_bg').css('background-color', log);
        $('.jdt-z').css('background-color', log);
        updataBgStorage('backgroundColor', log);
      } catch (e) {}
    },
    theme: 'default'
  });


})