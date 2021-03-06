var spawn = require('child_process').spawn;
var BPromise = require('bluebird');
var sh = require('shelljs');

var TmuxNotFoundError = function() {
  return new Error('TmuxNotFound');
}

var NotInTmuxError = function() {
  return new Error('NotInTmux');
}

function getInfo() {
  // resolves paneId, windowId, windowName
  return new BPromise(function (resolve, reject) {
    sh.exec("tmux list-panes -a -F '#{pane_id} #I #W'", { silent: true }, function(status, stdout, stderr) {
      if (status === 0) {
        var panes = stdout.split('\n')
        for (var i=0; i<panes.length; i++) {
          var pane = panes[i].split(' ');
          if (pane.length > 2) {
            var here = process.env['TMUX_PANE'] === pane[0];
            if (here) {
              resolve(pane)
              return false;
            }
          }
        }
        reject(NotInTmuxError());
      } else {
        reject(TmuxNotFoundError())
      }
    });
  });
}

module.exports = {
  getInfo: getInfo,
  getWindow: function() {
    return {
      setName: function (name) {
        return new BPromise(function(resolve, reject) {
          getInfo().spread(function(_, windowId) {
            var args = ['rename-window', '-t', windowId, name];
            var proc = spawn('tmux', args);
            proc.on('exit', function(status) {
              if (status === 0) {
                resolve();
              } else {
                reject(TmuxNotFoundError())
              }
            });
          }).catch(reject);
        });
      }
    }
  },
}
