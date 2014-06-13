'use strict';

app.controller('collectionController', function($scope, $http, sessionService){
	var userId = sessionService.getUser()._id;
	$http.get('http://localhost:9000/collection/'+userId)
	.success(function(data){
		console.log(data);
	});

	$scope.createCollection = function(){

	};

	$scope.updateCollection = function(){

	};

	$scope.deleteCollection = function(){

	};

	$scope.insertDocument = function(){

	};

	$scope.deleteDocument = function(){
		
	}
});