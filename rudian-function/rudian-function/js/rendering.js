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
            'font-size': obj.fontSize,
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
          // 特效
        } else if (obj.eleType) {
          // 互动
        } else if (obj.eleType) {

        }
      }
    });
  });
  $('.eles').remove();
  ele.prependTo($('.cont-zc'));
}