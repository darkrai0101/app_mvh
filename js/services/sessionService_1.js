'use strict';

app.factory('sessionService', function($http, $cookieStore, $rootScope){
	return{
		set:function(key, value){
			$cookieStore.put(key, value);
			$rootScope.user = $cookieStore.get(key);
		},
		get:function(key){
			$rootScope.user = $cookieStore.get(key);
			return $rootScope.user;
		},
		destroy:function(key){
			$cookieStore.remove(key);
			$rootScope.user = $cookieStore.get(key);
		}
	};
});