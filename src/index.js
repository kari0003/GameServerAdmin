import req from 'request';

req('http://www.google.com', function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
})