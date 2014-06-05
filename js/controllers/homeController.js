'use strict';

angular.module('mvh',['ngRoute'])
.controller('homeController', function($scope){
	$scope.message = "home page";
});