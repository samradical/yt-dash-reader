var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors'); // "Request" library
var fs = require('fs'); // "Request" library
var DL = require('./playlist_downloader');
var YT = require('ytdl-core');
var request = require('request');
var multiparty = require('multiparty');
var EXPRESS = (function() {
  var app = express();
  var server, routes;

  app.use(cors());

  /*app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));*/

  app.get('/', function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello AWSBOX\n');
  });

  app.get('/goofy', function(req, res) {
    request('http://images1.wikia.nocookie.net/__cb20120715102950/disney/images/a/a5/Disneygoofy2012.jpeg').pipe(res);
  });

  app.get('/goofy2', function(req, res) {
    request('https://s3-eu-west-1.amazonaws.com/chromegno.me/images/locations/08.jpg').pipe(res);
  });

  app.get('/getImage', function(req, res) {
    request("https://s3-eu-west-1.amazonaws.com/chromegno.me/bergsjostolen.jpg").pipe(res);
  });

  app.get('/getImage2', function(req, res) {
    var stat = fs.statSync(__dirname + '/920.jpeg');
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': stat.size
    });
    var s = fs.createReadStream(__dirname + '/920.jpeg');
    s.on('open', function() {
      // This just pipes the read stream to the response object (which goes to the client)
      s.pipe(res);
    });
  });

  app.get('/staticVideo', function(req, res) {
    YT("http://www.youtube.com/watch?v=zg_fAUsNVJ4").pipe(res)
  });
  /*app.get('/getVideo', function(req, res) {
    //https://placebear.com/1110/920
    DL.getSidx(req.query).then(function(data) {
      var url = data.url + '&range=' + data.range;
      console.log(data.range, data.max);
      res.writeHead(206, {
        'Content-Range': 'bytes ' + data.range + '/' + data.max,
        //'Content-Range': 'bytes ' + range + '/27908',
        //'Content-Length': '27908',
        'X-Accel-Buffering': 'no',
        'Content-Length': data.max,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        "Access-Control-Allow-Origin": "*"
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
  });*/
  app.post('/getVideo', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, data, files) {
      console.log(data);
      var url = data.url + '&range=' + data.byteRange;
      res.writeHead(206, {
        'Content-Range': 'bytes ' + data.byteRange + '/' + data.max,
        //'Content-Range': 'bytes ' + range + '/27908',
        //'Content-Length': '27908',
        'X-Accel-Buffering': 'no',
        'Content-Length': data.byteRangeMax,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        "Access-Control-Allow-Origin": "*"
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
  });

  app.post('/getVideoIndex', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, data, files) {
      console.log(data);
      var url = data.url + '&range=' + data.indexRange;
      res.writeHead(206, {
        'Content-Range': 'bytes ' + data.indexRange,
        'X-Accel-Buffering': 'no',
        'Content-Length': data.indexRangeMax,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        "Access-Control-Allow-Origin": "*"
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
  });

  app.get('/getVideoSidx', function(req, res) {
    DL.getSidx(req.query).then(function(data) {
      res.send(data);
    });
  });


  /* app.get('/getVideo2', function(req, res) {
     DL.getSidx().then(function(data) {
       var url = data.url + '&range=' + data.range;
       console.log(data.range, data.max);
       res.writeHead(206, {
         'Content-Range': 'bytes ' + data.range + '/' + data.max,
         //'Content-Range': 'bytes ' + range + '/27908',
         //'Content-Length': '27908',
         'Content-Length': data.max,
         'Accept-Ranges': 'bytes',
         'Content-Type': 'video/mp4',
         "Access-Control-Allow-Origin": "*"
       });
       console.log(url);
       var r = request({
         url: url,
         //url: 'https://radvisions.s3-eu-west-1.amazonaws.com/2b173550-a6b9-11e5-a7b6-b9c2f8eca471'
       }).on('response', function(response) {

         response.on('data', function(data) {
           res.write(data);
           console.log("data chunk received: " + data.length)
         });

         response.on('end', function(data) {
           res.end();
           console.log('Video completed');
         });
       });

       r.on('error', function(err) {
         console.log(err);
       });
     });
   });*/


  //routes
  //routes = require('./routes')(app);

  server = app.listen(process.env['PORT'] || 8080, '127.0.0.1');
  console.log("STARTED, ", process.env['PORT']);
})();

module.exports = EXPRESS;