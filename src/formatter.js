module.exports.build = function (format){
  if (!format)
    format = 'S{running,passing,failing}'
  var regex = /S\{(.*)\}/;
  var strings = format.match(regex)[1].split(',');
  return function(position) {
    return format.replace(regex, strings[position]);
  }
}
