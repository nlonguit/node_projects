/**
 * Created by Administrator on 3/29/2016.
 */
angular.module('shopAdvisor.controllers')
    .controller('AuthenticationCtrl', ['$scope', '$http', '$state', '$stateParams', 'localStorageService', 'Auth', '$location',
        function($scope, $http, $state, $stateParams, localStorageService, Auth, $location) {

            $scope.login = function (credentials) {
                Auth.signin(credentials, function (data, status) {
                    localStorageService.set('token', data.token);
                    localStorageService.set('principle', data.principle);
                    $state.go('home.greeting', {});
                    reload();
                }, function (data, status) {
                    $scope.message = data.message;
                    $state.go('home.sign-in', {});
                })
            }

            $scope.forgot = function (email) {
                Auth.forgot({email: email}, function(data, status) {
                    $scope.message = data.message;
                    $state.go('home.instruction', {});
                }, function(data, status) {
                    $scope.message = data.message;
                })
            }

            $scope.changePassword = function (password) {
                var token = $location.search().token;
                Auth.changePassword({password: password, token: token}, function(data, status) {
                    $scope.message = data.message;
                    $state.go('home.sign-in', {});
                }, function(data, status) {
                    $scope.message = data.message;
                })
            }

            var logout = function () {
                Auth.logout(function () {
                    $state.go('home.homepage', {});
                });
            }

            $scope.$on("$stateChangeSuccess", function() {
                if ($state.is('home.logout')) {
                    logout && logout();
                }
            })

        }
    ]);
