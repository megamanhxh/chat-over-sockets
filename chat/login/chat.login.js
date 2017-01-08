/**
 * Created by megam on 1/7/2017.
 */
'use strict';

angular.module('chat.login', ['ngRoute',
    'service.authentication'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '?path=login/chat.login.html',
            controller: 'login',
            controllerAs: 'vm'
        });
    }])

    .controller('login', function ($scope, $rootScope, $location, AuthenticationService) {
        var vm = this;
        vm.login = login;

        function login() {
            AuthenticationService.Login(vm.username, vm.password, function(response) {
                if (response.userID) {
                    AuthenticationService.SetCredentials(response.userID, response.userName);
                    $location.path('/');
                } else {

                }
            })
        }

    });
