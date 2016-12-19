// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
require('../lib/ionic/js/ionic.bundle.min')
require('./services')
require('../lib/w5c-validator/w5cValidator.min')
require('../lib/oclazyload/dist/ocLazyLoad.min')
require('./directive')
require('./filter')

var app = angular.module('demo', ['ionic', 'w5c.validator', 'oc.lazyLoad', 'appService', 'appDirective', 'appFilter']);
app.run(['$ionicPlatform', '$rootScope', '$ionicHistory', function ($ionicPlatform, $rootScope, $ionicHistory) {
  var a = 1;
	$ionicPlatform.ready(function () {
		$rootScope.backHistory = function () {
			$ionicHistory.goBack();
		}
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/dash');
	}]);
module.exports = {
	'app': app
}

if (module.hot) {
  module.hot.accept();
}