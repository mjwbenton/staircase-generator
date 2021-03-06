import Site from '../site';
import ContentItemBuilder from '../content-item-builder';
import {getLogger} from '../logging';
import * as request from 'request-promise';
import * as Cache from 'async-disk-cache';

import { skipMeta, skipDirectories } from '../transforms/skip-items';

const CACHE = new Cache('flickr-cache');

const FLICKR_API_BASE_URL = 'https://api.flickr.com/services/rest/';
const FLICKR_BASE_PARAMETERS = '?format=json&nojsoncallback=1';

export const PHOTOS_META_KEY = 'photos';
const FLICKR_SET_META_KEY = 'flickr_set';

const FLICKR_PHOTOS_METHOD = 'flickr.photosets.getPhotos';
const FLICKR_SIZES_METHOD = 'flickr.photos.getSizes';
const PHOTO_ID_KEY = 'photo_id';
const PHOTOSET_ID_KEY = 'photoset_id';

const WANTED_IMAGE_SIZES = new Set(['Medium', 'Medium 640', 'Medium 800', 'Large', 'Large 1600', 'Large 2048']);

async function callFlickr(apiKey : string, methodName : string,
        params : { [key : string] : string }, retryNumber: number = 0): Promise<any> {
    const log = getLogger('flickr-set');
    let url = FLICKR_API_BASE_URL + FLICKR_BASE_PARAMETERS
            + `&api_key=${apiKey}&`;
    let paramsStr = `method=${methodName}`;
    Object.keys(params).forEach((key) => {
        const value = params[key];
        paramsStr += `&${key}=${value}`;
    });
    url += paramsStr;
    try {
        return await CACHE.get(url).then(({isCached, value}) => {
            if (isCached) {
                log.info(`Using cache for: ${paramsStr}`);
                return JSON.parse(value);
            } else {
                log.info(`Making request: ${paramsStr}`);
                const resultStrPromise = request(url);
                log.info(`2xx response for: ${paramsStr}`);
                return resultStrPromise
                    .then((str: string) => {
                        CACHE.set(url, str).then(() => {
                            log.info(`Cached value for: ${paramsStr}`);
                        });
                        return JSON.parse(str);
                    });
            }
        });
    } catch (err) {
        log.info(`Error calling flickr for ${paramsStr}: ${err}`);
        if (retryNumber < 2) {
            log.info(`Initiating retry number ${retryNumber} for ${paramsStr}`);
            return callFlickr(apiKey, methodName, params, retryNumber + 1);
        }
        log.error(`Given up retrying for ${paramsStr}`);
        throw err;
    }
}

export type Photo = {
    id : string,
    pageUrl : string,
    title : string,
    mainSource: PhotoSource,
    sources: PhotoSource[]
};

export type PhotoSource = {
    url: string,
    pageUrl: string,
    width: number,
    height: number,
    sizeLabel: string
}

async function getPhotos(apiKey : string, setId : string): Promise<Array<Photo>> {
    const log = getLogger('flickr-set');
    const photosResponse = await callFlickr(apiKey, FLICKR_PHOTOS_METHOD, {
        [PHOTOSET_ID_KEY]: setId
    });
    const promises: Promise<Photo>[] = photosResponse.photoset.photo.map(async (p: any) => {
        const sizes = await callFlickr(apiKey, FLICKR_SIZES_METHOD, {
            [PHOTO_ID_KEY]: p.id
        });
        try {
            const photoSources: PhotoSource[] = sizes.sizes.size
                .filter((el: any) => WANTED_IMAGE_SIZES.has(el.label))
                .map((el: any) => ({
                    url: el.source,
                    pageUrl: el.url,
                    width: parseInt(el.width),
                    height: parseInt(el.height),
                    sizeLabel: el.label}))
                .sort((a: PhotoSource, b: PhotoSource) => b.width - a.width);
            const mainSource = photoSources[photoSources.length - 1];
            return {
                id: p.id,
                title: p.title,
                pageUrl: (mainSource || {pageUrl: ""}).pageUrl,
                sources: photoSources,
                mainSource: mainSource
            };
        } catch (ex) {
            log.error(`Error reading sizes for photo '${p.id}', `
                + `response was ${JSON.stringify(sizes)}`);
            throw ex;
        }
    });
    return await Promise.all(promises);
}

export default function buildFlickrSetOuter(apiKey : string) {
    return function buildFlickrSet(site : Site) {
        return site.mapWithFiltersAsync(
            [skipMeta, skipDirectories],
            async (item) => {
                const setId : string = item.meta[FLICKR_SET_META_KEY];
                if (typeof setId === 'string') {
                    const photos = await getPhotos(apiKey, setId);
                    return ContentItemBuilder.fromItem(item).withMergedMeta(
                        {[PHOTOS_META_KEY]: photos}).build();
                }
                return item;
            }
        );
    };
}
