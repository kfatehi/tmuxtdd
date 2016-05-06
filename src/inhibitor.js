// prevents something from occurring too quickly
module.exports = function(minDurationMilliseconds) {
  var timestamp = null

  // if you call this function again "too quickly", it returns false, otherwise returns false
  return function() {
    var now = new Date()
    if (timestamp) {
      var diff = now - timestamp;
      // console.log(diff);
      // allow time for multiple events to settle
      // if an event came in too quickly after the last one, ignore it
      if (diff < minDurationMilliseconds)
        return true;
    }
    timestamp = now;
    return false;
  }
}

