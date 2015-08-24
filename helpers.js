var tinygradient = require('tinygradient');
var clrs = tinygradient(['#E50000', '#FCFC00', '#2EFC00'])
  .rgb(100)
  .map(function(itm){
    return itm.toHexString().toUpperCase();
  });



module.exports = {
  s_to_human: function (dur) {
    var h = Math.floor(dur / 3600);
    var m = Math.floor((dur - h*3600) / 60);
    return h+':'+(m<10 ? '0'+m : m);
  },
  i_to_color: function (i, upper){
    var ii = Math.floor((i / (upper))*100);
    if(ii > 99){
      ii = 99;
    }
    return clrs[ii];
  },
  i_to_stars: function(i, upper){
    var ii = Math.floor((i / (upper))*100);
    if(ii < 100){ return ''; }
    var r = Math.ceil((ii - 100) / 10);
    r++;
    if(r > 4){
      r = 4;
    }
    return Array(r).join('★');
  }
};
