// 请求处理回调函数
function dataDeal(returnMsg, category) {
  switch (category) {
    // 首页第二屏
    case "home1":
      $("#profession>h2").html(returnMsg.youshi[0].point);
      $("#resource>h2").html(returnMsg.youshi[1].point);
      $("#attitude>h2").html(returnMsg.youshi[2].point);
      break;
    // 首页第三屏
    case "home2":
      $.each(returnMsg, function(key, value) {
        var target = "";
        if (key < 4) {
          target = ".case_one";
        } else if (key >= 4 && key < 8) {
          target = ".case_two";
        } else {
          target = ".case_three";
        }
        if (returnMsg[key].picture.length != 0) {
          $(target + '>div:eq(' + (key % 4) + ')>div').css({
            "background-image": 'url("http://106.3.37.173:81/home/' + returnMsg[key].picture[0].picture + '")',
            'background-repeat': 'no-repeat',
            "background-size": "cover",
            'background-postion': '50%',
          });
        }
      });
      break;
    // 首页第四屏
    case "home3":
      for (var i = 0; i < returnMsg.length; i++) {
        var month = returnMsg[i].pubtime.substring(returnMsg[i].pubtime.length - 5, returnMsg[i].pubtime.length - 3);
        var day = returnMsg[i].pubtime.substring(returnMsg[i].pubtime.length - 2);
        $(".sec4_txt:eq(" + i + ") b").html(day);
        $(".sec4_txt:eq(" + i + ") i").html("/" + month);
        $(".sec4_txt:eq(" + i + ") p").html(returnMsg[i].title);
        $(".sec4_txt:eq(" + i + ")").attr("data-id", returnMsg[i].id);
      }
      if (returnMsg[0].picture.length != 0) {
        $(".sec4_middle>div>div:eq(0)").css({
          "background-image": 'url("http://106.3.37.173:81/home/' + returnMsg[0].picture[0].picture + '")',
          'background-repeat': 'no-repeat',
          "background-size": "cover",
          'background-postion': '50%',
        });
      }
      $(".sec4_des h2").html(returnMsg[0].title);
      $(".sec4_des p").html(returnMsg[0].summary);
      break;
    // 首页第四屏 单个新闻
    case "homeonenews":
      if (returnMsg.picture.length != 0) {
        $(".sec4_middle>div>div:eq(0)").css({
          "background-image": 'url("http://106.3.37.173:81/home/' + returnMsg.picture[0].picture + '")',
        });
      }
      $(".sec4_des h2").html(returnMsg.title);
      $(".sec4_des p").html(returnMsg.summary);
      break;
    // 首页第五屏
    case "home5":
      for (var i = 0; i < returnMsg.length; i++) {
        $("#sec5_middle>div:eq(" + i + ") h2").html(returnMsg[i].name);
        $("#sec5_middle>div:eq(" + i + ")>div>p").html(returnMsg[i].require);
      }
      break;
    // 关于我们
    case "company":
      $("#abmt_txt").html(returnMsg.jianjie.information);
      for (var i = 0; i < returnMsg.youshi.length; i++) {
        $("#abmb_txt>div:eq(" + i + ")>h3").html("NO" + (i + 1) + "." + returnMsg.youshi[i].point);
        $("#abmb_txt>div:eq(" + i + ")>p").html(returnMsg.youshi[i].introduce);
      }
      break;
    // 关于我们banner
    case "companybanner":
      $("#ab_pic>img").attr("src", "http://106.3.37.173:81/home/" + returnMsg[0].picture);
      // 滚动固定 主体内容位置
      var top = parseFloat(getComputedStyle($('#ab_pic>img')[0]).width) * 520 / 1920 + 100;
      $('#about_main').css('margin-top', top);
      // 开始出现动画
      $(".ab_txt01,.ab_txt02").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
      // 最新动态
    case "news":
      for (var i = 0; i < returnMsg.length; i++) {
        var month = returnMsg[i].pubtime.substring(returnMsg[i].pubtime.length - 5, returnMsg[i].pubtime.length - 3);
        var day = returnMsg[i].pubtime.substring(returnMsg[i].pubtime.length - 2);
        if (i == 0) {
          var one = $('<div class="nm_list_one nm_list_cur" data-id="' + returnMsg[i].id + '"><div class="nm_list_one_data"><h3>' + day + '</h3><p>/' + month + '</p></div><div class="nm_list_one_line"></div><div class="nm_list_one_txt"><p>' + returnMsg[i].title + '</p></div></div>');
          $(".nm_list").append(one);
          $(".nm_des_txt>h2").html(returnMsg[i].title);
          // 去除样式
          var newscontent = returnMsg[i].content;
          newscontent = newscontent.replace(/ style=".+"/g, '');
          $(".nm_des_txt>p").html(newscontent);
          if (returnMsg[i].picture.length != 0) {
            $(".nm_des_pic>div").css({
              "background-image": 'url("http://106.3.37.173:81/home/' + returnMsg[i].picture[0].picture + '")',
              'background-repeat': 'no-repeat',
              "background-size": "cover",
              "background-postion": "50%",
            });
          } else {
            $(".nm_des_pic>div").css({
              "background-image": 'url("")'
            });
          }
        } else {
          var one = $('<div class="nm_list_one" data-id="' + returnMsg[i].id + '"><div class="nm_list_one_data"><h3>' + day + '</h3><p>/' + month + '</p></div><div class="nm_list_one_line"></div><div class="nm_list_one_txt"><p>' + returnMsg[i].title + '</p></div></div>');
          $(".nm_list").append(one);
        }
      }
      $(".nm_list_one:even").css('margin-right', '60px');
      /* end */
      break;
    // 最新动态banner
    case "newsbanner":
      $("#news_banner>div>img").attr("src", "http://106.3.37.173:81/home/" + returnMsg[0].picture);
      // 滚动固定 主体内容位置
      var top = parseFloat(getComputedStyle($('#news_banner>div>img')[0]).width) * 520 / 1920 + 100;
      $('#news_main').css('margin-top', top);
      $("#news_banner>div:last-child>div").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
    // 最新动态 单个新闻
    case "onenews":
      $(".nm_des_pic>img").attr("src", "");
      $(".nm_des_txt>h2").html(returnMsg.title);
      // 去除样式
      var newscontent = returnMsg.content;
      newscontent = newscontent.replace(/ style=".+"/g, '');
      $(".nm_des_txt>p").html(newscontent);
      if (returnMsg.picture.length != 0) {
        $(".nm_des_pic>div").css({
          "background-image": 'url("http://106.3.37.173:81/home/' + returnMsg.picture[0].picture + '")',
        });
      } else {
        $(".nm_des_pic>div").css({
          "background-image": 'url("")'
        });
      }
      break;
    // 最新动态页码
    case "pagecount":
      for (var i = 1; i <= returnMsg; i++) {
        if (i == 1) {
          var one = $('<li class="cp_cur" data-id="' + i + '">' + i + '</li>');
          $(".cp_num>ul").append(one);
        } else {
          $(".cp_num>ul").append('<li data-id="' + i + '">' + i + '</li>');
        }
      }
      break;
      // 加入我们
    case "jobs":
      $.each(returnMsg, function(key, value) {
        if (key % 2 == 0) {
          $('.jmm_left')[0].style = 'height:100%;';
          $('<div class="jmm_l"><h3>' + returnMsg[key].name + '</h3><span>岗位要求</span><p>' + returnMsg[key].require + '</p></div>').appendTo($('.jmm_left'));
        } else {
          $('.jmm_right')[0].style = 'height:100%;';
          $('<div class="jmm_r"><h3>' + returnMsg[key].name + '</h3><span>岗位要求</span><p>' + returnMsg[key].require + '</p></div>').appendTo($('.jmm_right'));
        }
        $('<div class="jmm_pic"><div style="background-image:url(http://106.3.37.173:81/home/' + returnMsg[key].picture[0].picture + ');"></div></div><div class="jmm_line"></div>').appendTo($('.jmm_middle'));
      });
      $('<div class="jmm_cu"><div><p>联系我们</p><span>contact us</span><i></i></div></div>').appendTo($('.jmm_middle'));
      break;
    // 加入我们banner
    case "jobbanner":
      $("#join_banner>div>img").attr("src", "http://106.3.37.173:81/home/" + returnMsg[0].picture);
      // 滚动固定 主体内容位置
      var top = parseFloat(getComputedStyle($('#join_banner>div>img')[0]).width) * 520 / 1920 + 100;
      $('#join_main').css('margin-top', top);
      $("#join_banner>div:last-child>div").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
      // 案例分享
    case "caseshare":
      for (var i = 0; i < returnMsg.length; i++) {
        $("#case_box>div>div").append('<div class="frame" title="' + returnMsg[i].name + '" data-id="' + returnMsg[i].id + '"><img src="http://106.3.37.173:81/home/' + returnMsg[i].picture[0].picture + '"/></div>');
      }
      // 启动案例分享效果
      sP.init();
      for (var i = 0; i < returnMsg.length; i++) {
        $(".slider:eq(" + i + ")").append($("<h4>" + returnMsg[i].name + "</h4>"));
      }
      $("#pan")[0].style = "";
      break;
    // 案例分享 单个案例
    case "oneproject":
      $(".cs_pic").css('background-image', 'url(http://106.3.37.173:81/home/' + returnMsg.picture[0].picture + ')');
      $(".cs_des>ul>li:eq(0)>p").html(returnMsg.rudianCustomer.companyname);
      $(".cs_des>ul>li:eq(1)>p").html(returnMsg.rudianCustomer.industries);
      $(".cs_des>ul>li:eq(2)>p").html(returnMsg.rudianCustomer.servicestype);
      $(".cs_txt").html(returnMsg.rudianCustomer.information);
      break;
      // 案例分享页码
    case "projectpagecount":
      for (var i = 1; i <= returnMsg; i++) {
        if (i == 1) {
          var one = $('<li class="cp_cur" data-id="' + i + '">' + i + '</li>');
          $(".cp_num>ul").append(one);
        } else {
          $(".cp_num>ul").append('<li data-id="' + i + '">' + i + '</li>');
        }
      }
      break;
  }
}
// 数据解密
function getData(packets, interName, category) {
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
    url: 'http://www.easyinto.net/rudian/' + interName,
    type: 'get',
    dataType: 'json',
    data: {
      // 'op': methName,
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
        returnMsg = JSON.parse(returnMsg.toString(CryptoJS.enc.Utf8));
      }
      if (typeof dataDeal === "function") {
        dataDeal(returnMsg, category);
      } else {
        console.log("dataDeal is not defined");
      }
    }
  });
}