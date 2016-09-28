function dataDeal(returnMsg, category) {
	switch (category) {
		case "picCut":
			/*begin*/
			$('#drawArea>div[data-cur="1"]>.pic>img').attr("src",returnMsg);
			/*end*/
			break;
	}
}