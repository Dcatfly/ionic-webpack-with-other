var appService = angular.module('appService', [])
appService
//数据持久化接口
	.factory('dataService', function () {
		var data = {};

		return {
			setData: function (key, value) {
				data[key] = value;
			},
			getData: function (key) {
				return data[key];
			}
		}
	})
	//更新四组基本URL数据
	.factory('baseUrlService', ['dataService', function (dataService) {
		return {
			update: function (ip) {
				dataService.setData('ip', ip);
				dataService.setData('ipConfig', ip + '/DataMapMoblie?classname=MobileInterface&');
				dataService.setData('rootImgUrl', ip + '/business/test/');
				dataService.setData('xiala', ip + '/DataDictMoblie?type=FACTDIC&cate=params');
			}

		}
	}])
	//短提示
	.factory('toastService', function () {
		return {
			show: function (message, time, position) {
				if (!time) {
					time = 'short'
				}
				if (!position) {
					position = 'center'
				}
				try {
					// window.plugins.toast.show(message, time, position);
					//  原函数是调用了原生的提示功能，此处需重新实现
				} catch (e) {
					console.error(e);
					console.warn(message);
				}

			}
		}
	})
	//查询、提交数据的接口
	.factory('serPostSearch', ['$http', '$ionicLoading', '$location', 'dataService', '$q', 'toastService', function ($http, $ionicLoading, $location, dataService, $q, toastService) {

		var service = {};
		var getBaseData = function () {
			var ipConfig = dataService.getData('ipConfig'), userId = dataService.getData('userId'), postId = dataService.getData('postId'), code = dataService.getData('code'), amapAddr = dataService.getData('amapAddr'), amapEqu = dataService.getData('amapEqu'), amapRange = dataService.getData('amapRange');
			var data = {
				opt_loading: {
					animation: 'fade-in',
//        showBackdrop: true,
//          maxWidth: 200,
					showDelay: 0
//           duration: 5000
//         noBackdrop: true
				},


				equ_delete: ipConfig + "funcname=delete&&useId=" + userId + "&id=",
				address_delete: ipConfig + "funcname=deleteAddress&userId=" + userId + "&id=",


				//所有的提交
				address_sub: ipConfig + "funcname=saveAddress",
				equ_sub: ipConfig + "funcname=saveData"
			};
			return data;
		};
		//隐藏加载动画
		service.hideLoading = function () {
			$ionicLoading.hide();
		};

		//内部自用service
		service._service = function (obj) {
			var deferred = $q.defer();
			$http(obj).then(function (suc) {
				if (suc.data.dataset && suc.data.dataset.response && suc.data.dataset.response.success == 'true') {
					deferred.resolve(suc.data);
				} else {
					if (suc.data.dataset && suc.data.dataset.response && suc.data.dataset.response.success == 'false') {
						deferred.reject(suc.data.dataset.response.content);
						toastService.show(suc.data.dataset.response.content);
					} else {
						deferred.reject();
						toastService.show('服务器繁忙，请稍后再试。');
					}

				}
				service.hideLoading();
			}, function (err) {
				deferred.reject();
				toastService.show('请检查网络。');
				service.hideLoading();
			});
			return deferred.promise;
		};

		//查询第三方服务专用service
		service._api_service = function (obj) {
			var deferred = $q.defer();
			$http(obj).then(function (suc) {
				if (suc.data.status && suc.data.status == 1) {
					deferred.resolve(suc.data);
				} else {
					if (suc.data.status == 0) {
						deferred.reject(suc.data.info);
						try {
							toastService.show(suc.data.info);
						} catch (e) {
							console.log(suc.data.info);
						}

					} else {
						deferred.reject();
						try {
							toastService.show('服务器繁忙，请稍后再试。');
						} catch (e) {
							console.log("操作失败 state非0");
							console.log(suc.data);
						}

					}

				}
				service.hideLoading();
			}, function (err) {
				deferred.reject(err);
				try {
					toastService.show('请检查网络。');
				} catch (e) {
					console.log(err);
				}

				service.hideLoading();
			});
			return deferred.promise;
		};

		//查询带参数
		service.post0 = function (name, reg, credential) {
			var data = getBaseData();
			$ionicLoading.show(data.opt_loading);
			var obj = {
				method: 'post',
				url: data[name] + reg,
				timeout: 60000,
				withCredentials: !!credential
			};
			if (angular.isObject(reg)) {
				obj['url'] = data[name]
				obj['data'] = reg
			}
			return service._service(obj);
		};
		//查询
		service.post1 = function (name) {
			var data = getBaseData();
			if ($location.path() != '') {
				$ionicLoading.show(data.opt_loading);
			}
			var obj = {
				method: 'post',
				url: data[name],
				timeout: 60000
			};

			return service._service(obj);
		};
		//提交
		service.post2 = function (name, reg) {
			var data = getBaseData();
			var serURL = data[name];
			var t = {
				'dataset': JSON.stringify(reg)
			};
			return $http.post(serURL, t);
		};
		//注册提交
		service.post3 = function (name, reg) {
			var data = getBaseData();
			$ionicLoading.show(data.opt_loading);
			var t = {
				'dataset': JSON.stringify(reg)
			};
			var obj = {
				method: 'post',
				url: data[name],
				timeout: 60000,
				data: t
			};
			return service._service(obj);
		};
		//查询带参数 外网api
		service.post4 = function (name, reg) {
			var data = getBaseData();
			$ionicLoading.show(data.opt_loading);
			var obj = {
				method: 'get',
				url: data[name] + reg,
				timeout: 60000
			};
			return service._api_service(obj);
		};
		//post提交 外网api
		service.post5 = function (name, reg) {
			var data = getBaseData();
			$ionicLoading.show(data.opt_loading);

			var obj = {
				method: 'post',
				url: data[name],
				timeout: 300000000,
				data: reg
			};
			return service._api_service(obj);
		};
		return service;
	}])
	//登陆接口
	.factory('serLogin', ['$http', 'dataService', '$q', '$rootScope', 'toastService', '$ionicLoading', function ($http, dataService, $q, $rootScope, toastService, $ionicLoading) {
		return {
			data: function (username, password) {
				var defer = $q.defer();
				var opt_loading = {
					animation: 'fade-in',
//        showBackdrop: true,
//          maxWidth: 200,
					showDelay: 0
//             duration: 8000
				};
				$ionicLoading.show(opt_loading);
				var ip = dataService.getData('ip');
				var obj = {
					method: 'post',
					url: ip + "?userCode=" + username + "&userPwd=" + password,
					timeout: 4000
				};
				$http(obj).then(function (suc) {
					if (suc.data.dataset && suc.data.dataset.response && suc.data.dataset.response.success == 'true') {

						var data = suc.data.dataset.uservo;
						if (data.id == undefined || data.id == "") {
							toastService.show('对不起，您的用户名或密码有误,请重新输入!');
							defer.reject();
						} else {
							store.set("loginData", data);
							defer.resolve(data);

							//保存通用参数到store
							var userId = data.id;
							var userName = data.name;
							//登陆名
							var code = data.code;

							store.set('userId', userId);
							store.set('userName', userName);
							store.set('code', code)//登陆名

							dataService.setData('userId', userId);
							dataService.setData('userName', userName);
							dataService.setData('code', code);//登录名
						}

					} else {
						toastService.show('服务器繁忙，请稍后再试。');
						defer.reject();
					}
				}, function (err) {
					defer.reject();
					toastService.show('无法连接到网络，请检查网络配置。');
				}).finally(function () {
					$ionicLoading.hide();
				});
				return defer.promise;
			}
		}
	}])

	//更新服务
	.factory('checkUpdate', [function () {
		var server = {};

		server.appVersion = function (flag) {
			//网页版无需更新功能
		}
		return server;
	}])

	//完全自定义的弹窗提示
	.factory('popupShowService', ['$ionicPopup', function ($ionicPopup) {
		var popup = {};
		popup.show = function (title, message, scopeObj, okText, okFunc, cssClass, cancelFunc) {
			cssClass = cssClass || "gengxin";
			var options = {
				title: title || "提示", // String. The title of the popup.
				cssClass: cssClass, // String, The custom CSS class name
				template: '<div class=' + cssClass + "_template" + '>' + message + '</div>', // String (optional).
				scope: scopeObj || null, // Scope (optional). A scope to link to the popup content.
				buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
					text: '取消',
					type: 'gx_cancel_button',
					onTap: cancelFunc || function (e) {
						/*            console.log(scopeObj.data);
						 console.log(this.scope.data);
						 console.log(options.scope.data);*/

						// e.preventDefault() will stop the popup from closing when tapped.
					}
				}, {
					text: okText || "确定",
					type: 'gx_ok_button',
					onTap: okFunc || function () {
					}
				}]
			};
			var popupShow = $ionicPopup.show(options);
		};


		return popup;
	}])
	//共用函数
	.factory('commonFucService', ['$cordovaStatusbar', '$ionicPlatform', function ($cordovaStatusbar, $ionicPlatform) {
		var server = {};

		var _Format = function (formatStr) {
			var str = formatStr;
			var Week = ['日', '一', '二', '三', '四', '五', '六'];
			str = str.replace(/yyyy|YYYY/, this.getFullYear());
			str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
			var mon = this.getMonth();
			mon = mon + 1;
			str = str.replace(/MM/, this.getMonth() > 8 ? mon.toString() : '0' + mon);
			str = str.replace(/M/g, mon);

			str = str.replace(/w|W/g, Week[this.getDay()]);

			str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
			str = str.replace(/d|D/g, this.getDate());

			str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
			str = str.replace(/h|H/g, this.getHours());
			str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
			str = str.replace(/m/g, this.getMinutes());

			str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
			str = str.replace(/s|S/g, this.getSeconds());

			return str;
		};
		//返回格式化时间
		server.getNowDate = function (format, now) {
			if (!now) {
				now = new Date();
			}
			if (format) {
				try {
					return _Format.call(now, format);
				} catch (e) {
					console.log(e);
				}
			}
			return _Format.call(now, "YYYYMMDD");
		};
		//将单个对象转为数组中的一个元素并返回该数组
		server.obj2Array = function (json) {
			var myArray = [];
			if (json instanceof Array) {
				return json;
			} else if (json == null || json == undefined || json == '') {
				console.log('返回数据异常');
				return myArray;
			} else {
				myArray.push(json);
				return myArray;
			}
		};
		//改变状态栏颜色
		server.setStatusbar = function (color) {
			//网页版无法实现此功能
			// $ionicPlatform.ready(function () {
			//   if (ionic.Platform.isAndroid()) {
			//     try {
			//       $cordovaStatusbar.styleHex(color);
			//     } catch (e) {
			//       console.log(e);
			//     }
			//   }
			// });

		};
		//此功能产生于特定场景下，应该无用
		server.supSplice = function (data) {
			var index = ["city", "district", "township", "street", "streetNumber", "community", "building", "floor", "roomNumber"];
			var count = 1;
			var _address = "";
			index.forEach(function (item) {
				if (data[item] != "" && data[item] != undefined) {
					_address += data[item] + "<sup>" + count + "</sup>"
				}
				count++;
			});
			return _address;
		};
		//生成随机编码
		server.randomString = function (len) {
			len = len || 32;
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
			var maxPos = $chars.length;
			var pwd = '';
			for (i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		}

		return server;
	}])
	.factory('Chats', function () {
		// Might use a resource here that returns a JSON array

		// Some fake testing data
		var chats = [{
			id: 0,
			name: 'Ben Sparrow',
			lastText: 'You on your way?',
			face: require('../img/ben.png')
		}, {
			id: 1,
			name: 'Max Lynx',
			lastText: 'Hey, it\'s me',
			face: require('../img/max.png')
		}, {
			id: 2,
			name: 'Adam Bradleyson',
			lastText: 'I should buy a boat',
			face: require('../img/adam.jpg')
		}, {
			id: 3,
			name: 'Perry Governor',
			lastText: 'Look at my mukluks!',
			face: require('../img/perry.png')
		}, {
			id: 4,
			name: 'Mike Harrington',
			lastText: 'This is wicked good ice cream.',
			face: require('../img/mike.png')
		}];

		return {
			all: function () {
				return chats;
			},
			remove: function (chat) {
				chats.splice(chats.indexOf(chat), 1);
			},
			get: function (chatId) {
				for (var i = 0; i < chats.length; i++) {
					if (chats[i].id === parseInt(chatId)) {
						return chats[i];
					}
				}
				return null;
			}
		};
	});
