require('../app.js').app.controller('AccountCtrl', ['$scope', function ($scope) {
	$scope.settings = {
		enableFriends: true
	};
}]);
if (module.hot) {
  module.hot.accept();
}