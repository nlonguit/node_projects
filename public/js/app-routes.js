'use strict';
angular.module('shopAdvisor.routes', [])
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactoryProvider){
        $urlMatcherFactoryProvider.strictMode(false);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){
        // Redirect to '/' in case of unmatched url
        $urlRouterProvider.otherwise('/');

        // Setup the states
        $stateProvider
            .state('home', {
                abstract : true,
                // Note: abstract still needs a ui-view for its children
                // to populate
                template : '<ui-view/>'
            })
            .state('home.homepage', {
                url: '/',
                templateUrl: '/public/views/partials/homepage.html',
                controller: ''
            })
            .state('home.sign-up', {
                url: '/sign-up',
                templateUrl: '/public/views/partials/register.html',
                controller: 'RegCtrl'
            })
            .state('home.sign-in', {
                url: '/sign-in',
                templateUrl: '/public/views/partials/login.html',
                controller: 'AuthenticationCtrl'
            })
            .state('home.forgot', {
                url: '/forgot',
                templateUrl: '/public/views/partials/forgot-password.html',
                controller: 'AuthenticationCtrl'
            })
            .state('home.reset', {
                url: '/password-reset',
                templateUrl: '/public/views/partials/reset-password.html',
                controller: 'AuthenticationCtrl'
            })
            .state('home.logout', {
                url: '/logout',
                controller: 'AuthenticationCtrl'
            })
            .state('home.greeting', {
                url: '/greeting',
                templateUrl: '/public/views/partials/greeting.html',
                controller: ''
            })
            .state('home.list-user', {
                url: '/list-user',
                templateUrl: '/public/views/partials/list-user.html',
                controller: 'UserCtrl'
            })
            .state('home.instruction', {
                url: '/instruction',
                templateUrl: '/public/views/partials/instruction.html',
                controller: ''
            })
            .state('home.findyourshop', {
                url: '/find-your-shop',
                templateUrl: '/public/views/partials/find-your-shop.html',
                controller: 'FindYourShopCtrl'
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