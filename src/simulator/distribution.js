import _ from 'lodash';

function normalFunction() {
  const u1 = Math.random();
  const u2 = Math.random();
  const R = Math.sqrt(-2 * Math.log(u1));
  const O = 2 * Math.PI * u2;
  const z0 = R * Math.cos(O);
  return z0;
}

export class DistributionVariable {

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

export function normalDistributionVariable({ mean = 1, variance = 1 } = {}) {
  return new DistributionVariable(normalFunction, mean, variance);
}
