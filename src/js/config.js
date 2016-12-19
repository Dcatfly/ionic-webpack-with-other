require('./controllers/account_ctrl')
require('./controllers/dash_ctrl')
var appConfig = require('./app').app
appConfig
	.config(['$httpProvider', '$ionicConfigProvider', 'w5cValidatorProvider', function ($httpProvider, $ionicConfigProvider, w5cValidatorProvider) {
		//禁用ios中右划返回
		$ionicConfigProvider.views.swipeBackEnabled(false);
//    $ionicConfigProvider.views.transition('ios');

		//最多缓存5个页面
		$ionicConfigProvider.views.maxCache(5);
		//令Android和苹果的tab栏均在底下
		$ionicConfigProvider.tabs.position('bottom');

		//配置请求服务基本参数
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.transformRequest = function (obj) {
			var str = [];
			for (var p in obj) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
			return str.join("&");
		};
		// w5cValidatorProvider全局配置
		w5cValidatorProvider.config({
			blurTrig: false,
			showError: function (elem, errorMessages) {
				var $elem = angular.element(elem);
				$elem.parent().addClass("my-has-error");
				//此处需重写处理函数
				console.log(errorMessages[0]);
			},
			removeError: function (elem) {

				var $elem = angular.element(elem);
				$elem.parent().removeClass("my-has-error");
			}

		});
		w5cValidatorProvider.setRules({

			select: {
				required: "选择项不能为“请选择”。"
			},
			username: {
				required: "输入的用户名不能为空",
				pattern: "用户名必须输入字母、数字、下划线,以字母开头",
				w5cuniquecheck: "输入用户名已经存在，请重新输入"
			},
			oldPassword: {
				required: "旧密码不能为空"
			},
			password: {
				required: "密码不能为空",
				minlength: "密码长度不能小于{minlength}",
				maxlength: "密码长度不能大于{maxlength}"
			},
			repeatPassword: {
				required: "重复密码不能为空",
				repeat: "两次密码输入不一致"
			},
			customizer: {
				customizer: "自定义验证数字必须大于上面的数字"
			},
			floorEnd: {
				customizer: "结束楼层需大于开始楼层"
			},
			roomEnd: {
				customizer: "结束房间号需大于开始房间号"
			}
		});

	}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider

		// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				template: require('../templates/tabs.html')
			})

			// Each tab has its own nav history stack:

			.state('tab.dash', {
				url: '/dash',
				views: {
					'tab-dash': {
						template: require('../templates/tab-dash.html'),
						controller: 'DashCtrl'
					}
				}
			})

			//webpack配合ocLazyLoad实现按需加载
			.state('tab.chats', {
				url: '/chats',
				views: {
					'tab-chats': {
						templateProvider: ['$q', function ($q) {
							return $q(function (resolve) {
								require.ensure([], function () {
									resolve(require('../templates/tab-chats.html'))
								});
							})
						}],
						controller: 'ChatsCtrl',
						resolve: {
							loadCtrl: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
								return $q(function (resolve) {
									require.ensure([], function () {
										// load only controller module
										var ctrl = require('./controllers/chat_ctrl');
										$ocLazyLoad.load({name: 'chatCtrl'});
										resolve(ctrl);
									})
								});
							}]
						}
					}
				}
			})
			.state('tab.chat-detail', {
				url: '/chats',
				params: {
					chatId: ''
				},
				views: {
					'tab-chats': {
						template: require('../templates/chat-detail.html'),
						controller: 'ChatDetailCtrl'
					}
				}
			})

			.state('tab.account', {
				url: '/account',
				views: {
					'tab-account': {
						template: require('../templates/tab-account.html'),
						controller: 'AccountCtrl'
					}
				}
			});

	}]);


if (module.hot) {
  module.hot.accept();
}