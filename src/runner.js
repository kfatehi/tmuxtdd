var kill = require('tree-kill');
var spawn = require('child_process').spawn;
var isRunning = require('is-running');
var inhibitor = require('./inhibitor');
var chalk = require('chalk');
var formatter = require('./formatter');

function running(proc) {
  return proc && isRunning(proc.pid);
}

module.exports = function (tmuxWindow, cmd, args, autoKill, format) {
  var proc = null;
  var creating = null;
  var tooQuick = inhibitor(1000);
  var label = formatter.build(format);

  function crashOut(err) {
    console.log(err.stack);
    process.exit(1);
  }

  function createProc() {
    creating = true;
    tmuxWindow.setName(label(0)).then(function() {
      proc = spawn(cmd, args, { stdio: 'inherit' });
      creating = false;
      proc.on('exit', function(status) {
        var str = status === 0 ? label(1) : label(2);
        tmuxWindow.setName(str).then(function() {
          proc = null;
        }).catch(crashOut)
      });
    }).catch(crashOut)
  }

  return {
    run: function() {
      if (creating || tooQuick()) return false;
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
