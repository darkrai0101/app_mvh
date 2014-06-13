'use strict';

app.factory('sessionService', function($rootScope){
	var service =  {
		setUser: function(data){
			sessionStorage.user = angular.toJson(data);
			$rootScope.user = sessionStorage.user;
		},
		getUser: function(){
			$rootScope.user = angular.fromJson(sessionStorage.user);
			return $rootScope.user;
		},
		setToken: function(data){
			sessionStorage.token = angular.toJson(data);
			$rootScope.token = sessionStorage.token;
		},
		getToken: function(){
			$rootScope.token = angular.fromJson(sessionStorage.token);
			return $rootScope.token;
		},
		setFriends: function(data){
			sessionStorage.friends = angular.toJson(data);
			$rootScope.friends = sessionStorage.friends;
		},
		getFriends: function(){
			$rootScope.friends = angular.fromJson(sessionStorage.friends);
			return $rootScope.friends;
		},
		destroy: function(){
			sessionStorage.removeItem('user');
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('friends');
		}
	};

	// $rootScope.$on("setUser", service.setUser);
 //    $rootScope.$on("getUser", service.getUser);
 //    $rootScope.$on("setToken", service.setToken);
 //    $rootScope.$on("getToken", service.getToken);
 //    $rootScope.$on("setFriends", service.setFriends);
 //    $rootScope.$on("getFriends", service.getFriends);
 //    $rootScope.$on("destroy", service.destroy);

	return service;
});