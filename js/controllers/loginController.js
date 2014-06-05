'use strict';

app.controller('loginController',function($scope, $http, $location, loginService){
	$scope.message = "login page";
	$scope.fbLogin = function(){
		loginService.login();
	};
});