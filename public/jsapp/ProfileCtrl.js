app.controller('ProfileCtrl', [
    '$scope',
    'tennis',
    'auth',
    '$state',
    function ($scope, tennis, auth, $state) {
        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';
        //get current user
        tennis.getuser(auth.currentUser()._id);
        console.log("currentUser id",tennis.current);
        $scope.currentUser = auth.currentUser;
        console.log("currentUser", $scope.currentUser.username);

        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isAdmin = auth.isAdmin;
        // $scope.current=tennis.getuser;
        // $state.go('profile');
        $scope.email = function () {
            console.log("email");
            // console.log("currentUser in f Play",tennis.current);
            // var id=auth.currentUser()._id;
            // console.log("id",id);
            // var y=tennis.getuser(id);
            //  console.log("currnet full",tennis.current);
            // console.log("y ",y);
            tennis.email();

        };


        $scope.play = function (user) {
            console.log("working");
            console.log("currentUser in f Play",tennis.current);
            // var id=auth.currentUser()._id;
            // console.log("id",id);
           // var y=tennis.getuser(id);
           //  console.log("currnet full",tennis.current);
            // console.log("y ",y);
            tennis.game.user1username = user.username;
            tennis.game.user1id = user._id;
            tennis.game.user1score = user.score;
            tennis.game.user1rating = user.rating;
            tennis.game.user1phone = user.phone;
            tennis.game.user1city = user.city;
            tennis.game.currentid=tennis.current._id;
            tennis.game.currentusername=tennis.current.username;
            // console.log("currnet full",tennis.current.username);
            tennis.game.currentrating=tennis.current.rating;
            tennis.game.currentscore=tennis.current.score;
            tennis.game.currentphone=tennis.current.phone;
            tennis.game.currentcity=tennis.current.city;

            tennis.gamePlay(tennis.game);
            // console.log("game",tennis.game);
            // console.log("user2",tennis.current);
            tennis.getGames();
            $state.go('game');
        }



    }]);