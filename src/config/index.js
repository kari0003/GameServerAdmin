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
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
    arg: 'ip',
  },
  domain: {
    doc: 'The domain where the application is running from.',
    format: String,
    default: 'http://healcloud.local',
    env: 'CORE_DOMAIN',
    arg: 'coreDomain',
  },
  backendUrl: {
    doc: 'The url of the backend for temp emails. TODO remove.',
    format: String,
    default: 'http://healcloud.local',
    env: 'CORE_BACKEND_URL',
    arg: 'backendUrl',
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
const env = conf.get('env');
conf.loadFile(path.normalize(`${__dirname}/${env}.json`));

// Perform validation
conf.validate({
  strict: true,
});

// console.log(`ENV ${env}`);

export default conf.getProperties();
