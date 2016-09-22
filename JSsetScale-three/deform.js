/*变形对象构造函数*/
function newBox(elem) {
	this.box = elem;
	if (elem.children().eq(0).attr("class") == "pic") {
		this.pic = elem.find('.pic')[0];
		this.img = elem.find('.pic')[0].firstElementChild;
	}
	this.container = elem.find('.container')[0];
	this.scale01 = elem.find('.scale01')[0];
	this.scale02 = elem.find('.scale02')[0];
	this.scale03 = elem.find('.scale03')[0];
	this.scale04 = elem.find('.scale04')[0];
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

	if (elem.children().eq(0).attr("class") == "pic") {
		this.verpicwidth = this.horpicwidth = this.width = parseFloat(getComputedStyle(this.pic).width);
		this.verpicheight = this.horpicheight = this.height = parseFloat(getComputedStyle(this.pic).height);
		// var ratio = parseFloat(getComputedStyle(this.pic).width) / parseFloat(getComputedStyle(this.pic).height);
		// this.aspectRatio = ratio > 1 ? 1 / ratio : ratio;
	} else {
		this.width = parseFloat(getComputedStyle(this.box[0]).width);
		this.height = parseFloat(getComputedStyle(this.box[0]).height);
	}
	this.picTop = 0;
	this.picLeft = 0;
	this.minsize = 20;
	this.pleft = 0;
	this.ptop = 0;
	this.pbottom = 0;
	this.pright = 0;
	this.angle = 0;
	var self = this;
	var bAngle = 0;
	// 旋转
	this.rotate.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.boxPosition.x = self.box[0].offsetLeft + self.width / 2 + self.box.parent()[0].offsetLeft;
			self.boxPosition.y = self.box[0].offsetTop + self.height / 2 + self.box.parent()[0].offsetTop;
			document.addEventListener("mousemove", self.doDrag00, true);
			document.addEventListener("mouseup", self.stopDrag00, true);
		}
	};
	this.calAngle = function(e) {
		self.mouseCur.x = e.clientX;
		self.mouseCur.y = e.clientY;
		bAngle = (Math.atan2(self.boxPosition.x - self.mouseCur.x, -(self.boxPosition.y - self.mouseCur.y)) + Math.PI) / 2 / Math.PI * 360;
	}
	this.doDrag00 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.calAngle(e);
		self.box[0].style.webkitTransform = 'rotate(' + bAngle + 'deg)';
	};
	this.stopDrag00 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.angle = bAngle;
		document.removeEventListener("mousemove", self.doDrag00, true);
		document.removeEventListener("mouseup", self.stopDrag00, true);
	}

	// 右侧水平拽
	self.right.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag1, true);
			document.addEventListener("mouseup", self.stopDrag1, true);
		}
	};
	self.doDrag1 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var w = e.clientX - self.mouseStart.x;
		if (self.width + w < self.minsize) {
			return;
		}
		if (self.pic) {
			// if (self.aspectRatio == 1) {
			self.box[0].style.width = self.width + w + "px";
			if (parseFloat(self.box[0].style.width) <= self.verpicwidth) {
				self.img.style.width = self.verpicwidth + "px";
				self.img.style.height = self.verpicheight + "px";
				w = parseFloat(self.box[0].style.width) - self.verpicwidth;
				self.img.style.marginTop = 0;
				self.img.style.marginLeft = w / 2 + "px";
			} else {
				self.img.style.width = parseFloat(self.box[0].style.width) + "px";
				self.img.style.height = (parseFloat(self.box[0].style.width) - self.verpicwidth) / 2 + self.verpicwidth + "px";
				self.img.style.marginLeft = 0;
				self.img.style.marginTop = -(parseFloat(self.box[0].style.width) - self.verpicwidth) / 4 + "px";
			}
			// }
		} else {
			self.box[0].style.width = self.width + w + "px";
		}

	};
	self.stopDrag1 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		if (self.pic) {
			self.horpicheight = parseFloat(self.img.style.height);
			self.horpicwidth = parseFloat(self.img.style.width);
			self.picTop = parseFloat(self.img.style.marginTop);
			self.picLeft = parseFloat(self.img.style.marginLeft);
			if (!self.picLeft) {
				self.picLeft = 0;
			}
		}
		document.removeEventListener("mousemove", self.doDrag1, true);
		document.removeEventListener("mouseup", self.stopDrag1, true);
	};
	// 底部垂直拽
	self.bottom.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag2, true);
			document.addEventListener("mouseup", self.stopDrag2, true);
		}
	};
	self.doDrag2 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var h = e.clientY - self.mouseStart.y;
		if (self.height + h < self.minsize) {
			return;
		}
		if (self.pic) {
			self.box[0].style.height = self.height + h + "px";
			if (parseFloat(self.box[0].style.height) <= self.horpicheight) {
				self.img.style.width = self.horpicwidth + "px";
				self.img.style.height = self.horpicheight + "px";
				h = parseFloat(self.box[0].style.height) - self.horpicheight;
				self.img.style.marginTop = h / 2 + "px";
				self.img.style.marginLeft = 0;
			} else {
				self.img.style.width = (parseFloat(self.box[0].style.height) - self.horpicheight) / 2 + self.horpicwidth + "px";
				self.img.style.height = parseFloat(self.box[0].style.height) + "px";
				self.img.style.marginLeft = -(parseFloat(self.box[0].style.height) - self.horpicheight) / 4 + "px";
				self.img.style.marginTop = 0;
			}
		} else {
			self.box[0].style.height = self.height + h + "px";
		}
	};
	self.stopDrag2 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.height = parseFloat(self.box[0].style.height);
		if (self.pic) {
			self.verpicheight = parseFloat(self.img.style.height);
			self.verpicwidth = parseFloat(self.img.style.width);
			self.picTop = parseFloat(self.img.style.marginTop);
			self.picLeft = parseFloat(self.img.style.marginLeft);
			if (!self.picLeft) {
				self.picLeft = 0;
			}
		}
		document.removeEventListener("mousemove", self.doDrag2, true);
		document.removeEventListener("mouseup", self.stopDrag2, true);
	};
	// 左侧水平拽
	self.left.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag3, true);
			document.addEventListener("mouseup", self.stopDrag3, true);
		}
	};
	self.doDrag3 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var w = self.mouseStart.x - e.clientX;
		if (self.width + w < self.minsize) {
			return;
		}
		if (self.pic) {
			// if (self.aspectRatio == 1) {
			self.box[0].style.width = self.width + w + "px";
			self.box[0].style.left = self.pleft - w + "px";
			if (parseFloat(self.box[0].style.width) <= self.verpicwidth) {
				self.img.style.width = self.verpicwidth + "px";
				self.img.style.height = self.verpicheight + "px";
				w = parseFloat(self.box[0].style.width) - self.verpicwidth;
				self.img.style.marginTop = 0;
				self.img.style.marginLeft = w / 2 + "px";
			} else {
				self.img.style.width = parseFloat(self.box[0].style.width) + "px";
				self.img.style.height = (parseFloat(self.box[0].style.width) - self.verpicwidth) / 2 + self.verpicwidth + "px";
				self.img.style.marginLeft = 0;
				self.img.style.marginTop = -(parseFloat(self.box[0].style.width) - self.verpicwidth) / 4 + "px";
			}
			// }
		} else {
			self.box[0].style.width = self.width + w + "px";
			self.box[0].style.left = self.pleft - w + "px";
		}

	};
	self.stopDrag3 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		self.pleft = parseFloat(self.box[0].style.left);
		if (self.pic) {
			self.horpicheight = parseFloat(self.img.style.height);
			self.horpicwidth = parseFloat(self.img.style.width);
			self.picTop = parseFloat(self.img.style.marginTop);
			self.picLeft = parseFloat(self.img.style.marginLeft);
			if (!self.picLeft) {
				self.picLeft = 0;
			}
		}
		document.removeEventListener("mousemove", self.doDrag3, true);
		document.removeEventListener("mouseup", self.stopDrag3, true);
	};
	// 顶部拽
	self.top.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		e.preventDefault();
		var h = self.mouseStart.y - e.clientY;
		if (self.height + h < self.minsize) {
			return;
		}
		if (self.pic) {
			self.box[0].style.height = self.height + h + "px";
			self.box[0].style.top = self.ptop - h + "px";
			if (parseFloat(self.box[0].style.height) <= self.horpicheight) {
				self.img.style.width = self.horpicwidth + "px";
				self.img.style.height = self.horpicheight + "px";
				h = parseFloat(self.box[0].style.height) - self.horpicheight;
				self.img.style.marginTop = h / 2 + "px";
				self.img.style.marginLeft = 0;
			} else {
				self.img.style.width =  (parseFloat(self.box[0].style.height) - self.horpicheight)/2+self.horpicwidth+"px";
				self.img.style.height = parseFloat(self.box[0].style.height) + "px";
				self.img.style.marginLeft = -(parseFloat(self.box[0].style.height) - self.horpicheight) / 4 + "px";
				self.img.style.marginTop = 0;
			}
		} else {
			self.box[0].style.height = self.height + h + "px";
			self.box[0].style.top = self.ptop - h + "px";
		}
	};
	self.stopDrag4 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.height = parseFloat(self.box[0].style.height);
		self.ptop = parseFloat(self.box[0].style.top);
		if (self.pic) {
			self.verpicheight = parseFloat(self.img.style.height);
			self.verpicwidth = parseFloat(self.img.style.width);
			self.picTop = parseFloat(self.img.style.marginTop);
			self.picLeft = parseFloat(self.img.style.marginLeft);
			if (!self.picLeft) {
				self.picLeft = 0;
			}
		}
		document.removeEventListener("mousemove", self.doDrag4, true);
		document.removeEventListener("mouseup", self.stopDrag4, true);
	};
	// 右下角拽 ==>成比例
	self.scale01.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag01, true);
			document.addEventListener("mouseup", self.stopDrag01, true);
		}
	};
	self.doDrag01 = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		if (self.pic) {
			self.img.style.height = self.picHeight + change + "px";
			self.img.style.width = self.horpicwidth + change + "px";
		}
	};
	self.stopDrag01 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		self.height = parseFloat(self.box[0].style.height);
		if (self.pic) {
			self.horpicheight = self.verpicheight = parseFloat(self.box[0].style.height);
			self.horpicwidth = self.verpicwidth = parseFloat(self.box[0].style.width);
			console.log(self.horpicheight,self.horpicwidth)
		}
		document.removeEventListener("mousemove", self.doDrag01, true);
		document.removeEventListener("mouseup", self.stopDrag01, true);
	};
	// 左下角拽
	self.scale02.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag02, true);
			document.addEventListener("mouseup", self.stopDrag02, true);
		}
	};
	self.doDrag02 = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		if (self.pic) {
			self.img.style.height = self.picHeight + change + "px";
			self.img.style.width = self.horpicwidth + change + "px";
		}

	};
	self.stopDrag02 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		self.height = parseFloat(self.box[0].style.height);
		self.pleft = parseFloat(self.box[0].style.left);
		if (self.pic) {
			self.horpicheight = self.verpicheight = parseFloat(self.box[0].style.height);
			self.horpicwidth = self.verpicwidth = parseFloat(self.box[0].style.width);
		}
		document.removeEventListener("mousemove", self.doDrag02, true);
		document.removeEventListener("mouseup", self.stopDrag02, true);
	};
	// 左上角拽
	self.scale03.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag03, true);
			document.addEventListener("mouseup", self.stopDrag03, true);
		}
	};
	self.doDrag03 = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		if (self.pic) {
			self.img.style.height = self.picHeight + change + "px";
			self.img.style.width = self.horpicwidth + change + "px";
		}

	};
	self.stopDrag03 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		self.height = parseFloat(self.box[0].style.height);
		self.ptop = parseFloat(self.box[0].style.top);
		self.pleft = parseFloat(self.box[0].style.left);
		if (self.pic) {
			self.horpicheight = self.verpicheight = parseFloat(self.box[0].style.height);
			self.horpicwidth = self.verpicwidth = parseFloat(self.box[0].style.width);
		}
		document.removeEventListener("mousemove", self.doDrag03, true);
		document.removeEventListener("mouseup", self.stopDrag03, true);
	};
	// 右上角拽
	self.scale04.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			document.addEventListener("mousemove", self.doDrag04, true);
			document.addEventListener("mouseup", self.stopDrag04, true);
		}
	};
	self.doDrag04 = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		if (self.pic) {
			self.img.style.height = self.picHeight + change + "px";
			self.img.style.width = self.horpicwidth + change + "px";
		}

	};
	self.stopDrag04 = function(e) {
		e.stopPropagation();
		e.preventDefault();
		self.width = parseFloat(self.box[0].style.width);
		self.height = parseFloat(self.box[0].style.height);
		self.ptop = parseFloat(self.box[0].style.top);
		if (self.pic) {
			self.horpicheight = self.verpicheight = parseFloat(self.box[0].style.height);
			self.horpicwidth = self.verpicwidth = parseFloat(self.box[0].style.width);
		}
		document.removeEventListener("mousemove", self.doDrag04, true);
		document.removeEventListener("mouseup", self.stopDrag04, true);
	};
	// 移动
	self.container.onmousedown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.button === 0) {
			self.mouseStart.x = e.clientX;
			self.mouseStart.y = e.clientY;
			self.divStart.x = self.box[0].offsetLeft;
			self.divStart.y = self.box[0].offsetTop;
			document.addEventListener("mousemove", self.doDrag0, true);
			document.addEventListener("mouseup", self.stopDrag0, true);
			$(".rightList").hide();
		}
		if (e.button === 2) {
			var rlx = e.clientX;
			var rly = e.clientY;
			$(this).parent().next().show().css({
				"left": rlx + "px",
				"top": rly + "px"
			});
		}
	};
	self.doDrag0 = function(e) {
		e.stopPropagation();
		e.preventDefault();
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
		e.preventDefault();
		self.pleft = parseFloat(self.box[0].style.left);
		self.ptop = parseFloat(self.box[0].style.top);
		document.removeEventListener("mousemove", self.doDrag0, true);
		document.removeEventListener("mouseup", self.stopDrag0, true);
	};
}