/**
 * Created by Administrator on 4/7/2016.
 */
angular.module('shopAdvisor.controllers')
    .controller('HeaderCtrl', ['$scope', '$http', '$state', '$stateParams', 'localStorageService', '$location',
        function($scope, $http, $state, $stateParams, localStorageService, $location) {
            if (localStorageService.get('principle')) {
                console.log('changeHeader: ' + JSON.stringify(localStorageService.get('principle')));
                $scope.changeHeader = true;
            } else {
                console.log('changeHeader: ' + JSON.stringify(localStorageService.get('principle')));
                $scope.changeHeader = false;
            }
        }])