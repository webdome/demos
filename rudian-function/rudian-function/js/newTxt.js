/*变形对象构造函数*/
function newTxt(txtElem, gpeid) {
  // 定位元素
  this.box = txtElem;
  this.bottomRight = txtElem.find('.bottomRight')[0];
  this.bottomLeft = txtElem.find('.bottomLeft')[0];
  this.topLeft = txtElem.find('.topLeft')[0];
  this.topRight = txtElem.find('.topRight')[0];
  this.right = txtElem.find('.rightc')[0];
  this.bottom = txtElem.find('.bottomc')[0];
  this.left = txtElem.find('.leftc')[0];
  this.top = txtElem.find('.topc')[0];
  this.rotate = txtElem.find('.rotate')[0];
  this.move = txtElem.find('.container')[0];
  this.txt = txtElem.find('.txt')[0];
  this.paragraph = txtElem.find('.txt')[0].firstElementChild;
  // 定义元素位置属性
  this.minsize = 40;
  this.mouseStart = {};
  this.mouseCur = {};
  this.boxPosition = {};
  this.divStart = {};
  this.eleType = 296;
  var elemObjs = getStorage();
  if (gpeid) {
    this.gpeid = gpeid;
    this.fontSize = elemObjs[gpeid].fontSize;
    this.fontFamily = elemObjs[gpeid].fontFamily;
    this.fontText = elemObjs[gpeid].fontText;
    this.textDecoration = elemObjs[gpeid].textDecoration;
    this.color = elemObjs[gpeid].color;
    this.width = elemObjs[gpeid].width;
    this.height = elemObjs[gpeid].height;
    this.opacity = elemObjs[gpeid].opacity;
    var textShadow = elemObjs[gpeid].textShadow.split(' ');
    this.txtShadowC = textShadow[0];
    this.txtShadowX = parseInt(textShadow[1]);
    this.txtShadowY = parseInt(textShadow[2]);
    this.txtShadowS = parseInt(textShadow[3]);
    this.lineHeight = elemObjs[gpeid].lineHeight;
    this.fontWeight = elemObjs[gpeid].fontWeight;
    this.fontStyle = elemObjs[gpeid].fontStyle;
    this.textAlign = elemObjs[gpeid].textAlign;
    this.zIndex = elemObjs[gpeid].zIndex;
    this.positionLeft = elemObjs[gpeid].left;
    this.positionTop = elemObjs[gpeid].top;
    this.totalAngle = elemObjs[gpeid].rotaAngle;
    this.animate = elemObjs[gpeid].animate;
    this.gpid = elemObjs[gpeid].gpid;
    this.sysgpeid = elemObjs[gpeid].sysgpeid;
    this.sysgpid = elemObjs[gpeid].sysgpid;
  } else {
    // 随机生成编号 
    this.gpeid = 'txt_' + Math.floor(Math.random() * 10000000000);
    // 样式
    this.fontSize = 24;
    this.fontFamily = "微软雅黑";
    this.fontText = "请输入文本";
    this.textDecoration = "none";
    this.color = "#515151";
    this.width = parseFloat(getComputedStyle(this.box[0]).width);
    this.height = parseFloat(getComputedStyle(this.box[0]).height);
    this.opacity = 1;
    this.txtShadowC = "#fff";
    this.txtShadowX = 0;
    this.txtShadowY = 0;
    this.txtShadowS = 0;
    this.lineHeight = 28;
    this.fontWeight = "400";
    this.fontStyle = "normal";
    this.textAlign = "left";
    this.zIndex = 150;
    this.positionLeft = 0;
    this.positionTop = 0;
    this.totalAngle = 0;
    this.animate = {};
    this.gpid = 0;
    this.sysgpeid = 0;
    this.sysgpid = 0;
  }
  var self = this;
  // 本地存储
  this.dataStorage = function() {
    self.box.attr('id', self.gpeid);
    var storageStr = '{"gpeid":"' + self.gpeid + '","sysgpeid":'+self.sysgpeid+',"gpid":' + self.gpid + ',"sysgpid":'+self.sysgpid+',"eleType":' + self.eleType + ',"zIndex":' + self.zIndex + ',"opacity":' + self.opacity + ',"lineHeight":' + self.lineHeight + ',"left":' + self.positionLeft + ',"top":' + self.positionTop + ',"width":' + self.width + ',"height":' + self.height + ',"rotaAngle":' + self.totalAngle + ',"fontSize":"' + self.fontSize + '","fontFamily":' + JSON.stringify(self.fontFamily) + ',"color":"' + self.color + '","fontWeight":"' + self.fontWeight + '","fontStyle":"' + self.fontStyle + '","textDecoration":"'+self.textDecoration+'","textShadow":"' + self.txtShadowC + ' ' + self.txtShadowX + 'px ' + self.txtShadowY + 'px ' + self.txtShadowS + 'px","textAlign":"' + self.textAlign + '","fontText":"' + self.fontText + '","animate":' + JSON.stringify(self.animate) + '}';
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
    self.box[0].style.transform = 'rotate(' + self.totalAngle + 'deg)';
    var rotaz = (self.totalAngle / 360 * 100).toFixed(0);
    $('.sx-dh .hk3').slider({
      value: rotaz
    })
    var rotahz = (rotaz * 3.6).toFixed(0) + '°';
    $('.sx-dh .txtr').text(rotahz);
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
    // e.stopPropagation();
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
    $('.sx-dh .hzb').text(left + 'px');
    $('.sx-dh .zzb').text(top + 'px');
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
  // 文本输入后的宽高改变记录
  this.paragraph.onfocus = function(e) {
    e.stopPropagation();
    // e.preventDefault();
    document.addEventListener("keydown", self.doTxtSize, true);
    document.addEventListener("blur", self.stopTxtSize, true);
  };
  this.doTxtSize = function(e) {
    // e.stopPropagation();
    // e.preventDefault();
    self.width = parseFloat(getComputedStyle(self.txt).width);
    self.height = parseFloat(getComputedStyle(self.txt).height);
  };
  this.stopTxtSize = function(e) {
    e.stopPropagation();
    // e.preventDefault();
    self.dataStorage();
    document.removeEventListener("keydown", self.doTxtSize, true);
    document.removeEventListener("blur", self.stopTxtSize, true);
  };
}