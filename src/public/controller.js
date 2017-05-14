const client = {};

angular.module('gameServerAdmin', ['chart.js']) //eslint-disable-line
.constant('_', window._)
.controller('mainController', function ($scope, $http, _) { // eslint-disable-line
  $scope.clientId = 1;
  $scope.statusData = {};
  $scope.formData = {};
  $scope.requestHistory = [];
  $scope.errorHappened = 'hide';
  $scope.token = 'TOKEN NOT GIVEN YET';
  $scope.statistics = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    series: ['Elo Matcher'],
    data: [[12, 13, 43, 53, 21, 11, 1]],
    options: {
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
        }],
      },
    },
    colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
  };
  $scope.matchStatistics = {
    labels: ['tbd'],
    series: ['Elo Matcher'],
    data: [[0]],
    options: {
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
        }],
      },
    },
    colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
  };

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
          $scope.refreshChart();
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
      $scope.formData.queueId = res.data.item.id;
      console.log(res);
    });
  };

  $scope.addPlayers = function() {
    if(!$scope.formData.queueId) {
      return alert('Please enter queue Id');
    }
    const options = {
      method: 'POST',
      url: '/api/admin/addPlayers',
      headers: {
        token: $scope.token,
      },
      data: $scope.formData,
    };
    $http(options)
    .success(function(res) {
      $scope.refreshClient();
    });
  };

  $scope.startMatch = function() {
    if(!$scope.formData.queueId) {
      return alert('Please enter queue Id');
    }
    if(!$scope.formData.startMatchId) {
      return alert('Please select matchId to start');
    }
    const options = {
      method: 'POST',
      url: '/api/admin/startMatch',
      headers: {
        token: $scope.token,
      },
      data: {
        queueId: $scope.formData.queueId,
        startMatchId: $scope.formData.startMatchId,
      },
    };
    $http(options)
    .success(function(res) {
      $scope.refreshClient();
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
        queueId: $scope.formData.queueId,
      },
    };
    $http(options)
    .success(function(res) {
      $scope.refreshClient();
    });
  };

  // Init chart.js provider:
//  ChartJsProvider.setOptions({
//    colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
//  });

  $scope.refreshChart = function () {
    const precision = 15;
    const rawData = _.map($scope.statusData.entries, (entry) => entry.player.traits.elo);
    const step = (_.max(rawData) - _.min(rawData)) / precision;
    $scope.statistics.labels = _.times(precision, (i) => parseInt(_.min(rawData) + step * i));
    $scope.statistics.data[0] = _.times(precision, (i) => {
      const count = _.countBy(rawData, (data) => {
        return (data >= _.min(rawData) + step * i) && ( data < _.min(rawData) + step * (i + 1));
      });
      return count['true'];
    });
    $scope.refreshMatchesChart();
  }

  $scope.refreshMatchesChart = function () {
    const precision = 10;
    const rawData = _.map($scope.statusData.pendingMatches, (match) => {
      const teamvalues = _.map(match.teams, (team) => {
        let sum = 0;
        _.forEach(team.entries, (member) => sum += member.player.traits.elo);
        return sum;
      });
      console.log(teamvalues);
      return Math.abs(teamvalues[0] - teamvalues[1]);
    });
    const step = (_.max(rawData) - _.min(rawData)) / precision;
    $scope.matchStatistics.labels = _.times(precision, (i) => parseInt(_.min(rawData) + step * i));
    $scope.matchStatistics.data[0] = _.times(precision, (i) => {
      const count = _.countBy(rawData, (data) => {
        return (data >= _.min(rawData) + step * i) && ( data < _.min(rawData) + step * (i + 1));
      });
      return count['true'];
    });
  }
});
