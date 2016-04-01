/**
 * Created by Administrator on 4/1/2016.
 */
angular.module('loginApp.services').factory('Auth', ['$http', 'localStorageService',
    function($http, localStorageService) {
        return {
            signin: function (data, success, error) {
                $http.post('/authenticate', data).success(success).error(error)
            },

            logout: function(success) {
                localStorageService.clearAll();
                success();
            }
        }
    }
]);