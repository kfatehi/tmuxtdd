var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var homedir = require('homedir');
var fs = require('fs');
var path = require('path');

module.exports.originalConf = path.resolve(homedir(), '.tmux.conf');
module.exports.tmuxConf = path.resolve(__dirname, 'tmux-tdd.conf');

function getStatusLine(status) {
  switch (status) {
    case 'passing':
      return '#[bg=green]#[fg=black] PASS ';
    case 'failing':
      return '#[bg=red]#[fg=black] FAIL ';
    default: 
      return '#[bg=black]#[fg=grey] BUSY ';
  }
}

function update(state) {
  var statusLine = getStatusLine(state.status);
  var args = ['set-option', '-g', 'status-left', statusLine];
  //var args = ['rename-window', statusLine];
  return spawn('tmux', args, { stdio: 'inherit' });
}


function runner(cmd) {
  var busy = false;
  return function() {
    if (busy) return null;
    busy = true;
    update({ status: 'busy' }).on('exit', function() {
      var proc = spawn('bash', ['-c', cmd], {stdio: "inherit"});
      proc.on('exit', function(status) {
        update({ status: status === 0 ? 'passing' : 'failing' }).on('exit', function() {
          busy = false;
        })
      });
    })
  }
}

module.exports.startRunner = function startRunner(watch, cmd) {
  console.log('Starting runner');
  var runTests = runner(cmd)
  if (watch) {
    var watchPattern = watch.split(',');
    console.log('Watching with pattern:', watchPattern);
    var watcher = chokidar.watch(watchPattern, {
      ignored: /[\/\\]\./,
      persistent: true
    });
    watcher
    .on('add', runTests)
    .on('change', runTests)
    .on('unlink', runTests)
  } else {
    runTests()
  }
}

module.exports.sourceTmuxConfig = function sourceTmuxConfig(filepath, callback) {
  console.log('Sourcing tmux config '+filepath);
  var proc = spawn('tmux', ['source-file', filepath], {stdio: "inherit"});
  proc.on('exit', function(status) {
    if (callback) {
      if (status === 0) return callback();
      else return callback(new Error('Non-zero exit status'));
    }
  })
}
