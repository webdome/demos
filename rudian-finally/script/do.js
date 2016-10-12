$(function() {
	if (document.getElementById("aboutus")) {
		getData({}, "companyService", "company");
		getData({
			type: "2"
		}, "bannerService", "companybanner");
	}
	if (document.getElementById("news")) {
		getData({
			pageNo: "1",
			pageSize: "12"
		}, "newsService", "news");
		getData({}, "pageCount", "pagecount");
		getData({
			type: "3"
		}, "bannerService", "newsbanner");
	}

	if (document.getElementById("joinus")) {
		getData({
			pageNo: "1",
			pageSize: "7"
		}, "jobsServices", "jobs");
		getData({
			type: "4"
		}, "bannerService", "jobbanner");
	}
	if (document.getElementById("caseshare")) {
		getData({
			pageNo: "1",
			pageSize: "6"
		}, "projectsServices", "caseshare");
		getData({}, "projectPageCount", "projectpagecount");
	}
	//主页内容
	if (document.getElementById("index")) {
		getData({}, "companyService", "home1");
		getData({
			pageNo: "1",
			pageSize: "12"
		}, "projectsServices", "home2");
		getData({
			pageNo: "1",
			pageSize: "3"
		}, "newsService", "home3");
		getData({
			pageNo: "1",
			pageSize: "3"
		}, "jobsServices", "home5");
	}
});