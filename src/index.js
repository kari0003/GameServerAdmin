import { makeRequest } from './utils.js';
import config from './config';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();


  app.use(express.static(__dirname + '/public'));
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({'extended':'true'}));
  app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.sendfile('./src/public/index.html');
});


app.get('/alpha', function(req, res) {
  res.sendfile('./src/public/alpha/index.html');
});

app.post('/api', function(req, res) {
  makeRequest({
    verb: req.body.verb ? req.body.verb : 'GET',
    path: req.body.path ? req.body.path : '',
    body: req.body.body ? req.body.body : '{}',
    clientId: req.body.clientId,
  })
  .then((data) => {
    res.json({data: data});
  })
  .catch((err) => {
    console.log(err.error);
    const msg = `ERROR ${err.error.status} - ${err.error.error} - ${err.error.message}`;
    console.log(msg);
    res.json({data: {error: err.error, request: err.options}});
    throw new Error();
  });
});
app.listen(config.port, () => {
  console.log('Started up!');
});
