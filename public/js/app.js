/**
 * Created by Administrator on 3/29/2016.
 */
'use strict';
(function(angular) {

    angular.module('loginApp.controllers', []);
    angular.module('loginApp.services', []);
    angular.module('loginApp.modules', ['ngResource', 'ui.router']);
    angular.module('loginApp', ['loginApp.modules', 'loginApp.routes', 'loginApp.controllers', 'loginApp.services']);
}(angular));