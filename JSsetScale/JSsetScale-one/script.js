$(function() {
	function newBox(elem, width, height, minsize) {
		this.box = elem;
		this.container = elem[0].firstChild;
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
		var bAngle = 0;
		var self = this;
		// 旋转
		self.rotate.onmousedown = function() {
			var e = window.event || arguments[0];
			e.stopPropagation();
			self.mouseStart.y = e.clientY;
			var mf = e.offsetX;
			if (mf < 10) {
				self.mouseStart.x = e.clientX + (10 - mf);
			} else if (mf > 10) {
				self.mouseStart.x = e.clientX - (10 - (20 - mf));
			} else {
				self.mouseStart.x = e.clientX;
			}
			self.boxPosition.x = self.box[0].offsetLeft + self.width / 2;
			self.boxPosition.y = self.box[0].offsetTop + self.height / 2;
			document.addEventListener("mousemove", self.doDrag00, true);
			document.addEventListener("mouseup", self.stopDrag00, true);
		};
		var aLine = 0; var bLine=0;var cLine=0;
		self.calAngle = function(e){
			self.mouseCur.x = e.clientX;
			self.mouseCur.y = e.clientY;
			aLine = Math.sqrt(Math.abs(Math.pow((self.boxPosition.x - self.mouseStart.x), 2)) + Math.abs(Math.pow((self.boxPosition.y - self.mouseStart.y), 2)));
			bLine = Math.sqrt(Math.abs(Math.pow((self.mouseStart.x - self.mouseCur.x), 2)) + Math.abs(Math.pow((self.mouseStart.y - self.mouseCur.y), 2)));
			cLine = Math.sqrt(Math.abs(Math.pow((self.mouseCur.x - self.boxPosition.x), 2)) + Math.abs(Math.pow((self.mouseCur.y - self.boxPosition.y), 2)));
			bAngle = Math.acos((Math.pow(bLine, 2) - Math.pow(aLine, 2) - Math.pow(cLine, 2)) / (-2 * aLine * cLine));
		}
		self.doDrag00 = function() {
			var e = window.event || arguments[0];
			e.stopPropagation();
			self.calAngle(e);
			// bAngle = self.angle + (3 - bAngle) / 3 * 180 + 180;
			// 缺少转过180deg的处理
			// 存储的问题
			/*起始点坐标(x>0,y>0)*/
			if ((self.mouseStart.x > self.boxPosition.x && self.mouseStart.y < self.boxPosition.y)) {
				// 右上
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					if (self.mouseCur.x - self.mouseStart.x > self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x < self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x == self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 右下
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 左上
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 左下
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					if (self.mouseStart.x - self.mouseCur.x > self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x < self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x == self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 上 / 左
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y < 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x < 0)) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 下 / 右
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y > 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x > 0)) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 起始点
				if (self.mouseCur.x == self.mouseStart.x && self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(x>0,y<0)*/
			if ((self.mouseStart.x > self.boxPosition.x && self.mouseStart.y > self.boxPosition.y)) {
				// 右上
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 右下
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					if (self.mouseCur.x - self.mouseStart.x > self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x < self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x == self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 左上
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					if (self.mouseStart.x - self.mouseCur.x < self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x > self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x == self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 左下
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 上 / 右
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y < 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x > 0)) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 下 / 左
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y > 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x < 0)) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 起始点
				if (self.mouseCur.x == self.mouseStart.x && self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(x<0,y<0)*/
			if ((self.mouseStart.x < self.boxPosition.x && self.mouseStart.y > self.boxPosition.y)) {
				// 右上
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					if (self.mouseCur.x - self.mouseStart.x > self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x < self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x == self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 右下
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 左上
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 左下
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					if (self.mouseStart.x - self.mouseCur.x > self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x < self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x == self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 下 / 右
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y > 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x > 0)) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 上 / 左
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y < 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x < 0)) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 起始点
				if (self.mouseCur.x == self.mouseStart.x && self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(x<0,y>0)*/
			if ((self.mouseStart.x < self.boxPosition.x && self.mouseStart.y < self.boxPosition.y)) {
				// 右上
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 右下
				if (self.mouseCur.x > self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					if (self.mouseCur.x - self.mouseStart.x > self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x < self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseCur.x - self.mouseStart.x == self.mouseCur.y - self.mouseStart.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 左上
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y < self.mouseStart.y) {
					if (self.mouseStart.x - self.mouseCur.x > self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle - bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x < self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					} else if (self.mouseStart.x - self.mouseCur.x == self.mouseStart.y - self.mouseCur.y) {
						bAngle = self.angle + bAngle / 3 * 180;
					}
				}
				// 左下
				if (self.mouseCur.x < self.mouseStart.x && self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 下 / 左
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y > 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x < 0)) {
					bAngle = self.angle - bAngle / 3 * 180;
				}
				// 上 / 右
				if ((self.mouseCur.x == self.mouseStart.x && self.mouseCur.y - self.mouseStart.y < 0) || (self.mouseCur.y == self.mouseStart.y && self.mouseCur.x - self.mouseStart.x > 0)) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
				// 起始点
				if (self.mouseCur.x == self.mouseStart.x && self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(y>0,x=0)*/
			if ((self.mouseStart.x == self.boxPosition.x && self.mouseStart.y < self.boxPosition.y)) {
				if (self.mouseCur.x > self.mouseStart.x) {
					bAngle = self.angle + bAngle / 3 * 180;
				} else if (self.mouseCur.x < self.mouseStart.x) {
					bAngle = self.angle - bAngle / 3 * 180;
				} else if (self.mouseCur.x == self.mouseStart.x) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(y=0,x>0)*/
			if ((self.mouseStart.x > self.boxPosition.x && self.mouseStart.y == self.boxPosition.y)) {
				if (self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				} else if (self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				} else if (self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(y<0,x=0)*/
			if ((self.mouseStart.x == self.boxPosition.x && self.mouseStart.y > self.boxPosition.y)) {
				if (self.mouseCur.x < self.mouseStart.x) {
					bAngle = self.angle + bAngle / 3 * 180;
				} else if (self.mouseCur.x > self.mouseStart.x) {
					bAngle = self.angle - bAngle / 3 * 180;
				} else if (self.mouseCur.x == self.mouseStart.x) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}
			/*起始点坐标(y=0,x<0)*/
			if ((self.mouseStart.x < self.boxPosition.x && self.mouseStart.y == self.boxPosition.y)) {
				if (self.mouseCur.y < self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				} else if (self.mouseCur.y > self.mouseStart.y) {
					bAngle = self.angle - bAngle / 3 * 180;
				} else if (self.mouseCur.y == self.mouseStart.y) {
					bAngle = self.angle + bAngle / 3 * 180;
				}
			}


			self.box[0].style.webkitTransform = 'rotate(' + bAngle + 'deg)';
		};
		self.stopDrag00 = function() {
				self.angle = bAngle;
				var e = window.event || arguments[0];
				e.stopPropagation();
				document.removeEventListener("mousemove", self.doDrag00, true);
				document.removeEventListener("mouseup", self.stopDrag00, true);
			}
			// 右侧拽
		self.right.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag1, true);
			document.addEventListener("mouseup", self.stopDrag1, true);
		};
		self.doDrag1 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var w = oEvent.clientX - self.mouseStart.x;
			if (self.width + w < self.minsize) {
				return;
			}
			self.box[0].style.width = self.width + w + "px";
		};
		self.stopDrag1 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			document.removeEventListener("mousemove", self.doDrag1, true);
			document.removeEventListener("mouseup", self.stopDrag1, true);
		};
		// 底部拽
		self.bottom.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag2, true);
			document.addEventListener("mouseup", self.stopDrag2, true);
		};
		self.doDrag2 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var h = oEvent.clientY - self.mouseStart.y;
			if (self.height + h < self.minsize) {
				return;
			}
			self.box[0].style.height = self.height + h + "px";
		};
		self.stopDrag2 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.height = parseInt(self.box[0].style.height);
			document.removeEventListener("mousemove", self.doDrag2, true);
			document.removeEventListener("mouseup", self.stopDrag2, true);
		};
		// 左侧拽
		self.left.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag3, true);
			document.addEventListener("mouseup", self.stopDrag3, true);
		};
		self.doDrag3 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var w = self.mouseStart.x - oEvent.clientX;
			if (self.width + w < self.minsize) {
				return;
			}
			self.box[0].style.width = self.width + w + "px";
			self.box[0].style.left = self.pleft - w + "px";
		};
		self.stopDrag3 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			self.pleft = parseInt(self.box[0].style.left);
			document.removeEventListener("mousemove", self.doDrag3, true);
			document.removeEventListener("mouseup", self.stopDrag3, true);
		};
		// 顶部拽
		self.top.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.topStart.y = self.top.offsetTop;
			document.addEventListener("mousemove", self.doDrag4, true);
			document.addEventListener("mouseup", self.stopDrag4, true);
		};
		self.doDrag4 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var h = self.mouseStart.y - oEvent.clientY;
			if (self.height + h < self.minsize) {
				return;
			}
			self.box[0].style.height = self.height + h + "px";
			self.box[0].style.top = self.ptop - h + "px";
		};
		self.stopDrag4 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.height = parseInt(self.box[0].style.height);
			self.ptop = parseInt(self.box[0].style.top);
			document.removeEventListener("mousemove", self.doDrag4, true);
			document.removeEventListener("mouseup", self.stopDrag4, true);
		};
		// 右下角拽 ==>成比例
		self.scale01.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag01, true);
			document.addEventListener("mouseup", self.stopDrag01, true);
		};
		self.doDrag01 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var l = oEvent.clientX - self.mouseStart.x;
			var t = oEvent.clientY - self.mouseStart.y;
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
		self.stopDrag01 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			self.height = parseInt(self.box[0].style.height);
			document.removeEventListener("mousemove", self.doDrag01, true);
			document.removeEventListener("mouseup", self.stopDrag01, true);
		};
		// 左下角拽
		self.scale02.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag02, true);
			document.addEventListener("mouseup", self.stopDrag02, true);
		};
		self.doDrag02 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var l = self.mouseStart.x - oEvent.clientX;
			var t = oEvent.clientY - self.mouseStart.y;
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
		self.stopDrag02 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			self.height = parseInt(self.box[0].style.height);
			self.pleft = parseInt(self.box[0].style.left);
			document.removeEventListener("mousemove", self.doDrag02, true);
			document.removeEventListener("mouseup", self.stopDrag02, true);
		};
		// 左上角拽
		self.scale03.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag03, true);
			document.addEventListener("mouseup", self.stopDrag03, true);
		};
		self.doDrag03 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var l = self.mouseStart.x - oEvent.clientX;
			var t = self.mouseStart.y - oEvent.clientY;
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
		self.stopDrag03 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			self.height = parseInt(self.box[0].style.height);
			self.ptop = parseInt(self.box[0].style.top);
			self.pleft = parseInt(self.box[0].style.left);
			document.removeEventListener("mousemove", self.doDrag03, true);
			document.removeEventListener("mouseup", self.stopDrag03, true);
		};
		// 右上角拽
		self.scale04.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			document.addEventListener("mousemove", self.doDrag04, true);
			document.addEventListener("mouseup", self.stopDrag04, true);
		};
		self.doDrag04 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var l = oEvent.clientX - self.mouseStart.x;
			var t = self.mouseStart.y - oEvent.clientY;
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
		self.stopDrag04 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.width = parseInt(self.box[0].style.width);
			self.height = parseInt(self.box[0].style.height);
			self.ptop = parseInt(self.box[0].style.top);
			document.removeEventListener("mousemove", self.doDrag04, true);
			document.removeEventListener("mouseup", self.stopDrag04, true);
		};
		// 移动
		self.container.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.divStart.x = self.box[0].offsetLeft;
			self.divStart.y = self.box[0].offsetTop;
			document.addEventListener("mousemove", self.doDrag0, true);
			document.addEventListener("mouseup", self.stopDrag0, true);
		};
		self.doDrag0 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			var l = oEvent.clientX - self.mouseStart.x + self.divStart.x;
			var t = oEvent.clientY - self.mouseStart.y + self.divStart.y;
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
		self.stopDrag0 = function() {
			var oEvent = window.event || arguments[0];
			oEvent.stopPropagation();
			self.pleft = parseInt(self.box[0].style.left);
			self.ptop = parseInt(self.box[0].style.top);
			document.removeEventListener("mousemove", self.doDrag0, true);
			document.removeEventListener("mouseup", self.stopDrag0, true);
		};
	}
	$("#btn").on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var box = $('<div class="box"></div>');
		var c = $('<div></div>');
		var scale01 = $('<div class="scale01"></div>');
		var scale02 = $('<div class="scale02"></div>');
		var scale03 = $('<div class="scale03"></div>');
		var scale04 = $('<div class="scale04"></div>');
		var rotate = $('<div class="rotate"></div>');
		var bottom = $('<div class="bottom"></div>');
		var right = $('<div class="right"></div>');
		var left = $('<div class="left"></div>');
		var top = $('<div class="top"></div>');
		box.append(c);
		box.append(scale01);
		box.append(scale02);
		box.append(scale03);
		box.append(scale04);
		box.append(right);
		box.append(left);
		box.append(top);
		box.append(bottom);
		box.append(rotate);
		$("body").append(box);
		new newBox(box, 200, 200, 10);
		// 点击隐藏显示操作点
		$(document).on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(".box").children().hide();
		});
		$(".box").on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(".box").children().hide();
			$(this).children().show();
		});

	});

})