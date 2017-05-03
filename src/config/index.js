//import path from 'path';

import convict from 'convict';

import dotenv from 'dotenv';

dotenv.config({ silent: true });


/**
 * Schema of the config file made with convict
 * @type {Object}
 */
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['prod', 'dev', 'test', 'stage', 'travis'],
    default: 'dev',
    env: 'NODE_ENV',
    arg: 'env',
  },
  gameServerUrl: {
    doc: 'The address of the matchmaker server.',
    format: String,
    default: 'http://127.0.0.1:3000/api/v1',
    env: 'GAME_SERVER_URL',
    arg: 'ip',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT',
    arg: 'port',
  },
  token: {
    secret: {
      doc: 'Secret used by token creating.',
      format: String,
      env: 'TOKEN_SECRET',
      arg: 'tokenSecret',
      default: 'I ALSO LIKE TO LIVE DANGEORUSLY',
    },
    expires: {
      doc: 'Indicates when the token will expire IN SECONDS.',
      format: Number,
      env: 'TOKEN_EXPIRES',
      arg: 'tokenExpires',
      default: 68000,
    },
    algorithm: {
      doc: 'Algorithm which is used to hash secrets.',
      format: String,
      env: 'TOKEN_ALGORITHM',
      arg: 'tokenAlgorithm',
      default: 'HS256',
    },
  },
});


// Load environment dependent configuration
//const env = conf.get('env');
//conf.loadFile(path.normalize(`${__dirname}/${env}.json`));

// Perform validation
conf.validate({
  strict: true,
});

// console.log(`ENV ${env}`);

export default conf.getProperties();
