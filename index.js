var exampleApp = angular.module('exampleApp', []);

exampleApp.factory("CartItemsFactory", function(){
  var cartItems = [
    {name: 'Default Product', price: 12.99}
  ];



  return {
    cartItems: cartItems,
    cartTotal: function() {
      var total = 0.00;
      angular.forEach(this.cartItems, function(obj, ind) {
        total = total += obj.price
      }, total);
      return total;
    }
  };

});

exampleApp.factory("AvailableProductsFactory", function(){
  var allProducts = [
    {name: 'Product 1', price: 12.99},
    {name: 'Product 2', price: 22.99},
    {name: 'Product 3', price: 32.99},
    {name: 'Product 4', price: 42.99}
  ];

  return {
    allProducts: allProducts
  };

});

exampleApp.controller('productCtrl', function($scope, CartItemsFactory, AvailableProductsFactory) {
  $scope.cartItems = CartItemsFactory.cartItems;
  $scope.cartTotal = CartItemsFactory.cartTotal;
  $scope.allProducts = AvailableProductsFactory.allProducts;

  $scope.addToCart = function(ind) {
    console.log($scope.allProducts[ind]);
    $scope.cartItems.push($scope.allProducts[ind]);
    console.log('cart total: ', $scope.cartTotal() );
  };
});

exampleApp.controller('cartCtrl', function($scope, CartItemsFactory) {
  $scope.cartItems = CartItemsFactory.cartItems;
});

