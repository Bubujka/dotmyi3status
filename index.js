/*globals module*/
var fs = require('fs');
var ts = require('toggl-stats');
var _ = require('underscore');


var prj = "";
var tgl_active = "";
var totaltime = 0;
var plan_lines = 0;
var tgl_data = false;

var wids = {
  '281169': {
    label: 'my',
    goal: 3600
  },
  '358026': {
    label: 'beta',
    goal: 3600*8
  }
};

var tinygradient = require('tinygradient');
var clrs = tinygradient(['#E50000', '#FCFC00', '#2EFC00'])
  .rgb(100)
  .map(function(itm){
    return itm.toHexString().toUpperCase();
  });

function _s_to_color(i, upper){
  var ii = Math.floor((i / (upper))*100);
  if(ii > 99){
    ii = 99;
  }
  return clrs[ii];
}
function _i_to_stars(i, upper){
  var ii = Math.floor((i / (upper))*100);
  if(ii < 100){ return ''; }
  var r = Math.ceil((ii - 100) / 10);
  r++;
  if(r > 4){
    r = 4;
  }
  return Array(r).join('★');
}

function _update_prj(){
  fs.readFile('/home/bubujka/.prj', 'utf8', function (err,data) {
    prj = data.replace('\n','');
  });
}
_update_prj();

setInterval(_update_prj, 10000);

function _update_plan_lines(){
  fs.readFile('/home/bubujka/.db/wiki/plan.md', 'utf8', function (err,data) {
    plan_lines = _.filter(data.split('\n'), function(line){
      return line.length > 5;
    }).length;
  });
}

_update_plan_lines();

setInterval(_update_plan_lines, 10000);


function _fetch_toggl(){
  ts(function(err, data){
    if(err){
      return;
    }
    tgl_data = data;

   // data.forEach(function(itm){
   //   if(itm.active){
   //     tgl_active = itm;
   //   }else{
   //     tgl_active = false;
   //   }
   //   if(itm.description === 'solo'){
   //     return;
   //   }
   //   totaltime+= itm.duration;
   // });
  });
}
_fetch_toggl();

setInterval(_fetch_toggl, 30000);

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

  if(tgl_data){
    _.each(tgl_data, function(group, wid){
      _.each(group, function(entry){
        if(entry.active){
          data.push({
            name: 'toggle_active', 
            full_text: 'TGL',
            color: '#FCFC00'
          });
          var pr = "";
          if(wids[wid]){
            pr = wids[wid].label+":";
          }
          data.push({
            name: 'toggle', 
            full_text: pr + entry.description + ' ('+entry.human+')',
            color: _s_to_color(entry.duration, 1800)
          });
        }
      });
    });
  }

  if(tgl_data){
    for (var i in wids) {
      var v = wids[i];
      if(tgl_data[i]){
        var totaltime = 0;
        tgl_data[i].forEach(function(itm){
          if(itm.description === 'solo'){
            return;
          }
          totaltime+= itm.duration;
        });

        data.push({
          name: 'toggle_'+i, 
          full_text: v.label+':'+_i_to_stars(totaltime, v.goal)+_s_to_human(totaltime),
          color: _s_to_color(totaltime, v.goal)
        });
      }
    }

   // tgl_data.forEach(function(itm){
   //   if (itm.description === 'solo') {
   //     var txt = 'solo:'+
   //         _i_to_stars(itm.duration, 1800)+
   //         _s_to_human(itm.duration);
   //     data.push({
   //       name: 'toggle_solo', 
   //       full_text: txt,
   //       color: _s_to_color(itm.duration, 1800)
   //     });
   //   }
   // });
  }
  
  data.push({
    name: 'plan_lines', 
    full_text: 'pl:'+plan_lines,
    color: _s_to_color((30 - plan_lines), 30)
  });

  return data;
};
