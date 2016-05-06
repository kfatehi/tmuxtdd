var spawn = require('child_process').spawn;

module.exports = {
  setName: function (name, callback) {
    var args = ['rename-window', name];
    var proc = spawn('tmux', args);
    proc.on('exit', function(status) {
      if (status === 0) {
        callback(null);
      } else {
        callback(new Error('failed to get name'));
      }
    });
  },
  getName: function(callback) {
    var args = ['display-message', '-p', '#W']
    var proc = spawn('tmux', args);
    var buf = ""
    proc.stdout.on('data', function(_buf) {
      buf+= _buf
    });
    proc.on('exit', function(status) {
      if (status === 0) {
        callback(null, buf.trim());
      } else {
        callback(new Error('failed to get name'));
      }
    });
    return proc;
  },
}
