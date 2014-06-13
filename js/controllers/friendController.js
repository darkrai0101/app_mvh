'use strict';

app.controller('friendController', function($rootScope,$location, $scope, $http, sessionService){
	if(!$rootScope.user) $location.path('/documents');
    $scope.friends = sessionService.getFriends();
    console.log($scope.friends);
	$scope.search = function(){
		console.log($scope.key);
		var userId = sessionService.getUser()._id;
		$http.get('http://dev.app.topica.vn:9000/friend/'+userId+'/s/'+$scope.key)
		.success(function(data_respon){
			// console.log(data_respon);
			var list_friends = sessionService.getFriends();
			var data_search = [];
			for(var i in data_respon){
				var obj_f = {};
				obj_f.friendId = data_respon[i]._id;
				obj_f.alias = data_respon[i].alias;
				obj_f.name = data_respon[i].name;
				obj_f.status = 99;
				
				for(var j in list_friends){
					if(list_friends[j]){
						if(data_respon[i]._id == list_friends[j].friendId){
							obj_f.status = list_friends[j].status;
						}
					}
				}
				data_search.push(obj_f);
			}

			$scope.friends = data_search;
			$scope.data_search = data_search;
		});
	};

	$scope.add = function(id, type){
		var userId = sessionService.getUser()._id;
		$http.get('http://dev.app.topica.vn:9000/friend/'+userId+'/add/'+id+'/'+type)
		.success(function(data_respon){
			var list_friends = sessionService.getFriends();
			var friend = {};
			console.log($scope.data_search);
			for(var i in $scope.data_search){
				if($scope.data_search[i].friendId = id){
					friend.status = 0;
					friend.friendId = $scope.data_search[i].friendId;
					friend.alias = $scope.data_search[i].alias;
					friend.name = $scope.data_search[i].name;

					list_friends.push(friend);
				}
			}

			sessionService.setFriends(list_friends);
			$scope.friends = list_friends;
		});
	};

	$scope.delete = function(id){
		var userId = sessionService.getUser()._id;
		$http.get('http://dev.app.topica.vn:9000/friend/'+userId+'/delete/'+id)
		.success(function(data_respon){
			var list_friends = sessionService.getFriends();
			for(var i in list_friends){
				if(list_friends[i]){
					if(list_friends[i].friendId = id){
						list_friends.splice(i, 1);
					}
				}
			}
			sessionService.setFriends(list_friends);
			$scope.friends = list_friends;
		});
	};

	$scope.accept = function(id){
		var userId = sessionService.getUser()._id;
		$http.get('http://dev.app.topica.vn:9000/friend/'+userId+'/accept/'+id)
		.success(function(data_respon){
			var list_friends = sessionService.getFriends();
			for(var i in list_friends){
				if(list_friends[i].friendId = id){
					list_friends[i].status = 2;
				}
			}
			sessionService.setFriends(list_friends);
			$scope.friends = list_friends;
		});
	}; 

	$scope.change = function(id, type){
		var userId = sessionService.getUser()._id;
		$http.get('http://dev.app.topica.vn:9000/friend/'+userId+'/change/'+id)
		.success(function(data_respon){
			
		});
	};
});