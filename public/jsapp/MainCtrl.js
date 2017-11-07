app.controller('MainCtrl', [
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

    }]);