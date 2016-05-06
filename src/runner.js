var kill = require('tree-kill');
var spawn = require('child_process').spawn;
var isRunning = require('is-running');
var inhibitor = require('./inhibitor');
var chalk = require('chalk');

function running(proc) {
  return proc && isRunning(proc.pid);
}

module.exports = function (tmuxWindow, cmd, args, autoKill) {
  var proc = null;
  var tooQuick = inhibitor(1000);

  function createProc() {
    tmuxWindow.setName('running', function(err) {
      if (err) throw err;
      proc = spawn(cmd, args, { stdio: 'inherit' });
      proc.on('exit', function(status) {
        var str = status === 0 ? 'passing' : 'failing';
        tmuxWindow.setName(str, function() {
          if (err) throw err;
          proc = null;
        })
      });
    });
  }

  return {
    run: function() {
      if (tooQuick()) return false;
      if (running(proc)) {
        if (autoKill) {
          proc.removeAllListeners('exit');
          kill(proc.pid, 'SIGTERM', function(err) {
            if (err) throw err;
            proc = null;
            createProc();
          })
        } else {
          return;
        }
      } else {
        createProc();
      }
    }
  }
}
