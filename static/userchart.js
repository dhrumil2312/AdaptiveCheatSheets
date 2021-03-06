'use strict';

var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller('AllActivityController', function ($scope, $http) {

    $scope.initForActivity = function () {
        // $http.defaults.useXDomain = true;
        // delete $http.defaults.headers.common['X-Requested-With'];
        var service = [];
        $http({
            url: '/userProfile/null/counter',
            method: 'GET'
        }).success(function (response) {

            console.log("userprofile counter from server", response);
            console.log("userprofile counter from server", response.upvote_sum);
            service.push(response.upvote_sum);
            service.push(response.downvote_sum);
            service.push(response.notes_shared_sum);
            service.push(response.note_access_sum);
            service.push(10);


            var userData = [];
            //Have to update the chart series data:
            for (var i = 0; i < 5; i++) {
                console.log("userprofile counter from server", service[i]);
                userData.push(service[i]);
            }

            var seriesArray = $scope.chartSeries[0];
            seriesArray.data = userData;
        });

        //Call for All user
        service = [];
        $http({
            url: '/userProfile/allUser/counter/',
            method: 'GET'
        }).success(function (response) {

            console.log("userprofile counter from server", response);
            service.push(response.upvote_sum + 10);
            service.push(response.downvote_sum + 10);
            service.push(response.notes_shared_sum + 10);
            service.push(response.note_access_sum + 10);
            service.push(40);

            var allUserData = [];
            //Have to update the chart series data:
            for (var i = 0; i < 5; i++) {
                console.log("all user counter from server", service[i]);
                allUserData.push(service[i] + 3 * i * 30 + 13);
            }

            var seriesArray = $scope.chartSeries[1];
            console.log(seriesArray, "new series array users ");
            seriesArray.data = allUserData;
        });
    };

    $scope.chartSeries = [
        {
            "name": " User Activity : " + "current user",
            "data": [],
            connectNulls: true,
            id: 'User Activity Counter'

        },

        {
            "name": "Social Users Activities",
            "data": [],
            connectNulls: true,
            id: 'Social Users Activities'
        }

    ];

    $scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "bar", "title": "Bar"},
        {"id": "pie", "title": "Pie"},
        {"id": "scatter", "title": "Scatter"}
    ];

    $scope.dashStyles = [
        {"id": "Solid", "title": "Solid"},
        {"id": "ShortDash", "title": "ShortDash"},
        {"id": "ShortDot", "title": "ShortDot"},
        {"id": "ShortDashDot", "title": "ShortDashDot"},
        {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        {"id": "Dot", "title": "Dot"},
        {"id": "Dash", "title": "Dash"},
        {"id": "LongDash", "title": "LongDash"},
        {"id": "DashDot", "title": "DashDot"},
        {"id": "LongDashDot", "title": "LongDashDot"},
        {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    ];


    $scope.chartStack = [
        {"id": '', "title": "No"},
        {"id": "normal", "title": "Normal"},
        {"id": "percent", "title": "Percent"}
    ];

    var seriesId = 0;


    $scope.addSeries = function () {
        var newUser = $scope.newUser;

        $http({
            url: '/userProfile/' + newUser + '/counter',
            method: 'GET'
        }).success(function (response) {
            var service = response;
            console.log(service, "add series call response of qwe");

            var userData = [];
            //Have to update the chart series data:
            for (var i = 0; i < service.length; i++)
                userData.push(service[i].activityCounter);

            var sId = 'series of' + newUser + seriesId++;
            $scope.chartConfig.series.push({
                data: userData,
                "name": "User Activity : " + newUser,
                id: sId
            });


        });
    };

    $scope.removeSeries = function (id) {
        var seriesArray = $scope.chartConfig.series;
        seriesArray.splice(id, 1);
    };

    $scope.toggleHighCharts = function () {
        this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks;
    };


    $scope.replaceAllSeries = function () {
        var data = [
            {name: "first", data: [10], id: 'a'},
            {name: "second", data: [3], id: 'b'},
            {name: "third", data: [13], id: 'c'}
        ];
        $scope.chartConfig.series = data;
    };


    $scope.chartConfig = {
        subtitle: {
            text: 'Click and drag to zoom in.'
        },

        chart: {
            height: 500,
            width: 1500,
            type: 'line',
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -45
                },
                theme: {
                    fill: 'yellow',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#41739D',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                }
            }
        },

        navigator: {
            enabled: true,
            series: {
                data: []
            }
        },

        tooltip: {
            shared: true,
            crosshairs: [true, true]
        },


        plotOptions: {
            series: {
                stacking: ''
            }
        },

        xAxis: {
            categories: ['upvote count', 'downvote count', 'Notes Shared', ' Access count ', 'highlighted activity count'],
            title: {
                text: null
            },
            padding: 20

        },

        series: $scope.chartSeries,
        title: {
            text: 'User Activity Graph'
        }
    }

    $scope.reflow = function () {
        $scope.$broadcast('highchartsng.reflow');
    };


})
;


