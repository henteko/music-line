function DateTime() {
  this.startTime = new Date();
}

DateTime.prototype.getCurrentTime = function() {
  var currentTime = new Date();
  return currentTime - this.startTime;
};
