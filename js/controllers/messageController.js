'use strict';

app.controller('messageController', function($rootScope, $location, $scope, $http, socket, $routeParams, sessionService){
  if(!$rootScope.user) $location.path('/documents');
  $scope.userId = sessionService.getUser()._id;
  $scope.friends = sessionService.getFriends();
  $scope.messages = [];

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
  
  $scope.createChat = function(event, id, alias){
      console.log('cr chat');
      $scope.userRecive = id;
      $("li.friend").removeClass("active");
      $(event.target).addClass('active');
  };

  $scope.send = function(){
    // params = {userRecive : userRecive, message : txt, messageId : messageId};
    var params = {
      'from' : $scope.userId, 
      'to' : [$scope.userRecive],
      'message' : $scope.txt,
      'messageId' : $scope.messageId,
      'alias' : sessionService.getUser().alias
    };
    var message = {
      'user' : 'Tôi',
      'message' : $scope.txt
    }
    $scope.messages.push(message);
    socket.emit('send:message', params);
    $scope.txt = '';
  };

  socket.on('messageId', function(data){
    console.log(data);
    $scope.messageId = data;

    socket.on($scope.messageId, function(data){
      console.log(data);
      var message = {
        'user' : data.alias,
        'message' : data.message
      }
      $scope.messages.push(message);
    });
  });

  socket.on($scope.userId, function(data){
    $scope.messageId = data.messageId;

    socket.on($scope.messageId, function(data){
      console.log(data);
      var message = {
        'user' : data.alias,
        'message' : data.message
      }
      $scope.messages.push(message);
    });

    var message = {
        'user' : data.alias,
        'message' : data.message
      }
      $scope.messages.push(message);
  });

  $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
        // or something like
        // socket.removeListener(this);
  });
});