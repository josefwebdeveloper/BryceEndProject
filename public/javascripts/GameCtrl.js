app.controller('GameCtrl', [
    '$scope',
    'tennis',
    'auth',
    function ($scope, tennis, auth) {
        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';


        $scope.users = tennis.users;
        $scope.games = tennis.games;
        $scope.isLoggedIn = auth.isLoggedIn;





    }]);