var _ = require('lodash');
var Q = require('bluebird');
var request = require('request');
var fs = require('fs');
var path = require('path');
var YT = require('ytdl-core');
var request = require('request');
var xml2js = require('xml2js');

var YOUTUBE_KEY = 'AIzaSyCebfDVAnfQw4wocPjNo7Czwndt7z9ArvA';
var RESOLUTIONS = ['720p', '480p', '360p'];
var DASH = ['133', '134', '135', '136'];

var PLAYLIST_ID = "PLRy338DcC4FLXMjXid_T-yn9GXbmiN6s-";
var V_ID = "KsdAIYmSHAg";

var YoutubeScraper = (function() {
  'use strict';
  var parser = new xml2js.Parser();

  function getSidx(query) {
    V_ID = query.id;
    return new Q(function(resolve, reject) {
      var url = 'http://www.youtube.com/watch?v=' + query.id;
      YT.getInfo(url, {}, function(err, info) {
        extractMpdRepresentation(info).then(function(data) {
          console.log("GOT");
          resolve(data);
        });
      });
      /*
       */
    });
  }

  function extractMpdRepresentation(ytInfo, format) {
    return new Q(function(resolve, reject) {
      var r = request({
        url: ytInfo['dashmpd']
      }, function(err, response, body) {
        if (err) {
          console.log(err);
          return;
        }
        var mpdVo = {};
        parser.parseString(body, function(err, result) {
          if (err || !result) {
            return;
          }
          var adaptionSets = result['MPD']['Period'][0]['AdaptationSet'];
          var representations = [];
          var videoResults = [];
          _.each(adaptionSets, function(adaption) {
            var mimeType = adaption['$']['mimeType'];
            //has video
            if (mimeType === ('video/mp4')) {
              representations = adaption['Representation'];
            }
          });
          _.each(representations, function(representation) {
            var res = representation['$'];
            _.each(DASH, function(iTag) {
              if (res.id === iTag) {
                var index = representation.SegmentBase[0].Initialization[0]['$'].range.split('-')[0];
                var range = representation.SegmentBase[0]['$'].indexRange.split('-')[1];
                var indexRange = index + '-' + range;
                videoResults.push({
                  $: res,
                  BaseURL: representation.BaseURL,
                  SegmentBase: representation.SegmentBase,
                  url: representation.BaseURL[0]['_'],
                  indexRange: indexRange,
                  codecs: res.codecs
                });
              }
            });
          });
          var test = videoResults[0];
          console.log(test);
          sidxFromInitRange(test.url, test.indexRange).then(function(sidx) {
            //var f = fs.createWriteStream(path.join(__dirname, 'xx.mp4'));
            var rr = test.indexRange.split('-')[0];
            var ee = sidx.references[20].mediaRange.split('-')[1];
            resolve({
              url: test.url,
              indexRange: rr + '-' + ee,
              range: rr + '-' + ee,
              max: Number(ee) + 1,
              codecs: test.codecs
            });

          });
          //fs.writeFileSync(path.join(__dirname, 'xx.json'), JSON.stringify(result), null, 4);
        });
      });

      r.on('error', function(err) {
        console.log(err);
      });
    });
  }

  function sidxFromInitRange(url, indexRange) {
    return new Q(function(resolve, reject) {
      var XMLHttpRequest = require('xhr2');
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader("Range", "bytes=" + indexRange);
      xhr.send();
      xhr.responseType = 'arraybuffer';
      try {
        xhr.addEventListener("readystatechange", function() {
          if (xhr.readyState == xhr.DONE) { // wait for video to load
            // Add response to buffer
            var p = require('./sidx').parseSidx(xhr.response);
            resolve(p);
          }
        }, false);
      } catch (e) {
        console.log(e);
      }
    })
  }
  return {
    getSidx: getSidx
  }

})();

module.exports = YoutubeScraper;