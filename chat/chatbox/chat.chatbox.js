/**
 * Created by megam on 1/7/2017.
 */
'use strict';

angular.module('chat.chatbox', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '?path=chatbox/chat.chatbox.html',
            controller: 'chatbox',
            controllerAs: 'vm'
        });
    }])
    .controller('chatbox', function ($scope, $rootScope, $location) {
        var vm = this;

        var clearResizeScroll, conf, userID, insertI, lol, receivedMessage, userName;
        var socket = io('', {query: 'name=user1'});

        conf = {
            cursorcolor: "#696c75",
            cursorwidth: "4px",
            cursorborder: "none"
        };

        lol = {
            cursorcolor: "#cdd2d6",
            cursorwidth: "4px",
            cursorborder: "none"
        };

        clearResizeScroll = function () {
            $("#texxt").val("");
            $(".messages").getNiceScroll(0).resize();
            return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
        };

        receivedMessage = function () {
            $(".messages").getNiceScroll(0).resize();
            return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
        };

        insertI = function () {
            var innerText;
            innerText = $.trim($("#texxt").val());
            if (innerText !== "") {
                //send to the server
                socket.emit('CHAT_MSG', {"toUser": "user1", "content": innerText});
                clearResizeScroll();
            }
        };


        //Enable sockets
        socket.on('HANDSHAKE_SUCCESSFUL', function(msg){
            //this will get assigned one time once the connection successful
            userID = msg.userID;
            userName = msg.userName;
        });

        socket.on('CHAT_USER', function(msg){
            $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span><span class=\"name\"> You</span></div><div class=\"message\">" + msg + "</div></li>");
            receivedMessage();
        });

        socket.on('CHAT_OTHER', function(msg){
            $(".messages").append("<li class=\"friend-with-a-SVAGina\"><div class=\"head\"><span class=\"name\">Friend  </span><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span></div><div class=\"message\">" + msg + "</div></li>");
            receivedMessage();
        });

        socket.on('SYS_MSG', function(msg){
            $(".messages").append("<li class=\"system\"><div class=\"head\"><span class=\"name\">[System] </span><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span></div><div class=\"message\">" + msg + "</div></li>");
            receivedMessage();
        });

        $(document).ready(function () {
            $(".list-friends").niceScroll(conf);
            $(".messages").niceScroll(lol);
            $("#texxt").keypress(function (e) {
                if (e.keyCode === 13) {
                    insertI();
                    return false;
                }
            });
            return $(".send").click(function () {
                return insertI();
            });
        });
    });