myapp.controller('LoginActivityController', function ($scope, $http, $window) {

    var username = "current user";

    //To load the data of the logged in user.
    $scope.initForLoginActivity = function () {
        var service = [];

        $http.get('../static/jsonData/loginUserData.json')
            .then(function (jsonData) {

                service = jsonData.data;
                console.log("", service);

                var userData = [];
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++)
                    userData.push(service[i].loginCounter);


                var seriesArray = $scope.chartSeries[0];
                seriesArray.data = userData;

            });

        $http.get('../static/jsonData/loginAllUserData.json')
            .then(function (jsonData) {

                service = jsonData.data;
                console.log("all user activity", service);

                var allUserData = [];
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++)
                    allUserData.push(service[i].loginCounter);

                var seriesArray = $scope.chartSeries[1];
                console.log(seriesArray, "new series array users ");
                seriesArray.data = allUserData;
            });
    };

    $scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "bar", "title": "Bar"},
        {"id": "pie", "title": "Pie"},
        {"id": "scatter", "title": "Scatter"}
    ];

    $scope.dashStyles = [
        {"id": "Solid", "title": "Solid"},
        {"id": "ShortDash", "title": "ShortDash"},
        {"id": "ShortDot", "title": "ShortDot"},
        {"id": "ShortDashDot", "title": "ShortDashDot"},
        {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        {"id": "Dot", "title": "Dot"},
        {"id": "Dash", "title": "Dash"},
        {"id": "LongDash", "title": "LongDash"},
        {"id": "DashDot", "title": "DashDot"},
        {"id": "LongDashDot", "title": "LongDashDot"},
        {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    ];

    $scope.chartSeries = [
        {"name": "User System Usage: " + username, "data": [], id: '' + username},
        {"name": "Social Users System Usage", "data": [], connectNulls: true, id: 'All Users'}
    ];

    $scope.chartStack = [
        {"id": '', "title": "No"},
        {"id": "normal", "title": "Normal"},
        {"id": "percent", "title": "Percent"}
    ];


    var seriesId = 0;

    //Adding the series of new user
    $scope.addSeries = function () {


        var newUser = $scope.newUser;

        $http.get('../static/jsonData/newLoginUserCounter.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "add series call response of qwe");

                var userData = [];
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++)
                    userData.push(service[i].loginCounter);

                var sId = 'series of' + "qwe" + seriesId++;
                $scope.chartConfig.series.push({
                    data: userData,
                    "name": "User Activity : " + newYear + " : " + newUser,
                    id: sId
                });

            });
    };

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1);
    };

    $scope.removeSeries = function (id) {
        var seriesArray = $scope.chartConfig.series;
        seriesArray.splice(id, 1);
    };

    $scope.replaceAllSeries = function () {
        var data = [
            {name: "first", data: [10], id: 'a'},
            {name: "second", data: [3], id: 'b'},
            {name: "third", data: [13], id: 'c'}
        ];
        $scope.chartConfig.series = data;
    };

    $scope.chartConfig = {
        subtitle: {
            text: 'Click and drag to zoom in.'
        },

        chart: {
            height: 500,
            width: 1600,
            type: 'areaspline',
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -45
                },
                theme: {
                    fill: 'yellow',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#41739D',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                }

            }
        },
        navigator: {
            enabled: true,
            series: {
                data: []
            }
        },

        tooltip: {
            shared: true,
            crosshairs: [true, true]
        },


        plotOptions: {
            series: {
                stacking: ''
            }
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'March', ' April ', ' May ', 'June', 'July', 'August', 'Sept', 'October', 'November', 'December'],
            title: {
                text: null
            },
            padding: 20

        },

        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },


        series: $scope.chartSeries,
        title: {
            text: 'User Login Activity Chart'
        }
    }

    $scope.reflow = function () {
        $scope.$broadcast('highchartsng.reflow');
    };


});


