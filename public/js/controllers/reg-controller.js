/**
 * Created by Administrator on 4/1/2016.
 */
angular.module('loginApp.controllers')
    .controller('UserCtrl', ['$scope', '$http', '$state', '$stateParams', '$location', 'User',
        function($scope, $http, $state, $stateParams, $location, User) {

            $scope.register = function (form) {
                var response = $http.post('/register', form);
                response.success(function (data, status) {
                    console.log(data);
                    if (data.success) {
                        $scope.message = data.message;
                        popUpDialog && popUpDialog();
                    }
                    else {
                        $scope.form = {};
                    }
                })
            }

            var popUpDialog = function () {
                $scope.showDialog('#message');
                // redirect to us list page after 1 sec
                setTimeout(function () {
                    $state.go('home.sign-in');
                }, 1000);
            }
            $scope.showDialog = function(id) {
                $(id).bPopup({
                    opacity : 0.6,
                    autoClose : 2000,
                    positionStyle : 'fixed',
                    modalClose : true,
                    modal : false,
                    position : [ 0, 0 ]
                });
            }
        }
    ]);