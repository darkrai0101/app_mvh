'use strict';

app.controller('documentsController', function($rootScope,$location, $scope, $http){
	$scope.documents = '';
	$http.get('http://dev.app.topica.vn:9000/documents')
	.success(function(data) {
      console.log('success', data);
      $scope.documents = data;
    })
    .error(function(err) {
      console.log('error', err);
    });
});

app.controller('documentController', function($scope, $http, $routeParams, $sce, readService){
	$scope.title = '';
	$scope.subtitle = '';
	$scope.articleContent = '';
	$scope.documentId = $routeParams.id;

	$http.get('http://dev.app.topica.vn:9000/document/'+$routeParams.id)
	.success(function(data){
		console.log(data);
		  var obj_document = data.document;
		  var obj_sections = data.sections;
		  var obj_category = data.category;

		  if(obj_category.type != 0){
			  $scope.sections = obj_sections;
			  readService.setTableOfContent(obj_sections);
			  $scope.table_content  = true;
		  }else{
		  	  $scope.table_content = false;
		  }

		  $scope.title = obj_document.title;
		  readService.setTitle(obj_document.title);
	      $scope.subtitle = obj_document.subtitle;
	      readService.setSubtitle(obj_document.subtitle);

	      var content = '';
	      if(obj_sections[0]){
		      var paragraphs = obj_sections[0].paragraphs
		      for(var i in paragraphs){
		      	console.log(paragraphs[i]);
		      	var paragraph = paragraphs[i].content;
		      	var html = $(paragraph).attr('name', paragraphs[i]._id);
		      	content += html[0].outerHTML;
		      }
		  }
	      // $scope.articleContent = content;
	      $scope.articleContent = $sce.trustAsHtml(content);
	      if(obj_category.type != 0){
	      	$scope.s_title = obj_sections[0].title;
	      	$scope.s_subtitle = obj_sections[0].subtitle;
	      }

	      if($routeParams.section != ''){
	      	for(var j in obj_sections){
	      		if($routeParams.section == obj_sections[j]._id){
	      			$scope.s_title = obj_sections[j].title;
	      			$scope.s_subtitle = obj_sections[j].subtitle;
	      			var paragraphs = obj_sections[j].paragraphs
				      for(var i in paragraphs){
				      	console.log(paragraphs[i]);
				      	var paragraph = paragraphs[i].content;
				      	var html = $(paragraph).attr('name', paragraphs[i]._id);
				      	content += html[0].outerHTML;
				      }

				      $scope.articleContent = $sce.trustAsHtml(content);
	      		}
	      	}
	      }
	})
	.error(function(err) {
	      console.log('error', err);
	});
});

app.controller('sectionController', function($scope, $http, $routeParams, $sce, readService){
	$scope.title = readService.getTitle();
	$scope.subtitle = readService.getSubtitle();
	$scope.sections = readService.getTableOfContent();
	$scope.table_content  = true;
	$scope.articleContent = '';
	$scope.documentId = $routeParams.id;
	
	$http.get('http://dev.app.topica.vn:9000/section/'+$routeParams.section)
	.success(function(obj_sections){
		console.log(obj_sections);
	    $scope.s_title = obj_sections[0].title;
		$scope.s_subtitle = obj_sections[0].subtitle;
		var paragraphs = obj_sections[0].paragraphs;
		var content = '';
      	for(var i in paragraphs){
	      	console.log(paragraphs[i]);
	      	var paragraph = paragraphs[i].content;
	      	var html = $(paragraph).attr('name', paragraphs[i]._id);
	      	content += html[0].outerHTML;
	    }

	    $scope.articleContent = $sce.trustAsHtml(content);
	})
	.error(function(err) {
	      console.log('error', err);
	});
});

