$(function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var piano = new Piano(context);

  var fullData = {};
  var dateTime = undefined;
  $('#start').click(function() {
    fullData = {};
    dateTime = new DateTime();
    $(this).hide();
    $('#repeat').hide();
    $('#end').show();
  });
  $('#end').click(function() {
    $(this).hide();
    $('#start').show();
    $('#repeat').show();
  }).hide();

  var $canvas = $('#canvas');
  var canvas = $canvas[0];
  var b = document.body;
  var d = document.documentElement;
  canvas.width = Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth);
  canvas.height = Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight);
  var cc = canvas.getContext('2d');

  $('#repeat').click(function() {
    //全て削除
    cc.clearRect(0, 0, canvas.width, canvas.height);
    //再生
    $.each(fullData, function(time, data) {
      var _time = parseInt(time);
      setTimeout(function() {
        var x = data['x'];
        var y = data['y'];
        var _x = data['_x'];
        var _y = data['_y'];
        var width = data['width'];
        var color = data['color'];

        lineWrite(cc, x, y, _x, _y, width, color);
        playPiano(piano, x, y, _x, _y, width, color);
      }, _time);
    });
  }).hide();

  var mouseFlag = false;
  var sum = 0;
  var x = 0;
  var y = 0;
  $canvas.mousedown(tapStart).mousemove(tapMove).mouseup(tapEnd);
  $canvas[0].addEventListener('touchstart', tapStart);
  $canvas[0].addEventListener('touchmove', tapMove);
  $canvas[0].addEventListener('touchend', tapEnd);

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
    x = e.clientX || e.touches[0].clientX;
    y = e.clientY || e.touches[0].clientY;
  }

  var sumCount = 0;
  function tapMove(e) {
    if(mouseFlag) {
      sum += 1;
      if(sum == 2) {
        var _x = e.clientX || e.touches[0].clientX;
        var _y = e.clientY || e.touches[0].clientY;

        //描画
        lineWrite(cc, x, y, _x, _y, currentLineWidth, currentColor);
        //start sound
        playPiano(piano, x, y, _x, _y, currentLineWidth, currentColor);

        if(dateTime != undefined) {
          fullData[dateTime.getCurrentTime()] = {
            'x': x,
            'y': y,
            '_x': _x,
            '_y': _y,
            'color': currentColor,
            'width': currentLineWidth
          };
        }

        x = _x;
        y = _y;
        sum = 0;
      }
    }
    e.preventDefault();
  }

  function tapEnd(e) {
    mouseFlag = false;
  }
});

function lineWrite(cc, x, y, _x, _y, width, color) {
  cc.beginPath();
  cc.lineWidth = width; //サイズの調整
  cc.lineCap="round"; //円形に描画
  cc.strokeStyle = color; //色の設定
  cc.moveTo(x,y);
  cc.lineTo(_x,_y);
  cc.stroke();
}

function playPiano(piano, x, y, _x, _y, width, color) {
  var colorInt = parseInt(color.replace('#', ''), 16);
  var noise = piano.noises[parseInt(lineDistance(x, y, _x, _y)) % piano.noises.length];
  piano.play(noise, {
    'playbackRate': (colorInt % 1000) / width
  });
}

function lineDistance(x1,y1,x2,y2) {
  var a, b, d;
  a = x1 - x2;
  b = y1 - y2;
  d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
  return d;
};
