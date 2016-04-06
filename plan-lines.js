var fs = require('fs');
var _ = require('underscore');
var helpers = require('./helpers.js');

var plan_lines = 0;

function _update_plan_lines(){
  fs.readFile('/home/bubujka/.db/wiki/plan.md', 'utf8', function (err,data) {
    plan_lines = _.filter(data.split('\n'), function(line){
      return line.length > 5;
    }).length;
  });
}

_update_plan_lines();

setInterval(_update_plan_lines, 10000);

module.exports = function(data){
  data.push({
    name: 'plan_lines',
    full_text: 'pl:'+plan_lines,
    color: helpers.i_to_color(Math.max(0, (30 - plan_lines)), 30)
  });
  return data;
};

