app.factory('auth', ['$http', '$window', '$rootScope', function ($http, $window, $rootScope) {
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

                // return payload.username;
                // console.log("payload",payload);
                return payload;
            }
        },
        isAdmin: function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                if (payload.username === "admin") {
                    return true;
                } else {

                    return false;
                }
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
}]);