/*变形对象构造函数*/
function newTxt(txtElem) {
  this.box = txtElem;
  this.bottomRight = txtElem.find('.bottomRight')[0];
  this.bottomLeft = txtElem.find('.bottomLeft')[0];
  this.topLeft = txtElem.find('.topLeft')[0];
  this.topRight = txtElem.find('.topRight')[0];
  this.right = txtElem.find('.right')[0];
  this.bottom = txtElem.find('.bottom')[0];
  this.left = txtElem.find('.left')[0];
  this.top = txtElem.find('.top')[0];
  this.rotate = txtElem.find('.rotate')[0];
  this.move = txtElem.find('.container')[0];
  this.txt = txtElem.find('.txt')[0];
  this.paragraph = txtElem.find('.txt')[0].firstElementChild;
  this.mouseStart = {};
  this.mouseCur = {};
  this.boxPosition = {};
  this.divStart = {};
  this.width = parseFloat(getComputedStyle(this.box[0]).width);
  this.height = parseFloat(getComputedStyle(this.box[0]).height);
  this.minsize = 20;
  this.positionLeft = 0;
  this.positionTop = 0;
  this.totalAngle = 0;
  var self = this;
  // 旋转
  this.rotate.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.button === 0) {
      self.boxPosition.x = self.box[0].offsetLeft + self.width / 2 + self.box.parent()[0].offsetLeft;
      self.boxPosition.y = self.box[0].offsetTop + self.height / 2 + self.box.parent()[0].offsetTop;
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
  };
  this.stopMove = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.positionTop = parseFloat(self.box[0].style.top);
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
    self.width = parseFloat(getComputedStyle(self.paragraph).width);
    self.height = parseFloat(getComputedStyle(self.paragraph).height);
  };
  this.stopTxtSize = function(e){
    e.stopPropagation();
    // e.preventDefault();
    document.removeEventListener("keydown", self.doTxtSize, true);
    document.removeEventListener("blur", self.stopTxtSize, true);
  };
  // 双击编辑
  this.box.ondblclick = function(){
    
  };
}