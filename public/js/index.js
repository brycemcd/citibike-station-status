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

  var setRefreshTime = function() {
    refreshTime = new Date();
    console.log('refreshingtime', refreshTime);
    return refreshTime;
  }

  return {
    allBikeStations : [],
    refreshBikeStations     : function() {
      var url = "/bike_info.json";
      return $http.get(url).then(function(response) {
        stations = response.data.stationBeanList;
        console.log("fetched:: ", stations);
        return stations;
      }, function(response) {
        console.log("wrong: ", response);
      });
    },
    lastRefreshTime : refreshTime,
    refreshTime     : function() { return setRefreshTime() }
  };
});

exampleApp.factory("WatchedBikeStations", function(BikeStationCensus) {

  var watchList = [519, 517, 318, 153, 128, 2004, 348];
  //var watchList = [72, 79, 82, 128, 519, 517];

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

  return {
    watchedIdList : watchList,
    stationCount: function() {
      console.log('stationCount');
      return this.watchedIdList.length;
    },
    watchedStations: [],
    watchedStationsRefresh : function(list, bikeStations) {
      console.log('watchedStationscall', bikeStations);
      var stationObjects = [];
      angular.forEach(list, function(ind, val) {
        var theStation = _.find(bikeStations, function(ele) {
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

exampleApp.controller('bikeFeedCtrl', function($scope,$interval, BikeStationCensus, WatchedBikeStations) {
  $scope.stationFactory = BikeStationCensus;
  $scope.watchedStationsFactory = WatchedBikeStations;

  $scope.addToWatchList = function(id) {
    $scope.watchedStationsFactory.watchedIdList.push(id);
    $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh($scope.watchedStationsFactory.watchedIdList, $scope.stationFactory.allBikeStations);
    //$scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh();
  };

  $scope.refreshStationCensus = function() {
    $scope.stationFactory.refreshBikeStations().then(function(responseObj){
      $scope.lastRefreshTime = new Date();
      $scope.stationFactory.allBikeStations = responseObj;
      $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh($scope.watchedStationsFactory.watchedIdList, $scope.stationFactory.allBikeStations);
    }, function(error) {
      console.log("error: ", error);
    });
  };

  $scope.refreshStationCensus();

  $interval($scope.refreshStationCensus , (1 * 60 * 1000)); // 1 minutes
});

exampleApp.controller('trackingCtrl', function($scope, $interval, BikeStationCensus, WatchedBikeStations) {
  $scope.stationFactory = BikeStationCensus;
  $scope.watchedStationsFactory = WatchedBikeStations;

  $scope.lastRefreshTime = "";

  $scope.setInitialData = function() {
    console.log('initiing');
    $scope.watchedStationsFactory.watchedStations = WatchedBikeStations.watchedStationsRefresh($scope.watchedStationsFactory.watchedIdList, $scope.stationFactory.allBikeStations);
  };
  $scope.setInitialData();

});
exampleApp.controller('mapCtrl', function($scope, $interval, $window, $http) {
  $scope.positionHistory = [];
  $scope.currentPosition = {};
  $scope.lastFailure = {};

  $scope._persistLocation = function() {
    var url = "/collect_location.json";
    var newPositionHistory = [];

    angular.forEach($scope.positionHistory, function(obj, ind) {
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      $http({
        url: url,
        method: "POST",
        data: {'current_location': obj}
       }).then(function(response) {
        console.log("pushed location: ", response.data);
      }, function(response) {
        newPositionHistory.push(obj);
        console.log("fail push location: ", response);
      });
    });
    $scope.positionHistory = newPositionHistory;
  };

  $scope._failPosition = function(position) {
    $scope.lastFailure = position;
    console.log('fail: ', position);
  };

  $scope._successPosition = function(position) {
    // why do I have to build this?!?
    var location = {
      date: new Date(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed
    }
    $scope.positionHistory.push(location);
    console.log("location response: ", location);
    $scope.currentPosition = location;
    $scope._persistLocation();
    //$scope.$apply();
  };

  $scope.currentLocation = function() {
    console.log("fetching location");
    $window.navigator.geolocation.getCurrentPosition($scope._successPosition,
                                                     $scope._failPosition,
                                                     {timeout: 50000});
  };

  $scope.currentLocation();
  $interval($scope.currentLocation , (1 * 60 * 1000)); // 1 minutes

});
