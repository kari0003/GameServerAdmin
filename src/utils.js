import _ from 'lodash';
import rp from 'request-promise';
import Chance from 'chance';
import config from './config';
import { jwtSign } from './authentication/jwtHandler.js';
import { getNormalPlayers } from './simulator/playerGenerator';

const chance = new Chance();

export function makeRequest(options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      uri: `${config.gameServerUrl}${options.path}`,
      method: options.verb,
      qs: options.queries,
      headers: {
        authentication: options.clientId || 'The Dude',
      },
      body: options.body,
      json: true,
    };
    console.log(reqOptions);
    rp(reqOptions)
    .then((res) => {
      console.log('Response OK: ', !_.isNil(res.data));
      resolve({ body: res, request: reqOptions });
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function findMatches(queueId) {
  return makeRequest({
    verb: 'GET',
    path: `/queue/${queueId}/matches`,
  });
}

export function startMatches(queueId, matchIds) {
  return makeRequest({
    verb: 'PUT',
    path: `/queue/${queueId}/matches/start`,
    body: {
      matches: matchIds,
    },
  });
}

export function addPlayers(queueId, playerCount, meanElo, variance) {
  const players = getNormalPlayers(playerCount, meanElo, variance);
  return makeRequest({
    verb: 'PUT',
    path: `/queue/${queueId}/players`,
    body: {
      players,
    },
  });
}
export function addPlayer(player = {}, queue = {},
  client) {
  const validPlayer = {
    name: player.name ? player.name : chance.name(),
    traits: {},
  };
  if (!queue.config) {
    queue.config = {
      matcherConfig: {
        distanceTraits: [{
          trait: {
            key: 'elo',
            type: 'number',
          },
          weight: 1.0,
        }],
      },
    };
  }
  _.forEach(queue.config.matcherConfig.distanceTraits, ({ trait }) => {
    validPlayer.traits[trait.key] = chance.integer({ min: 1000, max: 2500 });
  });
  return makeRequest({
    verb: 'PUT',
    path: `/queue/${queue.id}/players`,
    body: {
      players: [validPlayer],
    },
  });
}

export function createClientConfig(clientConfig = { queueConfigs: {
  test: {
    updateInterval: 500,
    updateOnInsert: false,
    updateWhenChecked: false,
    matchConfig: {
      teamSize: 4,
      teamCount: 2,
    },
    matcherConfig: {
      matcherType: 'ROLSTER_MATCHER',
      aspectNames: ['elo'],
      considerAspect: { elo: true },
      weighAspect: { elo: 1 },
      maxPotentials: 30,
      maxTargets: 1,
      maxDistancePlayers: 100,
      maxDistanceTeams: 300,
      considerWait: false,
      waitModifier: 10,
      maxWaitModification: 100,
    },
  },
} }) {
  return clientConfig;
}

export function initClient(configuration) {
//  return makeRequest({
//    verb: 'POST',
//    path: '',
//    body: configuration,
//    json: true,
//  }).then((res) => {
//    console.log('client response', res);
//    return { id: res.body.data };
//  }).then(jwtSign);
  return jwtSign({ client: 'admin' });
}
