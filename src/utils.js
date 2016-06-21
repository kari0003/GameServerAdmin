import _ from 'lodash';
import rp from 'request-promise';
import Chance from 'chance';
import config from './config';

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
      body: options.body.indexOf('{') > -1 ? JSON.parse(options.body) : options.body,
      json: true,
    };
    console.log(`BODY: ${reqOptions.body}`);
    rp(reqOptions)
    .then((res) => {
      console.log(JSON.stringify(reqOptions, null, 2));
      resolve({ body: res, request: reqOptions });
    })
    .catch((err) => {
      console.log('ERROR: ' + err);
      reject(err);
    });
  });
}

export function addPlayer(player, queue) {
  const validPlayer = {
    name: player.name ? player.name : chance.name(),
  };
  if (!player.scores) {
    _.forEach(queue.config.aspectNames, (aspect) => {
      if (queue.config.considerAspect[aspect]) {
        validPlayer.score[aspect] = chance.integer({ min: 0, max: 3000 });
      }
    });
  }
  return makeRequest({
    verb: 'POST',
    path: `/queue/${queue.id}/players`,
    body: validPlayer,
    clientId: queue.owner, //FIXME
  });
}

export function initClient(configuration) {
  return makeRequest({
    verb: 'POST',
    path: '/',
    body: configuration,
  }).then(function saveClient(idRes) {
    const clientId = parseInt(idRes.body.body, 10);
    const clientConfig = makeRequest({
      verb: 'GET',
      path: '/',
    }).then(function getClientConfig(configRes) {
      _.find(configRes.body.body, { clientId: 1 }); //TODO valid client id
    });
    return { id: clientId, config: clientConfig };
  });
}
