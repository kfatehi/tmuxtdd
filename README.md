# tmuxtdd

reports test runner status in the tmux status bar by watching your files and executing your tests for you when they change

![tmuxtdd](https://raw.githubusercontent.com/kfatehi/tmuxtdd/master/demo.gif)

## why

I wrote this program in order to see if I prefer using multiple tmux windows with information shared via status bar as opposed to a single tmux window with a pane for vim and a pane for the test runner.

## how

tmuxtdd reports test runner status in the status bar in this way:

`tmux set-option -g status-left "Tests Passing"`

## installation

`npm install -g tmuxtdd`

## usage

example usage for a javascript project:

`tmuxtdd run --watch 'src/**/*.js,test/**/*.js' --cmd 'npm test'`
