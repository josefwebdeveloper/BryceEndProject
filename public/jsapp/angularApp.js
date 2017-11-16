var app = angular.module('TennisBattle', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'

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
                        postPromise: ['tennis', 'auth', function (tennis, auth) {
                            console.log("stateprovider-getuser(auth.currentUser()._id)");

                            tennis.getuser(auth.currentUser()._id);

                            return tennis.getUsers();
                        }]
                    }
                })
                .state('players', {
                    url: '/players',
                    templateUrl: '/players.html',
                    controller: 'ProfileCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('login');
                        }
                    }],
                    resolve: {
                        postPromise: ['tennis', 'auth', function (tennis, auth) {
                            console.log("stateprovider-getuser(auth.currentUser()._id)");

                            tennis.getuser(auth.currentUser()._id);

                            return tennis.getUsers();
                        }]
                    }
                })
                .state('game', {
                    url: '/game',
                    templateUrl: '/game.html',
                    controller: 'GameCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('login');
                        }
                    }],
                    resolve: {
                        postPromise: ['tennis', function (tennis) {
                            console.log("stateprovider-getUsers()");
                            return tennis.getGames();

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
                            return tennis.getUser(tennis.user._id);

                        }]
                    }
                })

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
                })
                .state('contact', {
                    url: '/contact',
                    templateUrl: '/contact.html',
                    controller: 'MainCtrl'

                })
                .state('address', {
                    url: '/address',
                    templateUrl: '/google.html',
                    controller: 'MainCtrl'

                });

            $urlRouterProvider.otherwise('home');
        }]);





