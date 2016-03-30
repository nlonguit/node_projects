/**
 * Created by Administrator on 3/29/2016.
 */
angular.module('loginApp.controllers')
    .controller('LoginCtrl', ['$scope', '$http', '$state', '$stateParams', '$resource',
        function($scope, $http, $state, $stateParams, $resource) {

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
                        localStorage['token'] = data.token;
                        localStorage['principle'] = data.principle;
                        $state.go('home.greeting', {

                        });
                    }
                })
            }
        }]);
