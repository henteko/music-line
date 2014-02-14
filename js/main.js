$(function() {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var context = new AudioContext();
  var piano = new Piano(context);
  var noises = piano.noises;

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
  $canvas.mousedown(tapStart).mousemove(tapMove).mouseup(tapEnd);
  $canvas.on('touchstart', tapStart).on('touchmove', tapMove).on('touchend', tapEnd);

  var currentLineWidth = 10;
  var currentColor = "#000000";

  $('#size').change(function() {
    currentLineWidth = $(this).val();
  });
  $('#color').change(function() {
     currentColor = $(this).val();
  });

  function tapStart(e) {
    mouseFlag = true;
    x = e.clientX;
    y = e.clientY;
  }

  var sumCount = 0;
  function tapMove(e) {
    if(mouseFlag) {
      sum += 1;
      if(sum == 2) {
        var _x = e.clientX;
        var _y = e.clientY;

        //描画
        cc.beginPath();
        cc.lineWidth = currentLineWidth; //サイズの調整
        cc.lineCap="round"; //円形に描画
        cc.strokeStyle = currentColor; //色の設定
        cc.moveTo(x,y);
        cc.lineTo(_x,_y);
        cc.stroke();

        var colorInt = parseInt(currentColor.replace('#', ''), 16);
        // play sound
        var noise = noises[colorInt % noises.length];
        piano.play(noise, {
          'playbackRate': lineDistance(x, y, _x, _y) / currentLineWidth
        });

        x = _x;
        y = _y;
        sum = 0;
      }
    }
  }

  function tapEnd(e) {
    mouseFlag = false;
  }
});

function lineDistance(x1,y1,x2,y2) {
  var a, b, d;
  a = x1 - x2;
  b = y1 - y2;
  d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
  return d;
};
