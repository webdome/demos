// 判断对象是否为空
function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}
// 二次渲染页面
function rendering(self) {
  // 取得页面的id
  var gpid = self.attr('id').replace('_zs', '');
  // 创建画布区 ul
  var ele = $('<ul class="eles" gpid="' + gpid + '"></ul>');
  // 解析缓存 创建元素总对象
  var elemObjs = getStorage();
  // 循环元素总对象
  $.each(elemObjs, function(key, obj) {
    if (obj.remove) {
      return;
    }
    $.each(obj, function(property, value) {
      // 取出与gpid对应的元素
      if (value == gpid) {
        // 背景创建
        if (obj.eleType == 525) {
          $('<p class="box_bg view" id="' + obj.gpeid + '" gpid="' + obj.gpid + '" style="background-color:' + obj.backgroundColor + '; background-repeat: no-repeat; background-position: center center; background-size: contain;background-image:url(' + $.trim(obj.backgroundImage) + ');opacity:' + obj.opacity + ';"></p>').appendTo(ele);
          bgRender(obj);
          // 文本创建
        } else if (obj.eleType == 296) {
          var box_txt = $('<li class="box_txt wb" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var txt = $('<div class="txt"></div>').css({
            'text-shadow': obj.textShadow,
            'color': obj.color,
            'opacity': obj.opacity,
            'line-height': obj.lineHeight + 'px',
          });
          var div = $('<div>' + obj.fontText + '</div>').css({
            'font-family': obj.fontFamily,
            'font-style': obj.fontStyle,
            'font-size': obj.fontSize + 'px',
            'font-weight': obj.fontWeight,
            'text-align': obj.textAlign,
          });
          div.appendTo(txt);
          txt.prependTo(box_txt);
          box_txt.appendTo(ele);
          var oneElem = new newTxt(box_txt, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          $('.wzy').append($('<li class="srz sr-xl1" id="' + obj.gpeid + '-sh" style="background-color: rgb(240, 239, 244);"><span class="z-ht" style="background: url(&quot;./images/zz/1-3-bjcj_03.png&quot;) 0px -39px no-repeat;"></span><span class="z-hz" style="color: rgb(102, 102, 102);">请插入文本</span><span class="cllf"></span></li>'));
          // 图片创建
        } else if (obj.eleType == 62) {
          var box_pic = $('<li class="box_pic tp" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var pic = $('<div class="pic"></div>').css({
            'opacity': obj.opacity,
          });
          var img = $('<img src="' + obj.path + '" data-src="' + obj.path + '">').css({
            'box-shadow': obj.boxShadow,
            'border-radius': obj.borderRadius + "px",
          });
          img.appendTo(pic);
          pic.prependTo(box_pic);
          box_pic.appendTo(ele);
          var oneElem = new newPic(box_pic, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          $('.tpy').append($('<li class="srz sr-xl2" id="' + obj.gpeid + '-xh" style="background-color: rgb(240, 239, 244);"><span class="z-hw" style="background: url(&quot;./images/zz/1-3-bjcj_03.png&quot;) 0px -160px no-repeat;"></span><span class="z-hz" style="color: rgb(102, 102, 102);">请插入图片</span><span class="cllf"></span></li>'));
          // 贴图创建
        } else if (obj.eleType == 409) {
          var box_graph = $('<li class="box_graph tp" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var graph = $('<div class="graph"></div>').css({
            'opacity': obj.opacity,
          });
          var img = $('<img src="' + obj.path + '" data-src="' + obj.path + '">').css({
            'box-shadow': obj.boxShadow,
            'border-radius': obj.borderRadius + "px",
          });
          img.appendTo(graph);
          graph.prependTo(box_graph);
          box_graph.appendTo(ele);
          var oneElem = new newGraph(box_graph, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          $('.tpy').append($('<li class="srz sr-xl2" id="' + obj.gpeid + '-xh" style="background-color: rgb(240, 239, 244);"><span class="z-hw" style="background: url(&quot;./images/zz/1-3-bjcj_03.png&quot;) 0px -160px no-repeat;"></span><span class="z-hz" style="color: rgb(102, 102, 102);">请插入图片</span><span class="cllf"></span></li>'));
          // 形状创建
        } else if (obj.eleType == 470) {
          var box_shape = $('<li class="box_shape tp" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var shape = $('<div class="shape"></div>').css({
            'opacity': obj.opacity,
          });
          var svg = obj.path.replace('svg ', 'svg style="box-shadow:' + obj.boxShadow + ';"').replace('path ', 'path style="fill:' + obj.fill + ';"');
          shape.html(svg);
          shape.prependTo(box_shape);
          box_shape.appendTo(ele);
          var oneElem = new newShape(box_shape, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          $('.tpy').append($('<li class="srz sr-xl2" id="' + obj.gpeid + '-xh" style="background-color: rgb(240, 239, 244);"><span class="z-hw" style="background: url(&quot;./images/zz/1-3-bjcj_03.png&quot;) 0px -160px no-repeat;"></span><span class="z-hz" style="color: rgb(102, 102, 102);">请插入图片</span><span class="cllf"></span></li>'));
          // 输入框创建
        } else if (obj.eleType == 520) {
          var box_input = $('<li class="box_input area form" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var input = $('<div class="input bdxan" style="color:' + obj.color + ';"><div class="dxbc" style="opacity:' + obj.opacity + '; border-radius:' + obj.borderRadius + 'px;background-color:' + obj.backgroundColor + ';></div></div>');
          if (isEmptyObject(obj.inputTxt)) {
            var textarea = $('<textarea name="" id="" cols="30" rows="10" style="width: 100%;height: 100%;position:relative;z-index:170;margin:0;padding:0;display:block;background-color:transparent;resize:none;box-shadow:' + obj.boxShadow + ';" disabled="disabled" placeholder=""></textarea>');
          } else {
            var textarea;
            $.each(obj.inputTxt, function(key, value) {
              textarea = $('<textarea name="" id="" cols="30" rows="10" style="width: 100%;height: 100%;position:relative;z-index:170;margin:0;padding:0;display:block;background-color:transparent;resize:none;box-shadow:' + obj.boxShadow + ';" disabled="disabled" placeholder=' + value + '></textarea>');
            });
          }
          textarea.appendTo(input);
          input.prependTo(box_input);
          box_input.appendTo(ele);
          var oneElem = new newInput(box_input, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          // 复选框创建
        } else if (obj.eleType == 521) {
          var box_input = $('<li class="box_input dax form" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var input = $('<div class="input bsxan" style="color:' + obj.color + ';"><div class="dubc" style="background-color:' + obj.backgroundColor + '; opacity:' + obj.opacity + '; border-radius:' + obj.borderRadius + 'px;"></div></div>');
          if (isEmptyObject(obj.inputTxt)) {
            $('<input type="checkbox" disabled="disabled" value="选项一" style="position:relative;z-index:170"><span class="ddxnr" id="">选项一</span>').appendTo(input);
          } else {
            $.each(obj.inputTxt, function(txt, content) {
              $('<input type="checkbox" disabled="disabled" value="选项一" style="position:relative;z-index:170"><span class="ddxnr" id="' + txt + '">' + content + '</span>').appendTo(input);
            });
          }
          input.prependTo(box_input);
          box_input.appendTo(ele);
          var oneElem = new newInput(box_input, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          // 单选框创建
        } else if (obj.eleType == 522) {
          var box_input = $('<li class="box_input dax form" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });;
          var input = $('<div class="input bdxan" style="color:' + obj.color + ';"><div class="dxbc" style="background-color:' + obj.backgroundColor + '; opacity:' + obj.opacity + '; border-radius:' + obj.borderRadius + 'px;"></div></div>');
          if (isEmptyObject(obj.inputTxt)) {
            $('<input type="radio" disabled="disabled" value="选项一" style="position:relative;z-index:170"><span class="ddxnr" id="">选项一</span>').appendTo(input);
          } else {
            $.each(obj.inputTxt, function(txt, content) {
              $('<input type="radio" disabled="disabled" value="选项一" style="position:relative;z-index:170"><span class="ddxnr" id="' + txt + '">' + content + '</span>').appendTo(input);
            });
          }
          input.prependTo(box_input);
          box_input.appendTo(ele);
          var oneElem = new newInput(box_input, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          // 按钮创建
        } else if (obj.eleType == 523) {
          var box_input = $('<li class="box_input bt form" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });
          var input = $('<div class="input btu" style="color:' + obj.color + ';"><div class="anbc" style="background-color:' + obj.backgroundColor + '; opacity:' + obj.opacity + '; border-radius:' + obj.borderRadius + 'px;"></div></div>');
          if (isEmptyObject(obj.inputTxt)) {
            $('<button>请命名</button>').appendTo(input);
          } else {
            $.each(obj.inputTxt, function(txt, content) {
              $('<button id="' + txt + '">' + content + '</button>').appendTo(input);
            });
          }
          input.prependTo(box_input);
          box_input.appendTo(ele);
          var oneElem = new newInput(box_input, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          // 下拉框创建
        } else if (obj.eleType == 524) {
          var box_input = $('<li class="box_input xla form" data-cur="0" gpid="' + obj.gpid + '" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>').css({
            'width': obj.width + 'px',
            'height': obj.height + 'px',
            'top': obj.top + 'px',
            'left': obj.left + 'px',
            'z-index': obj.zIndex,
            'transform': 'rotate(' + obj.rotaAngle + 'deg)',
          });;
          var input = $('<div class="input selc" style="color:' + obj.color + ';"><div class="xlbc" style="background-color:' + obj.backgroundColor + '; opacity:' + obj.opacity + '; border-radius:' + obj.borderRadius + 'px;"></div></div>');
          var select = $('<select class="xlko"></select>');
          $.each(obj.inputTxt, function(txt, content) {
            $('<option value="请输入内容" id="' + txt + '">' + content + '</option>').appendTo(select);
          });
          select.appendTo(input);
          input.prependTo(box_input);
          box_input.appendTo(ele);
          var oneElem = new newInput(box_input, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
          // 摇一摇
        } else if (obj.eleType == 406) {

          // 擦一擦
        } else if (obj.eleType == 407) {
          // 互动
        } else if (obj.eleType == 527 || obj.eleType == 528 || obj.eleType == 529 || obj.eleType == 530) {
          var box_act = $('<li class="box_act at" data-cur="0" gpid="' + obj.gpid + '" style="top:' + obj.top + 'px;left:' + obj.left + 'px;width:' + obj.width + 'px;height:' + obj.height + 'px;display:table;z-index:' + obj.zIndex + ';text-align:center;" id="' + obj.gpeid + '"><div class="container"></div><div class="bottomRight"></div><div class="bottomLeft"></div><div class="topLeft"></div><div class="topRight"></div><div class="rightc"></div><div class="leftc"></div><div class="topc"></div><div class="bottomc"></div><div class="rotate"></div><div class="line"></div></li>');
          var hd = $('<div class="hd" style="box-shadow:' + obj.boxShadow + ';">' + obj.path.replace('<path ', '<path style="fill:' + obj.color + ';"') + '<span class="hdzt" style="color:' + obj.color + ';display:' + obj.display + ';">0</span><div class="fxbc" style="background-color:' + obj.backgroundColor + ';opacity:' + obj.opacity + ';border-radius:' + obj.borderRadius + '%;"></div></div>');
          hd.prependTo(box_act);
          box_act.appendTo(ele);
          var oneElem = new newInput(box_act, obj.gpeid);
          elemObj[obj.gpeid] = oneElem;
        }
      }
    });
  });
  $('.eles').remove();
  ele.prependTo($('.cont-zc'));
}

function Secondary(returnMsg) {
  console.log(returnMsg);
  var g = returnMsg.gift;
  // console.log(g);
  var gp = returnMsg.giftPages;
  // console.log(gp);
  var gpe = returnMsg.giftPageElements;
  // console.log(gpe);
  // 渲染gift
  $('.cont-c').attr('gid', g.gid + 1);
  $('.cont-c').attr('sysgid', g.gid);
  if (g.mpath != 'bg') {
    $('audio').attr('data-id', g.mpath);
  }
  if (g.mid != "0") {
    $('audio').attr({
      'src': g.mpath,
      'data-id': g.mid
    });
    $('#yybbz').html("<marquee scrollamount='4'>" + g.mname + "</marquee>").css('color', '#2eb3e8');
    $('.muy').removeClass('mumr_f mumr_b').addClass('mumr_z');
  }
  // 渲染giftPages
  var firstgpid = "";
  $.each(gp, function(i, pageObj) {
    if (i == 0) {
      var cur = 1;
      var border = '2px solid #2eb3e8'
      var display = 'block';
      firstgpid = pageObj.id;
    } else {
      var cur = 0;
      var border = '2px solid #efeff4'
      var display = 'none';
    }
    $('<div class="x-zk" page-cur="' + cur + '" style="border:' + border + ';" id="' + pageObj.id + '1_zs" sysgpid="' + pageObj.id + '"><span class="paixu">' + (++i) + '</span><span class="b-jq"></span><span class="x-sc" style="display:' + display + '"></span><span class="x-jz" style="display:' + display + '"></span></div>').appendTo($('.btcd'));
  });
  // 渲染giftPageElements
  $.each(gpe, function(i, eleObj) {
    // 取出第一页所有元素渲染至画布区
    if (eleObj.giftpageid == firstgpid) {

    }
    // 取出所有元素对象存入缓存中
    if (eleObj.eletype == 525) {
      var bg_id = 'bg_' + Math.floor(Math.random() * 10000000000);
      var bg_obj = {
        "gpeid": bg_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleId": "0",
        "eleType": "525",
        "zIndex": "40",
        "backgroundColor": eleObj.backgroundcolor ? eleObj.backgroundcolor : "#fff",
        "backgroundImage": eleObj.backgroundimage ? "http://106.3.37.173:81/image/" + eleObj.backgroundimage : "",
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "animate": {}
      };
      window.sessionStorage.setItem(bg_id, JSON.stringify(bg_obj));
    } else if (eleObj.eletype == 296) {
      var txt_id = 'txt_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = txt_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      var txt_obj = {
        "gpeid": txt_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": 296,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "lineHeight": eleObj.lineheight / 2 ? eleObj.lineheight / 2 : 28,
        "left": eleObj.left / 2 - 10,
        "top": eleObj.top / 2,
        "width": eleObj.width / 2 + 20,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "fontSize": eleObj.fontsize / 2,
        "fontFamily": eleObj.fontfamily ? eleObj.fontfamily : "微软雅黑",
        "color": eleObj.color ? eleObj.color : "#000",
        "fontWeight": eleObj.fontweight ? eleObj.fontweight : 400,
        "fontStyle": eleObj.fontstyle ? eleObj.fontstyle : "normal",
        "textDecoration": eleObj.textdecoration ? eleObj.textdecoration : "none",
        "textShadow": eleObj.textshadow ? eleObj.textshadow : "#fff 0px 0px 0px",
        "textAlign": eleObj.textalign ? eleObj.textalign : "left",
        "fontText": eleObj.path,
        "animate": animateObj,
      };
      window.sessionStorage.setItem(txt_id, JSON.stringify(txt_obj));
    } else if (eleObj.eletype == 62) {
      var pic_id = 'pic_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = pic_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      var pic_obj = {
        "gpeid": pic_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": 62,
        "eleId": eleObj.eleid,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "borderRadius": eleObj.borderradius ? eleObj.borderradius : 0,
        "boxShadow": eleObj.boxshadow ? eleObj.boxshadow : "#fff 0px 0px 0px",
        "left": eleObj.left / 2 - eleObj.width / 4,
        "top": eleObj.top / 2 - eleObj.height / 4,
        "width": eleObj.width / 2,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "path": "http://106.3.37.173:81/image/" + eleObj.path,
        "animate": animateObj,
      };
      window.sessionStorage.setItem(pic_id, JSON.stringify(pic_obj));
    } else if (eleObj.eletype == 409) {
      var graph_id = 'graph_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = graph_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      var graph_obj = {
        "gpeid": graph_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": 409,
        "eleId": eleObj.eleid,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "borderRadius": eleObj.borderradius ? eleObj.borderradius : 0,
        "boxShadow": eleObj.boxshadow ? eleObj.boxshadow : "#fff 0px 0px 0px",
        "left": eleObj.left / 2 - eleObj.width / 4,
        "top": eleObj.top / 2 - eleObj.height / 4,
        "width": eleObj.width / 2,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "path": "http://106.3.37.173:81/map/" + eleObj.path,
        "animate": animateObj,
      };
      window.sessionStorage.setItem(graph_id, JSON.stringify(graph_obj));
    } else if (eleObj.eletype == 470) {
      var shape_id = 'shape_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = shape_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      var shape_obj = {
        "gpeid": shape_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": 470,
        "eleId": eleObj.eleid,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "backgroundColor": eleObj.backgroundcolor ? eleObj.backgroundcolor : "#2eb3e8",
        "borderRadius": eleObj.borderradius ? eleObj.borderradius : 0,
        "boxShadow": eleObj.boxshadow ? eleObj.boxshadow : "#fff 0px 0px 0px",
        "left": eleObj.left / 2 - eleObj.width / 4,
        "top": eleObj.top / 2 - eleObj.height / 4,
        "width": eleObj.width / 2,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "path": eleObj.graph,
        "animate": animateObj,
      };
      window.sessionStorage.setItem(shape_id, JSON.stringify(shape_obj));
    } else if (eleObj.eletype == 520 || eleObj.eletype == 521 || eleObj.eletype == 522 || eleObj.eletype == 523 || eleObj.eletype == 524) {
      var input_id = 'input_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      var inputTxtObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = input_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      $.each(JSON.parse(eleObj.path), function(i, txt) {
        var inputTxt_id = 'inputTxt_' + Math.floor(Math.random() * 10000000000);
        inputTxtObj[inputTxt_id] = txt;
      });
      var input_obj = {
        "gpeid": input_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": eleObj.eletype,
        "eleId": 0,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "border": eleObj.border,
        "color": eleObj.color,
        "display": "inline",
        "backgroundColor": eleObj.backgroundcolor ? eleObj.backgroundcolor : "#2eb3e8",
        "borderRadius": eleObj.borderradius ? eleObj.borderradius : 0,
        "boxShadow": eleObj.boxshadow ? eleObj.boxshadow : "#fff 0px 0px 0px",
        "left": eleObj.left / 2 - eleObj.width / 4,
        "top": eleObj.top / 2 - eleObj.height / 4,
        "width": eleObj.width / 2,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "path": 0,
        "inputTxt": inputTxtObj,
        "animate": animateObj,
      };
      window.sessionStorage.setItem(input_id, JSON.stringify(input_obj));
    } else if (eleObj.eletype == 527 || eleObj.eletype == 528 || eleObj.eletype == 529 || eleObj.eletype == 530) {
      var input_id = 'input_' + Math.floor(Math.random() * 10000000000);
      var animateObj = {};
      $.each(eleObj.animate, function(i, ani) {
        var ani_id = 'ani_' + Math.floor(Math.random() * 10000000000);
        ani.element = input_id;
        delete ani.id;
        delete ani.pageeleid;
        animateObj[ani_id] = ani;
      });
      var input_obj = {
        "gpeid": input_id,
        "sysgpeid": eleObj.id,
        "gpid": eleObj.giftpageid + '1',
        "sysgpid": eleObj.giftpageid,
        "eleType": eleObj.eletype,
        "eleId": eleObj.eleid,
        "zIndex": eleObj.zindex,
        "opacity": eleObj.opacity ? eleObj.opacity : 1,
        "border": eleObj.border,
        "color": eleObj.color,
        "display": eleObj.display,
        "backgroundColor": eleObj.backgroundcolor ? eleObj.backgroundcolor : "#2eb3e8",
        "borderRadius": eleObj.borderradius ? eleObj.borderradius : 0,
        "boxShadow": eleObj.boxshadow ? eleObj.boxshadow : "#fff 0px 0px 0px",
        "left": eleObj.left / 2 - eleObj.width / 4,
        "top": eleObj.top / 2 - eleObj.height / 4,
        "width": eleObj.width / 2,
        "height": eleObj.height / 2 ? eleObj.height / 2 : 40,
        "rotaAngle": eleObj.rotaangle ? eleObj.rotaangle : 0,
        "path": eleObj.graph,
        "inputTxt": {},
        "animate": animateObj,
      };
      window.sessionStorage.setItem(input_id, JSON.stringify(input_obj));
    }
    $('.x-zk:eq(0)').trigger('click');
  });
}