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
    //get user by id( copy to service controller to current)
    userFactory.getuser = function (id) {

        $http.get('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            userFactory.current = data;
            console.log("data userservice", userFactory.current);
            // angular.copy(data, userFactory.current);
        });

    };

    userFactory.deleteUser = function (id) {
        return $http.delete('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };

    userFactory.getUsers = function () {
        return $http.get('/users').success(function (data) {
            angular.copy(data, userFactory.users);
            console.log("getUsers()");
        });
    };
    userFactory.getGames = function () {
        return $http.get('/games').success(function (data) {
            angular.copy(data, userFactory.games);
            console.log("getGames()");
        });
    };
    userFactory.updateRating = function () {
        return $http.get('/updaterating').success(function (data) {
            // angular.copy(data, userFactory.users);
            console.log("rating updated");
        });
    };

    userFactory.create = function (post) {
        return $http.post('/posts', post, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            userFactory.posts.push(data);
        });
    };
    userFactory.gamePlay = function (game) {
        return $http.post('/game', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };
    userFactory.gameApproval = function (game) {
        return $http.post('/game/approval', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };
    userFactory.gameWinner = function (game) {
        return $http.post('/game/winner', game, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.game);
        });
    };

    userFactory.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            post.upvotes += 1;
        });
    };

    userFactory.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
    //stam
    userFactory.update = function (user) {
        console.log("update", user);
        return $http.post('/admins', user)
    };
    //

    userFactory.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            comment.upvotes += 1;
        });
    };
    // Delete a user
    userFactory.deleteUser = function (id) {
        return $http.delete('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
    //update user
    userFactory.updateUser = function (user) {
        console.log("updateUser", user);
        return $http.post('/admin/update',
            user);
    };

    return userFactory;
}]);