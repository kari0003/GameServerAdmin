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
      body: options.body.indexOf('{') > -1 ? JSON.parse(options.body) : options.body,
      json: true,
    };
    console.log("BODY:: " + reqOptions.body);
    rp(reqOptions)
    .then((res) => {
      console.log(JSON.stringify(reqOptions, null, 2));
      resolve({body: res, request: reqOptions});
    })
    .catch((err) => {
      console.log('ERROR: ' + err);
      reject(err);
    });
  });
}
