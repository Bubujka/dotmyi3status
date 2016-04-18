var helpers = require('./helpers');
var sprintf = require('sprintf');
var async = require('async');
var ut = require('untildify');


var exec = require('child_process').exec;
var uid = 0;
module.exports = function(projects){
  uid++;
  var text = '';
  function update(){
    var t = [];
    async.forEachOf(projects, function(name, pth, cb){
      pth = ut(pth);
      exec(sprintf('git --git-dir=%s/.git --work-tree=%s log --since midnight', pth, pth),
           function(err,stdout){
             if(err){
               return cb(err);
             }
             if(!stdout.length){
               t.push(name);
             }
             cb();
           });
    }, function(err){
      if(err){console.log(err);return;}
      text = t.sort().join(', ');
    });
  }
  update();
  setInterval(update, 10000);

  return function(data){
    data.push({
      name: 'at_least_commit_per_day'+uid,
      full_text: text !== '' ? 'wrk: '+text : '',
      color: helpers.i_to_color(0, 1)
    });
    return data;
  };
};
