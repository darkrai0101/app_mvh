'use strict';
angular.module('configContenteditable', []).
directive('contenteditable', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function () {
                scope.$apply(readViewText);
            });

            // No need to initialize, AngularJS will initialize the text based on ng-model attribute

            // Write data to the model
            function readViewText() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});


var app = angular.module('mvh'
  ,['ngRoute','ngCookies','btford.socket-io','snap','ngSanitize','configContenteditable','angular-medium-editor']
  ,function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data){
      if (data === undefined) {
          return data;
      }
      return $.param(data);
    }
});

app.config(function(snapRemoteProvider) {
  snapRemoteProvider.globalOptions = {
        disable: 'right',
        touchToDrag: false
      }
});

app.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'views/home.html',
		controller: 'mainController'
	})
	.when('/login',{
		templateUrl: 'views/login.html',
		controller: 'loginController'
	})
  .when('/register', {
    templateUrl: 'views/register.html',
    controller: 'registerController'
  })
  .when('/message/:userId', {
    templateUrl: 'views/message.html',
    controller: 'messageController'
  })
  .when('/documents', {
    templateUrl: 'views/documents.html',
    controller: 'documentsController'
  })
  .when('/document/id/:id', {
    templateUrl: 'views/document.html',
    controller: 'documentController'
  })
  .when('/document/:id/section/:section', {
    templateUrl : 'views/document.html',
    controller: 'sectionController'
  })
  .when('/document/pre-create', {
    templateUrl : 'views/pre-create-document.html',
    controller : 'preCreateDocumentController'
  })
  .when('/document/create', {
    templateUrl : 'views/create-document.html',
    controller : 'createDocumentController'
  })
  .when('/publish-document', {
    templateUrl : 'views/publis-document.html',
    controller : 'publishDocumentController'
  })
  .when('/my-document', {
    templateUrl : 'views/my-document',
    controller: 'myDocumentController'
  })
  .when('/collection', {
    templateUrl : 'views/collection.html',
    controller : 'collectionController'
  })
	.otherwise({
        redirectTo: '/'
    })
})
.constant('Strings', {
  CONNECTION_ERROR: ['Hệ thống đang bận, hoặc kết nối internet của bạn có vấn đề.','Xin hãy kiểm tra và thử lại sau ít phút.']
})
.run(function($rootScope, $templateCache, loginService) {
  $templateCache.removeAll();
  $rootScope.logout = function(){
    loginService.logout();
  }
});

app.controller('mainController', function($rootScope, $scope, socket, snapRemote){
  snapRemote.getSnapper().then(function(snapper){
    snapper.on('open',function(){
      $rootScope.disableBoxControl = true;
      if(!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });

    snapper.on('close', function(){
      $rootScope.disableBoxControl = false;
      if(!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });
  });

  socket.on('connected', function(data){
    $scope.connect = data;
  });
  // $scope.$on('$destroy', function (event) {
  //   socket.removeAllListeners();
  //   // or something like
  //   // socket.removeListener(this);
  // });  
});
