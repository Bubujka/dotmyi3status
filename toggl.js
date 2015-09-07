var ts = require('toggl-stats');
var _ = require('underscore');
var helpers = require('./helpers.js');
var config = require('./config.js');

var tgl_data = false;


function _fetch_toggl(){
  ts(function(err, data){
    if(err){
      return;
    }
    tgl_data = data;
  });
}

_fetch_toggl();
setInterval(_fetch_toggl, 30000);

var tasks = { };
config.tasks.forEach(function(task){
  var t = function(){
    ts.byDesc(task.descs, task.wid, function(err,data) {
      if(err){
        return;
      }
      var tt = task.label+':';
      var ttt = [];
      for (var i in task.show) {
        var type = task.show[i];
        ttt.push(Math.floor(data[type].duration / 360)/10);
      }
      tt += ttt.join('/');
      tasks[task.label] = {
        name: 'tgl_task_'+task.label,
        full_text: tt
      };
    });
  };
  t();
  setInterval(t, task.update*1000);
});



function _duration_acc(memo, itm){
  return memo + itm.duration;
}
function _task_stats(data){
  for (var i in tasks) {
    data.push(tasks[i]);
  }
}
function _active_task(data){
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
          if(config.wids[wid]){
            pr = config.wids[wid].label+":";
          }
          data.push({
            name: 'toggle', 
            full_text: pr + entry.description + ' ('+entry.human+')',
            color: helpers.i_to_color(entry.duration, 1800)
          });
        }
      });
    });
  }
}

function _wid_stats(data){
  if(tgl_data){
    for (var i in config.wids) {
      var v = config.wids[i];
      if(tgl_data[i]){
        var totaltime = _.reduce(tgl_data[i], _duration_acc, 0);

        data.push({
          name: 'toggle_'+i, 
          full_text: 
            v.label+':'+
            (v.stars ? helpers.i_to_stars(totaltime, v.goal) : '')+
            helpers.s_to_human(totaltime),
          color: helpers.i_to_color(totaltime, v.goal)
        });
      }
    }
  }
}

module.exports = function(data){
  _active_task(data);
  _wid_stats(data);
  _task_stats(data);
  return data;
};

