// var $ = require('../../lib/jquery-3.1.1.min')
var $S = require('../../lib/script.min')
var DateSelector = require('../../lib/multi-picker/DateSelector/DateSelector')
require('../../lib/multi-picker/DateSelector/DateSelector.css')
angular.module('chatCtrl', [])
	.controller('ChatsCtrl', ['$scope', 'Chats', '$state', function ($scope, Chats, $state) {
		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//
		//$scope.$on('$ionicView.enter', function(e) {
		//});
		$S.get('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', function () {
			console.log($('*').length)
		})
		new DateSelector({
			input: 'date-selector-input',
			container: 'targetContainer',
			type: 0,
			param: [1, 1, 1],
			beginTime: [1970, 01, 01],
			endTime: ['nextYear', 01, 01],
			recentTime: [],
			success: function (suc) {
				console.log(suc)
			}
		})
		// console.log($('*').length)
		$scope.chats = Chats.all();
		$scope.remove = function (chat) {
			Chats.remove(chat);
		};
		$scope.go_detail = function (data) {
			$state.go('tab.chat-detail', {
				chatId: data
			})
		}
	}])
	.controller('ChatDetailCtrl', ['$scope', '$stateParams', 'Chats', function ($scope, $stateParams, Chats) {
		$scope.chat = Chats.get($stateParams.chatId);
		$scope.data = {
			test: {
				onlyNumber: 0
			}
		}
	}])
