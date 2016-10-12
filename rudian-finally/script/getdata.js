function dataDeal(returnMsg, category) {
  switch (category) {
    case "home1":
      $("#profession>h2").html(returnMsg.youshi[0].point);
      $("#resource>h2").html(returnMsg.youshi[1].point);
      $("#attitude>h2").html(returnMsg.youshi[2].point);
      break;
    case "home2":

      for (var i = 0; i < returnMsg.length; i++) {
        if (i < 4) {
          $(".case_one>div:eq(" + i + ")>div").css({
            "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg[i].picture[0].picture + '")',
            'background-repeat': 'no-repeat',
            "background-size": "cover"
          });
        }
        if (i >= 4 && i < 8) {
          $(".case_two>div:eq(" + (i % 4) + ")>div").css({
            "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg[i].picture[0].picture + '")',
            'background-repeat': 'no-repeat',
            "background-size": "cover"
          });
        }
        if (i >= 8) {
          $(".case_three>div:eq(" + (i % 4) + ")>div").css({
            "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg[i].picture[0].picture + '")',
            'background-repeat': 'no-repeat',
            "background-size": "cover"
          });
        }
      }
      break;
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
          "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg[0].picture[0].picture + '")',
          'background-repeat': 'no-repeat',
          "background-size": "cover"
        });
      }

      $(".sec4_des h2").html(returnMsg[0].title);
      /*var reg = new RegExp("style=", "g");
      var c = returnMsg[0].content.replace(reg, "");*/
      $(".sec4_des p").html(returnMsg[0].summary);
      break;
    case "homeonenews":
      if (returnMsg.picture.length != 0) {
        $(".sec4_middle>div>div:eq(0)").css({
          "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg.picture[0].picture + '")',
          'background-repeat': 'no-repeat',
          "background-size": "cover"
        });
      }
      $(".sec4_des h2").html(returnMsg.title);
      /*var reg = new RegExp("style=", "g");
      var c = returnMsg.content.replace(reg, "");*/
      $(".sec4_des p").html(returnMsg.summary);
      break;
    case "home5":
      for (var i = 0; i < returnMsg.length; i++) {
        $("#sec5_middle>div:eq(" + i + ") h2").html(returnMsg[i].name);
        var reg = new RegExp("style=", "g");
        var c = returnMsg[i].require.replace(reg, "");
        $("#sec5_middle>div:eq(" + i + ")>div>p").html(c);
      }

      break;
    case "company":
      /* begin */
      $("#abmt_txt").html(returnMsg.jianjie.information);
      for (var i = 0; i < returnMsg.youshi.length; i++) {
        $("#abmb_txt>div:eq(" + i + ")>h3").html("NO" + (i + 1) + "." + returnMsg.youshi[i].point);
        $("#abmb_txt>div:eq(" + i + ")>p").html(returnMsg.youshi[i].introduce);
      }
      /* end */
      break;
    case "companybanner":
      $("#ab_pic>img").attr("src", "http://192.168.1.10:8080/picture/" + returnMsg[0].picture);
      // 开始向下滚动
      $(".ab_txt01,.ab_txt02").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
    case "news":
      /* begin */
      console.log(returnMsg);
      $(".nm_list>div").remove();
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
              "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg[i].picture[0].picture + '")',
              'background-repeat': 'no-repeat',
              "background-size": "cover",
              "background-postion": "center",
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
    case "newsbanner":
      $("#news_banner>div>img").attr("src", "http://192.168.1.10:8080/picture/" + returnMsg[0].picture);
      $("#news_banner>div:last-child>div").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
    case "onenews":
      $(".nm_des_pic>img").attr("src", "");
      $(".nm_des_txt>h2").html(returnMsg.title);
      // 去除样式
      var newscontent = returnMsg.content;
      newscontent = newscontent.replace(/ style=".+"/g, '');
      $(".nm_des_txt>p").html(newscontent);
      if (returnMsg.picture.length != 0) {
        $(".nm_des_pic>div").css({
          "background-image": 'url("http://192.168.1.10:8080/picture/' + returnMsg.picture[0].picture + '")',
          'background-repeat': 'no-repeat',
          "background-size": "cover"
        });
      } else {
        $(".nm_des_pic>div").css({
          "background-image": 'url("")'
        });
      }
      break;
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
    case "jobs":
      // 加入我们
      $.each(returnMsg, function(key, value) {
        if (key % 2 == 0) {
          $('.jmm_left')[0].style = 'height:100%;';
          $('<div class="jmm_l"><h3>' + returnMsg[key].name + '</h3><span>岗位要求</span><p>' + returnMsg[key].require + '</p></div>').appendTo($('.jmm_left'));
          $('<div class="jmm_pic"><div style="background-image:url(http://192.168.1.10:8080/picture/' + returnMsg[key].picture[0].picture + ');"></div></div><div class="jmm_line"></div>').prependTo($('.jmm_cu'));
        } else {
          $('.jmm_right')[0].style = 'height:100%;';
          $('<div class="jmm_r"><h3>' + returnMsg[key].name + '</h3><span>岗位要求</span><p>' + returnMsg[key].require + '</p></div>').appendTo($('.jmm_right'));
          $('<div class="jmm_pic"><div style="background-image:url(http://192.168.1.10:8080/picture/' + returnMsg[key].picture[0].picture + ');"></div></div><div class="jmm_line"></div>').prependTo($('.jmm_cu'));
        }
      });
      break;
    case "jobbanner":
      $("#join_banner>div>img").attr("src", "http://192.168.1.10:8080/picture/" + returnMsg[0].picture);
      $("#join_banner>div:last-child>div").css({
        "opacity": "1",
        "transform": "translateY(0px)"
      });
      break;
    case "caseshare":
      $("#case_box>div>div>div").remove();
      for (var i = 0; i < returnMsg.length; i++) {
        $("#case_box>div>div").append('<div class="frame" title="' + returnMsg[i].name + '" data-id="' + returnMsg[i].id + '"><img src="http://192.168.1.10:8080/picture/' + returnMsg[i].picture[0].picture + '"/></div>');
      }
      sP.init();
      onresize = sP.resize;
      $("#pan")[0].style = "";
      break;
    case "oneproject":
      $(".cs_pic").css('background-image', 'url(http://192.168.1.10:8080/picture/' + returnMsg.picture[0].picture + ')');
      $(".cs_des>ul>li:eq(0)>p").html(returnMsg.rudianCustomer.companyname);
      $(".cs_des>ul>li:eq(1)>p").html(returnMsg.rudianCustomer.industries);
      $(".cs_des>ul>li:eq(2)>p").html(returnMsg.rudianCustomer.servicestype);
      $(".cs_txt").html(returnMsg.rudianCustomer.information);
      break;
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
// 项目翻页点击数字
if (document.getElementById("caseshare")) {
  $(document).delegate(".cp_num>ul>li", "click",
    function() {
      var a = $(this).data('id');
      getData({
          pageNo: a,
          pageSize: "6"
        },
        "projectsServices", "caseshare");
      $(".cp_num>ul>li").removeClass('cp_cur');
      $(this).addClass('cp_cur');
    });
}

// 项目单条
$(document).delegate(".frame", "click",
  function() {
    var a = $(this).data('id');
    getData({
        pid: a
      },
      "oneProjectServices", "oneproject");
  });

// home新闻单条
$(".sec4_txt").click(function() {
  var a = $(this).data('id');
  getData({
      newId: a
    },
    "oneNewService", "homeonenews");
});

// 新闻单条
$(document).delegate(".nm_list_one", "click",
  function() {
    var a = $(this).data('id');
    getData({
        newId: a
      },
      "oneNewService", "onenews");
  });

// 新闻翻页点击数字
if (document.getElementById("news")) {
  $(document).delegate(".cp_num>ul>li", "click",
    function() {
      var a = $(this).data('id');
      getData({
          pageNo: a,
          pageSize: "12"
        },
        "newsService", "news");
      $(".cp_num>ul>li").removeClass('cp_cur');
      $(this).addClass('cp_cur');
    });
}

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
    url: 'http://192.168.1.10:8080/rudian/' + interName,
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