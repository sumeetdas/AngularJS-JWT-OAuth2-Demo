angular.module('app')
.factory('popup', ['$q', '$interval', '$window', '$localStorage', '$state', '$stateParams', 'jwtHelper',
	function ($q, $interval, $window, $localStorage, $state, $stateParams, jwtHelper) {
		
		var popup = {}, popupWindow = null, polling = null

		popup.popupWindow = popupWindow

		popup.open = function(options) {

			var width 	= options.width || 500,
				height 	= options.height || 500

			options.windowOptions = options.windowOptions || 'width=500,height=500' + ',top=' + $window.screenY + (($window.outerHeight - height) / 2.5) + ',left=' + $window.screenX + (($window.outerWidth - width) / 2)

			popupWindow = window.open(options.url, '_blank', options.windowOptions)

          	if (popupWindow && popupWindow.focus) {
            	popupWindow.focus()

            	polling = $interval(function() {
	          		try {
	            		if (popupWindow.document.domain === document.domain && popupWindow.document.URL.indexOf('callback') !== -1) {

							$localStorage.userToken = popupWindow.document.getElementsByTagName('body')[0].innerHTML
	            			$localStorage.name = jwtHelper.decodeToken($localStorage.userToken).name

	            			if ($stateParams.redirect) {
	                			$state.go($stateParams.redirect)
	                		} else{
	                			$state.go('user.docs')
	                		}

	            			popupWindow.close()
	                		$interval.cancel(polling)
	              		}
	            	} catch (error) {}

	            	if (!popupWindow) {
	            		$interval.cancel(polling)
	              		// deferred.reject({ data: 'Provider Popup Blocked' })
	            	} else if (popupWindow.closed) {
	              		$interval.cancel(polling)
	              		// deferred.reject({ data: 'Authorization Failed' })
	            	}
	        	}, 350)
          	}
       	
        }

		return popup
}])