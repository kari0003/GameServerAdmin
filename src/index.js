import { makeRequest } from './utils.js';
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

app.post('/api', function(req, res) {
  console.log(req.body);
  makeRequest('', 0, 'get', {})
  .then((data) => {
    res.json({
      useful: 'this is a legit message',
      data: data,
    });
  })
  .catch((err) => {
    console.log(err);
    throw new Error();
  });
});
app.listen(3000, () => {
  console.log('Started up!');
});
