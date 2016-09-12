/*wrapping your javascript in a closure is a good habit*/
(function() {
	var app = angular.module("store", []);
	/*notice that controller is attached to our app*/
	/*when our StoreController is called,the code in anonymous function will be executed*/
	app.controller('StoreController', function() {
		this.products = gems;
	});
	/*set this gem equal to a property of this controller (product)*/
	var gems = [{
			name: "Dodecahedron",
			price: "2.92",
			description: "....",
			canPurchase: false,
			soldOut: false,
		}, {
			name: "Pentagonal Gem",
			price: "5.95",
			description: "....",
			canPurchase: true,
			soldOut: false,
		},

	]
})();