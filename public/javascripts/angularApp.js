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
                            tennis.getUsers();
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
                    }],
                    resolve: {
                        postPromise: ['tennis', function (tennis) {
                            console.log("postPromise");
                            return tennis.getUser( tennis.user._id);

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


