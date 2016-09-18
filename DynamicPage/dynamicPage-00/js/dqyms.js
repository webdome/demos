	$(document).ready(function(){
		var prs = function(obj){
			for(var i=0;i<obj.length;i++){
                var s = obj[i].prevAll().length;
			}
			return s+1;
		}
		prs();
	})
