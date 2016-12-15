var appCtrl = require('../app.js').app
appCtrl.controller('DashCtrl', ['$scope', 'h5ToastService', function ($scope, h5ToastService) {

	$scope.toast = function () {
		h5ToastService.show('提交成功')
	}
}])
