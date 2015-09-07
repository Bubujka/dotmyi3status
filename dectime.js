var moment = require('moment');
module.exports = function(data) {
  var st = new Date()  - moment().startOf('day');
  st = Math.floor(st / 1000);
  var dc = Math.floor((st/ (3600 * 24)) * 100 * 10 * 100);

  var h, m , s ;
  h = Math.floor(dc / 10000);
  m = Math.floor((dc - h * 10000) / 100);
  s = dc - h *10000 - m *100;
  var time = h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  
  time = '' + Math.floor(dc / 10) / 100+'%';
  data.push({
    name: 'dectime', 
    full_text: time,
  });
  return data;
};