app.controller('preCreateDocumentController', function($rootScope, $scope, $http, $location, documentService, sessionService, sectionService){
	//get thong tin categories
	if(!$rootScope.user) $location.path('/documents');
	$http.get('http://dev.app.topica.vn:9000/list-category')
	.success(function(data){
		$scope.categories = data;
	})

	$scope.next = function(){
		//clear lai sesion document
		documentService.destroy();
		sectionService.destroy();

		var data = {
			'title' : $scope.title_document,
			'subtitle' : $scope.subtitle_document,
			'category' : $scope.category_document,
			'writer' : sessionService.getUser()._id
		};

		$http.post('http://dev.app.topica.vn:9000/document/pre-create', data)
		.success(function(data_respon){
			documentService.setId(data_respon._id);
			documentService.setTitle(data.title);  
			documentService.setSubtitle(data.subtitle);  

			for(var c  in $scope.categories){
				if($scope.categories[c]._id == $scope.category_document){
					documentService.setCategory($scope.categories[c]);
				}
			}
			
			$location.path('/document/create');
		});
	};

	$scope.back = function(){
		$location.path('/documents');
	}
});

app.controller('createDocumentController', function($rootScope, $scope, $http, $location, documentService, sectionService){
	if(!$rootScope.user) $location.path('/documents');
	//tao section moi
	var category = documentService.getCategory();
	console.log(category.type);
	$scope.categoryType = category.type;
	if(category.type == 0){
		$scope.title = documentService.getTitle();
		$scope.subtitle = documentService.getSubtitle();
		$scope._id = documentService.getId();
	}

	$scope.newSection = function(){
		sectionService.destroy();
		$scope.title = '';
		$scope.subtitle = '';
		$scope.content = ''
		// $location.path('/document/create');
	};

	//luu section lai || can xac dinh la section moi hay la noi dung bai luon
	$scope.saveSection = function(){

		var length = $($scope.content).length;
		console.log(length);
		var data = {};
		var paragraphs = [];
		for(var i = 0; i < length; i++){
			console.log($($scope.content)[i].outerHTML);
			paragraphs.push({'content' : $($scope.content)[i].outerHTML});
		}

		console.log(paragraphs);

		if(sectionService.getId()){
			data = {
				'_id' : sectionService.getId(),
				'paragraphs' : paragraphs
			}
		}else{
			data = {
				'documentId' : documentService.getId(),
				'title' : $scope.title,
				'subtitle' : $scope.subtitle,
				'paragraphs' : paragraphs
			}
		}

		$http.post('http://dev.app.topica.vn:9000/save-section', data)
		.success(function(data_respon){
			console.log(data_respon);
			sectionService.setId(data_respon._id);
		});
	};

	//luu paragraph
	$scope.saveParagraph = function(keyCode){     
		if(keyCode === 13) {
			var length = $($scope.content).length;
			var paragraph = $($scope.content)[length - 1].outerHTML;
			var data = {};
			if(sectionService.getId()){
				data = {
					'_id' :  sectionService.getId(),
					'content' : paragraph
				};
				$http.post('http://dev.app.topica.vn:9000/save-paragraph', data)
				.success(function(data){
					console.log(data);
				});
			}else{
				if(category.type == 0){
					data = {
						'documentId' : documentService.getId(),
						'paragraphs' : [{
							'content' : paragraph
						}]
					} 
				}else{
					data = {
						'documentId' : documentService.getId(),
						'title' : $scope.title,
						'subtitle' : $scope.subtitle,
						'paragraphs' : [{
							'content' : paragraph
						}]
					}
				}
				$http.post('http://dev.app.topica.vn:9000/create-section', data)
				.success(function(data){
					console.log(data);
					sectionService.setId(data._id);
				});
			}
		}
	}

	$scope.publish = function(){
		// xu ly j day
		$location.path('/publish-document');
	}

});

app.controller('publishDocumentController', function($rootScope,$location, $scope, $http, documentService){
	if(!$rootScope.user) $location.path('/documents');
	// thoi gian
	// gia
	
});

app.controller('myDocumentController', function($rootScope,$location, $scope, $http, sessionService){
	if(!$rootScope.user) $location.path('/documents');
	console.log('my document');
	var userId = sessionService.getUser()._id;
	$http.get('http://dev.app.topica.vn:9000/my-document/'+userId)
	.success(function(data){
		console.log(data);
	});
});