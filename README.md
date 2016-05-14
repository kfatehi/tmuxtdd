# tmuxtdd

updates tmux window title with the status of a command which executes when your files change, such as your test suite, or a server (use --kill to auto-kill and restart long running processes like servers)

![tmuxtdd](https://raw.githubusercontent.com/kfatehi/tmuxtdd/master/demo.gif)

## installation

`npm install -g tmuxtdd`

## usage

```
usage: tmuxtdd [--help] [--watch=<pattern[,pattern]>] [--kill] [--fmt]
  <command> [args]

example usage for a javascript test suite:

  tmuxtdd run --watch={src,test}/**/*.js --cmd 'npm test'

example usage for a long-running process (i.e. a server)

  tmuxtdd run --watch=src/**/*.js --cmd 'npm start' --kill

you can provide custom formatting using --fmt for example

  --fmt='tests S{run,pass,fail}'

you can use tmux semantics here, such as color

  --fmt='tests S{#[fg=yellow]run,#[fg=green]pass,#[fg=red]fail}'
```
