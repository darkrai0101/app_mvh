'use strict';

app.factory('sectionService', function(){
	var service = {
		setId : function(data){
			sessionStorage.s_id = angular.toJson(data);
		},
		getId : function(){
			return angular.fromJson(sessionStorage.s_id);
		},
		setTitle: function(data){
			sessionStorage.s_title = angular.toJson(data);	
		},
		getTitle : function(){
			return angular.fromJson(sessionStorage.s_title);
		},
		setSubtitle: function(data){
			if(!data) data = '';
			sessionStorage.s_subtitle = angular.toJson(data);	
		},
		getSubtitle : function(){
			return angular.fromJson(sessionStorage.s_subtitle);
		},
		destroy: function(){
			sessionStorage.removeItem('s_id');
			sessionStorage.removeItem('s_title');
			sessionStorage.removeItem('s_subtitle');
		}
	}
	return service;
})