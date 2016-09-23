var fs = require('fs');
var helpers = require('./helpers.js');
var pth = '/home/bubujka/.timer';
var seconds = 0;
var diff = 0;
var hide_timer = true;

function _update_timer(){
  fs.stat(pth, function(err, stat){
    if(err || !stat){
      hide_timer = true;
      return;
    }

    diff = Math.floor((new Date() - stat.mtime) / 1000);

    fs.readFile(pth, 'utf8', function (err,data) {
      hide_timer = false;
      seconds = parseInt(data);
    });
  });
}

_update_timer();

setInterval(_update_timer, 1000);

module.exports = function(data){
  var s = seconds - diff;
  var prefix = '';
  var color;
  if (s<0){
    prefix = '-';
    color = '#FCFC00';
  }else{
    prefix = '';
    color = '#2EFC00';
  }

  data.push({
    name: 'timer',
    full_text: hide_timer ? '' :'tmr '+prefix+helpers.s_to_human(Math.abs(s)),
    color: color
  });
  return data;
};

