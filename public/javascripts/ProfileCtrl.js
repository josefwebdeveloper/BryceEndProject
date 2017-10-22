app.controller('ProfileCtrl', [
    '$scope',
    'tennis',
    'auth',
    function ($scope, tennis, auth) {
        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';


        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;





    }]);