app.controller('NavCtrl', [
    '$scope',
    'auth',
    'tennis',
    '$state',
    function ($scope, auth,tennis,$state) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
        $scope.isAdmin = auth.isAdmin;
        $scope.logOut = function () {
            auth.logOut();
            tennis.current={};
            $state.go('login');

        };

    }]);