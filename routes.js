var _ = require("lodash");
var request = require('request');
var DL = require('./playlist_downloader');

var ROUTES = function(exp) {
  var express = exp;

  express.get('/video', function(req, res) {
  	console.log(__dirname);
   /* DL.getSidx().then(function(data) {
      var url = data.url + '&range=' + data.range;
      var r = request({
        url: url
      }, function(err, response, body) {
        res.writeHead(206, {
          'Content-Range': 'bytes ' + data.range + '/' + data.max,
          'Content-Length': data.max,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4'
        });
        r.pipe(res);
      });

      r.on('error', function(err) {
        console.log(err);
      });
    });*/
  });
  console.log("sdsd");
};

module.exports = ROUTES;