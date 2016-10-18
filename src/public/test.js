
const myApp = angular.module('myApp', ['chart.js'])
  .constant('_', window._)
  .constant('sampleSize', 4)
  .controller('GraphTestController', function ($scope, $http, _, sampleSize, ChartJsProvider) { //eslint-disable-line
    ChartJsProvider.setOptions({
      colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
    });
    $scope.generate = function generate() {
      console.log('WAT');
      $scope.results = gen($scope.count);
      $scope.labels = _.times(2 * sampleSize * 10 + 1, i => i);
    };
    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };
  });
/*
const stdin = process.openStdin();
stdin.addListener('data', (d) => {
  const gyakorisag = gen(d);
  _.forEach(gyakorisag, nu => console.log(nu));
});
*/
function gen(d) {
  console.log('generating', d, 'amount');
  const count = parseInt(d, 10);
  const norm = normalDistributionVariable();
  const fixed = _.map(norm.getArray(count), n => n.toFixed(1));
  const gyakorisag = [];
  const edge = 4;
  _.times(2 * edge * 10 + 1, (i) => {
    gyakorisag[i] = 0;
  });
  _.forEach(fixed, n => {
    let a = parseFloat(n, 10);
    if (Math.abs(a) > edge) {
      a = Math.sign(a) * edge;
    }
    const index = Math.round((a + edge) * 10, 10);
    gyakorisag[index] += 1;
  });
  return gyakorisag;
}

function normalFunction() {
  const u1 = Math.random();
  const u2 = Math.random();
  const R = Math.sqrt(-2 * Math.log(u1));
  const O = 2 * Math.PI * u2;
  const z0 = R * Math.cos(O);
  return z0;
}

class DistributionVariable {

  constructor(distributionFunction = (x) => { return x; }, mean, variance) {
    this.distributionFunction = distributionFunction;
    this.variance = variance;
    this.mean = mean;
  }

  _getRandom() {
    return this.distributionFunction(Math.random());
  }

  getArray(count = 1) {
    return _.times(count, () => {
      return this._getRandom();
    });
  }
}

function normalDistributionVariable({ mean = 1, variance = 1 } = {}) {
  return new DistributionVariable(normalFunction, mean, variance);
}
