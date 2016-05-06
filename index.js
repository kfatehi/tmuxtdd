var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var homedir = require('homedir');
var fs = require('fs');
var path = require('path');
var createRunner = require('./src/runner');
var tmux = require('./src/tmux');

module.exports.startRunner = function(watch, cmd, args, autoKill) {
  tmux.getInfo().spread(function(paneId, windowId, originalWindowName) {

    var tmuxWindow = tmux.target(windowId);

    var runner = createRunner(tmuxWindow, cmd, args, autoKill)

    process.on('exit', function() {
      tmuxWindow.setName(originalWindowName, function() {
        process.removeAllListeners('exit');
        process.exit();
      });
    });

    process.on('SIGINT', process.exit);

    if (watch) {
      var watchPattern = watch.split(',');
      var watcher = chokidar.watch(watchPattern, {
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
    throw err
  })
}
