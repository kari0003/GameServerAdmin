var gameServerAdmin = angular.module('gameServerAdmin', []);

const client = {};

function mainController($scope, $http) {
    $scope.clientId = 1;
    $scope.statusData = {};
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
              $scope.formData.clientId = client.id = $scope.clientId;
              $scope.resBody = JSON.stringify(res.data.body, null, 2);
            })
            .error(function(data) {
                $scope.errorHappened="show";
                console.log('Error: ' + data);
                $scope.resBody = JSON.stringify(res.data.error, null, 2);
                $scope.requestHistory.push(res.data.request);
            });
    };

    $scope.refreshClient = function() {
      $scope.formData.clientId = client.id = $scope.clientId;
      $http.post('/api', {
        clientId: client.id,
        verb: 'GET',
        path: '/',
      }).success(function(res) {
        for(var i = 0; i < res.data.body.length; i++){
          if(res.data.body[i].clientId === client.id){
            client.config = res.data.body[i];
          }
        }
      });
      $http.post('/api', {
        clientId: client.id,
        verb: 'GET',
        path: '/queue',
      }).success(function(res) {
        client.queues = res.data.body;
        for(let i = 0; i < client.queues.length; i++){
          client.queues[i].config = JSON.stringify(client.queues[i].config, null, 2);
        }
        $scope.statusData = client;
        console.log(client);
      });
    };

    $scope.isDrafted = function(d){
      return d ? "drafted" : "notDrafted";
    };
}
