/**
 * Created by Administrator on 3/29/2016.
 */
'use strict';
(function(angular) {

    angular.module('shopAdvisor.controllers', []);
    angular.module('shopAdvisor.services', []);
    angular.module('shopAdvisor.modules', ['ngResource', 'ui.router', 'LocalStorageModule']);
    angular.module('shopAdvisor', ['shopAdvisor.modules', 'shopAdvisor.routes', 'shopAdvisor.controllers', 'shopAdvisor.services'])
        .config(function(localStorageServiceProvider){
            localStorageServiceProvider
                .setPrefix('ShopAdvisor')
                .setStorageType('localStorage')
                .setNotify(true, true);
            // localStorageServiceProvider.setStorageCookieDomain('example.com');
        });
}(angular));