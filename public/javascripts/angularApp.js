var app=angular.module('TennisBattle', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['tennis', function (tennis) {
                            return tennis.getAll();
                        }]
                    }
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/profile.html',
                    controller: 'ProfileCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('login');
                        }
                    }],
                    resolve: {
                        postPromise: ['tennis', function (tennis) {
                            console.log("stateprovider-getUsers()");
                            return tennis.getUsers();

                        }]
                    }
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: '/admin.html',
                    controller: 'AdminCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('login');
                        }
                    }],
                    resolve: {
                        postPromise: ['tennis', function (tennis) {

                            return tennis.getUsers();

                        }]
                    }
                })
                .state('adminEdit', {
                    url: '/adminedit',
                    templateUrl: '/editUser.html',
                    controller: 'AdminCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('login');
                        }
                    }]
                    // resolve: {
                    //     postPromise: ['tennis', function (tennis) {
                    //
                    //         return tennis.getUsers();
                    //
                    //     }]
                    // }
                })
                // .state('posts', {
                //     url: '/posts/{id}',
                //     templateUrl: '/posts.html',
                //     controller: 'PostsCtrl',
                //     resolve: {
                //         post: ['$stateParams', 'tennis', function ($stateParams, tennis) {
                //             return tennis.get($stateParams.id);
                //         }]
                //     }
                // })
                .state('login', {
                    url: '/login',
                    templateUrl: '/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('profile');
                        }
                    }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('profile');
                        }
                    }]
                });

            $urlRouterProvider.otherwise('home');
        }])
    .factory('tennis', ['$http', 'auth', function ($http, auth) {
        var userFactory = {
            posts: [],
            users: [],
            user:[]
        };


        userFactory.get = function (id) {
            return $http.get('/posts/' + id).then(function (res) {
                return res.data;
            });
        };

        userFactory.getAll = function () {
            return $http.get('/posts').success(function (data) {
                angular.copy(data, userFactory.posts);
            });
        };
        userFactory.getUsers = function () {
            return $http.get('/users').success(function (data) {
                angular.copy(data, userFactory.users);
                console.log("getUsers()");
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
    }])
    .factory('auth', ['$http', '$window', '$rootScope', function ($http, $window, $rootScope) {
        var auth = {
            saveToken: function (token) {
                $window.localStorage['tennis-battle'] = token;
            },
            getToken: function () {
                return $window.localStorage['tennis-battle'];
            },
            isLoggedIn: function () {
                var token = auth.getToken();

                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            },
            currentUser: function () {
                if (auth.isLoggedIn()) {
                    var token = auth.getToken();
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.username;
                }
            },
            register: function (user) {
                return $http.post('/register', user).success(function (data) {
                    auth.saveToken(data.token);
                });
            },
            logIn: function (user) {
                return $http.post('/login', user).success(function (data) {
                    auth.saveToken(data.token);
                });
            },
            logOut: function () {
                $window.localStorage.removeItem('tennis-battle');
            }
        };

        return auth;
    }])


    // .controller('AdminCtrl', [
    //     '$scope',
    //     'tennis',
    //     'auth',
    //     function ($scope, tennis, auth) {
    //         $scope.sortType     = 'rating';
    //         $scope.test = 'Hello world!';
    //         $scope.searchFish   = '';
    //
    //
    //         $scope.users = tennis.users;
    //         $scope.isLoggedIn = auth.isLoggedIn;
    //
    //
    //
    //
    //
    //     }])
    .controller('PostsCtrl', [
        '$scope',
        'tennis',
        'post',
        'auth',
        function ($scope, tennis, post, auth) {
            $scope.post = post;
            $scope.isLoggedIn = auth.isLoggedIn;

            $scope.addComment = function () {
                if ($scope.body === '') {
                    return;
                }
                tennis.addComment(post._id, {
                    body: $scope.body,
                    author: 'user'
                }).success(function (comment) {
                    $scope.post.comments.push(comment);
                });
                $scope.body = '';
            };

            $scope.incrementUpvotes = function (comment) {
                tennis.upvoteComment(post, comment);
            };
        }]);


