var appDirective = angular.module('appDirective', [])
appDirective
//负责隐藏tab栏的指令
	.directive('hideTabs', ['$rootScope', '$location', '$timeout', '$ionicSideMenuDelegate', '$window', function ($rootScope, $location, $timeout, $ionicSideMenuDelegate, $window) {
		return {
			restrict: 'AEC',
			link: function (scope, element, attributes) {
				var _hasHide = false;
				scope.$on('$ionicView.enter', function () {
					var _path = $location.path();
					if (_path == "/tab/hujiao" || _path == "/tab/ruku" || _path == "/tab/chuku" || _path == "/tab/kucun" || _path == "/tab/fangxing") {
						element.removeClass('tabs-item-hide');
						$ionicSideMenuDelegate.$getByHandle('left-side-menu').canDragContent(true);
					} else {
						$ionicSideMenuDelegate.$getByHandle('left-side-menu').canDragContent(false);
						$timeout(function () {
							element.addClass('tabs-item-hide');
						}, 0);
					}
				});

				angular.element($window).bind('native.keyboardshow', function () {
//           element.addClass('tabs-item-hide');
					if (element.hasClass('tabs-item-hide')) {
						_hasHide = true;
					} else {
						_hasHide = false;
						$timeout(function () {
							element.addClass('tabs-item-hide');
						}, 0);
					}
					/*          setTimeout(function () {
					 $ionicScrollDelegate.$getByHandle('ruku').resize().then(function (suc) {
					 console.log(suc);
					 }, function (err) {
					 console.log(err);
					 });
					 }, 1000)*/

				});

				angular.element($window).bind('native.keyboardhide', function () {
					if (!_hasHide) {
						element.removeClass('tabs-item-hide');
					}
				});
			}
		}
	}])
	//确保输入框只能输入纯数字, 与ngModel的key相关
	.directive('onlyNumber', [function () {
		return {
			restrict: 'AEC',
			link: function (scope, element, attributes) {
				var regNum = /^[0-9]*$/;
				scope.$watch(attributes.ngModel, function (newVal, oldVal, scope) {
					if (newVal !== null) {
						if (!regNum.test(newVal)) {
							var _arr = attributes.ngModel.split(".");
							scope[_arr[0]][_arr[1]][_arr[2]] = oldVal || "";
						}
					}
				});
			}
		}
	}])

