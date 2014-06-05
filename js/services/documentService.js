'use strict';

app.factory('documentService', function(){
	var service = {
		model : {},
		save : function(data){
			service.model = data;
		},
		get : function(){
			return service.model;
		}
	}
	return service;
})