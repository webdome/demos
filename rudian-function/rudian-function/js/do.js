// 声明裁切参数
var imgH, imgW, boxW, boxH, send_x, send_y, send_w, send_h;
// 请求处理回调函数
function dataDeal(returnCode, returnMsg, category, target) {
  switch (category) {
    // 登录
    case 'login':
      if (returnCode == "002") {
        $('.login_msg').text(returnMsg);
      } else {
        document.cookie = "user_msg=" + JSON.stringify(returnMsg);
        window.location.href = "home.html";
      }
      break;
      // 获取用户作品
    case 'draft':
      $('.picture').empty();
      $.each(returnMsg, function(key, value) {
        if (value.path == "#") {
          var bgurl = 'none';
        } else {
          var bgurl = 'url(http://106.3.37.173:81/image/' + value.path + ')';
        }
        $('<li class="tu tu' + (key + 1) + '" style="background:' + bgurl + ' center no-repeat;background-size:cover;" ><div class="yfb">已发布</div><div class="wbeizhu"><div class="chihuo">' + value.giftName + '</div><div class="faxian"><span class="yan"></span><span class="shu">0</span></div></div><div class="xza"><div class="ybx"><a class="dyj" href="giftShow.html?gift_id=' + value.id + '" target="_blank"></a><a class="dqb" href="index.html?gift_id=' + value.id + '" target="_blank"></a><a class="dxh"></a></div><div class="beizhu"><div class="chihuo">' + value.giftName + '</div><div class="faxian"><span class="yan"></span><span class="shu">0</span></div></div><div class="zsgc1"><span class="mean1"></span><span class="shan1"></span><span class="shezhi1"><span class="ban1"></span><span class="szz">设置</span></span></div></div></li>').appendTo($('.picture'));
      });
      break;
      // 获取作品总条数
    case "draft_count":
      var pages = Math.ceil(returnMsg.toString() / 20);
      for (var i = 0; i < pages; i++) {
        if (i == 0) {
          $('<span class="num page_cur">' + (i + 1) + '</span>').insertAfter($('.liebiao>span:eq(' + (i + 1) + ')'));
        } else {
          $('<span class="num">' + (i + 1) + '</span>').insertAfter($('.liebiao>span:eq(' + (i + 1) + ')'));
        }
      }
      break;
      // 获取单个作品详情
    case "one_draft":
      Secondary(returnMsg);
      $('.y-t>div:eq(0)').trigger('click');
      break;
      // 音乐列表
    case "music_list":
      $('.sc-yy .sc-yys').empty();
      $('.yy-lb').empty();
      $.each(returnMsg, function(key, value) {
        if (key == 0) {
          $('<div class="c_y stl-c fg" data-id="' + value.id + '">' + value.value + '</div>').appendTo($('.sc-yy .sc-yys'));
          getData({
            "name": "",
            "parId": value.id,
            "pageSize": "36",
            "pageNo": "1"
          }, "elementsService.do", 'getMusic', "music_list_one");
        } else {
          $('<div class="stl fg" data-id="' + value.id + '">' + value.value + '</div>').appendTo($('.sc-yy .sc-yys'));
        }
      });
      break;
    case "music_list_one":
      // 1026
      if (!returnMsg.length) {
        $('<h2 style="text-align:center;" class="no_more">无更多数据</h2>').appendTo($('.yy-lb'));
        return;
      }
      // end
      $.each(returnMsg, function(key, value) {
        $('<li class="lb-t" data-url="' + value.path + '" id="' + value.id + '"><span class="lb-gm" style="font-size:12px;cursor:default" title="' + value.eleName + '">' + value.eleName + '</span><span class="bfzi"></span><span class="sg-zt sg-zt2"></span></li>').appendTo($('.yy-lb'));
      });
      break;
      // ***1021 图片裁切功能
    case "picCut":
      // console.log(returnMsg);
      $('.eles>li[data-cur="1"]>.pic>img').attr("src", returnMsg[0].path);
      $('.eles>li[data-cur="1"]').css({
        'width': send_w,
        'height': send_h,
      });
      updatePicStorage("width", send_w);
      updatePicStorage("height", send_h);
      updatePicStorage("hwratio", send_h / send_w);
      updatePicStorage("whratio", send_w / send_h);
      updatePicStorage('eleId', returnMsg[0].id);
      break;
      // 1024 获取贴图分类
    case "graph_class":
      $('<div class="c_y">全部</div>').appendTo($('.tie-z .sc-yys'));
      getData({
        "pageSize": "24",
        "pageNo": "1",
      }, "elementsService.do", 'getMapPing', "graph_list");
      $.each(returnMsg, function(key, value) {
        $('<div data-id="' + value.id + '">' + value.value + '</div>').appendTo($('.tie-z .sc-yys'));
      });
      break;
      // 贴图列表// ***1024
    case "graph_list":
      if (!returnMsg.length) {
        $('<div style="text-align:center;" class="no_more">无更多数据</div>').appendTo($('.tie-z .tu-ce'));
        return;
      }
      $.each(returnMsg, function(key, value) {
        var tu_p = $('<div class="tu-p" style="background:url(http://106.3.37.173:81/map/' + value.path + ') no-repeat center;background-size:contain;" data-url="http://106.3.37.173:81/map/' + value.path + '" data-id="' + value.id + '"><img src="http://106.3.37.173:81/map/' + value.path + '" style="display:none;"/></div>');
        tu_p.appendTo($('.tie-z .tu-ce'));
      });
      break;
    case "pic_class":
      // 默认请求我的图库
      $('<div class="own_pic c_y">我的图库</div>').appendTo($('.xc-tou'));
      $('.own_pic').trigger('click');
      $.each(returnMsg, function(key, value) {
        // <span class="xt-s"></span>
        $('<div data-id="' + value.id + '" class="public_pic">' + value.value + '</div>').appendTo($('.xc-tou'));
      });
      break;
      // 图片列表  1103***
    case "pic_list":
      if (!returnMsg.length) {
        $('<h2 style="text-align:center;" class="no_more">无更多数据</h2>').appendTo($('.tp-sj .tu-ce'));
        return;
      }
      var del = '';
      if ($('.own_pic').hasClass('c_y')) {
        del = '<span class="xt-s"></span>';
      }
      $.each(returnMsg, function(key, value) {
        var tu_p = $('<div class="tu-p" style="background:url(http://106.3.37.173:81/image/' + value.path + ') no-repeat center;background-size:contain;" data-url="http://106.3.37.173:81/image/' + value.path + '" data-id="' + value.id + '"><img src="http://106.3.37.173:81/image/' + value.path + '" style="display:none;"/>' + del + '</div>');
        tu_p.appendTo($('.tp-sj .tu-ce'));
      });
      break;
      // 删除图片  同时删除页面中已经使用的该图片 包括对象集合和缓存中   1103***
    case 'delPicture':
      // console.log(returnMsg);
      if (returnCode == 000) {
        $(target).remove();
        var elemObjs = getStorage();
        var elem_id;
        $.each(elemObjs, function(key, value) {
          if (value.eleId == $(target).attr('data-id')) {
            elem_id = key;
          }
        });
        $('#' + elem_id).remove();
        delete elemObj[elem_id];
        window.sessionStorage.removeItem(elem_id);
        alert(returnMsg);
      }
      break;
      // 形状分类
    case 'shape_list':
      $('.xing-z .sc-yys').empty();
      $('<div class="c_y">全部</div>').appendTo($('.xing-z .sc-yys'));
      getData({
        'pageSize': '36',
        'pageNo': '1',
      }, "elementsService.do", 'getShape', "shape_one");
      $.each(returnMsg, function(key, value) {
        $('<div data-id="' + value.id + '">' + value.value + '</div>').appendTo($('.xing-z .sc-yys'));
      });
      break;
      // 形状列表
    case 'shape_one':
      if (!returnMsg.length) {
        $('<div style="text-align:center;" class="no_more">无更多数据</div>').appendTo($('.xing-z .tu-ce'));
        return;
      }
      $.each(returnMsg, function(key, value) {
        // 1027
        var tu_p = $('<div class="tu-p" data-id="' + value.id + '">' + value.graph + '</div>');
        // end
        tu_p.appendTo($('.xing-z .tu-ce'));
      });
      break;
      // 保存作品
    case 'saveGift':
      console.log(returnMsg);
      // 得到返回的数据 赋值给缓存内的元素 以便二次修改
      var elemObjs = getStorage();
      console.log(elemObjs);
      $.each(elemObjs, function(key, value) {
        value.sysgpid = returnMsg[value.gpid];
        value.sysgpeid = returnMsg[value.gpeid];
        if (elemObj[value.gpeid]) {
          elemObj[value.gpeid].sysgpid = returnMsg[value.gpid];
          elemObj[value.gpeid].sysgpeid = returnMsg[value.gpeid];
        }
      });
      var pages = $('.x-zk');
      $.each(pages, function(key, value) {
        var gpid = Number($(value).attr('id').replace('_zs', ''));
        $(value).attr('sysgpid', returnMsg[gpid]);
      });
      $('.cont-c').attr('sysgid', returnMsg[$('.cont-c').attr('gid')]);
      setStorage(elemObjs);
      // console.log(elemObjs);
      break;
  }
}
// 数据解密------------------------
function getData(packets, interName, methName, category, target) {
  var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
  var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
  var packetsAES = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") + "]";
  var signMD5 = CryptoJS.MD5(sign).toString();
  $.ajax({
    url: 'http://106.3.37.173:8080/love/' + interName,
    // url: 'http://192.168.1.9:8080/love/' + interName,
    type: 'post',
    dataType: 'json',
    data: {
      'op': methName,
      'packets': packetsAES,
      'sign': signMD5
    },
    success: function(res) {
      var returnCode = res.returnCode;
      var returnMsg = res.returnMsg;
      if (returnCode === "000") {
        returnMsg = CryptoJS.AES.decrypt(returnMsg, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        /* ***1021 */
        try {
          returnMsg = JSON.parse(returnMsg.toString(CryptoJS.enc.Utf8));
        } catch (err) {
          returnMsg = returnMsg.toString(CryptoJS.enc.Utf8);
        }
      }
      if (typeof dataDeal === "function") {
        dataDeal(returnCode, returnMsg, category, target);
      } else {
        console.log("dataDeal is not defined");
      }
    }
  });
}
// 上传方法 获取packets sign
function setData(packets) {
  var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
  var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
  var packetsAES = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") + "]";
  var signMD5 = CryptoJS.MD5(sign).toString();
  return [packetsAES, signMD5];
}