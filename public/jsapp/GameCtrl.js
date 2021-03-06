app.controller('GameCtrl', [
    '$scope',
    'tennis',
    'auth',
    function ($scope, tennis, auth) {
        $scope.sortType = 'rating';
        $scope.test = 'Hello world!';
        //get current user
        tennis.getuser(auth.currentUser()._id);
        if(tennis.current.username=="admin"){
            $scope.admin=true;
            console.log( "admin",$scope.admin);
        }else{
            $scope.admin=false
        }


        $scope.searchFish = auth.currentUser().username;
        // console.log("searchFish",$scope.searchFish);
        // if(auth.isAdmin()){
        //     console.log("searchfish",$scope.searchFish);
        //     $scope.searchFish=="";
        //     tennis.getGames();
        // }

        $scope.users = tennis.users;
        $scope.games = tennis.games;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isAdmin = auth.isAdmin;
        $scope.approval = function (userid, k, game) {
            // console.log("working approval");
            // console.log("currentUser", tennis.current._id);
            // console.log("userid", userid);
            // console.log("game approval", game.approval1, game.approval2);
            if (userid !== tennis.current._id) {

                tennis.game = game;
                if (k == 1) {
                    tennis.game.approval1 = true;
                }
                else if (k == 2) {
                    tennis.game.approval2 = true
                }

                tennis.gameApproval(tennis.game);
                // console.log("game", tennis.game);
                // // console.log("user2",tennis.current);
                // $state.go('game');
            } else {
                console.log("userid not current");
            }
            tennis.getGames();

        };
        $scope.deleteGame = function (id) {

            tennis.deleteGame(id);
            tennis.getGames();

        };

        $scope.winner = function (k, game) {

            console.log("working winner");

            if (game.user1username == tennis.current.username || game.user2username == tennis.current.username) {

                tennis.game = game;
                if (k == 1) {
                    tennis.game.winner = tennis.game.user1username;
                    tennis.game.looser = tennis.game.user2username;

                }
                else if (k == 2) {
                    tennis.game.winner = tennis.game.user2username;
                    tennis.game.looser = tennis.game.user1username;
                }

                tennis.gameWinner(tennis.game);
                console.log("game", tennis.game);
                // // console.log("user2",tennis.current);
                // $state.go('game');
            } else {
                console.log("userid not current");
            }
            tennis.updateRating();
            tennis.getGames();

        }


    }]);