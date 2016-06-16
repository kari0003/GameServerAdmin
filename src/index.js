import { makeRequest } from './config/requestUtil.js';
import express from 'express';

const app = express();

app.get('/', function(req, res) {
  makeRequest('', 0, get, {})
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    console.log(err);
    throw new Error();
  });
});

app.listen(3000, () => {
  console.log('Started up!');
});

/*
req('http://www.google.com', function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
})
*/