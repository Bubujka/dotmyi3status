/*globals module*/
var fs = require('fs');
var ts = require('toggl-stats');


var tinygradient = require('tinygradient');
var clrs = tinygradient('#E50000', '#FCFC00', '#2EFC00')
  .rgb(100)
  .map(function(itm){
    return itm.toHexString().toUpperCase();
  });

var prj = "";
var tgl_active = "";
var totaltime = 0;
function _s_to_color(i){
  return clrs[Math.floor((i / (8 * 3600))*100)];
}
setInterval(function() {
  fs.readFile('/home/bubujka/.prj', 'utf8', function (err,data) {
    prj = data.replace('\n','');
  });
}, 10000);


setInterval(function() {
  ts(function(err, data){
    if(err){
      return console.log(err);
    }
    totaltime = 0;
    data.forEach(function(itm){
      if(itm.active){
        tgl_active = itm;
      }else{
        tgl_active = false;
      }
      totaltime+= itm.duration;
    });
  });
}, 5000);
function _s_to_human(dur) {
  var h = Math.floor(dur / 3600);
  var m = Math.floor((dur - h*3600) / 60);
  return h+':'+(m<10 ? '0'+m : m);
}
module.exports = function(data) {
  data.push({
    name: 'mi3s_suffix', 
    full_text: prj.replace(/^.*\/(.*\/.*)$/,'$1'), 
  });
  if(tgl_active){
    data.push({
      name: 'toggle', 
      full_text: tgl_active.description + ' ('+tgl_active.human+')',
      color: '#00FF00'
    });
  }
  if(totaltime){
    data.push({
      name: 'toggle_total', 
      full_text: _s_to_human(totaltime),
      color: _s_to_color(totaltime)
    });
  }
  return data;
};
