/*globals module*/
var commits_on_file_today = require('./commits_on_file_today');
var check_dirty_git = require('./check_dirty_git');

var fns = [
  commits_on_file_today('~/.db/wiki', 'waiting.md', 'waiting'),
  check_dirty_git({
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
