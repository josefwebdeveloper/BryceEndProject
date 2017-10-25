app.controller('GameCtrl', [
    '$scope',
    'tennis',
    'auth',
    function ($scope, tennis, auth) {
        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        //get current user
        tennis.getuser(auth.currentUser()._id);

        $scope.searchFish   = auth.currentUser().username;
        // console.log("current",tennis.current.username);


        $scope.users = tennis.users;
        $scope.games = tennis.games;
        $scope.isLoggedIn = auth.isLoggedIn;





    }]);