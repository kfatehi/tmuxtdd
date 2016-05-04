# tmuxtdd

![tmuxtdd](https://raw.githubusercontent.com/kfatehi/tmuxtdd/master/demo.gif)

## what

A program that runs your test suite for you, capturing its exit status. It uses chokidar to watch files with respect to the glob pattern you pass in with `--watch`. By passing in `--status` you can query this status, however the output is designed for tmux.

## why

I wrote this program in order to see if I prefer using multiple tmux windows with information shared via status bar as opposed to a single tmux window with a pane for vim and a pane for the test runner.

## how

The program comes bundled with a small tmux configuration that frequently calls `tmuxtdd --status` and renders test status to the top left of the tmux status bar. When you run `tmuxtdd`, this tmux configuration is sourced into your tmux session. Right before `tmuxtdd` exits, your original tmux configuration is sourced, restoring your environment.

As a result, tmux becomes aware of your tests so you can keep your tests running in a different window and only shift over to the test runner when you see failure occurring.

## installation

`npm install -g tmuxtdd`

## usage

Go to any node project and run a command such as this. You must have a `test` script defined in `package.json` because `tmuxtdd` is hardcoded to run `npm test`.

`tmuxtdd --watch src/**/*.js,test/**/*.js`
