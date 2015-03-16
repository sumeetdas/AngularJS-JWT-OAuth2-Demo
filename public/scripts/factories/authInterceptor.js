angular.module('app')
.factory('authInterceptor', ['jwtHelper', '$q', '$localStorage', 
	function (jwtHelper, $q, $localStorage) {
	
	return {
		// Add authorization token to headers
		request: function (config) {
			config.headers = config.headers || {}
			if ($localStorage.userToken) {
				config.headers.Authorization = 'Bearer ' + $localStorage.userToken
			}
			return config
		},
		// Intercept 401s and redirect you to login
		responseError: function(response) {

			if(response.status === 401) {
				// remove any stale tokens
				delete $localStorage.userToken
				return $q.reject(response)
			}
			else {
				return $q.reject(response)
			}
		}
	}
}])