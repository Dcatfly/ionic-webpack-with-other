var appFilter = angular.module('appFilter', [])
appFilter
//20160301100700变成2016/03/01 10:07
	.filter('dateFormat1', function () {
		return function (dateTime) {
			if (dateTime == null || dateTime == "") {
				return dateTime
			} else {
				var arr = dateTime.split('');
				var year = arr[0] + arr[1] + arr[2] + arr[3]
				var month = arr[4] + arr[5]
				var day = arr[6] + arr[7]
				var hours = arr[8] + arr[9]
				var minute = arr[10] + arr[11]
				var second = arr[12] + arr[13]
				return dateTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minute + ':' + second
			}
		}
	})
	//20160301变成2016/03/01
	.filter('dateFormat2', function () {
		return function (dateTime) {
			if (dateTime == null || dateTime == "") {
				return dateTime
			} else {
				var arr = dateTime.split('');
				var year = arr[0] + arr[1] + arr[2] + arr[3]
				var month = arr[4] + arr[5]
				var day = arr[6] + arr[7]
				return dateTime = year + '-' + month + '-' + day
			}
		}
	})
	//如果不是对象，转换成数组对象
	.filter('obj2Array', function () {
		return function (json) {
			var myArray = [];
			if (json instanceof Array) {
				return json;
			} else {
				myArray.push(json);
				return myArray;
			}
		}
	})
	//如果不是对象，转换成数组对象
	.filter('objDeep2Array', function () {
		return function (json) {
			var myArray = [];
			if (json instanceof Array) {
				return json;
			} else {
				if (json instanceof Object) {
					for (var it in json) {
						myArray.push(json[it]);
					}
				}
				return myArray;
			}
		}
	})
	.filter('str2Num', function () {
		return function (str) {
			if (typeof str == "string") {
				return parseInt(str);
			} else {
				return str;
			}
		}
	})
	.filter('obj2Str', function () {
		return function (str) {
			if (typeof str == "object") {
				return "暂无";
			} else {
				return str;
			}
		}
	})
	.filter('isObj', function () {
		return function (str) {
			return str instanceof Object;
		}
	})
	.filter('subStr', function () {
		return function (str) {
			var ret = str, NUM_LENGTH = 100;
			if (typeof ret == "string") {
				if (ret.length > NUM_LENGTH) {
					var _split = str.split("、");
					ret = ""
					for (var i = 0; i < _split.length; i++) {
						ret = ret + _split[i];
						if (ret.length > NUM_LENGTH) {
							ret = ret.substring(0, ret.lastIndexOf("、")) + "、等等";
							break;
						} else {
							ret = ret + "、"
						}
					}
				}
			}
			return ret;
		}
	})
if (module.hot) {
  module.hot.accept();
}