import * as _ from 'lodash';
import Chance from 'chance';
import { normalDistributionVariable } from './distribution';

const chance = new Chance();

export function getNormalPlayers(playerCount = 1, meanElo = 1, variance = 1) {
  const eloVar = normalDistributionVariable({ mean: meanElo, variance });
  const eloArray = eloVar.getArray(playerCount);
  const players = _.times(playerCount, (i) => {
    return generatePlayer({ traits: { elo: parseInt(eloArray[i]) } });
  });
  return players;
}

export function generatePlayer({ name, traits } = {}) {
  const player = {
    name: name ? name : chance.name(),
    traits: traits ? traits: {
      elo: 0,
    },
  };
  return player;
}
