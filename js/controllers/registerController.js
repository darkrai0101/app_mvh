'use strict';

app.controller('registerController', function($scope, $location, $http, sessionService){
  $scope.next = function(){

    var data = sessionService.getUser();
    data.alias = $scope.alias;
    sessionService.setUser(data);
    $http.post('http://dev.app.topica.vn:9000/update-account', data)
    .success(function(respon) {
      console.log('success', respon);
      $location.path('/documents');
    })
    .error(function(err) {
      console.log('error', err);
    });
  }
});

app.controller('registerFormController', function($scope, $location, $http){
  $scope.reg = function(){
      var options = {
      'username' : $scope.username,
      'password' : $scope.password,
      'email' : $scope.email,
      'alias' : $scope.alias
    };

    $http.post('http://dev.app.topica.vn:9000/register-form', options)
    .success(function(data){
      console.log(data);
      $location.path('/login');
    });
  }
})