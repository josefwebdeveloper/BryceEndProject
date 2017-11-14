app.factory('tennis', ['$http', 'auth', function ($http, auth) {
    var userFactory = {
        posts: [],
        users: [],
        user: {},
        user1: {},
        user2: {},
        game: {},
        games:[],
        current: {}
    };


    userFactory.getUser = function (id) {
        return $http.get('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.user);
        });
    };
    // get user by id( copy to service controller  data to current)
    userFactory.getuser = function (id) {

        $http.get('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            userFactory.current = data;
            console.log("data userservice", userFactory.current);
            // angular.copy(data, userFactory.current);

        });

    };

    // getUsers
    userFactory.getUsers = function () {
        return $http.get('/users').success(function (data) {
            angular.copy(data, userFactory.users);
            console.log("getUsers()");
        });
    };
    // getGames
    userFactory.getGames = function () {
        return $http.get('/games').success(function (data) {
            angular.copy(data, userFactory.games);
            console.log("getGames()");
        });
    };
    // updateRating
    userFactory.updateRating = function () {
        return $http.get('/updaterating').success(function (data) {
            // angular.copy(data, userFactory.users);
            console.log("rating updated");
        });
    };


    // gamePlay
    userFactory.gamePlay = function (game) {
        return $http.post('/game', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };
    // gameApproval
    userFactory.gameApproval = function (game) {
        return $http.post('/game/approval', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };
    // gameWinner
    userFactory.gameWinner = function (game) {
        return $http.post('/game/winner', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };





    // Delete  user
    userFactory.deleteUser = function (id) {
        return $http.delete('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
    // Delete  game
    userFactory.deleteGame = function (id) {
        return $http.delete('/admin/delete/game/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
    // Update user
    userFactory.updateUser = function (user) {
        console.log("updateUser", user);
        return $http.post('/admin/update',
            user);
    };
    //email
    userFactory.email = function (mail) {
        console.log("email tennis",mail);
        return $http.post('/mail',mail);
    };

    return userFactory;
}]);