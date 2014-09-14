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


exampleApp.factory("BikeStationCensus", function($http, $interval){

  var stations = [];
  var refreshTime = new Date();
  
  var fetch_stations = function() {
      console.log("fetching:");
      $http.get("/station_info.json").success(function(data){
        angular.forEach(data.stationBeanList, function(obj, ind){
          stations.push(obj);
        });
      });
      return stations;
  };

  var refresh_functions = function() {
    this.stations = fetch_stations();
  };

  var setRefreshTime = function() {
    refreshTime = new Date();
    console.log('refreshingtime', refreshTime);
    return refreshTime;
  }


  //$interval(function() { refreshTime = setRefreshTime() }, 1000, 10);
  //

  this.stations = fetch_stations();
  //this.refreshTime = $interval(setRefreshTime, 1000, 10);

  return {
    allBikeStations : this.stations,
    refreshTime     : function() { return setRefreshTime() }
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
        var theStation = _.find(BikeStationCensus.allBikeStations, function(ele) {
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
  $scope.allBikeStations = BikeStationCensus.allBikeStations;
  $scope.watchedBikeStations = WatchedBikeStations.watchedIdList;


  $scope.stationFactory = BikeStationCensus;

  $scope.addToWatchList = function(id) {
    $scope.watchedBikeStations.push(id);
  };
});

exampleApp.controller('trackingCtrl', function($scope, $interval, BikeStationCensus, WatchedBikeStations) {
  $scope.watchedStationIds = WatchedBikeStations.watchedIdList;
  $scope.watchFactory = WatchedBikeStations;

  $scope.stationFactory = BikeStationCensus;


  $scope.foo = function() {
    console.log('foo');
    BikeStationCensus.refreshTime();
    BikeStationCensus.allBikeStations;
  }
  ////$interval(function() { console.log(BikeStationCensus.refreshTime()); }, 1000, 5);
  $interval($scope.foo , 3000, 5);

});
