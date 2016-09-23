function newBox(elem, width, height, minsize) {
	this.box = elem;
	this.container = elem.find('.container')[0];
	this.scale01 = elem.find('.scale01')[0];
	this.scale02 = elem.find('.scale02')[0];
	this.scale03 = elem.find('.scale03')[0];
	this.scale04 = elem.find('.scale04')[0];
	this.h2 = elem.find('.h2')[0];
	this.right = elem.find('.right')[0];
	this.bottom = elem.find('.bottom')[0];
	this.left = elem.find('.left')[0];
	this.top = elem.find('.top')[0];
	this.rotate = elem.find('.rotate')[0];
	this.mouseStart = {};
	this.mouseCur = {};
	this.boxPosition = {};
	this.divStart = {};
	this.rightStart = {};
	this.bottomStart = {};
	this.leftStart = {};
	this.topStart = {};
	this.width = width;
	this.height = height;
	this.minsize = minsize;
	this.pleft = 0;
	this.ptop = 0;
	this.pbottom = 0;
	this.pright = 0;
	this.angle = 0;
	var self = this;
	var bAngle = 0;
	// 取消默认右键菜单事件
	document.oncontextmenu = function(e) {
		e.preventDefault();
	};
	// 旋转
	self.rotate.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.boxPosition.x = self.box[0].offsetLeft + self.width / 2;
			self.boxPosition.y = self.box[0].offsetTop + self.height / 2;
			document.addEventListener("mousemove", self.doDrag00, true);
			document.addEventListener("mouseup", self.stopDrag00, true);
		}
	};
	self.calAngle = function(e) {
		self.mouseCur.x = e.clientX;
		self.mouseCur.y = e.clientY;
		bAngle = (Math.atan2(self.boxPosition.x - self.mouseCur.x, -(self.boxPosition.y - self.mouseCur.y)) + Math.PI) / 2 / Math.PI * 360;
		console.log(bAngle);
	}
	self.doDrag00 = function(e) {
		e.stopPropagation();
		self.calAngle(e);
		self.box[0].style.webkitTransform = 'rotate(' + bAngle + 'deg)';
	};
	self.stopDrag00 = function(e) {
			self.angle = bAngle;
			e.stopPropagation();
			document.removeEventListener("mousemove", self.doDrag00, true);
			document.removeEventListener("mouseup", self.stopDrag00, true);
		}
		// 右侧拽
	self.right.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag1, true);
			document.addEventListener("mouseup", self.stopDrag1, true);
		}
	};
	self.doDrag1 = function(e) {
		e.stopPropagation();
		var w = e.clientX - self.mouseStart.x;
		if (self.width + w < self.minsize) {
			return;
		}
		if (self.box[0].firstElementChild.nodeName == "IMG") {
			self.box[0].style.width = self.width + w + "px";
			self.box[0].style.height = self.height + w + "px";
		}
		self.box[0].style.width = self.width + w + "px";
	};
	self.stopDrag1 = function(e) {
		e.stopPropagation();
		self.height = parseInt(self.box[0].style.height);
		self.width = parseInt(self.box[0].style.width);
		document.removeEventListener("mousemove", self.doDrag1, true);
		document.removeEventListener("mouseup", self.stopDrag1, true);
	};
	// 底部拽
	self.bottom.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag2, true);
			document.addEventListener("mouseup", self.stopDrag2, true);
		}
	};
	self.doDrag2 = function(e) {
		e.stopPropagation();
		var h = e.clientY - self.mouseStart.y;
		if (self.height + h < self.minsize) {
			return;
		}
		if (self.box[0].firstElementChild.nodeName == "IMG") {
			self.box[0].style.width = self.width + h + "px";
			self.box[0].style.height = self.height + h + "px";
		}
		self.box[0].style.height = self.height + h + "px";
	};
	self.stopDrag2 = function(e) {
		e.stopPropagation();
		self.height = parseInt(self.box[0].style.height);
		self.width = parseInt(self.box[0].style.width);
		document.removeEventListener("mousemove", self.doDrag2, true);
		document.removeEventListener("mouseup", self.stopDrag2, true);
	};
	// 左侧拽
	self.left.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag3, true);
			document.addEventListener("mouseup", self.stopDrag3, true);
		}
	};
	self.doDrag3 = function(e) {
		e.stopPropagation();
		var w = self.mouseStart.x - e.clientX;
		if (self.width + w < self.minsize) {
			return;
		}
		if (self.box[0].firstElementChild.nodeName == "IMG") {
			self.box[0].style.width = self.width + w + "px";
			self.box[0].style.height = self.height + w + "px";
			self.box[0].style.left = self.pleft - w + "px";
			self.box[0].style.top = self.ptop - w + "px";
		}
		self.box[0].style.width = self.width + w + "px";
		self.box[0].style.left = self.pleft - w + "px";
	};
	self.stopDrag3 = function(e) {
		e.stopPropagation();
		self.width = parseInt(self.box[0].style.width);
		self.pleft = parseInt(self.box[0].style.left);
		self.height = parseInt(self.box[0].style.height);
		self.ptop = parseInt(self.box[0].style.top);
		document.removeEventListener("mousemove", self.doDrag3, true);
		document.removeEventListener("mouseup", self.stopDrag3, true);
	};
	// 顶部拽
	self.top.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			self.topStart.y = self.top.offsetTop;
			document.addEventListener("mousemove", self.doDrag4, true);
			document.addEventListener("mouseup", self.stopDrag4, true);
		}
	};
	self.doDrag4 = function(e) {
		e.stopPropagation();
		var h = self.mouseStart.y - e.clientY;
		if (self.height + h < self.minsize) {
			return;
		}
		if (self.box[0].firstElementChild.nodeName == "IMG") {
			self.box[0].style.width = self.width + h + "px";
			self.box[0].style.height = self.height + h + "px";
			self.box[0].style.top = self.ptop - h + "px";
			self.box[0].style.left = self.pleft - h + "px";
		}
		self.box[0].style.height = self.height + h + "px";
		self.box[0].style.top = self.ptop - h + "px";
	};
	self.stopDrag4 = function(e) {
		e.stopPropagation();
		self.height = parseInt(self.box[0].style.height);
		self.ptop = parseInt(self.box[0].style.top);
		self.width = parseInt(self.box[0].style.width);
		self.pleft = parseInt(self.box[0].style.left);
		document.removeEventListener("mousemove", self.doDrag4, true);
		document.removeEventListener("mouseup", self.stopDrag4, true);
	};
	// 右下角拽 ==>成比例
	self.scale01.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag01, true);
			document.addEventListener("mouseup", self.stopDrag01, true);
		}
	};
	self.doDrag01 = function(e) {
		e.stopPropagation();
		var l = e.clientX - self.mouseStart.x;
		var t = e.clientY - self.mouseStart.y;
		if (l > t) {
			var change = l;
		} else {
			var change = t;
		}
		if (self.height + change < self.minsize || self.width + change < self.minsize) {
			return;
		}
		self.box[0].style.width = self.width + change + "px";
		self.box[0].style.height = self.height + change + "px";
	};
	self.stopDrag01 = function(e) {
		e.stopPropagation();
		self.width = parseInt(self.box[0].style.width);
		self.height = parseInt(self.box[0].style.height);
		document.removeEventListener("mousemove", self.doDrag01, true);
		document.removeEventListener("mouseup", self.stopDrag01, true);
	};
	// 左下角拽
	self.scale02.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag02, true);
			document.addEventListener("mouseup", self.stopDrag02, true);
		}
	};
	self.doDrag02 = function(e) {
		e.stopPropagation();
		var l = self.mouseStart.x - e.clientX;
		var t = e.clientY - self.mouseStart.y;
		if (l > t) {
			var change = l;
		} else {
			var change = t;
		}
		if (self.height + change < self.minsize || self.width + change < self.minsize) {
			return;
		}
		self.box[0].style.width = self.width + change + "px";
		self.box[0].style.height = self.height + change + "px";
		self.box[0].style.left = self.pleft - change + "px";
	};
	self.stopDrag02 = function(e) {
		e.stopPropagation();
		self.width = parseInt(self.box[0].style.width);
		self.height = parseInt(self.box[0].style.height);
		self.pleft = parseInt(self.box[0].style.left);
		document.removeEventListener("mousemove", self.doDrag02, true);
		document.removeEventListener("mouseup", self.stopDrag02, true);
	};
	// 左上角拽
	self.scale03.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag03, true);
			document.addEventListener("mouseup", self.stopDrag03, true);
		}
	};
	self.doDrag03 = function(e) {
		e.stopPropagation();
		var l = self.mouseStart.x - e.clientX;
		var t = self.mouseStart.y - e.clientY;
		if (l > t) {
			var change = l;
		} else {
			var change = t;
		}
		if (self.height + change < self.minsize || self.width + change < self.minsize) {
			return;
		}
		self.box[0].style.width = self.width + change + "px";
		self.box[0].style.height = self.height + change + "px";
		self.box[0].style.top = self.ptop - change + "px";
		self.box[0].style.left = self.pleft - change + "px";
	};
	self.stopDrag03 = function(e) {
		e.stopPropagation();
		self.width = parseInt(self.box[0].style.width);
		self.height = parseInt(self.box[0].style.height);
		self.ptop = parseInt(self.box[0].style.top);
		self.pleft = parseInt(self.box[0].style.left);
		document.removeEventListener("mousemove", self.doDrag03, true);
		document.removeEventListener("mouseup", self.stopDrag03, true);
	};
	// 右上角拽
	self.scale04.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag04, true);
			document.addEventListener("mouseup", self.stopDrag04, true);
		}
	};
	self.doDrag04 = function(e) {
		e.stopPropagation();
		var l = e.clientX - self.mouseStart.x;
		var t = self.mouseStart.y - e.clientY;
		if (l > t) {
			var change = l;
		} else {
			var change = t;
		}
		if (self.height + change < self.minsize || self.width + change < self.minsize) {
			return;
		}
		self.box[0].style.width = self.width + change + "px";
		self.box[0].style.height = self.height + change + "px";
		self.box[0].style.top = self.ptop - change + "px";
	};
	self.stopDrag04 = function(e) {
		e.stopPropagation();
		self.width = parseInt(self.box[0].style.width);
		self.height = parseInt(self.box[0].style.height);
		self.ptop = parseInt(self.box[0].style.top);
		document.removeEventListener("mousemove", self.doDrag04, true);
		document.removeEventListener("mouseup", self.stopDrag04, true);
	};
	// 移动
	self.container.onmousedown = function(e) {
		e.stopPropagation();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			self.divStart.x = self.box[0].offsetLeft;
			self.divStart.y = self.box[0].offsetTop;
			document.addEventListener("mousemove", self.doDrag0, true);
			document.addEventListener("mouseup", self.stopDrag0, true);
			$(".rightList").hide();
		}
		// 右键菜单
		if (e.button === 2) {
			var rlx = e.clientX;
			var rly = e.clientY;
			$(".rightList").show().css({
				"left": rlx + "px",
				"top": rly + "px"
			});
		}
	};
	self.doDrag0 = function(e) {
		e.stopPropagation();
		var l = e.clientX - self.mouseStart.x + self.divStart.x;
		var t = e.clientY - self.mouseStart.y + self.divStart.y;
		if (l < 0) {
			l = 0;
		} else if (l > document.documentElement.clientWidth - self.box[0].offsetWidth) {
			l = document.documentElement.clientWidth - self.box[0].offsetWidth;
		}
		if (t < 0) {
			t = 0;
		} else if (t > document.documentElement.clientHeight - self.box[0].offsetHeight) {
			t = document.documentElement.clientHeight - self.box[0].offsetHeight;
		}
		self.box[0].style.left = l + "px";
		self.box[0].style.top = t + "px";
	};
	self.stopDrag0 = function(e) {
		e.stopPropagation();
		self.pleft = parseInt(self.box[0].style.left);
		self.ptop = parseInt(self.box[0].style.top);
		document.removeEventListener("mousemove", self.doDrag0, true);
		document.removeEventListener("mouseup", self.stopDrag0, true);
	};
}