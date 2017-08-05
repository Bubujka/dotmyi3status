/*globals module*/
var commits_on_file_today = require('./commits_on_file_today');

var at_least_commit_per_day = require('./at_least_commit_per_day');
var check_dirty_git = require('./check_dirty_git');

var fns = [
  check_dirty_git({
    '~/.db/prj/tis': 'tis',
    '~/.bu.bin': 'bin',
    '~/.db/gnucash': '$$$',
    '~/.db/wiki': 'wiki',
    '~/.db/dotfiles': '.files',
    '~/.db/dotfiles-private': '.files-p',
    '~/.myi3status': 'myi3st'
  })
];

module.exports = function(data) {
  data = require('./toggl')(data);

  fns.forEach(function(fn){
    data = fn(data);
  });

  data = require('./timer')(data);
  return data;
};
