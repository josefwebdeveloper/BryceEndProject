app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    'tennis',
    function ($scope, $state, auth, tennis) {
        // $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
                console.log(error);
            }).then(function () {
                tennis.updateRating();
                tennis.getUsers();
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