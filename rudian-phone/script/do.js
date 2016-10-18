$(function() {
  // 请求处理回调函数
  function dataDeal(returnMsg, category) {
    switch (category) {
      /*首页*/
      case "index_case":
        $.each(returnMsg, function(key, value) {
          $('.case_box>div:eq(' + key + ')').css({
            'background': 'url(' + 'http://106.3.37.173:81/home/' + value.picture[0].picture + ') no-repeat center',
            'background-size': 'cover'
          });
          $('.case_box>div:eq(' + key + ')>a').attr('data-id', value.id);
        });
        break;
      case "index_news":
        $.each(returnMsg, function(key, value) {
          var mouth = value.pubtime.split('-')[1];
          var day = value.pubtime.split('-')[2];
          $('.one_news:eq(' + key + ')>.news_date>h4').text(day);
          $('.one_news:eq(' + key + ')>.news_date>p').text('/' + mouth);
          $('.one_news:eq(' + key + ')>.title_wrap p').text(value.title);
          $('.one_news:eq(' + key + ')>a').attr('data-id', value.id);
        });
        break;
      case "index_job":
        $.each(returnMsg, function(key, value) {
          $('#section_five>div:eq(' + key + ')>a').text(value.name);
          $('#section_five>div:eq(' + key + ')>a').attr('data-id', value.id);
        });
        break;
        /*end*/
        /*关于我们*/
      case "aboutus":
        $('#main1>p').html(returnMsg.jianjie.information);
        break;
        /*end*/
        /*案例分享*/
      case "case":
        $('#all_case').html("");
        $.each(returnMsg, function(key, value) {
          $('#all_case').append($('<div class="one_case"><img src="' + 'http://106.3.37.173:81/home/' + value.picture[0].picture + '" alt=""><a href="oneCase.html" class="case_cover" data-id="' + value.id + '"></a></div>'));
        });
        break;
      case "case_page":
        $('#news_pages>div>div>s').text(" " + returnMsg-1);
        break;
        /*end*/
        /*最新动态*/
      case "news":
        $('#main1').html("");
        $.each(returnMsg, function(key, value) {
          if (key == 0) {
            var curClass = 'news_cur';
          }
          var mouth = value.pubtime.split('-')[1];
          var day = value.pubtime.split('-')[2];
          $('#main1').append($('<div class="one_news ' + curClass + '"><div class="news_date"><h4>' + day + '</h4><p>/' + mouth + '</p></div><span></span><div class="title_wrap"><div class="title_subwrap"><div class="title_content"><p>' + value.title + '</p></div></div></div><a href="newsDetails.html" data-id="' + value.id + '"></a>'));
        });
        break;
      case "newspage":
        $('#news_pages>div>div>s').text(" " + returnMsg);
        break;
        /*end*/
        /*加入我们*/
      case "jobs":
        $.each(returnMsg, function(key, value) {
          var require = value.require;
          $('#job_main').append($('<div class="job" data-id="' + value.id + '"><h2>' + value.name + '</h2><span>岗位要求</span><p>' + value.require + '</p><div class="job_pic"><div style="background:url(http://106.3.37.173:81/home/' + value.picture[0].picture + ') no-repeat center;"></div></div></div>'));
        });
        $('#job_main').append($('<div class="job" id="join_us"><div class="job_pic"><div><p>JOIN US</p><span></span></div></div></div>'));
        // 加入我们 读取cookie 滚动页面
        var job_id = document.cookie.match(/job_id=(\d+)/g).join('').split('=')[1];
        if (job_id) {
          $("html,body").animate({
            scrollTop: $('#job_main>.job[data-id="' + job_id + '"]')[0].offsetTop - 100
          }, 500);
        }
        document.cookie = "job_id=" + " ";
        break;
        /*end*/
        /*单个案例*/
      case "onecase":
        $('.one_case>img').attr('src', 'http://106.3.37.173:81/home/' + returnMsg.picture[0].picture);
        $('.des_top_content>li:eq(0)').text(' ' + returnMsg.rudianCustomer.companyname);
        $('.des_top_content>li:eq(1)').text(' ' + returnMsg.rudianCustomer.industries);
        $('.des_top_content>li:eq(2)').text(' ' + returnMsg.rudianCustomer.servicestype);
        $('.des_txt').html(returnMsg.rudianCustomer.information.replace(/style=".+"/g, ''));
        break;
        /*end*/
        /*单个动态*/
      case "newsDetails":
        $('#newsd_main>h1').text(returnMsg.title);
        $('.newsd_m_data>div:eq(0)').text(returnMsg.pubtime);
        $('.newsd_txt>p:eq(0)').text(returnMsg.summary);
        $('.newsd_pic>img').attr('src', 'http://106.3.37.173:81/home/' + returnMsg.picture[0].picture);
        $('.newsd_txt>p:eq(1)').html(returnMsg.content.replace(/style=".+"/g, ''));
        break;
        /*end*/
    }
  }
  // 数据解密------------------------
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
  // 发送请求--------------------------------
  //首页请求
  if (document.getElementById("index")) {
    getData({
      pageNo: "1",
      pageSize: "3"
    }, "projectsServices", "index_case");
    getData({
      pageNo: "1",
      pageSize: "4"
    }, "newsService", "index_news");
    getData({
      pageNo: "1",
      pageSize: "3"
    }, "jobsServices", "index_job");
  }
  // 关于我们
  if (document.getElementById("aboutus")) {
    getData({}, "companyService", "aboutus");
  }
  // 案例分享
  if (document.getElementById("case")) {
    getData({
      pageNo: "1",
      pageSize: "12"
    }, "projectsServices", "case");
    getData({}, "projectPageCount", "case_page");
  }
  // 最新动态
  if (document.getElementById("news")) {
    getData({
      pageNo: "1",
      pageSize: "10"
    }, "newsService", "news");
    getData({}, "pageCount", "newspage");
  }
  // 加入我们
  if (document.getElementById("joinus")) {
    getData({}, "jobsServices", "jobs");
  }
  // 首页案例点击跳转
  if (document.getElementById('index')) {
    $('.case_box>div>a').on('click', function() {
      var case_id = $(this).attr('data-id');
      document.cookie = "case_id=" + case_id;
    });
  }
  // 案例分享页点击案例跳转
  if (document.getElementById("case")) {
    $(document).delegate('.one_case>a', 'click', function() {
      var case_id = $(this).attr('data-id');
      document.cookie = "case_id=" + case_id;
    });
  }
  if (document.getElementById('onecase')) {
    var case_id = document.cookie.match(/case_id=(\d+)/g).join('').split('=')[1];
    getData({
        pid: case_id
      },
      "oneProjectServices", "onecase");
  }
  // 案例分享页点击翻页
  if (document.getElementById('case')) {
    $('#news_pages>div>span:eq(0)').on('click', function() {
      var pages = $('#news_pages>div>div>s').text().replace(" ", "");
      var page = $('#news_pages>div>div>i').text().replace(" ", "");
      if (page > 1) {
        $('#news_pages>div>div>i').text(parseInt(page) - 1 + " ");
        getData({
          pageNo: parseInt(page) - 1,
          pageSize: "12"
        }, "projectsServices", "case");
      }
    });
    $('#news_pages>div>span:eq(1)').on('click', function() {
      var pages = $('#news_pages>div>div>s').text().replace(" ", "");
      var page = $('#news_pages>div>div>i').text().replace(" ", "");
      if (page < pages) {
        $('#news_pages>div>div>i').text(parseInt(page) + 1 + " ");
        getData({
          pageNo: parseInt(page) + 1,
          pageSize: "12"
        }, "projectsServices", "case");
      }
    });
  }
  // 首页最新动态点击跳转
  if (document.getElementById('index')) {
    $('.one_news>a').on('click', function() {
      var news_id = $(this).attr('data-id');
      document.cookie = "news_id=" + news_id;
    });
  }
  // 最新动态页 点击新闻跳转
  if (document.getElementById("news")) {
    $(document).delegate('.one_news>a', 'click', function() {
      var news_id = $(this).attr('data-id');
      document.cookie = "news_id=" + news_id;
    });
  }
  if (document.getElementById('newsDetails')) {
    var news_id = document.cookie.match(/news_id=(\d+)/g).join('').split('=')[1];
    getData({
        newId: news_id
      },
      "oneNewService", "newsDetails");
  }
  // 案例分享页点击翻页
  if (document.getElementById('news')) {
    $('#news_pages>div>span:eq(0)').on('click', function() {
      var pages = $('#news_pages>div>div>s').text().replace(" ", "");
      var page = $('#news_pages>div>div>i').text().replace(" ", "");
      if (page > 1) {
        $('#news_pages>div>div>i').text(parseInt(page) - 1 + " ");
        getData({
          pageNo: parseInt(page) - 1,
          pageSize: "10"
        }, "newsService", "news");
      }
    });
    $('#news_pages>div>span:eq(1)').on('click', function() {
      var pages = $('#news_pages>div>div>s').text().replace(" ", "");
      var page = $('#news_pages>div>div>i').text().replace(" ", "");
      if (page < pages) {
        $('#news_pages>div>div>i').text(parseInt(page) + 1 + " ");
        getData({
          pageNo: parseInt(page) + 1,
          pageSize: "10"
        }, "newsService", "news");
      }
    });
  }
  // 首页职位点击跳转
  if (document.getElementById('index')) {
    $('#section_five>div>a').on('click', function() {
      var job_id = $(this).attr('data-id');
      document.cookie = "job_id=" + job_id;
    });
  }



});