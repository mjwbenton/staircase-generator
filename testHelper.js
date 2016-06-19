require('babel-register');
var setLogger = require('./src/logging').setLogger;
var bunyan = require('bunyan');
setLogger(bunyan.createLogger({ name: 'staircase', level: 'error' }));
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
