/**
 * Created by Administrator on 3/30/2016.
 */
angular.module('loginApp.controllers')
    .controller('UserCtrl', ['$scope', '$http', '$state', '$stateParams', '$resource', 'User',
        function($scope, $http, $state, $stateParams, $resource, User) {
            // call when change page
            $scope.$on("$stateChangeSuccess", function() {
                // load list of sprints in a project
                if ($state.is('home.list-user')) {
                    loadUsers && loadUsers();
                }
            });

            var loadUsers = function(){
                $scope.users = User.query();
                console.log('list of users: ' + JSON.stringify($scope.user));
            }
        }]);