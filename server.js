var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors'); // "Request" library
var fs = require('fs'); // "Request" library
var DL = require('./playlist_downloader');
var request = require('request');
var EXPRESS = (function() {
  var app = express();
  var server, routes;

  app.use(cors({
    allowedOrigins: [
      'localhost'
    ]
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.get('/', function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello AWSBOX\n');
  });
  app.get('/getVideo', function(req, res) {
    //https://placebear.com/1110/920
    /* res.writeHead(206, {
       'Content-Type': 'image/png'
     });
     request("https://placebear.com/1110/920").pipe(res);*/
    DL.getSidx().then(function(data) {
      console.log(data);
      var url = data.url + '&range=' + data.range;
      console.log(data.range, data.max);
      var range = '0-27907';
      res.writeHead(206, {
        'Content-Range': 'bytes ' + data.range + '/' + data.max,
        //'Content-Range': 'bytes ' + range + '/27908',
        //'Content-Length': '27908',
        'Content-Length': data.max,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4'
      });
      console.log(url);
      var r = request({
        url: url,
        //url: 'https://radvisions.s3-eu-west-1.amazonaws.com/2b173550-a6b9-11e5-a7b6-b9c2f8eca471'
      }).on('response', function(response) {

        response.on('data', function(data) {
          console.log("data chunk received: " + data.length)
        });

        response.on('end', function(data) {
          console.log('Video completed');
        });

      }).pipe(res);

      r.on('error', function(err) {
        console.log(err);
      });
    });
  })


  //routes
  //routes = require('./routes')(app);

  server = app.listen(process.env['PORT'] || 8080, '127.0.0.1');
  console.log("STARTED");
})();

module.exports = EXPRESS;