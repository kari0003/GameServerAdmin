import path from 'path';

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
    default: 'http://127.0.0.1:8080',
    env: 'GAME_SERVER_URL',
    arg: 'ip',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
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
