var moment = require('moment');
var sprintf = require('sprintf-js');






var s = new Date  - moment().startOf('day');
s = Math.floor(s / 1000);
var dc = Math.floor((s/ (3600 * 24)) * 100 * 10 * 100);

var h, m , s ;
h = Math.floor(dc / 10000);
m = Math.floor((dc - h * 10000) / 100);
s = dc - h *10000 - m *100;
console.log(h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s);
