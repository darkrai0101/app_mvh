'use strict';

app.factory('readService', function(){
	var service = {
		setId : function(data){
			sessionStorage.r_id = angular.toJson(data);
		},
		getId : function(){
			return angular.fromJson(sessionStorage.r_id);
		},
		setTitle: function(data){
			sessionStorage.r_title = angular.toJson(data);	
		},
		getTitle : function(){
			return angular.fromJson(sessionStorage.r_title);
		},
		setSubtitle: function(data){
			if(!data) data = '';
			sessionStorage.r_subtitle = angular.toJson(data);	
		},
		getSubtitle : function(){
			return angular.fromJson(sessionStorage.r_subtitle);
		},
		setTableOfContent : function(data){
			sessionStorage.r_tableofcontent = angular.toJson(data);	
		},
		getTableOfContent :  function(){
			return angular.fromJson(sessionStorage.r_tableofcontent);
		},
		setParagraphs : function(data){
			sessionStorage.r_paragraphs = angular.toJson(data);	
		},
		getParagraphs : function(){
			return angular.fromJson(sessionStorage.r_paragraphs);
		},
		destroy: function(){
			sessionStorage.removeItem('r_id');
			sessionStorage.removeItem('r_title');
			sessionStorage.removeItem('r_subtitle');
			sessionStorage.removeItem('r_tableofcontent');
		}
	}
	return service;
});