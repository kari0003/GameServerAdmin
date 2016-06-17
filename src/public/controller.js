// public/core.js
var gameServerAdmin = angular.module('gameServerAdmin', []);

function mainController($scope, $http) {
    $scope.clientId = 1;
    $scope.formData = {};
    $scope.requestHistory = [];

    $scope.formData.verb = 'POST';

    // when submitting the add form, send the text to the node API
    $scope.makeRequest = function() {
        $http.post('/api', $scope.formData)
            .success(function(res) {
                console.log(res);
                //parsedData = JSON.parse(data);
                $scope.formData.clientId = $scope.clientId;
                $scope.requestHistory.push(res.data.request);
                $scope.resBody = JSON.stringify(res.data.body, null, 2);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
/*
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
*/
}
