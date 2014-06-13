'use strict';
app.factory('loginService', function($http, $location, sessionService){
	return {
		login: function(){
			FB.login(function(response) {
		        if (response.authResponse) {
		            console.log('Welcome!  Fetching your information.... ');
		            //console.log(response); // dump complete info
		            var access_token = response.authResponse.accessToken; //get access token
		            var user_id = response.authResponse.userID; //get FB UID

		            FB.api('/me', function(response) {
		                var user_email = response.email; //get user email
		                // you can store this data into your database     
		                var data = {
		                  'access_token' : access_token,
		                  'email' : user_email
		                };
		                $http.post('http://localhost:9000/authenticate', data).success(function(res){
		                	console.log(res);
		                	var token = res.token;
		                	if(token){
		                		sessionService.setToken(token);
		                		sessionService.setUser(res.user);
		                		sessionService.setFriends(res.friends);
		                		console.log('login');
		                		if(res.isFirst == 1){
		                			$location.path('/register');
		                		}else{
		                			$location.path('/documents');
		                		}
		                	}else{
		                		console.log('fail login');
		                	}
		                });
		            });
		        } else {
		            //user hit cancel button
		            console.log('User cancelled login or did not fully authorize.');
		        }
		    }, {
		        scope: 'publish_stream,email'
		    });
			
		},
		logout:function(){
			sessionService.destroy();
			FB.logout();			
		},
		isLogin:function(){
			if(sessionService.getToken()) return true;
			else return false;
		}
	};
});