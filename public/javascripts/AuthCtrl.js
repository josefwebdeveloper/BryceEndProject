app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function ($scope, $state, auth) {
        // $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
                console.log(error);
            }).then(function () {
                $state.go('profile');
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {

                if($scope.user.username=='admin'){

                    $state.go('admin');
                } else $state.go('profile');
            });
        };
    }])