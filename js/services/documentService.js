'use strict';

app.factory('documentService', function(){
	var service = {
		setId : function(data){
			sessionStorage.d_id = angular.toJson(data);
		},
		getId : function(){
			return angular.fromJson(sessionStorage.d_id);
		},
		setTitle: function(data){
			sessionStorage.d_title = angular.toJson(data);	
		},
		getTitle : function(){
			return angular.fromJson(sessionStorage.d_title);
		},
		setSubtitle: function(data){
			if(!data) data = '';
			sessionStorage.d_subtitle = angular.toJson(data);	
		},
		getSubtitle : function(){
			return angular.fromJson(sessionStorage.d_subtitle);
		},
		setCategory : function(data){
			sessionStorage.d_category = angular.toJson(data);	
		},
		getCategory :  function(){
			return angular.fromJson(sessionStorage.d_category);
		},
		destroy: function(){
			sessionStorage.removeItem('d_id');
			sessionStorage.removeItem('d_title');
			sessionStorage.removeItem('d_subtitle');
			sessionStorage.removeItem('d_category');
		}
	}
	return service;
});