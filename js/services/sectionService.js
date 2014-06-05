'use strict';

app.factory('sectionService', function(){
	var service = {
		model : [],
		save: function(obj){
			service.model.push(obj);
		},
		get: function(){
			return service.model;
		}
	};

	return service;
})