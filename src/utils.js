import rp from 'request-promise';

const address = 'http://localhost:8080/'

export function makeRequest(path, clientId, verb, body){
  return new Promise((resolve, reject) => {
    if(!verb){
      throw new Error('DUDE? SET VERB PLS');
    }
    const options = {
      uri: `${address}${path}`,
      method: verb,
      headers: {
        authentication: clientId,
      },
      body: body,
      json: true,
    };
    rp(options)
    .then((res) => {
      console.log('this and that');
      resolve(res);
    });
  });
}
