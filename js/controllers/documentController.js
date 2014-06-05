'use strict';

app.controller('documentsController', function($scope, $http){
	$scope.documents = '';
	$http.get('http://localhost:9000/documents')
	.success(function(data) {
      console.log('success', data);
      $scope.documents = data;
    })
    .error(function(err) {
      console.log('error', err);
    });
});

app.controller('documentController', function($scope, $http, $routeParams, $sce){
	$scope.title = '';
	$scope.subtitle = '';
	$scope.articleContent = '';

	$http.get('http://localhost:9000/document/'+$routeParams.id)
	.success(function(data){
	      console.log('success', data);
	      $scope.title = data.title;
	      $scope.subtitle = data.subtitle;
	      $scope.articleContent = $sce.trustAsHtml(data.content);
	})
	.error(function(err) {
	      console.log('error', err);
	});
});

app.controller('sectionController', function($scope, $http, $routeParams, $sce){
	$scope.title = '';
	$scope.subtitle = '';
	$scope.articleContent = '';
	
	$http.get('http://localhost:9000/section/'+$routeParams.section)
	.success(function(data){
	      console.log('success', data);
	      $scope.title = data.title;
	      $scope.subtitle = data.subtitle;
	      $scope.articleContent = $sce.trustAsHtml(data.content);
	})
	.error(function(err) {
	      console.log('error', err);
	});
});

app.controller('preCreateDocumentController', function($scope, $http, documentService){
	$http.post('http://localhost:9000/', data)
	.success(function(data){

	})
	.error(function(err){

	});
});

app.controller('createDocumentController', function($scope, $http, $location, documentService){
	//tao section moi
	$scope.newSection = function(){

	};

	//luu section lai || can xac dinh la section moi hay la noi dung bai luon
	$scope.saveSection = function(){
		$http.post('http://localhost:9000/', data)
		.success(function(data){

		})
		.error(function(err){

		});
	};

	//luu paragraph
	$scope.saveParagraph = function(){
		$http.post('http://localhost:9000/', data)
		.success(function(data){

		})
		.error(function(err){

		});
	}

	$scope.publish = function(){
		// xu ly j day
		$location.path('/publish-document');
	}

});

app.controller('publishDocumentController', function($scope, $http, documentService){
	// thoi gian
	// gia

	// xu ly kieu fu j day
});

app.controller('myDocumentController', function($scope, $http){
	$http.get('http://localhost:9000/', data)
	.success(function(data){

	})
	.error(function(err){

	});
});