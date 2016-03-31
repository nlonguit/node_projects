/**
 * Created by Administrator on 3/29/2016.
 */
angular.module('loginApp.controllers')
    .controller('LoginCtrl', ['$scope', '$http', '$state', '$stateParams', '$resource', 'localStorageService',
        function($scope, $http, $state, $stateParams, $resource, $localStorage, localStorageService) {

            $scope.login = function(credentials) {
                $http.post('/authenticate', credentials).success(function(data, status) {
                    console.log(data.principle);
                    console.log(status);
                    if(!data.success) {
                        console.log(data.message);
                        $state.go('home.sign-up', {

                        });
                    }
                    else {
                        localStorageService.set('token',data.token);
                        $localStorage.set('principle',data.principle);
                        $state.go('home.greeting', {

                        });
                    }
                })
            }
        }]);
