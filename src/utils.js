import rp from 'request-promise';
import config from './config';

export function makeRequest(options = {}){
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
    rp(reqOptions)
    .then((res) => {
      console.log(JSON.stringify(reqOptions, null, 2));
      resolve({body: res, request: reqOptions});
    })
    .catch((err) => {
      reject(err);
    });
  });
}
