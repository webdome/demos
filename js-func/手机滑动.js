	var mouseStart = {};
	var mouseMove = {};
	var self;
	// mousedown touchstart
	$(target).on(startEvent, '.photoShow div', function(e) {
		e.stopPropagation();
		mouseStart.x = e.originalEvent.touches[0].clientX;
		mouseStart.y = e.originalEvent.touches[0].clientY;
		self = $(this);
		document.addEventListener(moveEvent, doPhotoSlide, true);
		document.addEventListener(upEvent, stopPhotoSlide, true);
	});
	// mousemove touchmove
	function doPhotoSlide(e) {
		e.stopPropagation();
		e.preventDefault();
		
		mouseMove.x = e.targetTouches[0].clientX - mouseStart.x;
		mouseMove.y = e.targetTouches[0].clientY - mouseStart.y;
	}
	// mouseup touchend
	function stopPhotoSlide(e) {
		e.stopPropagation();
		mouseStart = {};
		mouseMove = {};
		document.removeEventListener(moveEvent, doPhotoSlide, true);
		document.removeEventListener(upEvent, stopPhotoSlide, true);
	}