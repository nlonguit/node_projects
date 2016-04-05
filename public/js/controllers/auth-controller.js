/**
 * Created by Administrator on 3/29/2016.
 */
angular.module('shopAdvisor.controllers')
    .controller('AuthenticationCtrl', ['$scope', '$http', '$state', '$stateParams', 'localStorageService', 'Auth', '$location',
        function($scope, $http, $state, $stateParams, localStorageService, Auth, $location) {

            $scope.login = function (credentials) {
                Auth.signin(credentials, function (data, status) {
                    console.log(data.principle);
                    console.log(data.success);
                        localStorageService.set('token', data.token);
                        localStorageService.set('principle', data.principle);
                            $('#sign-in').hide();
                            $('#my-profile').show();

                        $state.go('home.greeting', {});
                }, function (data, status) {
                    $scope.message = data.message;
                    $state.go('home.sign-in', {});
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

                }, 500);
            }

            $scope.$on("$stateChangeSuccess", function() {
                if ($state.is('home.logout')) {
                    logout && logout();
                }
            })

        }
    ]);
