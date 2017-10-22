app.controller('AdminCtrl', [
    '$scope',
    'tennis',
    'auth',
    '$state',
    function ($scope, tennis, auth,$state) {

        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';

        $scope.user = tennis.user;
        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.delete = function (id) {

            tennis.deleteUser(id);
            tennis.getUsers();

        };
        $scope.edit = function (id) {
            console.log("working");
            tennis.user._id=id;
            console.log( tennis.user._id);
            $state.go('adminEdit');


        };




    }]);