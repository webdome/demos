/*wrapping your javascript in a closure is a good habit*/
(function() {
	var app = angular.module("store", []);
	/*notice that controller is attached to our app*/
	/*when our StoreController is called,the code in anonymous function will be executed*/
	app.controller('StoreController', function() {
		this.products = gems;
	});
	app.controller('PanelController', function(){
		this.tab = 1;
		this.selectTab = function(setTab){
			this.tab = setTab;
		};
		this.isSelected = function(checkTab){
			return this.tab === checkTab;
		}

	});
	/*set this gem equal to a property of this controller (product)*/
	var gems = [{
			name: "Dodecahedron",
			price: "2.92",
			description: "this is a description of Dodecahedron",
			canPurchase: false,
			soldOut: false,
			images: [{
				full: 'images/p.png',
				thumb: 'images/p.png',
			}],
		}, {
			name: "Pentagonal Gem",
			price: "5.95",
			description: "this is a description of Pentagonal Gem",
			canPurchase: true,
			soldOut: false,
			images: [{
				full: 'images/d.png',
				thumb: 'images/d.png',
			}],
		},

	]
})();