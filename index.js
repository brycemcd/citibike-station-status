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
  
  var fetchStations = function() {
      console.log("fetching:");
      var url = "http://localhost:4567/bike_info.json";
      $http.get(url).success(function(data){
        console.log('exectionTime: ', data.executionTime);
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

  this.stations = fetchStations();

  return {
    allBikeStations : this.stations,
    refreshBikeStations     : function() { return fetchStations() },
    lastRefreshTime : refreshTime,
    refreshTime     : function() { return setRefreshTime() }
  };
});

exampleApp.factory("WatchedBikeStations", function(BikeStationCensus) {

  var watchList = [72, 79, 82];

  var stationRefresh = function() {
    console.log('watchedStationscall', watchList);
    var stationObjects = [];
    angular.forEach(watchList, function(ind, val) {
      var theStation = _.find(BikeStationCensus.allBikeStations, function(ele) {
        return ele.id == ind
      });

      if(theStation) {
        stationObjects.push(theStation);
      };
    }, stationObjects);
    return stationObjects;
  };

  var tryitout = function() {
    console.log('trying', watchList);
    return stationRefresh();
  };

  return {
    watchedIdList : watchList,
    stationCount: function() {
      console.log('stationCount');
      return this.watchedIdList.length;
    },
    watchedStationsRefresh : function() { return stationRefresh(); },
    watchedStations: tryitout()
  }
});

exampleApp.controller('bikeFeedCtrl', function($scope, BikeStationCensus, WatchedBikeStations) {
  $scope.allBikeStations = BikeStationCensus.allBikeStations;


  $scope.stationFactory = BikeStationCensus;
  $scope.watchedStationsFactory = WatchedBikeStations;

  $scope.addToWatchList = function(id) {
    $scope.watchedStationsFactory.watchedIdList.push(id);
    $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh();
  };
});

exampleApp.controller('trackingCtrl', function($scope, $interval, BikeStationCensus, WatchedBikeStations) {
  $scope.watchedStationIds = WatchedBikeStations.watchedIdList;

  $scope.stationFactory = BikeStationCensus;
  $scope.watchedStationsFactory = WatchedBikeStations;

  $scope.foo = function() {
    $scope.stationFactory.lastRefreshTime = BikeStationCensus.refreshTime();
    $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh();
    $scope.stationFactory.allBikeStations = BikeStationCensus.refreshBikeStations();
  }
  $interval($scope.foo , (1 * 60 * 1000), 5); // 3 minutes

  $scope.setInitialData = function() {
    console.log('initiing');
    $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh();
  };
  $scope.setInitialData();

});
