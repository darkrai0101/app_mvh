'use strict';

app.factory('userService', function($rootScope){
	var service =  {
		model : {
			name : '',
			email : '',
			alias: '',
			friends : [{}],
			birthday: '',
			address: '',
			status: '',
			payment: '',
			token : ''
		},
		set: function(){
			sessionStorage.user = angular.toJson(service.model)
		},
		get: function(){
			return angular.fromJson(sessionStorage.user);
		},
		destroy: function(){
			sessionStorage.removeItem('user');
		}
	};

	$rootScope.$on("setUser", service.set);
    $rootScope.$on("getUser", service.get);
    $rootScope.$on("destroyUser", service.destroy);

	return service;
});