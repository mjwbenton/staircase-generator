require('babel-register');
require('babel-polyfill');
var glob = require('glob');
function runForPattern(pattern) {
    glob(pattern, function(err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            require('./'+file);
        });
    });
}
runForPattern('tst/*.js');
runForPattern('tst/**/*.js');
