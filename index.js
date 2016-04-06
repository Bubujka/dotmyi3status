/*globals module*/

module.exports = function(data) {

  data = require('./toggl')(data);
  data = require('./plan-lines')(data);
  data = require('./money')(data);

  return data;
};
