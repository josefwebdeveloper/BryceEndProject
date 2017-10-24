app.controller('AdminCtrl', [
    '$scope',
    'tennis',
    'auth',
    '$state',
    '$http',
    function ($scope, tennis, auth,$state,$http) {
        // $scope.commentss=$scope.user1;
        //stam
        // var commentss={};
        // commentss.username='qwert';
        // commentss.email='asdd@fdfd';
        // commentss.phone='34434343';

        //


        $scope.sortType     = 'rating';
        $scope.test = 'Hello world!';
        $scope.searchFish   = '';

        $scope.user = tennis.user;
        // console.log( "$scope.user",  $scope.user);
        $scope.users = tennis.users;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.delete = function (id) {

            tennis.deleteUser(id);
            tennis.getUsers();

        };
        $scope.edit = function (id) {
            console.log("working");
            tennis.user._id=id;
            console.log( tennis.user._id);
            $state.go('adminEdit');


        };
        $scope.update1 = function () {
            //stam
            // var commentss={};
            // commentss.username='qwert';
            // commentss.email='asdd@fdfd';
            // commentss.phone='34434343';
            // console.log( "fuck1",commentss);
            // //
            console.log("working stam",$scope.user);
            tennis.update($scope.user);

            $state.go('adminEdit');


        };

        $scope.update = function () {
            console.log("adminctrl",$scope.user);
            console.log("adminctrl",$scope.user.username);
            tennis.updateUser($scope.user).error(function (error) {
                $scope.error = error;
                console.log(error);
            }).then(function () {
                tennis.updateRating();
                tennis.getUsers();
                $state.go('admin');
            });

        };




    }]);