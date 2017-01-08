/**
 * Created by megam on 1/7/2017.
 */
(function () {
    'use strict';
    angular.module('service.authentication', ['ngRoute','ngCookies'])
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope'];
    function AuthenticationService($http, $cookieStore, $rootScope) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.GetCredentials = GetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.isExpired = isExpired;

        return service;

        function Login(username, password, callback) {
            $http({
                method: 'POST',
                url: 'http://localhost:3000/auth',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //based on API structure
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { username: username, password: password, grant_type: "password" }
            }).then(function onSuccess(response) {
                // Handle success
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                callback(response.data);
            }).catch(function onError(response) {
                // Handle error
                var data = response.data;
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
                callback(response.data);
            });
        }

        function SetCredentials(userID, userName) {
            $rootScope.globals = {
                currentUser: {
                    userID: userID,
                    userName: userName
                }
            };

            var exp = new Date();
            exp.setSeconds(exp.getSeconds() + 300000);
            //$http.defaults.headers.common['Authorization'] = token_type + ' ' + access_token; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals, { expires: exp });
        }

        function GetCredentials() {
            return ($rootScope.globals.currentUser ? $rootScope.globals.currentUser : false);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = '';
        }

        function isExpired(callback) {
            callback(true);
            // $http({
            //     method: 'POST',
            //     url: rootAPIHost + 'PortalWS/AppUsers/RefreshToken'
            // }).success(function (response) {
            //     callback(false);
            // }).error(function (response) {
            //     callback(true);
            // });
        }
    }

})();
