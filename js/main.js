$(function() {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var context = new AudioContext();

  var buffer;
  var request = new XMLHttpRequest();
  request.open('GET', '/sounds/tap.wav', true);
  request.responseType = 'arraybuffer';

  request.send();
  request.onload = function () {
    var res = request.response;
    context.decodeAudioData(res, function (buf) {
      buffer = buf;
    });
  };

  var $canvas = $('#canvas');
  var canvas = $canvas[0];
  var b = document.body;
  var d = document.documentElement;
  canvas.width = Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth);
  canvas.height = Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight);
  var cc = canvas.getContext('2d');

  var mouseFlag = false;
  var sum = 0;
  var x = 0;
  var y = 0;
  $canvas.mousedown(function(e) {
    mouseFlag = true;
    x = e.clientX;
    y = e.clientY;
  }).mousemove(function(e) {
    if(mouseFlag) {
      sum += 1;
    }
    if(mouseFlag && sum > 2) {
      var _x = e.clientX;
      var _y = e.clientY;
      cc.beginPath();
      cc.moveTo(x,y);
      cc.lineTo(_x,_y);
      cc.stroke();

      var source = context.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = (x / 100) + (y / 100);
      source.connect(context.destination);
      source.noteOn(0);

      sum = 0;
      x = _x;
      y = _y;
    }
  }).mouseup(function(e) {
    mouseFlag = false;
  });
});
