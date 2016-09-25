const gameServerAdmin = angular.module('gameServerAdmin', []); //eslint-disable-line

const client = {};

function mainController($scope, $http) { // eslint-disable-line
  $scope.clientId = 1;
  $scope.statusData = {};
  $scope.formData = {};
  $scope.requestHistory = [];
  $scope.errorHappened = 'hide';
  $scope.token = 'TOKEN NOT GIVEN YET';

  $scope.formData.verb = 'POST';

  $scope.makeRequest = function() {
    $http.post('/api', $scope.formData)
      .success(function(res) {
        $scope.requestHistory.push(res.data.request);
        if (res.data.error) {
          $scope.errorHappened = 'show';
          $scope.resBody = JSON.stringify(res.data.error, null, 2);
          return;
        }
        $scope.errorHappened = 'hide';
        $scope.formData.clientId = client.id = $scope.clientId;
        $scope.resBody = JSON.stringify(res.data.body, null, 2);
      })
      .error(function(data) {
        $scope.errorHappened = 'show';
        console.log('Error: ' + data);
        $scope.resBody = JSON.stringify(data.error, null, 2);
        $scope.requestHistory.push(data.request);
      });
  };

  $scope.refreshClient = function() {
    $http.get('/api/admin/whoami',{
      headers: {
        token: $scope.token,
      },
    }).success((whoami) => {
      $scope.formData.clientId = client.id = $scope.clientId = whoami.id;
      $http.post('/api', {
        clientId: client.id,
        verb: 'GET',
        path: '/',
      }).success(function(res) {
        for (let i = 0; i < res.data.body.data.length; i++) {
          if (res.data.body.data[i].clientId === client.id) {
            client.config = res.data.body.data[i];
          }
        }
      });
      $http.post('/api', {
        clientId: client.id,
        verb: 'GET',
        path: '/queue',
      }).success(function(res) {
        client.queues = res.data.body.data;
        for (let i = 0; i < client.queues.length; i++) {
          client.queues[i].config = JSON.stringify(client.queues[i].config, null, 2);
        }
        $scope.statusData = client;
      });
    });
  };

  $scope.createClient = function() {
    $scope.formData.clientId = client.id = $scope.clientId;
    console.log(client.id);
    $http.post('/api/createClient', {})
    .success(function(res) {
      $scope.token = res.token;
      console.log('Token: ' + $scope.token);
      $scope.statusData = res.body;
    });
  };

  $scope.createQueue = function() {
    const options = {
      method: 'POST',
      url: '/api/admin/createQueue',
      headers: {
        token: $scope.token,
      },
    };
    $http(options)
    .success(function(res) {
      $scope.statusData = res;
      console.log(res);
    });
  };

  $scope.addPlayer = function() {
    $scope.formData.clientId = client.id = $scope.clientId;
    console.log($scope.formData);
    if(!$scope.formData.queueId) {
      return alert('Please enter queue Id');
    }
    const options = {
      method: 'POST',
      url: '/api/admin/addPlayer',
      headers: {
        token: $scope.token,
      },
      data: {
        queue: {
          id: $scope.formData.queueId,
          config: {
            aspectNames: ['elo'],
            considerAspect: { elo: true },
            aspectWeight: { elo: 1 },
          },
        },
      },
    };
    $http(options)
    .success(function(res) {
      //$scope.statusData = res;
    });
  };
  $scope.isDrafted = function(d) {
    return d ? 'drafted' : 'notDrafted';
  };
}
