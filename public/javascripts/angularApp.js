angular.module('TennisBattle', ['ui.router'])
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
                    controller: 'MainCtrl',
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
        var o = {
            posts: [],
            users: []
        };


        o.get = function (id) {
            return $http.get('/posts/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/posts').success(function (data) {
                angular.copy(data, o.posts);
            });
        };
        o.getUsers = function () {
            return $http.get('/users').success(function (data) {
                angular.copy(data, o.users);
                console.log("getUsers()");
            });
        };

        o.create = function (post) {
            return $http.post('/posts', post, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                o.posts.push(data);
            });
        };

        o.upvote = function (post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                post.upvotes += 1;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/posts/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        o.upvoteComment = function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                comment.upvotes += 1;
            });
        };

        return o;
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
    .controller('MainCtrl', [
        '$scope',
        'tennis',
        'auth',
        function ($scope, tennis, auth) {
            $scope.test = 'Hello world!';

            $scope.posts = tennis.posts;
            $scope.users = tennis.users;
            $scope.isLoggedIn = auth.isLoggedIn;

            $scope.addPost = function () {
                if ($scope.title === '') {
                    return;
                }
                tennis.create({
                    title: $scope.title,
                    link: $scope.link
                });
                $scope.title = '';
                $scope.link = '';
            };

            $scope.incrementUpvotes = function (post) {
                tennis.upvote(post);
            };

        }])
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
        }])
    .controller('AuthCtrl', [
        '$scope',
        '$state',
        'auth',
        function ($scope, $state, auth) {
            $scope.user = {};

            $scope.register = function () {
                auth.register($scope.user).error(function (error) {
                    $scope.error = error;
                    console.log(error);
                }).then(function () {
                    $state.go('profile');
                });
            };

            $scope.logIn = function () {
                auth.logIn($scope.user).error(function (error) {
                    $scope.error = error;
                }).then(function () {
                    $state.go('profile');
                });
            };
        }])
    .controller('NavCtrl', [
        '$scope',
        'auth',
        function ($scope, auth) {
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logOut;
        }]);
