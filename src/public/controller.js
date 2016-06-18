var gameServerAdmin = angular.module('gameServerAdmin', []);

function mainController($scope, $http) {
    $scope.clientId = 1;
    $scope.formData = {};
    $scope.requestHistory = [];
    $scope.errorHappened = "hide";

    $scope.formData.verb = 'POST';

    $scope.makeRequest = function() {
        $http.post('/api', $scope.formData)
            .success(function(res) {
              $scope.requestHistory.push(res.data.request);
              if(res.data.error){
                $scope.errorHappened="show";
                $scope.resBody = JSON.stringify(res.data.error, null, 2);
                return;
              }
              $scope.errorHappened="hide";
              $scope.formData.clientId = $scope.clientId;
              $scope.resBody = JSON.stringify(res.data.body, null, 2);
            })
            .error(function(data) {
                $scope.errorHappened="show";
                console.log('Error: ' + data);
                $scope.resBody = JSON.stringify(res.data.error, null, 2);
                $scope.requestHistory.push(res.data.request);
            });
    };
}
