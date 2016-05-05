var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var homedir = require('homedir');
var fs = require('fs');
var path = require('path');
var runner = require('./src/runner');

module.exports.startRunner = function(watch, cmd, args, autoKill) {
  console.log('Starting runner');
  var runTests = runner(cmd, args, autoKill)
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
