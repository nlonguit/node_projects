/**
 * Created by Administrator on 3/30/2016.
 */
angular.module('loginApp.services').factory('User', ['$resource', 'localStorageService', function($resource, localStorageService) {
    var getToken = function() {
        console.log('local storage: ' + localStorageService);
        return localStorageService.get('token');
    }
    var User = $resource('./api/users/:id', {id: '@_id'},
        {
            update: {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getToken
                }
            },
            pupdate: {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getToken
                }
            },
            query: {
                method:'GET',
                isArray:true,
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getToken
                }
            }
        });

    return User;
} ]);