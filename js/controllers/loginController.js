'use strict';

app.controller('loginController',function($scope, $http, $location, loginService, sessionService){
	$scope.message = "login page";
	$scope.fbLogin = function(){
		loginService.login();
	};

	$scope.login = function(){
		var options = {
			'username' : $scope.username,
			'password' : $scope.password
		}

		$http.post('http://dev.app.topica.vn:9000/login', options)
		.success(function(data){
			console.log(data);
			var token = data.token;
        	if(token){
        		sessionService.setToken(token);
        		sessionService.setUser(data.user);
        		sessionService.setFriends(data.friends);
        		console.log('login');
        		
        		$location.path('/documents');
        	}else{
        		console.log('fail login');
        	}
		});
	}
});