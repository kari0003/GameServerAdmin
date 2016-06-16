// public/core.js
var gameServerAdmin = angular.module('gameServerAdmin', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when submitting the add form, send the text to the node API
    $scope.makeRequest = function() {
        $http.post('/api', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.resBody = JSON.stringify(data, null, 2);
                console.log(data);
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