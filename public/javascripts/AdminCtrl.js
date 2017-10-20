app.controller('AdminCtrl', [
    '$scope',
    'tennis',
    'auth',
    '$state',
    function ($scope, tennis, auth,$state) {
        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';


        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.delete = function (id) {

            tennis.deleteUser(id);
            tennis.getUsers();

        };
        $scope.edit = function (id) {

            tennis.user._id=id;
            $state.go('adminEdit');


        };




    }]);