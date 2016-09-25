import _ from 'lodash';
import rp from 'request-promise';
import Chance from 'chance';
import config from './config';
import { jwtSign } from './authentication/jwtHandler.js';

const chance = new Chance();

export function makeRequest(options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      uri: `${config.gameServerUrl}${options.path}`,
      method: options.verb,
      qs: options.queries,
      headers: {
        authentication: options.clientId,
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

export function addPlayer(player = {}, queue = {
  id: 1000,
  config: {
    aspectNames: ['elo'],
    considerAspect: { elo: true },
    aspectWeight: 1,
  } },
  client) {
  const validPlayer = {
    name: player.name ? player.name : chance.name(),
    scores: {},
  };
  if (!player.scores) {
    _.forEach(queue.config.aspectNames, (aspect) => {
      if (queue.config.considerAspect[aspect]) {
        validPlayer.scores[aspect] = chance.integer({ min: 0, max: 3000 });
      }
    });
  }
  return makeRequest({
    verb: 'POST',
    path: `/queue/${queue.id}/players`,
    body: {
      queueId: queue.id,
      player: validPlayer,
    },
    clientId: client.id,
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
  return makeRequest({
    verb: 'POST',
    path: '',
    body: configuration,
    json: true,
  }).then((res) => {
//    console.log('client response', res);
    return { id: res.body.data };
  }).then(jwtSign);
}
