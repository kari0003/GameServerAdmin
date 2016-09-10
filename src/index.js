import { makeRequest, initClient,
  createClientConfig, addPlayer } from './utils.js';
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
app.post('/api/admin/addPlayer', (req, res) => {
  console.log(req.client);
  console.log(req.body);
  addPlayer(req.body.player, req.body.queue, req.client)
  .then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({ err, status: 499 });
  });
});

app.post('/api/admin/createQueue', (req, res) => {
  console.log('Create Queue:', req.client);
  makeRequest({
    clientId: '' + req.client.id,
    path: '/queue',
    verb: 'POST',
    body: 'test',
  }).then((data) => res.json(data));
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
    body: req.body.body ? req.body.body : '{}',
    clientId: req.body.clientId,
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
  console.log('Started up!'); // eslint-disable-line
});
