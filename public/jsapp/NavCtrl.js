app.controller('NavCtrl', [
    '$scope',
    'auth',
    'tennis',
    function ($scope, auth,tennis) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
        $scope.isAdmin = auth.isAdmin;
    }]);