myapp.controller('ExploredTopicActivityController', function ($scope, $http, $window) {


    // var username = $window.sessionStorage.getItem("username");
    var username = "current user";


    $scope.initForLoginActivity = function () {
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];
        var service = [];


        $http.get('../static/jsonData/topicCounter.json')
            .then(function (jsonData) {

                service = jsonData.data;

                console.log("topic counter json", service);

                var userData = [];
                var topics = [];

                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    userData.push(service[i].counter);
                    topics.push(service[i].topic);
                }

                var seriesArray = $scope.chartSeries[0];
                var categories = $scope.chartConfig;

                console.log(seriesArray, categories, "particular user topic counter  ");

                seriesArray.data = userData;

            });

        $http.get('../static/jsonData/topicCounter.json')
            .then(function (jsonData) {

                service = jsonData.data;
                console.log(service);

                var allUserData = [];
                var topics = [];
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    allUserData.push(service[i].globalCounter);
                    topics.push(service[i].topic);
                }

                var seriesArray = $scope.chartSeries[1];
                var categories = $scope.chartConfig.xAxis;
                console.log(seriesArray, categories, "all user topic counter  ");
                seriesArray.data = allUserData;
                $scope.chartConfig.xAxis.categories = topics;

            });
    };


    $scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "bar", "title": "Bar"},
        {"id": "pie", "title": "Pie"},
        {"id": "scatter", "title": "Scatter"}
    ];

    $scope.dashStyles = [
        {"id": "Solid", "title": "Solid"},
        {"id": "ShortDash", "title": "ShortDash"},
        {"id": "ShortDot", "title": "ShortDot"},
        {"id": "ShortDashDot", "title": "ShortDashDot"},
        {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        {"id": "Dot", "title": "Dot"},
        {"id": "Dash", "title": "Dash"},
        {"id": "LongDash", "title": "LongDash"},
        {"id": "DashDot", "title": "DashDot"},
        {"id": "LongDashDot", "title": "LongDashDot"},
        {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    ];

    $scope.chartSeries = [
        {"name": "Explored Topics graph: " + username, "data": [], id: 's1'},
        {"name": "Explored Topics graph: All User", "data": [], connectNulls: true, id: 's2'}
    ];

    $scope.chartStack = [
        {"id": '', "title": "No"},
        {"id": "normal", "title": "Normal"},
        {"id": "percent", "title": "Percent"}
    ];


    var seriesId = 0;

    $scope.addSeries = function () {

        var newUser = $scope.newUser;


        $http.get('../static/jsonData/newTopicCounter.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "add series call response of new user topic");

                var userData = [];
                for (var i = 0; i < service.length; i++) {
                    userData.push(service[i].counter);
                }

                var sId = 'series of' + newUser + seriesId++;
                $scope.chartConfig.series.push({
                    data: userData,
                    "name": "User Activity : " + newUser,
                    id: sId
                });

            });

    };


    $scope.removeSeries = function (id) {
        var seriesArray = $scope.chartConfig.series;
        seriesArray.splice(id, 1);
    };

    $scope.replaceAllSeries = function () {
        var data = [
            {name: "first", data: [10], id: 'a'},
            {name: "second", data: [3], id: 'b'},
            {name: "third", data: [13], id: 'c'}
        ];
        $scope.chartConfig.series = data;
    };

    $scope.chartConfig = {
        subtitle: {
            text: 'Click and drag to zoom in.'
        },

        chart: {
            height: 500,
            width: 1600,
            type: 'column',
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -45
                }, theme: {
                    fill: 'yellow',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#41739D',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                }
            }
        },
        navigator: {
            enabled: true,
            series: {
                data: []
            }
        },

        tooltip: {
            shared: true,
            crosshairs: [true, true]
        },


        plotOptions: {
            series: {
                stacking: ''
            }
        },

        //Have to get it from server
        xAxis: {
            range: 0,
            categories: [],
            title: {
                text: null
            },
            padding: 20

        },

        series: $scope.chartSeries,
        title: {
            text: 'Explored Topic Activity Chart'
        }
    }

    $scope.reflow = function () {
        $scope.$broadcast('highchartsng.reflow');
    };


});
