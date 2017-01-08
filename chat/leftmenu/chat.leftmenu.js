/**
 * Created by megam on 1/7/2017.
 */

angular.module('chat.leftmenu', ['ngRoute'])
    .controller('leftmenu', function ($rootScope, $scope) {
        var vm = this;

        vm.changeConversation = changeConversation;

        (function initController() {
            vm.userinfo = $rootScope.globals.currentUser;
        })();

        if (vm.userinfo) {
            updateContacts();
        } else {
            vm.contacts = [];
        }

        function updateContacts() {
            vm.contacts = [
                {
                    id: "user1",
                    name: "User1",
                    image: "http://cs625730.vk.me/v625730358/1126a/qEjM1AnybRA.jpg",
                    online: true
                },
                {
                    id: "user2",
                    name: "User2",
                    image: "http://lorempixel.com/50/50/people/1",
                    online: false
                }
            ];
        }

        function changeConversation(id) {
            $rootScope.currentConversation = {
                userID: id
            };
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            vm.userinfo = $rootScope.globals.currentUser;
            updateContacts();
        });
    });
