'use strict';

app.controller('registerController',function($scope, $http){
	var data = {
		'alias' : $scope.alias
	};

	$http.post('http://localhost:9000/update-account', data)
	.success(function(data) {
      console.log('success', data);
      $scope.documents = data;
    })
    .error(function(err) {
      console.log('error', err);
    });
});