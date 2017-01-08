/**
 * Created by megam on 1/7/2017.
 */

'use strict';

// Declare app level module which depends on views, and components
angular.module('chat', [
    'ngRoute',
    'ngCookies',
    'service.authentication',
    'chat.login',
    'chat.chatbox',
    'chat.leftmenu'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    //$locationProvider.hashPrefix('#');

    $routeProvider.otherwise({redirectTo: '/'});
}]).run(function ($rootScope, $location, $cookieStore, AuthenticationService) {
    $rootScope.globals = $cookieStore.get('globals') || {};
    // if ($rootScope.globals.currentUser) {
    //     $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.token_type + ' ' + $rootScope.globals.currentUser.access_token; // jshint ignore:line
    // }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
        var loggedIn = $rootScope.globals.currentUser;

        if (restrictedPage && !loggedIn) {
            routeToLogin();
        }
    });

    $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
        $rootScope.animation = currRoute.animation;
    });

    function routeToLogin() {
        $location.path('/login'); //enable to restrict navigation
    }
});
