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

        $scope.approval = function (userid,k,game) {
            console.log("working approval");
            console.log("currentUser",tennis.current._id);
            console.log("userid",userid);
            console.log("game approval",game.approval1,game.approval2);
            if(userid!==tennis.current._id){
            // console.log("working approval in if");
            // console.log("currentUser",tennis.current);
            // var id=auth.currentUser()._id;
            // console.log("id",id);
            // var y=tennis.getuser(id);
            //  console.log("currnet full",tennis.current);
            // console.log("y ",y);
            tennis.game = game;
            if(k==1){tennis.game.approval1=true;}
            else if(k==2){tennis.game.approval2=true}
            // tennis.game.user1id = user._id;
            // tennis.game.user1score = user.score;
            // tennis.game.user1rating = user.rating;
            // tennis.game.user1phone = user.phone;
            // tennis.game.user1city = user.city;
            // tennis.game.currentid=tennis.current._id;
            // tennis.game.currentusername=tennis.current.username;
            // // console.log("currnet full",tennis.current.username);
            // tennis.game.currentrating=tennis.current.rating;
            // tennis.game.currentscore=tennis.current.score;
            // tennis.game.currentphone=tennis.current.phone;
            // tennis.game.currentcity=tennis.current.city;
            //
            tennis.gameApproval(tennis.game);
            console.log("game",tennis.game);
            // // console.log("user2",tennis.current);
            // $state.go('game');
            }else {
            console.log("userid not current");}
        }









    }]);