$(document).ready(function(e) {
  $("#tipEvent").bind("mouseover", function() {
    $("#tipUser").show("fast");
  });
  $("#tipUser").bind("mouseleave", function() {
    $("#tipUser").hide();
  })
  $('.qd1').on('click', function() {
    $('.zhezhao1').fadeOut(100);
  })
  $('.picture ul').on('mouseenter', 'li', function() {
    $(this).find('.beizhu').animate({
      'bottom': 40
    }, 100);
    $(this).find('.zsgc1').show(100);
    $(this).find('.ybx').show(100);
  })
  $('.picture ul').on('mouseleave', 'li', function() {
    $(this).find('.beizhu').animate({
      'bottom': 0
    }, 100);
    $(this).find('.zsgc1').hide(100);
    $(this).find('.ybx').hide(100);
  })
  $('.zsgc1').on('click', '.shan', function() {
      $('.zhezhao1').fadeIn(100);
    })
    //关闭浏览总数显示栏
  $('.gbzso').on('click', function() {
      $('.sjxsc').hide();
    })
    //我的邀请页面的跳转
  $('.tiaomu span').on('click', function() {
    $('.tiaomu span').removeClass('lan');
    $(this).addClass('lan');
  })
  $('.tiaomu span:eq(0)').on('click', function() {
    $('.biaoge2').hide();
    $('.biaoge3').hide();
    $('.biaoge1').show();
  })
  $('.tiaomu span:eq(1)').on('click', function() {
    $('.biaoge1').hide();
    $('.biaoge3').hide();
    $('.biaoge2').show();
  })
  $('.tiaomu span:eq(2)').on('click', function() {
      $('.biaoge1').hide();
      $('.biaoge2').hide();
      $('.biaoge3').show();
    })
    //输入验证信息
  $('.bianji').on("click", function() {
    $('.zhezhao').fadeIn(200);
    $('.jcbd').show()
  });
  $('.qd').on("click", function() {
    $('.zhezhao').fadeOut(600);
    $('.jcbd').hide()
  });
  $('.jh').blur(function() {
    if (!$(".jh").val().match(/^(((13[0-9]{1})|13|15|18)+\d{9})$/)) {
      alert('请输入正确的手机号格式');
    }
  })
  $('.hyzm').on('click', function() {
    if (!$('.jh').val()) {
      alert('手机号不能为空');
    } else {
      $(this).text('发送中...')
    }
  })
  $()
  $('.qx').on('click', function() {
    $('.zhezhao').fadeOut(600);
  })
  $('.mm').blur(function() {
    if (!$(this).val()) {
      alert('设置密码不能为空');
    } else if ($(this).val().length < 6) {
      alert('密码不能小于六位');
    }
  })
  $('.qmm').blur(function() {
    if ($(this).val() !== $('.mm').val()) {
      alert('两次输入的密码不一致')
    }
  })
  $('.xjt').on('click', function() {
    $('.yinz').slideDown();
  })
  $('.yxjt').on('click', function() {
    $('.yiny').slideDown();
  })
  $('.xjt2').on('click', function() {
    $(this).parent().parent().slideUp();
  })
  $('.set1').on('click', function() {
    $('.sety').slideDown();
  })
  $('.xcl').on('click', function() {
    $('.sety').slideUp();
  })
  $('.search').on('click', function() {
    $('.nrss').toggle();
  })
  $('.bg3t').on('click', 'span', function() {
    $('.bg3t span').removeClass('lan');
    $(this).addClass('lan');
  })
  $('.bg3t span:eq(0)').on('click', function() {
    $('.bg3nr').show();
    $('.bg3nl').hide();
  })
  $('.bg3t span:eq(1)').on('click', function() {
      $('.bg3nl').show();
      $('.bg3nr').hide();
    })
    // 场景回收站删除
  $('.tudd2').on('click', 'span', function() {
    $(this).parent().parent().remove();
  })
  $('.tudd4').on('click', 'span', function() {
    $(this).parent().parent().remove();
  })
  $('.sj').on('click', function() {
    $(this).css('border-bottom', 'none');
    $('.ewm').css('border-bottom', '1px solid #d2d2d2').css('border-right', 'none');
    $('.sjqy').show();
    $('.ewmqy').hide();
  })
  $('.ewm').on('click', function() {
    $(this).css('border-right', '1px solid #d2d2d2').css('border-bottom', 'none');
    $('.sj').css('border-bottom', '1px solid #d2d2d2')
    $('.sjqy').hide();
    $('.ewmqy').show();
  })
  $('.yaoqing').on('click', function() {
    if ($('.ssjh').val() === '') {
      alert('请输入正确的数字');
    } else {
      window.location.href = "logo.html";
    }
  })
  $('.ggtm').on('click', '.zdj', function() {
    if ($(this).hasClass('zdjt')) {
      $(this).removeClass('zdjt').addClass('djxx').parent().parent().next().slideDown(400);
    } else {
      $(this).removeClass('djxx').addClass('zdjt').parent().parent().next().slideUp(400);
    }
  })
  $('.ggtm').on('click', '.huishou', function() {
    $(this).parentsUntil('.ggzsq').remove('li');
  })
  $('.yidu').on('click', function() {
    $(this).prev().find('p').text(0)
  })
  var jtxx = $('.hgg').length;
  $('.xxzs').find('p').text(jtxx);

  $('.userg').on('click', function() {
    $('.feyeo').hide();
    $('.content').show();
    $('.content .zhanshi').hide();
    $('.content .zhanshi1').show();
    $('.sjxsc').hide();
    $('.tjcj').hide();
    $('.txq').show();
    $('.b_tit').hide();
  })

  $('.mysv').on('click', function() {
    $('.feyeo').hide();
    $('.lianjie').show();
    $('.sjxsc').hide();
    $('.tjcj').hide();
    $('.txq').hide();
    $('.b_tit').show();
  })

  $('.zuopin').on('click', function() {
    $('.feyeo').hide();
    $('.content').show();
    $('.content .zhanshi').show();
    $('.content .zhanshi1').hide();
    $('.sjxsc').show();
    $('.tjcj').show();
    $('.txq').hide();
    $('.b_tit').show();
  })
  $('.msg').on('click', function() {
    $('.feyeo').hide();
    $('.gonggao').show();
    $('.sjxsc').hide();
    $('.tjcj').hide();
    $('.txq').hide();
    $('.b_tit').show();

  })
  $('.picture').on('click', '.dxh', function() {
    $('.feyeo').hide();
    $('.lll').show();
  })
});

