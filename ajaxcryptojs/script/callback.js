function dataDeal(returnMsg, category) {
	switch (category) {
		case "music":
			var list = "";
			$.each(returnMsg, function(n, obj) {
				list += "<li>" + obj.value + "</li>";
			});
			$("#abc").append("<ul>" + list + "</ul>");
			break;
		case "book":
			alert("book");
			break;
			// ......
	}
}