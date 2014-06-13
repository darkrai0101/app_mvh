'use strict';

app.controller('registerController', function($scope, $location, $http, sessionService){
  $scope.next = function(){

    var data = sessionService.getUser();
    data.alias = $scope.alias;
    sessionService.setUser(data);
    $http.post('http://localhost:9000/update-account', data)
    .success(function(respon) {
      console.log('success', respon);
      $location.path('/documents');
    })
    .error(function(err) {
      console.log('error', err);
    });
  }
});