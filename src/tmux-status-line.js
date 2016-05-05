module.exports = function(status) {
  switch (status) {
    case 'passing':
      return '#[bg=green]#[fg=black] PASS ';
    case 'failing':
      return '#[bg=red]#[fg=black] FAIL ';
    default: 
      return '#[bg=black]#[fg=grey] BUSY ';
  }
}
