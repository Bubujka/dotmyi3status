var helpers = require('./helpers');
var sprintf = require('sprintf');

var exec = require('child_process').exec;
var uid = 0;
module.exports = function(project, file, format){
  uid++;
  var lines = 0;
  function update(){
    exec('git --git-dir '+project+'/.git  log --since midnight --oneline -- '+file, function(err,stdout){
      lines = stdout.split('\n').filter(function(str){ return str !== ''; }).length;
    });
  }
  update();
  setInterval(update, 10000);

  return function(data){
    data.push({
      name: 'commits_on_file_today'+uid,
      full_text: sprintf(format, lines),
      color: helpers.i_to_color(lines, 1)
    });

    return data;
  };
};
