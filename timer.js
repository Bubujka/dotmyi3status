var fs = require('fs');
var helpers = require('./helpers.js');
var pth = '/home/bubujka/.timer';
var nn = require('node-notifier');

var seconds = 0;
var diff = 0;
var prevdiff = 0;
var hide_timer = true;

function _update_timer(){
  fs.stat(pth, function(err, stat){
    if(err || !stat){
      hide_timer = true;
      return;
    }

    prevdiff = diff;
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
  var prev, s;
  var prefix = '';
  var color;
  prev = seconds - prevdiff;
  s = seconds - diff;
  if (s<0){
    if(prev >= 0){
      if(!hide_timer){
        nn.notify({
          title: "Timer",
          message: 'Время у таймера вышло.',
          urgency: 'critical',
          wait: true,
          time: 3600* 1000
        });
      }
    }
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

