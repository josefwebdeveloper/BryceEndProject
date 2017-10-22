app.factory('tennis', ['$http', 'auth', function ($http, auth) {
    var userFactory = {
        posts: [],
        users: [],
        user:[]
    };


    userFactory.getUser = function (id) {
        return $http.get('/admin/' + id, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            angular.copy(data, userFactory.user);
        });
    };
    userFactory.deleteUser = function(id) {
        return $http.delete('/admin/' + id , {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
    // userFactory.getAll = function () {
    //     return $http.get('/posts').success(function (data) {
    //         angular.copy(data, userFactory.posts);
    //     });
    // };
    userFactory.getUsers = function () {
        return $http.get('/users').success(function (data) {
            angular.copy(data, userFactory.users);
            console.log("getUsers()");
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

    userFactory.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            comment.upvotes += 1;
        });
    };
    // Delete a user
    userFactory.deleteUser = function(id) {
        return $http.delete('/admin/' + id , {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };

    // Edit a user
    userFactory.editUser = function(id) {
        return $http.put('/api/edit', id);
    };

    return userFactory;
}]);