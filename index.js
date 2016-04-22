/*globals module*/
var commits_on_file_today = require('./commits_on_file_today');

var at_least_commit_per_day = require('./at_least_commit_per_day');
var check_dirty_git = require('./check_dirty_git');

var fns = [
  commits_on_file_today('~/.db/wiki', 'waiting.md', '+wit'),
  commits_on_file_today('~/.db/wiki', 'next-home.md', '+n-home'),
  at_least_commit_per_day({
    '~/.db/prj/tis': 'tis',
    '~/.db/gnucash': '$$$',
    '~/.db/wiki': 'wiki',
    '~/.db/prj/najomi_data': 'najomi'
  }),
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
  data = require('./plan-lines')(data);
  data = require('./money')(data);

  fns.forEach(function(fn){
    data = fn(data);
  });

  return data;
};