// 登录处理 取出用户id 根据id获取作品 如果没有用户id则需要登录 获取用户作品数生成页码
try {
  var userid = document.cookie.match(/user_msg=(\d+)/g).join('').split('=')[1];
  $('#tipEvent').attr('data-id', userid);
  getData({
    "userId": userid,
    "isDraft": "1",
    "pageSize": "20",
    "pageNo": "1"
  }, 'giftsService.do', 'getGift', 'draft');
  getData({
    "userId": userid,
    "isDraft": "1",
  }, 'giftsService.do', 'getGiftCount', 'draft_count');
} catch (err) {
  alert("请先登录");
  window.location.href = "login.html";
}
// 点击退出 清除cookie 退到登录页 
$('.backt').click(function(e) {
  e.stopPropagation();
  document.cookie = "user_msg=" + "";
  window.location.href = "login.html";
});
// // 点击作品预览  //展示页面的跳转
// $('.picture').on('click', '.dyj', function(e) {
//   e.stopPropagation();
//   var gift_id = $(this).attr('data-id');
//   getData({
//     "gid": gift_id,
//   }, 'giftsService.do', 'getGiftDetail', 'gift_preview');
//   $('.bjsc').fadeIn(200);
// })
// // 点击关闭预览页 并且清空预览内容
// $('.ysch').on('click', function(e) {
//     e.stopPropagation();
//     $('.bjsc').fadeOut(200);
//     $('#giftPreview').empty();
//     $('body').children('script:last').remove();
//   })
  // 分页切换 点击数字 点击箭头 点击首尾页
$('.liebiao').on('click', 'span', function(e) {
  e.stopPropagation;
  var class_num = $(this).attr('class');
  var pageNo = 0;
  if (class_num == 'num00') {
    if ($('.page_cur').index() == 2) {
      return;
    } else {
      pageNo = 1;
      $('.num').removeClass('page_cur');
      $('.num:first').addClass('page_cur');
    }
  } else if (class_num == 'num99') {
    if ($('.page_cur').index() == $('.liebiao').children().length-3) {
      return;
    } else {
      pageNo = $('.liebiao').children().length - 4;
      $('.num').removeClass('page_cur');
      $('.num:last').addClass('page_cur');
    }
  } else if (class_num == 'numl') {
    var i = $('.page_cur').index();
    if (i == 2) {
      return;
    } else {
      pageNo = i - 2;
      $('.num').removeClass('page_cur');
      $('.num:eq(' + (i - 3) + ')').addClass('page_cur');
    }
  } else if (class_num == 'numr') {
    var i = $('.page_cur').index();
    if (i == $('.liebiao').children().length - 3) {
      return;
    } else {
      pageNo = i;
      $('.num').removeClass('page_cur');
      $('.num:eq(' + (i - 1) + ')').addClass('page_cur');
    }
  } else if (class_num == 'num') {
    var i = $(this).index() - 1;
    pageNo = i;
    $('.num').removeClass('page_cur');
    $(this).addClass('page_cur');
  }
  var userid = $('#tipEvent').attr('data-id');
  getData({
    "userId": userid,
    "isDraft": "1",
    "pageSize": "20",
    "pageNo": pageNo
  }, 'giftsService.do', 'getGift', 'draft');
});