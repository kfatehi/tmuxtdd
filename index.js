var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var homedir = require('homedir');
var fs = require('fs');
var path = require('path');
var createRunner = require('./src/runner');
var tmux = require('./src/tmux');

module.exports.startRunner = function(watch, cmd, args, autoKill, format) {
  tmux.getInfo().spread(function(paneId, windowId, originalWindowName) {
    var tmuxWindow = tmux.getWindow(paneId);

    var runner = createRunner(tmuxWindow, cmd, args, autoKill, format)

    if (watch) {
      var watcher = chokidar.watch(watch, {
        ignored: /[\/\\]\./,
        persistent: true
      });

      watcher
      .on('add', runner.run)
      .on('change', runner.run)
      .on('unlink', runner.run)
    } else {
      runner.run()
    }
  }).catch(function(err) {
    console.log(err.message);
    process.exit(1);
  })
}
