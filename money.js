var fs = require('fs');
var helpers = require('./helpers');

var expandTilde = require('expand-tilde');

var m = {
  name: 'money',
  full_text: ''
};
function _update(){
  fs.readFile(expandTilde('~/.money.json'), function(err, body){
    if(err){
      m.full_text = err.message;
      return;
    }
    var t = JSON.parse(body);
    var p = t.collected / t.goal * 100;
    m.color = helpers.i_to_color(p, 100);
    m.full_text = (t.collected/1000)+'' +'/'+(t.goal/1000)+'k (' + (t.collected / t.goal * 100).toPrecision(4)+'%)';
  });
}
_update();
setInterval(_update, 10000);
module.exports = function(data) {

  data.push(m);
  return data;
};
