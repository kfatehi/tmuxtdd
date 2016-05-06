var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var homedir = require('homedir');
var fs = require('fs');
var path = require('path');
var createRunner = require('./src/runner');
var tmux = require('./src/tmux');

module.exports.startRunner = function(watch, cmd, args, autoKill) {
  var runner = createRunner(cmd, args, autoKill)

  tmux.getName(function(err, windowName) {
    if (err) throw err;

    process.on('exit', function() {
      tmux.setName(windowName, function() {
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
  });
}
