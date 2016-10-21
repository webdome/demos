/*变形对象构造函数*/
function newPic(picElem) {
  // 定位元素
  this.box = picElem;
  this.bottomRight = picElem.find('.bottomRight')[0];
  this.bottomLeft = picElem.find('.bottomLeft')[0];
  this.topLeft = picElem.find('.topLeft')[0];
  this.topRight = picElem.find('.topRight')[0];
  this.right = picElem.find('.rightc')[0];
  this.bottom = picElem.find('.bottomc')[0];
  this.left = picElem.find('.leftc')[0];
  this.top = picElem.find('.topc')[0];
  this.rotate = picElem.find('.rotate')[0];
  this.move = picElem.find('.container')[0];
  this.pic = picElem.find('.pic')[0];
  this.img = picElem.find('.pic')[0].firstElementChild;
  // 定义元素位置属性
  this.minsize = 20;
  this.mouseStart = {};
  this.mouseCur = {};
  this.boxPosition = {};
  this.divStart = {};
  // 随机生成编号
  this.num = Math.floor(Math.random() * 10000000000);
  // 图片框样式
  this.verpicwidth = parseFloat(getComputedStyle(this.img).width);
  this.verpicheight = parseFloat(getComputedStyle(this.img).height);
  this.horpicwidth = parseFloat(getComputedStyle(this.img).width);
  this.horpicheight = parseFloat(getComputedStyle(this.img).height);
  this.width = parseFloat(getComputedStyle(this.img).width);
  this.height = parseFloat(getComputedStyle(this.img).height);
  this.positionLeft = 0;
  this.positionTop = 0;
  this.totalAngle = 0;
  this.picMarginTop = 0;
  this.picMarginLeft = 0;
  var self = this;
  // 本地存储
  this.dataStorage = function() {
    self.box.attr('id', 'pic_' + self.num);
    var storageStr = '{"gpeid":"' + 'pic_' + self.num + '","sysgpeid":"","gpid":"1","sysgpid":"","eleType":"62","left":"' + (self.positionLeft + self.width / 2) + '","top":"' + (self.positionTop + self.height / 2) + '","zIndex":"","width":"' + self.width + '","height":"' + self.height + '","rotaAngle":"' + self.totalAngle + '","fontSize":"","fontFamily":"","color":"","fontWeight":"","textShadow":"","fontDirection":"","textAlign":"","fontText":""}';
    window.sessionStorage.setItem('pic_' + self.num, storageStr);
  };
  self.dataStorage();
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
    if (parseFloat(self.box[0].style.width) <= self.verpicwidth) {
      self.img.style.width = self.verpicwidth + "px";
      self.img.style.height = self.verpicheight + "px";
      self.img.style.marginTop = 0;
      self.img.style.marginLeft = (parseFloat(self.box[0].style.width) - self.verpicwidth) / 2 + "px";
    } else {
      self.img.style.width = parseFloat(self.box[0].style.width) + "px";
      self.img.style.height = (parseFloat(self.box[0].style.width) - self.verpicwidth) + self.verpicheight + "px";
      self.img.style.marginLeft = 0;
      self.img.style.marginTop = (self.verpicwidth - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
  };
  this.stopRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.picMarginTop = parseFloat(self.img.style.marginTop);
    self.picMarginLeft = parseFloat(self.img.style.marginLeft);
    self.dataStorage();
    if (!self.picMarginLeft) {
      self.picMarginLeft = 0;
    }
    if (self.picMarginLeft >= 0) {
      self.horpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width);
    } else {
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
    }
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
    if (parseFloat(self.box[0].style.height) <= self.horpicheight) {
      self.img.style.width = self.horpicwidth + "px";
      self.img.style.height = self.horpicheight + "px";
      self.img.style.marginTop = (parseFloat(self.box[0].style.height) - self.horpicheight) / 2 + "px";
      self.img.style.marginLeft = 0;
    } else {
      self.img.style.width = (parseFloat(self.box[0].style.height) - self.horpicheight) + self.horpicwidth + "px";
      self.img.style.height = parseFloat(self.box[0].style.height) + "px";
      self.img.style.marginLeft = (self.horpicheight - parseFloat(self.box[0].style.height)) / 2 + "px";
      self.img.style.marginTop = 0;
    }
  };
  this.stopBottomDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.height = parseFloat(self.box[0].style.height);
    self.picMarginTop = parseFloat(self.img.style.marginTop);
    self.picMarginLeft = parseFloat(self.img.style.marginLeft);
    self.dataStorage();
    if (!self.picMarginLeft) {
      self.picMarginLeft = 0;
    }
    if (self.picMarginTop >= 0) {
      self.verpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = parseFloat(self.img.style.width);
    } else {
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }

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
    if (parseFloat(self.box[0].style.width) <= self.verpicwidth) {
      self.img.style.width = self.verpicwidth + "px";
      self.img.style.height = self.verpicheight + "px";
      self.img.style.marginTop = 0;
      self.img.style.marginLeft = (parseFloat(self.box[0].style.width) - self.verpicwidth) / 2 + "px";
    } else {
      self.img.style.width = parseFloat(self.box[0].style.width) + "px";
      self.img.style.height = parseFloat(self.box[0].style.width) - self.verpicwidth + self.verpicheight + "px";
      self.img.style.marginLeft = 0;
      self.img.style.marginTop = (self.verpicwidth - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
  };
  this.stopLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.picMarginTop = parseFloat(self.img.style.marginTop);
    self.picMarginLeft = parseFloat(self.img.style.marginLeft);
    self.dataStorage();
    if (!self.picMarginLeft) {
      self.picMarginLeft = 0;
    }
    if (self.picMarginLeft >= 0) {
      self.horpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width);
    } else {
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
    }
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
    if (parseFloat(self.box[0].style.height) <= self.horpicheight) {
      self.img.style.width = self.horpicwidth + "px";
      self.img.style.height = self.horpicheight + "px";
      self.img.style.marginTop = (parseFloat(self.box[0].style.height) - self.horpicheight) / 2 + "px";
      self.img.style.marginLeft = 0;
    } else {
      self.img.style.width = parseFloat(self.box[0].style.height) - self.horpicheight + self.horpicwidth + "px";
      self.img.style.height = parseFloat(self.box[0].style.height) + "px";
      self.img.style.marginLeft = (self.horpicheight - parseFloat(self.box[0].style.height)) / 2 + "px";
      self.img.style.marginTop = 0;
    }
  };
  this.stopTopDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.picMarginTop = parseFloat(self.img.style.marginTop);
    self.picMarginLeft = parseFloat(self.img.style.marginLeft);
    self.dataStorage();
    if (!self.picMarginLeft) {
      self.picMarginLeft = 0;
    }
    if (self.picMarginTop >= 0) {
      self.verpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = parseFloat(self.img.style.width);
    } else {
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }
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
    var maxwidth = self.horpicwidth > self.verpicwidth ? self.horpicwidth : self.verpicwidth;
    var maxheight = self.horpicheight > self.verpicheight ? self.horpicheight : self.verpicheight;
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.img.style.height = maxheight + changew + "px";
      self.img.style.width = maxwidth + changew + "px";
      self.img.style.marginTop = -(parseFloat(self.img.style.height) - parseFloat(self.box[0].style.height)) / 2 + "px";
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changeh + "px";
      self.img.style.marginLeft = -(parseFloat(self.img.style.width) - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changew + "px";
    }
  };
  this.stopBottomRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.dataStorage();
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.picMarginTop = parseFloat(self.img.style.marginTop);
      self.horpicheight = parseFloat(self.img.style.height);
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.horpicwidth = parseFloat(self.img.style.width);
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.picMarginLeft = parseFloat(self.img.style.marginLeft);
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.verpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
      self.verpicwidth = parseFloat(self.img.style.width);
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.verpicheight = self.horpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = self.horpicwidth = parseFloat(self.img.style.width);
    }
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
    var maxwidth = self.horpicwidth > self.verpicwidth ? self.horpicwidth : self.verpicwidth;
    var maxheight = self.horpicheight > self.verpicheight ? self.horpicheight : self.verpicheight;
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.img.style.height = maxheight + changew + "px";
      self.img.style.width = maxwidth + changew + "px";
      self.img.style.marginTop = -(parseFloat(self.img.style.height) - parseFloat(self.box[0].style.height)) / 2 + "px";
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changeh + "px";
      self.img.style.marginLeft = -(parseFloat(self.img.style.width) - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changew + "px";
    }
  };
  this.stopBottomLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.dataStorage();
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.picMarginTop = parseFloat(self.img.style.marginTop);
      self.horpicheight = parseFloat(self.img.style.height);
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.horpicwidth = parseFloat(self.img.style.width);
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.picMarginLeft = parseFloat(self.img.style.marginLeft);
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.verpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
      self.verpicwidth = parseFloat(self.img.style.width);
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.verpicheight = self.horpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = self.horpicwidth = parseFloat(self.img.style.width);
    }
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
    var maxwidth = self.horpicwidth > self.verpicwidth ? self.horpicwidth : self.verpicwidth;
    var maxheight = self.horpicheight > self.verpicheight ? self.horpicheight : self.verpicheight;
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.img.style.height = maxheight + changew + "px";
      self.img.style.width = maxwidth + changew + "px";
      self.img.style.marginTop = -(parseFloat(self.img.style.height) - parseFloat(self.box[0].style.height)) / 2 + "px";
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changeh + "px";
      self.img.style.marginLeft = -(parseFloat(self.img.style.width) - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changew + "px";
    }
  };
  this.stopTopLeftDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.positionLeft = parseFloat(self.box[0].style.left);
    self.dataStorage();
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.picMarginTop = parseFloat(self.img.style.marginTop);
      self.horpicheight = parseFloat(self.img.style.height);
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.horpicwidth = parseFloat(self.img.style.width);
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.picMarginLeft = parseFloat(self.img.style.marginLeft);
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.verpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
      self.verpicwidth = parseFloat(self.img.style.width);
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.verpicheight = self.horpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = self.horpicwidth = parseFloat(self.img.style.width);
    }
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
    var maxwidth = self.horpicwidth > self.verpicwidth ? self.horpicwidth : self.verpicwidth;
    var maxheight = self.horpicheight > self.verpicheight ? self.horpicheight : self.verpicheight;
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.img.style.height = maxheight + changew + "px";
      self.img.style.width = maxwidth + changew + "px";
      self.img.style.marginTop = -(parseFloat(self.img.style.height) - parseFloat(self.box[0].style.height)) / 2 + "px";
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changeh + "px";
      self.img.style.marginLeft = -(parseFloat(self.img.style.width) - parseFloat(self.box[0].style.width)) / 2 + "px";
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.img.style.height = maxheight + changeh + "px";
      self.img.style.width = maxwidth + changew + "px";
    }
  };
  this.stopTopRightDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();
    self.width = parseFloat(self.box[0].style.width);
    self.height = parseFloat(self.box[0].style.height);
    self.positionTop = parseFloat(self.box[0].style.top);
    self.dataStorage();
    if (self.picMarginTop < 0 && self.picMarginLeft == 0) {
      self.picMarginTop = parseFloat(self.img.style.marginTop);
      self.horpicheight = parseFloat(self.img.style.height);
      self.verpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginTop;
      self.horpicwidth = parseFloat(self.img.style.width);
      self.verpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginTop;
    }
    if (self.picMarginLeft < 0 && self.picMarginTop == 0) {
      self.picMarginLeft = parseFloat(self.img.style.marginLeft);
      self.horpicheight = parseFloat(self.img.style.height) + 2 * self.picMarginLeft;
      self.verpicheight = parseFloat(self.img.style.height);
      self.horpicwidth = parseFloat(self.img.style.width) + 2 * self.picMarginLeft;
      self.verpicwidth = parseFloat(self.img.style.width);
    }
    if (self.picMarginLeft == 0 && self.picMarginTop == 0) {
      self.verpicheight = self.horpicheight = parseFloat(self.img.style.height);
      self.verpicwidth = self.horpicwidth = parseFloat(self.img.style.width);
    }
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