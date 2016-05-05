var spawn = require('child_process').spawn;
var tmuxStatusLine = require('./tmux-status-line');

module.exports = {
  update: function (state) {
    var statusLine = tmuxStatusLine(state.status);
    var args = ['set-option', '-g', 'status-left', statusLine];
    //var args = ['rename-window', statusLine];
    return spawn('tmux', args, { stdio: 'inherit' });
  }
}


