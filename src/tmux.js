var spawn = require('child_process').spawn;
var BPromise = require('bluebird');

module.exports = {
  target: function(target) {
    return {
      setName: function (name, callback) {
        var args = ['rename-window', '-t', target, name];
        var proc = spawn('tmux', args);
        proc.on('exit', function(status) {
          if (status === 0) {
            callback(null);
          } else {
            callback(new Error('failed to get name'));
          }
        });
      }
    }
  },
  // resolves paneId, windowId, windowName
  getInfo: function(callback) {
    return new BPromise(function (resolve, reject) {
      var DELIM = ',';
      var args = ['list-panes', '-a', '-F', '#{pane_id} #I #W']
      var proc = spawn('tmux', args);
      var buf = ""
      proc.stdout.on('data', function(_buf) {
        buf+= _buf.toString();
      });
      proc.on('exit', function(status) {
        if (status === 0) {
          var pane = {};
          var panes = [];
          buf.split('\n').map(function(s) {
            var i = s.split(' ');
            if (i.length === 3) {
              var here = process.env['TMUX_PANE'] === i[0];
              if (here) {
                resolve(i)
                return false;
              }
            }
          });
        } else {
          reject(new Error('failed to get name'));
        }
      });
      return proc;
    });
  },
}
