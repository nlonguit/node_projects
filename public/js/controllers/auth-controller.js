/**
 * Created by Administrator on 3/29/2016.
 */
angular.module('loginApp.controllers')
    .controller('AuthenticationCtrl', ['$scope', '$http', '$state', '$stateParams', 'localStorageService', 'Auth', '$location',
        function($scope, $http, $state, $stateParams, localStorageService, Auth, $location) {

            $scope.login = function (credentials) {
                Auth.signin(credentials, function (data, status) {
                    console.log(data.principle);
                    console.log(status);
                    if (!data.success) {
                        console.log(data.message);
                        $state.go('home.sign-in', {});
                    }
                    else {
                        localStorageService.set('token', data.token);
                        localStorageService.set('principle', data.principle);
                        $scope.message = data.message;
                        popUpDialog && popUpDialog();
                    }
                }, function () {
                    $scope.message = 'Failed to fetch details';
                })
            }

            var logout = function () {
                Auth.logout(function () {
                    $location.path('/');
                }, function() {
                    $scope.message = 'Failed to logout';
                })
            }

            var popUpDialog = function() {
                $scope.showDialog('#message');
                // redirect to us list page after 1 sec
                setTimeout(function () {
                    $state.go('home.greeting', {});
                }, 500);
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

            $scope.$on("$stateChangeSuccess", function() {
                if ($state.is('home.logout')) {
                    logout && logout();
                }
            })

        }
    ]);
