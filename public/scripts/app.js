var app = angular.module('app', ['ui.router','ui.bootstrap', 'angular-jwt', 'ngToast', 'ngStorage'])

app
.config([ '$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
	$urlRouterProvider.otherwise('/')

	$stateProvider
	.state('user', {
		abstract: true,
		data: {
			requiresLogin: true
		},
		template: '<ui-view/>'
	})
	.state('user.account', {
		url: '/account',
		templateUrl: '/views/account',
		controller: 'AccountCtrl'
	})
	.state('user.docs', {
		url: '/docs'
	})
	.state('home', {
		url: '/',
		templateUrl: '/views/home'
	})
	.state('login', {
		url: '/login',
		params: {
			redirect: null
		},
		templateUrl: '/views/login',
		controller: 'LoginCtrl'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: '/views/signup',
		controller: 'SignupCtrl'
	})
	
	jwtInterceptorProvider.tokenGetter = ['$localStorage', function($localStorage) {
    	return $localStorage.userToken
  	}]	

	$httpProvider.interceptors.push('jwtInterceptor')
	$httpProvider.interceptors.push('authInterceptor')

}])
.run(['$rootScope', '$state', 'jwtHelper', '$localStorage', 
	function($rootScope, $state, jwtHelper, $localStorage) {
	$rootScope.$on('$stateChangeStart', function(e, to) {
		if (to.data && to.data.requiresLogin) {
	  		if (!$localStorage.userToken || jwtHelper.isTokenExpired($localStorage.userToken)) {
	    		e.preventDefault()
	    		$state.go('login', {redirect: to.name})
	  		}
    	}
    	if ($localStorage.userToken && !jwtHelper.isTokenExpired($localStorage.userToken) 
    								&& to.name === 'login') {
    		e.preventDefault()
    		$state.go('home')
    	} 
  	})
}])
.controller('HeaderCtrl', ['$scope', '$state', '$localStorage', 'jwtHelper',
	function ($scope, $state, $localStorage, jwtHelper) {
	
	$scope.$storage = $localStorage

	$scope.logout = function logout () {
		delete $scope.$storage.userToken
		$state.go('home')
	}

	$scope.isCollapsed = true
}])
.controller('LoginCtrl', ['$scope', '$http', 'popup', '$localStorage', 
						  '$state', '$stateParams', 'jwtHelper',
	function LoginCtrl ($scope, $http, popup, $localStorage, 
						$state, $stateParams, jwtHelper) {
	
	$scope.oauth2login = function oauth2login (provider) {
		popup.open({
			url: '/auth/' + provider
		})
	}

	$scope.localLogin = function localLogin () {
		var data = {
			'username': $scope.username,
			'password': $scope.password
		}
		$http.post('/auth/local', data).success(function success (token) {
			
			$localStorage.userToken = token
			$localStorage.name = jwtHelper.decodeToken(token).name

			if ($stateParams.redirect) {
				$state.go($stateParams.redirect)
			} else {
				$state.go('user.docs')
			}
		})
		.error(function error (err) {
			console.error(err)
		})
	}
}])
.controller('SignupCtrl', ['$scope', '$http', '$state', '$localStorage', 'jwtHelper',
	function SignupCtrl ($scope, $http, $state, $localStorage, jwtHelper) {
	$scope.submit = function () {
		var data = {
			'username': $scope.username,
			'password': $scope.password,
			'confirmPassword': $scope.confirmPassword
		}
		$http.post('/signup', data).success(function success (token) {
			$localStorage.userToken = token
			$localStorage.name = jwtHelper.decodeToken(token).name

			$state.go('user.docs')
		})
		.error(function error (err) {
			console.error(err)
		})
	}
}])
.controller('AccountCtrl', ['$scope', '$localStorage', 'jwtHelper', 
	function ($scope, $localStorage, jwtHelper) {

	var userData = jwtHelper.decodeToken($localStorage.userToken) || {}

	$scope.provider = userData.provider || 'Unknown'
	$scope.id 		= userData.id || ''
	$scope.name 	= userData.name || '' 
}])