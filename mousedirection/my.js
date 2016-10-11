/*
*使用说明：
*		$(".a").show($(".b"))
*		a是展示层，b是遮罩层
*		b在a的内部
*/


		$(".outer").each(function(i){
			$(this).show($(".inner").eq(i));
		});