$(function() {


	function newBox(elem) {
		this.oDiv2 = elem;
		this.oDiv = elem.find('.scale')[0];
		this.h2 = elem.find('.h2')[0];
		this.right = elem.find('.right')[0];
		this.bottom = elem.find('.bottom')[0];
		this.mouseStart = {};
		this.divStart = {};
		this.rightStart = {};
		this.bottomStart = {};
		var self = this;
		// 向右拽
		self.right.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.rightStart.x = self.right.offsetLeft;
			if (self.right.setCapture) {
				self.right.onmousemove = self.doDrag1;
				self.right.onmouseup = self.stopDrag1;
				self.right.setCapture();
			} else {
				document.addEventListener("mousemove", self.doDrag1, true);
				document.addEventListener("mouseup", self.stopDrag1, true);
			}
		};
		self.doDrag1 = function() {
			var oEvent = window.event || arguments[0];
			var l = oEvent.clientX - self.mouseStart.x + self.rightStart.x;
			var w = l + self.oDiv.offsetWidth;

			if (w < self.oDiv.offsetWidth) {
				w = self.oDiv.offsetWidth;
			} else if (w > document.documentElement.clientWidth - self.oDiv2[0].offsetLeft) {
				w = document.documentElement.clientWidth - self.oDiv2[0].offsetLeft - 2;
			}
			self.oDiv2[0].style.width = w + "px";
		};
		self.stopDrag1 = function() {
			if (self.right.releaseCapture) {
				self.right.onmousemove = null;
				self.right.onmouseup = null;
				self.right.releaseCapture();
			} else {
				document.removeEventListener("mousemove", self.doDrag1, true);
				document.removeEventListener("mouseup", self.stopDrag1, true);
			}
		};
		// 向下拽
		self.bottom.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.bottomStart.y = self.bottom.offsetTop;
			if (self.bottom.setCapture) {
				self.bottom.onmousemove = self.doDrag2;
				self.bottom.onmouseup = self.stopDrag2;
				self.bottom.setCapture();
			} else {
				document.addEventListener("mousemove", self.doDrag2, true);
				document.addEventListener("mouseup", self.stopDrag2, true);
			}
		};
		self.doDrag2 = function() {
			var oEvent = window.event || arguments[0];
			var t = oEvent.clientY - self.mouseStart.y + self.bottomStart.y;
			var h = t + self.oDiv.offsetHeight;

			if (h < self.oDiv.offsetHeight) {
				h = self.oDiv.offsetHeight;
			} else if (h > document.documentElement.clientHeight - self.oDiv2[0].offsetTop) {
				h = document.documentElement.clientHeight - self.oDiv2[0].offsetTop - 2;
			}
			self.oDiv2[0].style.height = h + "px";
		};
		self.stopDrag2 = function() {
			if (self.bottom.releaseCapture) {
				self.bottom.onmousemove = null;
				self.bottom.onmouseup = null;
				self.bottom.releaseCapture();
			} else {
				document.removeEventListener("mousemove", self.doDrag2, true);
				document.removeEventListener("mouseup", self.stopDrag2, true);
			}
		};
		// 右下角拽
		self.oDiv.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.divStart.x = self.oDiv.offsetLeft;
			self.divStart.y = self.oDiv.offsetTop;
			if (self.oDiv.setCapture) {
				self.oDiv.onmousemove = self.doDrag;
				self.oDiv.onmouseup = self.stopDrag;
				self.oDiv.setCapture();
			} else {
				document.addEventListener("mousemove", self.doDrag, true);
				document.addEventListener("mouseup", self.stopDrag, true);
			}

		};
		self.doDrag = function() {
			var oEvent = window.event || arguments[0];
			var l = oEvent.clientX - self.mouseStart.x + self.divStart.x;
			var t = oEvent.clientY - self.mouseStart.y + self.divStart.y;
			var w = l + self.oDiv.offsetWidth;
			var h = t + self.oDiv.offsetHeight;
			if (w < self.oDiv.offsetWidth) {
				w = self.oDiv.offsetWidth;
			} else if (w > document.documentElement.clientWidth - self.oDiv2[0].offsetLeft) {
				w = document.documentElement.clientWidth - self.oDiv2[0].offsetLeft - 2;
			}
			if (h < self.oDiv.offsetHeight) {
				h = self.oDiv.offsetHeight;
			} else if (h > document.documentElement.clientHeight - self.oDiv2[0].offsetTop) {
				h = document.documentElement.clientHeight - self.oDiv2[0].offsetTop - 2;
			}
			self.oDiv2[0].style.width = w + "px";
			self.oDiv2[0].style.height = h + "px";
		};
		self.stopDrag = function() {
			if (self.oDiv.releaseCapture) {
				self.oDiv.onmousemove = null;
				self.oDiv.onmouseup = null;
				self.oDiv.releaseCapture();
			} else {
				document.removeEventListener("mousemove", self.doDrag, true);
				document.removeEventListener("mouseup", self.stopDrag, true);
			}

		};
		// h2拖拽
		self.h2.onmousedown = function() {
			var oEvent = window.event || arguments[0];
			self.mouseStart.x = oEvent.clientX;
			self.mouseStart.y = oEvent.clientY;
			self.divStart.x = self.oDiv2[0].offsetLeft;
			self.divStart.y = self.oDiv2[0].offsetTop;
			if (self.h2.setCapture) {
				self.h2.onmousemove = self.doDrag3;
				self.h2.onmouseup = self.stopDrag3;
				self.h2.setCapture();
			} else {
				document.addEventListener("mousemove", self.doDrag3, true);
				document.addEventListener("mouseup", self.stopDrag3, true);
			}

		};
		self.doDrag3 = function() {
			var oEvent = window.event || arguments[0];
			var l = oEvent.clientX - self.mouseStart.x + self.divStart.x;
			var t = oEvent.clientY - self.mouseStart.y + self.divStart.y;
			if (l < 0) {
				l = 0;
			} else if (l > document.documentElement.clientWidth - self.oDiv2[0].offsetWidth) {
				l = document.documentElement.clientWidth - self.oDiv2[0].offsetWidth;
			}
			if (t < 0) {
				t = 0;
			} else if (t > document.documentElement.clientHeight - self.oDiv2[0].offsetHeight) {
				t = document.documentElement.clientHeight - self.oDiv2[0].offsetHeight;
			}
			self.oDiv2[0].style.left = l + "px";
			self.oDiv2[0].style.top = t + "px";
		};
		self.stopDrag3 = function() {
			if (self.h2.releaseCapture) {
				self.h2.onmousemove = null;
				self.h2.onmouseup = null;
				self.h2.releaseCapture();
			} else {
				document.removeEventListener("mousemove", self.doDrag3, true);
				document.removeEventListener("mouseup", self.stopDrag3, true);
			}

		};
	}
	
	// 添加一个div
	$("#btn").on('click', function(event) {
		event.preventDefault();
		var box = $('<div class="box"></div>');
		var c = $('<div></div>');
		var h2 = $('<h2 class="h2">拖拽黄色区域移动<br>拖拽红色区域单向放大缩小<br>拖拽绿色虚线区域整体放大缩小</h2>');
		var right = $('<div class="right"></div>');
		var scale = $('<div class="scale">+</div>');
		var bottom = $('<div class="bottom"></div>');
		c.append(h2);
		c.append(right);
		c.append(scale);
		c.append(bottom);
		box.append(c);
		$("body").append(box);
		new newBox(box);
	});


})