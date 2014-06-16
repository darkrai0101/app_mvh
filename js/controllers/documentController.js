'use strict';

app.controller('documentsController', function($rootScope,$location, $scope, $http,sessionService){
	$rootScope.user = sessionService.getUser();

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

app.controller('documentController', function($rootScope,$scope, $http, $routeParams, $sce,$compile, readService, sessionService){
	$rootScope.user = sessionService.getUser();

	$scope.title = '';
	$scope.subtitle = '';
	$scope.articleContent = '';
	$scope.documentId = $routeParams.id;
	$scope.comments = [];

	$http.get('http://dev.app.topica.vn:9000/document/'+$routeParams.id)
	.success(function(data){
		// console.log(data);
		  var obj_document = data.document;
		  var obj_sections = data.sections;
		  var obj_category = data.category;
		  var paragraphs = data.paragraphs;
		  readService.setParagraphs(paragraphs);
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
	      if(obj_sections){
		      for(var i in paragraphs){
		      	console.log(paragraphs[i]);
		      	var paragraph = paragraphs[i].content;
		      	var html = $(paragraph).attr('id', paragraphs[i]._id);
		      	html.attr('name', i);
		      	html.attr('ng-mouseover', 'phover($event)');
		      	content += html[0].outerHTML;
		      }
		  }
	      $scope.articleContent = content;
	      // $compile($(content).contents())($scope);
	      // $scope.articleContent = $sce.trustAsHtml(content);
	      if(obj_category.type != 0){
	      	$scope.s_title = obj_sections[0].title;
	      	$scope.s_subtitle = obj_sections[0].subtitle;
	      }

	      if($routeParams.section != ''){
	      	for(var j in obj_sections){
	      		if($routeParams.section == obj_sections[j]._id){
	      			$scope.s_title = obj_sections[j].title;
	      			$scope.s_subtitle = obj_sections[j].subtitle;
	      			
				      for(var i in paragraphs){
				      	// console.log(paragraphs[i]);
				      	var paragraph = paragraphs[i].content;
				      	var html = $(paragraph).attr('id', paragraphs[i]._id);
				      	html.attr('name', i);
		      			html.attr('ng-mouseover', 'phover($event)');
				      	content += html[0].outerHTML;
				      }
				      $scope.articleContent = content;
				      // $compile($(content).contents())($scope);
				      // $scope.articleContent = $sce.trustAsHtml(content);
	      		}
	      	}
	      }
	})
	.error(function(err) {
	      console.log('error', err);
	});

	$scope.phover = function(event){
		var pId = $(event.target).attr('id');
		var pos = $(event.target).position();
		var width = $(event.target).width();
		var name = $(event.target).attr('name');
	
		$('#note-count').attr('name', pId);
		if(readService.getParagraphs()[name].numComment != 0) 
			$('#note-count').html(readService.getParagraphs()[name].numComment);
		else
			$('#note-count').html('+');

		$('.notes-marker').css('display', 'block');
		$('.notes-marker').css('top', pos.top);
		$('.notes-marker').css('left', pos.left + width + 10);
	}

	$scope.openComment = function(){
		var pos = $('.notes-marker').position();
		var pId = $('#note-count').attr('name');

		var getComment = function(pId){
			$('#note-content').attr('name', pId);
			$('#note-content').css('top', pos.top);
			$('#note-content').css('left', pos.left);

			$http.get('http://dev.app.topica.vn:9000/comment/get/'+pId)
			.success(function(data){
				console.log(data);
				$scope.comments = data;
			});
		};

		if($('#note-content').hasClass('active')){
			var note_content_pos = $('#note-content').position();
			if(note_content_pos.top == pos.top){
				console.log('tat');
				$('#note-content').toggleClass('active');
				$('#main-article').toggleClass('trans-left');
			}else{
				console.log('chuyen');
				getComment(pId);
			}
		}else{
			console.log('mo');
			getComment(pId);
			$('#note-content').toggleClass('active');
			$('#main-article').toggleClass('trans-left');
		}
	}

	$scope.saveCmt = function(){
		var options = {
			'userId' : sessionService.getUser()._id,
			'parentId' : $('#note-content').attr('name'),
			'content' : $scope.comment_new,
			'status' : 1
		}
		$http.post('http://dev.app.topica.vn:9000/comment/new', options)
		.success(function(data){
			console.log(data);
			var comment = {
				'_id' : data,
				'alias' : sessionService.getUser().alias,
				'avatar' : sessionService.getUser().avatar,
				'content' : $scope.comment_new,
			}
			$scope.comments.push(comment);
			$scope.comment_new = '';
		});
	}

	$scope.cancelCmt = function(){
		$('#note-content').toggleClass('active');
		$('#main-article').toggleClass('trans-left');
	}
});

app.controller('sectionController', function($rootScope, $scope, $http, $routeParams, $sce, readService){
	$scope.title = readService.getTitle();
	$scope.subtitle = readService.getSubtitle();
	$scope.sections = readService.getTableOfContent();
	$scope.table_content  = true;
	$scope.articleContent = '';
	$scope.documentId = $routeParams.id;
	
	$http.get('http://dev.app.topica.vn:9000/section/'+$routeParams.section)
	.success(function(data){
	    $scope.s_title = data.title;
		$scope.s_subtitle = data.subtitle;
		var paragraphs = data.paragraphs;
		readService.setParagraphs(paragraphs);

		var content = '';
      	for(var i in paragraphs){
	      	var paragraph = paragraphs[i].content;
	      	var html = $(paragraph).attr('id', paragraphs[i]._id);
	      	html.attr('name', i);
  			html.attr('ng-mouseover', 'phover($event)');
	      	content += html[0].outerHTML;
	    }

	    $scope.articleContent = content;
	})
	.error(function(err) {
	      console.log('error', err);
	});

	$scope.phover = function(event){
		console.log($(event.target).attr('id'));
		var pos = $(event.target).position();
		var width = $(event.target).width();
		var name = $(event.target).attr('name');

		if(readService.getParagraphs()[name].numComment != 0) 
			$('#note-count').html(readService.getParagraphs()[name].numComment);

		$('.notes-marker').css('display', 'block');
		$('.notes-marker').css('top', pos.top);
		$('.notes-marker').css('left', pos.left + width + 10);
	};

	$scope.openComment = function(){
		$('#note-content').toggleClass('active');
		$('#main-article').toggleClass('trans-left');
	}
});

app.controller('preCreateDocumentController', function($rootScope, $scope, $http, $location, documentService, sessionService, sectionService){
	//get thong tin categories
	$rootScope.user = sessionService.getUser();
	if(!$rootScope.user) $location.path('/documents');
	$http.get('http://dev.app.topica.vn:9000/list-category')
	.success(function(data){
		$scope.categories = data;
	})

	$scope.next = function(){
		console.log('next');
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
	$rootScope.user = sessionService.getUser();
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

app.controller('publishDocumentController', function($rootScope,$location, $scope, $http, documentService, sessionService){
	$rootScope.user = sessionService.getUser();
	if(!$rootScope.user) $location.path('/documents');
	
	var category_type = documentService.getCategory().type;
	if(category_type == 0){

	}else{

	}

	$scope.back = function(){
		$location.path('/create-document');
	};

	$scope.next = function(){
		$http.post('http://dev.app.topica.vn:9000/publish-document', options)
		.success(function(data){
			console.log(data);
		})
	};
	
});

app.controller('myDocumentController', function($rootScope,$location, $scope, $http, sessionService){
	$rootScope.user = sessionService.getUser();
	if(!$rootScope.user) $location.path('/documents');
	console.log('my document');
	var userId = sessionService.getUser()._id;
	$http.get('http://dev.app.topica.vn:9000/my-document/'+userId)
	.success(function(data){
		console.log(data);
	});
});