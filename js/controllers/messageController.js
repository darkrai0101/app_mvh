'use strict';

app.controller('messageController', function($rootScope, $location, $scope, $http, socket, $routeParams, sessionService){
  if(!$rootScope.user) $location.path('/documents');
  $scope.userId = sessionService.getUser()._id;
  $scope.friends = sessionService.getFriends();
  $scope.messages = [];

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