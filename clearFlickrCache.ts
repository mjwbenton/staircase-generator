import Cache from "async-disk-cache";
const cache = new Cache('flickr-cache');
cache.clear().then(() => {
    console.log('Done')
});
