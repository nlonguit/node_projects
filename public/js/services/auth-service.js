/**
 * Created by Administrator on 4/1/2016.
 */
angular.module('shopAdvisor.services').factory('Auth', ['$http', 'localStorageService',
    function($http, localStorageService) {
        return {
            signin: function (data, success, error) {
                $http.post('./authenticate', data).success(success).error(error);
            },

            logout: function(success) {
                localStorageService.clearAll();
                success();
            },

            forgot: function(data, success, error) {
                $http.post('./forgot', data).success(success).error(error);
            },

            changePassword: function(data, success, error) {
                $http.post('./reset', data).success(success).error(error);
            }
        }
    }
]);