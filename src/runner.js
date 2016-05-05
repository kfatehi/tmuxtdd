var tmux = require('./tmux');
var kill = require('tree-kill');
var spawn = require('child_process').spawn;
var isRunning = require('is-running');

module.exports = function(cmd, args, autoKill) {
  var proc = null;
  var timestamp = null

  function tooQuick() {
    var minDurationMilliseconds = 1000
    var now = new Date()
    if (timestamp) {
      var diff = now - timestamp;
      console.log(diff);
      // allow time for multiple events to settle
      // if an event came in too quickly after the last one, ignore it
      if (diff < minDurationMilliseconds)
        return true;
    }
    timestamp = now;
    return false;
  }

  function createProc() {
    tmux.update({ status: 'proc' }).on('exit', function() {
      console.log('proc set');
      proc = spawn(cmd, args, { stdio: 'inherit' });
      proc.on('exit', function(status) {
        tmux.update({ status: status === 0 ? 'passing' : 'failing' }).on('exit', function() {
          proc = null;
        })
      });
    });
  }

  function running() {
    console.log('proc set?', !!proc);
    return proc && isRunning(proc.pid);
  }

  return function() {
    if (tooQuick()) return false;

    if (running()) {
      if (autoKill) {
        console.log('killing');
        proc.removeAllListeners('exit');
        kill(proc.pid, 'SIGTERM', function(err) {
          if (err) throw err;
          console.log('killed');
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
