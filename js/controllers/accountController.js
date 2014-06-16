'use strict';

app.controller('accountController', function($rootScope, $scope, $http, $location, sessionService){
	$rootScope.user = sessionService.getUser();

	$scope.avatar = $rootScope.user.avatar;
	$scope.alias = $rootScope.user.alias;
	$scope.firstname = $rootScope.user.name.firstname;
	$scope.lastname = $rootScope.user.name.lastname;
	$scope.email = $rootScope.user.email;
	$scope.address = $rootScope.user.address;
	$scope.phone = $rootScope.user.phone;

	$scope.update = function(){
		var options = {
			'_id' : sessionService.getUser()._id,
			'avatar' : $scope.avatar,
			'alias' : $scope.alias,
			'email' : $scope.email,
			'address' : $scope.address,
			'phone' : $scope.phone,
			'name' : {
				'firstname' : $scope.firstname,
				'lastname' : $scope.lastname,
			}
		};

		$http.post('http://dev.app.topica.vn:9000/update-account', options)
		.success(function(data){
			console.log(data);
		});
	}

	$scope.changePassword = function(){

	}
});