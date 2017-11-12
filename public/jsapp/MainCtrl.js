app.controller('MainCtrl', [
    '$scope',
    'tennis',
    'auth',
    function ($scope, tennis, auth) {
        $scope.test = 'Hello world!';


        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;





    }]);