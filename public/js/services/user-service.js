/**
 * Created by Administrator on 3/30/2016.
 */
angular.module('loginApp.services').factory('User', ['$resource', function($resource) {
    var User = $resource('./api/users/:id', {id: '@_id'},
        {
            update: {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':localStorage['token']
                }
            },
            pupdate: {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':localStorage['token']
                }
            },
            query: {
                method:'GET',
                isArray:true,
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':localStorage['token']
                }
            }
        });
    return User;
} ]);