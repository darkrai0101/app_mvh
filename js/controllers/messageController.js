'use strict';

app.controller('messageController', function($scope, socket, $routeParams){
  $scope.userId = $routeParams.userId;
  $scope.messages = [];
  $scope.send = function(){
    // params = {userRecive : userRecive, message : txt, messageId : messageId};
    var params = {
      'from' : $scope.userId, 
      'to' : [$scope.userRecive],
      'message' : $scope.txt,
      'messageId' : $scope.messageId
    };
    console.log(params);
    $scope.messages.push($scope.txt);
    socket.emit('send:message', params);
  };

  socket.on('messageId', function(data){
    console.log(data);
    $scope.messageId = data;

    socket.on($scope.messageId, function(data){
      console.log(data);
      $scope.messages.push(data);
    });
  });

  socket.on($scope.userId, function(data){
    $scope.messageId = data.messageId;

    socket.on($scope.messageId, function(data){
      console.log(data);
      $scope.messages.push(data);
    });

    $scope.messages.push(data.message);
  });

  $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
        // or something like
        // socket.removeListener(this);
  });
});