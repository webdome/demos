function setScale() {
	if (window.top !== window) {
		return;
	}
	var pageScale = 1;

	var width = document.documentElement.clientWidth || 640;
	var height = document.documentElement.clientHeight || 1008;
	if (width / height >= 640 / 1008) {
		pageScale = height / 1008;
	} else {
		pageScale = width / 640;
	}
	//console.log('screen.width', width, 'screen.height', height, 'setScale', pageScale);
	// meta
	var content = 'width=640, initial-scale=' + pageScale + ', maximum-scale=' +
		pageScale + ', user-scalable=no';
	document.getElementById('viewport').setAttribute('content', content);
}
setScale();
