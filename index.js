/*globals module*/

module.exports = function(data) {
  
  data = require('./toggl')(data);
  data = require('./plan-lines')(data);

  return data;
};
