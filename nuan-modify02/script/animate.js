var n = 2;
$(".animate_add").on("mousedown",function(e){
	e.preventDefault();
	e.stopPropagation();
	if ($('#animate>div:eq(0)').hasClass('anim_panels')) {
		$('<div class="anim_'+n+'"></div>').appendTo('.anim_panels');
		n++;
	}else{
		$('<div class="anim_panels"><div class="anim_1"></div></div>').prependTo('#animate');
	}
	
});