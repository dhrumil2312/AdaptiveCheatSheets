'use strict';


var loginApp = angular.module('loginApp', []);



loginApp.controller('loginController', function ($scope, $http, $location, $window) {


    $scope.authenticate = function () {
        $http({
            url: 'http://localhost:8989/login/' + $scope.username + '/' + $scope.password,
            dataType: 'text',
            method: 'GET',
            data: '',
            headers: {
                "Accept": "text/plain",
                "Content-Type": "text/plain"
            }
        }).success(function (response) {
            console.log(response);
            if (response != 'Invalid') {
                alert("Success!!");
                // $location.path("http://localhost:8989/userProfile/" + $scope.username);

                $window.sessionStorage.setItem("username",$scope.username);
                $window.location.href = "http://localhost:8989/userProfile/" + $scope.username;
            }
            else {
                alert("Invalid user name or password!!");
            }


        });


    };

    $scope.saveData = function () {
        $http({
            url: 'http://localhost:8989/signup/' + $scope.username + '/' + $scope.password,
            dataType: 'text',
            method: 'GET',
            data: '',
            headers: {
                "Accept": "text/plain",
                "Content-Type": "text/plain"
            }
        }).success(function (response) {

            console.log(response);

            if (response == 'Successfully signed up') {
                alert("Successfully signed up!!");
                // $location.path("/Login.html");
                $window.location.href = "http://localhost:8989/loginPage";
            }


        });


    };


});