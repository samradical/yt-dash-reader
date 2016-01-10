'use strict';

function Player(el) {
  'use strict';

  var VERBOSE = false;
  if (!MediaSource) {
    throw new Error('NO MEDIASOURCE!');
  }

  //manage vos
  var _latestVos = [];
  var maxLatestVos = 20;

  var requestId;

  //booleans
  var updatedStarted, locked, starting = true;

  //playback info
  var segDuration = 0,
    playOffset = 0,
    stuckCounter = 0,
    enterFrameCounter = 0,
    previousCurrentTime = 0,
    segmentIndex = 0,
    totalSegments = 0,
    paused = false,
    skipCount = 0;
  ////-----------------
  //SETUP
  ////-----------------
  var _currentVo;
  var mediaSource;
  var sourceBuffer;
  var _effects;

  var videoElement = el;

  var onBufferUpdateStartBound = onBufferUpdateStart.bind(this);
  var onBufferUpdateEndBound = onBufferUpdateEnd.bind(this);


  mediaSource = new MediaSource();
  var url = URL.createObjectURL(mediaSource);
  videoElement.src = url;
  mediaSource.addEventListener('error', _onSourceError, false);
  mediaSource.addEventListener('sourceopen', _onSourceOpen, false);
  //requestId = window.requestAnimationFrame(onUpdate);

  function _onSourceError(e) {
    if (VERBOSE) {
      console.log(e);
    }
  }

  function _onSourceOpen(e) {
    starting = false;
    newBufferSouce('avc1.4d400d');
    //newBufferSouce('avc1.4d401f,mp4a.40.2');
  }

  function newBufferSouce(codecs) {
    mediaSource.removeEventListener('sourceopen', _onSourceOpen);
    sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="' + codecs + '"');
    sourceBuffer.addEventListener('updatestart', onBufferUpdateStartBound);
    sourceBuffer.addEventListener('updateend', onBufferUpdateEndBound);
    if (VERBOSE) {
      console.log('Source Open');
    }
    request();
  }

  videoElement.addEventListener("timeupdate", onUpdate, false);
  videoElement.addEventListener("ended", _onVideoEnded, false);
  ////-----------------
  //VIDEO HANDLERS
  ////-----------------

  function _onVideoEnded(e) {
    console.warn('Video Ended');
  }

  ////-----------------
  //BUFFER HANDLERS
  ////-----------------


  function onBufferUpdateStart() {
    updatedStarted = true;
  }

  function onBufferUpdateEnd() {
    updatedStarted = false;
    locked = false;
  }

  ////-----------------
  //UPDATE
  ////-----------------

  function _manageVos() {
    _latestVos.push(_currentVo);
    if (_latestVos.length === maxLatestVos) {
      _latestVos.shift();
    }
  }

  function onUpdate() {}

  function preciseUpdate() {}


  //----------
  //PLAY A VO
  //----------

  /*
  {
  url:

  }
  */
  function request() {


    getSidx('QcIy9NiNbmo');
    return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://52.90.55.176/getVideoIndex?id=TTUpgAVwrXE', true);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState == xhr.DONE) {
        console.log(xhr);
        sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
      }
    });
    xhr.send();
    return;
    var xhr = new XMLHttpRequest();
    if (VERBOSE) {
      console.log(data['url'], data['byteRange']);
    }
    xhr.open('GET', 'http://52.90.55.176/getVideoSidx?id=TTUpgAVwrXE', true);
    xhr.send();
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState == xhr.DONE) { //wait for video to load
        if (!sourceBuffer || !mediaSource) {
          return;
        }
        var segResp = new Uint8Array(xhr.response);
        var off = 0;
        if (sourceBuffer.buffered.length > 0) {
          off = sourceBuffer.buffered.end(sourceBuffer.buffered.length - 1);
        }

        function _trySettingOffset() {
          try {
            sourceBuffer.timestampOffset = off || 0;
            initialRequest(data, __addInit);
          } catch (e) {
            console.log(e);
            //resetMediasource();
          }
        }

        function __addInit(initRes) {
          sourceBuffer.appendBuffer(initRes);

          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'http://52.90.55.176/getVideo?id=TTUpgAVwrXE', true);
          xhr.send();
          xhr.responseType = 'arraybuffer';
          xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState == xhr.DONE) { //wait for video to load
              var segResp = new Uint8Array(xhr.response);
              sourceBuffer.appendBuffer(segResp);
            }
          });
          if (VERBOSE) {
            console.log('init added');
          }
        }

        function __onInitAddStart() {

        }

        function __onInitAdded() {
          if (mediaSource.readyState === 'open') {
            sourceBuffer.removeEventListener('updatestart', __onInitAddStart);
            sourceBuffer.removeEventListener('updateend', __onInitAdded);
            sourceBuffer.addEventListener('updateend', onBufferUpdateEndBound);
            sourceBuffer.addEventListener('updatestart', onBufferUpdateStartBound);
            if (VERBOSE) {
              console.log(segmentIndex, '/', totalSegments);
            }
            sourceBuffer.timestampOffset = off -= data['timestampOffset'];
            //sourceBuffer.timestampOffset = sourceBuffer.timestampOffset - data['timestampOffset'];
            sourceBuffer.appendBuffer(segResp);
            segmentIndex++;
          }
        }
        _trySettingOffset();
      }
    }, false);
  }

  function getSidx(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://52.90.55.176/getVideoSidx?id='+id, true);
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState == xhr.DONE) {
        console.log(xhr);
      }
    });
    xhr.send();
  }


  function initialRequest(data, callback) {
    var xhr = new XMLHttpRequest();
    var range = "bytes=" + data['indexRange']
    xhr.open('GET', 'http://52.90.55.176/getVideoIndex?id=TTUpgAVwrXE', true);
    xhr.send();
    xhr.responseType = 'arraybuffer';
    try {
      xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState == xhr.DONE) { // wait for video to load
          callback(new Uint8Array(xhr.response));
        }
      }, false);
    } catch (e) {
      log(e);
    }
  }

  return {
    request: request
  }
};

module.exports = Player;