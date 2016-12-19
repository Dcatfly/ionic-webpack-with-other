var appCtrl = require('../app.js').app
appCtrl.controller('ChatDetailCtrl', ['$scope', '$stateParams', 'Chats', function ($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
	$scope.data = {
		test: {
			onlyNumber: 0
		}
	}
}])
if (module.hot) {
  module.hot.accept();
}