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
      //$scope.formData.clientId = client.id = $scope.clientId = whoami.id;
      $http.post('/api', {
        verb: 'GET',
        path: `/queue/${$scope.formData.queueId}`,
      }).success(function(res) {
          $scope.statusData = res.data.body.data.item;
//        client.queues = res.data.body.data;
//        for (let i = 0; i < client.queues.length; i++) {
//          client.queues[i].config = JSON.stringify(client.queues[i].config, null, 2);
//        }
//        $scope.statusData = client;
      });
    });
  };

  $scope.createClient = function() {
    $scope.formData.clientId = client.id = $scope.clientId;
    $http.post('/api/createClient', {})
    .success(function(res) {
      $scope.token = res.token;
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
      $scope.formData.queueId = res.data.item.key;
      console.log(res);
    });
  };

  $scope.addPlayer = function() {
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
        },
      },
    };
    $http(options)
    .success(function(res) {
      $scope.refreshClient();
    });
  };

  $scope.findMatches = function () {
    const options = {
      method: 'POST',
      url: '/api/admin/findMatches',
      headers: {
        token: $scope.token,
      },
      data: {
        queue: {
          id: $scope.formData.queueId,
        },
      },
    };
    $http(options)
    .success(function(res) {
      $scope.refreshClient();
    });
  };
}
