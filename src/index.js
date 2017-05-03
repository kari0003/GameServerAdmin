import _ from 'lodash';
import {
  makeRequest,
  initClient,
  createClientConfig,
  addPlayer,
  findMatches } from './utils.js';
import config from './config';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { jwtVerifyMw } from './authentication/jwtHandler';

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendfile('./src/public/index.html');
});

app.get('/admin', (req, res) => {
  res.sendfile('./src/public/admin.html');
});

app.get('/alpha', (req, res) => {
  res.sendfile('./src/public/alpha/index.html');
});

app.use('/api/admin', jwtVerifyMw);

app.get('/api/admin/whoami', (req, res) => {
  return res.json(res.token);
});

app.post('/api/admin/addPlayer', (req, res) => {
  addPlayer({}, { id: req.body.queue.id })
  .then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({ err, status: 499 });
  });
});

app.post('/api/admin/findMatches', (req, res) => {
  findMatches({ id: req.body.queue.id })
  .then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({ err, status: 499 });
  });
});

app.post('/api/admin/createQueue', (req, res) => {
  console.log('Create Queue:', req.client);
  const config = req.body.config || {
    queueSize: -1,
    isUpdateEnabled: true,
    updateInterval: 1000,
    isGroupEnabled: false,
    isPlayerEnabled: true,
    matchOnInsert: false,
    matchOnQuery: true,
    matcherConfig: {
      matchConfig: {
        teamCount: 2,
        teamSize: 5,
      },

      isDistanceMatcher: true,
      distanceTraits: [{
        trait: {
          key: 'elo',
          type: 'number',
        },
        weight: 1.0,
      }],
      maxDistancePlayers: 50,
      maxDistanceTeams: 50,

      isCompabilityMatcher:false,
      isWaitDurationMatcher: false,

      maxPotentials: -1,
      maxTargets: -1,
    }
  };
  makeRequest({
    clientId: '' + req.client.id,
    path: '/queue',
    verb: 'POST',
    body: { config },
  }).then((data) => res.json(data.body))
  .catch((err) => res.json(500, err));
});

app.post('/api/createClient', (req, res) => {
  const conf = createClientConfig();
  console.log(conf);
  initClient(conf)
  .then((client) => {
    console.log('created Client: ' + JSON.stringify(client, null, 2));
    res.json({
      token: client,
      body: {
        description: 'Created client, and encoded it\'s id in da token',
      },
    });
  }).catch((err) => {
    console.log(err && err.message || err);
    res.send(500);
  });
});

app.post('/api', (req, res) => {
  makeRequest({
    verb: req.body.verb ? req.body.verb : 'GET',
    path: req.body.path ? req.body.path : '',
    body: req.body.body ? req.body.body : {},
  })
  .then((data) => {
    res.json({ data });
  })
  .catch((err) => {
    console.error(err && err.message || err);
    const msg = err && err.message || err;
    res.json({ data: { error: msg, request: err.options } });
    throw new Error();
  });
});

app.listen(config.port, () => {
  console.log(`Started up! (${config.port})`); // eslint-disable-line
});
