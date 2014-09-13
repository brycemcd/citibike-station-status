var exampleApp = angular.module('exampleApp', []);

exampleApp.factory("CartItemsFactory", function(){
  var cartItems = [
    {name: 'Default Product', price: 12.99}
  ];


  return {
    cartItems: cartItems,
    // TODO: move this up
    cartTotal: function() {
      var total = 0.00;
      angular.forEach(this.cartItems, function(obj, ind) {
        total = total += obj.price
      }, total);
      return total;
    },

    cartItemsCount: function() {
      return this.cartItems.length;
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
  $scope.cart = CartItemsFactory;

  $scope.addToCart = function(ind) {
    console.log($scope.allProducts[ind]);
    $scope.cartItems.push($scope.allProducts[ind]);
    console.log('cart total: ', $scope.cart.cartTotal() );
  };
});

exampleApp.controller('cartCtrl', function($scope, CartItemsFactory) {
  $scope.cartItems = CartItemsFactory.cartItems;
  $scope.cart = CartItemsFactory;
});


exampleApp.factory("BikeStationCensus", function($http){

  return {
    allBikeStations : function(){
      var stations = {};
      $http.get("http://www.citibikenyc.com/stations/json").success(function(data){
        console.log(data);
        stations = data;
      });
      return stations;
      return {
            "executionTime": "2014-09-13 01:41:01 PM",
            "stationBeanList": [
                  {
              "id": 72,
              "stationName": "W 52 St & 11 Ave",
              "availableDocks": 21,
              "totalDocks": 39,
              "latitude": 40.76727216,
              "longitude": -73.99392888,
              "statusValue": "In Service",
              "statusKey": 1,
              "availableBikes": 18,
              "stAddress1": "W 52 St & 11 Ave",
              "stAddress2": "",
              "city": "",
              "postalCode": "",
              "location": "",
              "altitude": "",
              "testStation": false,
              "lastCommunicationTime": null,
              "landMark": ""
            },
            {
              "id": 79,
              "stationName": "Franklin St & W Broadway",
              "availableDocks": 29,
              "totalDocks": 33,
              "latitude": 40.71911552,
              "longitude": -74.00666661,
              "statusValue": "In Service",
              "statusKey": 1,
              "availableBikes": 4,
              "stAddress1": "Franklin St & W Broadway",
              "stAddress2": "",
              "city": "",
              "postalCode": "",
              "location": "",
              "altitude": "",
              "testStation": false,
              "lastCommunicationTime": null,
              "landMark": ""
            }]
      }
    }
  };
});

exampleApp.factory("WatchedBikeStations", function(BikeStationCensus) {

  var watchList = [72];

  return {
    watchedIdList : watchList,
    stationCount: function() {
      return this.watchedIdList.length;
    },
    watchedStations : function() {
      var stationObjects = [];
      angular.forEach(this.watchedIdList, function(ind, val) {
        var theStation = _.find(BikeStationCensus.allBikeStations().stationBeanList, function(ele) {
          return ele.id == ind
        });

        if(theStation) {
          stationObjects.push(theStation);
        };
      }, stationObjects);
      return stationObjects;
    }
  }
});

exampleApp.controller('bikeFeedCtrl', function($scope, BikeStationCensus, WatchedBikeStations) {
  $scope.allBikeStations = BikeStationCensus.allBikeStations();
  $scope.watchedBikeStations = WatchedBikeStations.watchedIdList;

  $scope.addToWatchList = function(id) {
    $scope.watchedBikeStations.push(id);
  };
});

exampleApp.controller('trackingCtrl', function($scope, BikeStationCensus, WatchedBikeStations) {
  $scope.watchedStationIds = WatchedBikeStations.watchedIdList;
  $scope.watchFactory = WatchedBikeStations;
  $scope.lastUpdated = BikeStationCensus.allBikeStations().executionTime;

});
