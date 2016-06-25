var algoApp = angular.module("algoApp", ['ngConstellation']);
algoApp.controller('mainController', ['$scope', 'constellationConsumer', '$location',
    function ($scope, constellation, $location) {
        $scope.ConditionsPrototype ={
                "Value": undefined,
                "DynamicValue": null,
                "OperationTested": undefined,
                "IsTrue": false,
                "Variables": {
                    "sentinel": "",
                    "package": "",
                    "variable": ""
                }};
        $scope.ExecutionPrototype ={
                    "Arguments": [],
                "Variables": {
                    "sentinel": "",
                    "package": "",
                    "callBack": ""
                }};
        $scope.Algorithme =
            {
                "Description": "",
                "URLPhotoDescription": "http://lorempixel.com/700/300/technics/",
                "Waiting": 0,
                "IsActive": true,
                "Conditions": [
                    $scope.ConditionsPrototype
                ],
                "Executions": [
                    $scope.ExecutionPrototype
                ],
                "Name": "",
                "DisableAfterRealisation": false,
                "Schedule": {
                    "Week": {
                        "Sunday": true,
                        "Monday": true,
                        "Tuesday": true,
                        "Wednesday": true,
                        "Thursday": true,
                        "Friday": true,
                        "Saturday": true
                    },
                    "Begin": {
                        "Second": 0,
                        "Minute": 0,
                        "Hour": 0,
                        "Day": 1,
                        "Month": 1
                    },
                    "End": {
                        "Second": 59,
                        "Minute": 59,
                        "Hour": 23,
                        "Day": 31,
                        "Month": 12
                    },
                    "ReactivationPeriode": "Minutes"
                }
            }
        $scope.sent = "Developer";
        if ($location.search().sentinel)
        {
            $scope.sent = $location.search().sentinel;
        }
        
        $scope.algoName = undefined;

        if ($location.search().name) {
            $scope.algoName = $location.search().name;
        }

        $scope.state = false;
        $scope.listeAlgos = [];

        constellation.intializeClient("http://localhost:8088", "8dea78b76b83d2ea291ed68db80e5cb1fd630ec8", "test");

        constellation.onUpdateStateObject(function (stateobject) {
            $scope.$apply(function () {

                if ($scope[stateobject.SentinelName] == undefined) {
                    $scope[stateobject.SentinelName] = {};
                }
                if ($scope[stateobject.SentinelName][stateobject.PackageName] == undefined) {
                    $scope[stateobject.SentinelName][stateobject.PackageName] = {};
                }
                $scope[stateobject.SentinelName][stateobject.PackageName][stateobject.Name] = stateobject;
                if ($scope[$scope.sent] != undefined && $scope[$scope.sent]['AlgorithmePackage'] != undefined && $scope[$scope.sent]['AlgorithmePackage']['PausedAlgorithmes'] != undefined) {

                    $scope.listeAlgos[0] = $scope[$scope.sent]['AlgorithmePackage']['PausedAlgorithmes'];
                }
                if ($scope[$scope.sent] != undefined && $scope[$scope.sent]['AlgorithmePackage'] != undefined && $scope[$scope.sent]['AlgorithmePackage']['Algorithmes'] != undefined) {

                    $scope.listeAlgos[1] = $scope[$scope.sent]['AlgorithmePackage']['Algorithmes'];
                }
                if ($scope.listeAlgos.length == 2 && $scope.algoName != undefined) {
                    $scope.loadAlgo($scope.listeAlgos);
                }
            });
        });

        constellation.onConnectionStateChanged(function (change) {
            $scope.$apply(function () {
                $scope.state = change.newState == $.signalR.connectionState.connected;
            });

            if (change.newState == $.signalR.connectionState.connected) {

                constellation.requestSubscribeStateObjects("*", "AlgorithmePackage", "*", "*");
            }
        });
        $scope.loadAlgo = function (algos) {
            for (i in algos) {
                for (j in algos[i].Value) {
                    if (algos[i].Value[j].Name == $scope.algoName) {
                        $scope.Algorithme = algos[i].Value[j];
                    }
                }
            }
        };

        $scope.addExecution = function()
        {
            $scope.Algorithme.Executions.push($scope.ExecutionsPrototype);
        }
        $scope.addCondition = function () {
            $scope.Algorithme.Conditions.push($scope.ConditionsPrototype);
        }



        constellation.connect();
    }]);
algoApp.controller('titleController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.title = "Nouvel Algorithme";
        if ($location.search().name) {
            $scope.title = "Algorithme : " + $location.search().name;
        }
    }]);
