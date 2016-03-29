'use strict';
angular.module('loginApp.routes', [])
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactoryProvider){
        $urlMatcherFactoryProvider.strictMode(false);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){
        // Redirect to '/' in case of unmatched url
        $urlRouterProvider.otherwise('/not-found');

        // Setup the states
        $stateProvider
            .state('home', {
                abstract : true,
                // Note: abstract still needs a ui-view for its children
                // to populate
                template : '<ui-view/>'
            })
            .state('home.signup', {
                url: '/',
                templateUrl: '../views/pages/login.html',
                controller: 'LoginCtrl'
            });
        //https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-make-a-trailing-slash-optional-for-all-routes
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.url();
            // check to see if the path already has a slash where it should be
            if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
                return;
            }
            if (path.indexOf('?') > -1) {
                return path.replace('?', '/?');
            }
            return path + '/';
        });
    }]);