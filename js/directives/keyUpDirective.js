angular.module('mvh').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                var key = event.which||event.keyCode;  
                if(key === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });
                    //event.preventDefault();
                }

            });
        };
});