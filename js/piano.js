function Piano(context) {
  this.context = context;
  this.buffers = {};
  this.noises = ['C', 'D', 'E', 'F', 'G', 'B', 'A'];
  
  var self = this;
  var requestPiano = function(url, key) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.send();
    request.onload = function () {
      var res = request.response;
      self.context.decodeAudioData(res, function (buf) {
        self.buffers[key] = buf;
      });
    };
  }
  requestPiano('/sounds/C.wav', 'C');
  requestPiano('/sounds/D.wav', 'D');
  requestPiano('/sounds/E.wav', 'E');
  requestPiano('/sounds/F.wav', 'F');
  requestPiano('/sounds/G.wav', 'G');
  requestPiano('/sounds/A.wav', 'A');
  requestPiano('/sounds/B.wav', 'B');
}

Piano.prototype.play = function(noise, opt) {
  var source = this.context.createBufferSource();
  var buffer = this.buffers[noise];
  var value = opt['playbackRate'];
  if(buffer == undefined) return false;
  if(value == undefined) value = 1.0;

  source.buffer = this.buffers[noise];
  source.playbackRate.value = value;
  source.connect(this.context.destination);
  source.noteOn(0);
};
