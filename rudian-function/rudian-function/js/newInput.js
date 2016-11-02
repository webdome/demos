/*图形对象构造函数*/
function newInput(inputElem, gpeid) {
  // 定位元素
  this.box = inputElem;
  this.bottomRight = inputElem.find('.bottomRight')[0];
  this.bottomLeft = inputElem.find('.bottomLeft')[0];
  this.topLeft = inputElem.find('.topLeft')[0];
  this.topRight = inputElem.find('.topRight')[0];
  this.right = inputElem.find('.rightc')[0];
  this.bottom = inputElem.find('.bottomc')[0];
  this.left = inputElem.find('.leftc')[0];
  this.top = inputElem.find('.topc')[0];
  this.rotate = inputElem.find('.rotate')[0];
  this.move = inputElem.find('.container')[0];
  // 定义元素位置属性
  this.minsize = 20;
  this.mouseStart = {};
  this.mouseCur = {};
  this.boxPosition = {};
  this.divStart = {};
  
  var elemObjs = getStorage();
  if (gpeid) {
    this.gpeid = gpeid;
    this.width = elemObjs[gpeid].width;
    this.height = elemObjs[gpeid].height;
    this.opacity = elemObjs[gpeid].opacity;
    var boxShadow = elemObjs[gpeid].boxShadow.split(' ');
    this.boxShadowC = boxShadow[0];
    this.boxShadowX = parseInt(boxShadow[1]);
    this.boxShadowY = parseInt(boxShadow[2]);
    this.boxShadowS = parseInt(boxShadow[3]);
    this.inputTxt = elemObjs[gpeid].inputTxt;
    this.positionLeft = elemObjs[gpeid].left;
    this.positionTop = elemObjs[gpeid].top;
    this.totalAngle = elemObjs[gpeid].rotaAngle;
    this.borderRadius = elemObjs[gpeid].borderRadius;
    this.backgroundColor = elemObjs[gpeid].backgroundColor;
    this.color = elemObjs[gpeid].color;
    this.animate = elemObjs[gpeid].animate;
    this.gpid = elemObjs[gpeid].gpid;
    this.zIndex = elemObjs[gpeid].zIndex;
    this.eleType = elemObjs[gpeid].eleType;
    this.sysgpeid = elemObjs[gpeid].sysgpeid;
    this.sysgpid = elemObjs[gpeid].sysgpid;
    var border = elemObjs[gpeid].border.split(' solid ');
    this.borderSize = border[0];
    this.borderColor = border[1];
  } else {
    // 随机生成编号
    this.gpeid = 'input_' + Math.floor(Math.random() * 10000000000);
    // 样式
    this.width = 100;
    this.height = 40;
    this.opacity = 1;
    this.boxShadowC = "#fff";
    this.boxShadowX = 0;
    this.boxShadowY = 0;
    this.boxShadowS = 0;
    this.inputTxt = {};
    this.positionLeft = 0;
    this.positionTop = 0;
    this.totalAngle = 0;
    this.borderRadius = 0;
    this.backgroundColor = "#fff";
    this.color = "#515151";
    this.animate = {};
    this.gpid = 0;
    this.zIndex = 100;
    this.borderSize = 1;
    this.borderColor = "#fff";
    this.eleType = 0;
    this.sysgpeid = 0;
    this.sysgpid = 0;
  }
  var self = this;
  // 本地存储
  this.dataStorage = function() {
    self.box.attr('id', self.gpeid);
    var storageStr = '{"gpeid":"' + self.gpeid + '","sysgpeid":'+self.sysgpeid+',"gpid":' + self.gpid + ',"sysgpid":'+self.sysgpid+',"eleType":'+self.eleType+',"opacity":' + this.opacity + ',"border":"'+self.borderSize+'px solid '+self.borderColor+'","boxShadow":"' + self.boxShadowC + ' ' + self.boxShadowX + 'px ' + self.boxShadowY + 'px ' + self.boxShadowS + 'px","inputTxt":' + JSON.stringify(self.inputTxt) + ',"left":' + self.positionLeft + ',"top":' + self.positionTop + ',"zIndex":'+self.zIndex+',"width":' + self.width + ',"height":' + self.height + ',"rotaAngle":' + self.totalAngle + ',"borderRadius":' + self.borderRadius + ',"backgroundColor":"' + self.backgroundColor + '","color":"' + self.color + '","fontSize":"","fontFamily":"","color":"","fontWeight":"","textShadow":"","fontDirection":"","textAlign":"","fontText":"","animate":' + JSON.stringify(self.animate) + '}';
    window.sessionStorage.setItem(self.gpeid, storageStr);
  };
  if (!gpeid) {
    self.dataStorage();
  }
  // 旋转
  this.rotate.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.boxPosition.x = self.box.offset().left + self.width / 2;
      self.boxPosition.y = self.box.offset().top + self.height / 2;
      document.addEventListener("mousemove", self.doRotate, true);
      document.addEventListener("mouseup", self.stopRotate, true);
    }
  };
  this.doRotate = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.mouseCur.x = e.clientX;
    self.mouseCur.y = e.clientY;
    self.totalAngle = (Math.atan2(self.boxPosition.x - self.mouseCur.x, -(self.boxPosition.y - self.mouseCur.y)) + Math.PI) / 2 / Math.PI * 360;
    self.box[0].style.webkitTransform = 'rotate(' + self.totalAngle + 'deg)';
  };
  this.stopRotate = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.dataStorage();
    document.removeEventListener("mousemove", self.doRotate, true);
    document.removeEventListener("mouseup", self.stopRotate, true);
  };
  // 右侧水平拽
  this.right.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doRightDrag, true);
      document.addEventListener("mouseup", self.stopRightDrag, true);
    }
  };
  this.doRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var w = e.clientX - self.mouseStart.x;
    if (self.width + w < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + w + "px";
    var wi = self.width + w + "px";
    $('.dw-k').text(wi);
  };
  this.stopRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doRightDrag, true);
    document.removeEventListener("mouseup", self.stopRightDrag, true);
  };
  // 底部垂直拽
  this.bottom.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doBottomDrag, true);
      document.addEventListener("mouseup", self.stopBottomDrag, true);
    }
  };
  this.doBottomDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var h = e.clientY - self.mouseStart.y;
    if (self.height + h < self.minsize) {
      return;
    }
    self.box[0].style.height = self.height + h + "px";
    var he = self.height + h + "px";
    $('.dw-g').text(he);
  };
  this.stopBottomDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.height = parseFloat(self.box[0].style.height);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doBottomDrag, true);
    document.removeEventListener("mouseup", self.stopBottomDrag, true);
  };
  // 左侧水平拽
  this.left.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doLeftDrag, true);
      document.addEventListener("mouseup", self.stopLeftDrag, true);
    }
  };
  this.doLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var w = self.mouseStart.x - e.clientX;
    if (self.width + w < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + w + "px";
    self.box[0].style.left = self.positionLeft - w + "px";
    var leftz = (self.positionLeft - w).toFixed(0) + "px";
    $('.dw-p').text(leftz);
    var wi = self.width + w + "px";
    $('.dw-k').text(wi);
  };
  this.stopLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doLeftDrag, true);
    document.removeEventListener("mouseup", self.stopLeftDrag, true);
  };
  // 顶部拽
  this.top.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doTopDrag, true);
      document.addEventListener("mouseup", self.stopTopDrag, true);
    }
  };
  this.doTopDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var h = self.mouseStart.y - e.clientY;
    if (self.height + h < self.minsize) {
      return;
    }
    self.box[0].style.height = self.height + h + "px";
    self.box[0].style.top = self.positionTop - h + "px";
    var topz = self.positionTop - h + "px";
    $('.dw-x').text(topz);
    var he = self.height + h + "px";
    $('.dw-g').text(he);
  };
  this.stopTopDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doTopDrag, true);
    document.removeEventListener("mouseup", self.stopTopDrag, true);
  };
  // 四个角拽 ==> 等比例 并且以Y轴为标准
  // 右下角拽
  this.bottomRight.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doBottomRightDrag, true);
      document.addEventListener("mouseup", self.stopBottomRightDrag, true);
    }
  };
  this.doBottomRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var changeh = e.clientY - self.mouseStart.y;
    var changew = changeh * (parseFloat(self.width) / parseFloat(self.height));
    if (self.height + changeh < self.minsize || self.width + changew < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + changew + "px";
    self.box[0].style.height = self.height + changeh + "px";
    var wi = (self.width + changew).toFixed(0) + "px";
    $('.dw-k').text(wi);
    var he = self.height + changeh + "px";
    $('.dw-g').text(he);
  };
  this.stopBottomRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doBottomRightDrag, true);
    document.removeEventListener("mouseup", self.stopBottomRightDrag, true);
  };
  // 左下角拽
  this.bottomLeft.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doBottomLeftDrag, true);
      document.addEventListener("mouseup", self.stopBottomLeftDrag, true);
    }
  };
  this.doBottomLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var changeh = e.clientY - self.mouseStart.y;
    var changew = changeh * (parseFloat(self.width) / parseFloat(self.height));
    if (self.height + changeh < self.minsize || self.width + changew < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + changew + "px";
    self.box[0].style.height = self.height + changeh + "px";
    self.box[0].style.left = self.positionLeft - changew + "px";
    var wi = (self.width + changew).toFixed(0) + "px";
    $('.dw-k').text(wi);
    $('.dw-k').text(wi);
    var he = self.height + changeh + "px";
    $('.dw-g').text(he);
    var leftz = (self.positionLeft - changew).toFixed(0) + "px";
    $('.dw-p').text(leftz);
  };
  this.stopBottomLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doBottomLeftDrag, true);
    document.removeEventListener("mouseup", self.stopBottomLeftDrag, true);
  };
  // 左上角拽
  this.topLeft.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doTopLeftDrag, true);
      document.addEventListener("mouseup", self.stopTopLeftDrag, true);
    }
  };
  this.doTopLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var changeh = self.mouseStart.y - e.clientY;
    var changew = changeh * (parseFloat(self.width) / parseFloat(self.height));
    if (self.height + changeh < self.minsize || self.width + changew < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + changew + "px";
    self.box[0].style.height = self.height + changeh + "px";
    self.box[0].style.top = self.positionTop - changeh + "px";
    self.box[0].style.left = self.positionLeft - changew + "px";
    var wi = (self.width + changew).toFixed(0) + "px";
    $('.dw-k').text(wi);
    $('.dw-k').text(wi);
    var he = self.height + changeh + "px";
    $('.dw-g').text(he);
    var leftz = (self.positionLeft - changew).toFixed(0) + "px";
    $('.dw-p').text(leftz);
    var topz = self.positionTop - changeh + "px";
    $('.dw-x').text(topz);
  };
  this.stopTopLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doTopLeftDrag, true);
    document.removeEventListener("mouseup", self.stopTopLeftDrag, true);
  };
  // 右上角拽
  this.topRight.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      document.addEventListener("mousemove", self.doTopRightDrag, true);
      document.addEventListener("mouseup", self.stopTopRightDrag, true);
    }
  };
  this.doTopRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var changeh = self.mouseStart.y - e.clientY;
    var changew = changeh * (parseFloat(self.width) / parseFloat(self.height));
    if (self.height + changeh < self.minsize || self.width + changew < self.minsize) {
      return;
    }
    self.box[0].style.width = self.width + changew + "px";
    self.box[0].style.height = self.height + changeh + "px";
    self.box[0].style.top = self.positionTop - changeh + "px";
    var wi = (self.width + changew).toFixed(0) + "px";
    $('.dw-k').text(wi);
    $('.dw-k').text(wi);
    var he = self.height + changeh + "px";
    $('.dw-g').text(he);
  };
  this.stopTopRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doTopRightDrag, true);
    document.removeEventListener("mouseup", self.stopTopRightDrag, true);
  };
  // 移动
  this.move.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.mouseStart.x = e.clientX;
      self.mouseStart.y = e.clientY;
      self.divStart.x = self.box[0].offsetLeft;
      self.divStart.y = self.box[0].offsetTop;
      document.addEventListener("mousemove", self.doMove, true);
      document.addEventListener("mouseup", self.stopMove, true);
    }
  };
  this.doMove = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var left = e.clientX - self.mouseStart.x + self.divStart.x;
    var top = e.clientY - self.mouseStart.y + self.divStart.y;
    self.box[0].style.left = left + "px";
    self.box[0].style.top = top + "px";
    $('.dw-p').text(left + 'px');
    $('.dw-x').text(top + 'px');
  };
  this.stopMove = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.dataStorage();
    document.removeEventListener("mousemove", self.doMove, true);
    document.removeEventListener("mouseup", self.stopMove, true);
  };

}