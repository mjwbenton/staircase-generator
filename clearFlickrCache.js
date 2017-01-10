var Cache = require('async-disk-cache');
var cache = new Cache('flickr-cache');
cache.clear().then(function() {
    console.log('Done')
});
