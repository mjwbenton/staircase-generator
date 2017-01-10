/* @flow */

import type Site from '../site';
import ContentItemBuilder from '../content-item-builder';
import {getLogger} from '../logging';
import request from 'request-promise';
import Cache from 'async-disk-cache';

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

const LARGE_1600_SIZE_LABEL = 'Large 1600';
const LARGE_SIZE_LABEL = 'Large';

async function callFlickr(apiKey : string, methodName : string,
        params : { [key : string] : string }, retryNumber: number = 0) {
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
                    .then((str) => {
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
    url : string,
    pageUrl : string,
    title : string,
    width: number,
    height: number
};

async function getPhotos(apiKey : string, setId : string)
        : Promise<Photo[]> {
    const log = getLogger('flickr-set');
    const photosResponse = await callFlickr(apiKey, FLICKR_PHOTOS_METHOD, {
        [PHOTOSET_ID_KEY]: setId
    });
    return await Promise.all(photosResponse.photoset.photo.map(async (p) => {
        const sizes = await callFlickr(apiKey, FLICKR_SIZES_METHOD, {
            [PHOTO_ID_KEY]: p.id
        });
        try {
            let size = sizes.sizes.size.find(
                    (el) => el.label === LARGE_1600_SIZE_LABEL);
            if (size === undefined) {
                size = sizes.sizes.size.find(
                    (el) => el.label === LARGE_SIZE_LABEL);
            }
            return {
                id: p.id,
                title: p.title,
                width: size.width,
                height: size.height,
                url: size.source,
                pageUrl: size.url
            };
        } catch (ex) {
            log.error(`Error reading sizes for photo '${p.id}', `
                    + `response was ${JSON.stringify(sizes)}`);
            throw ex;
        }
    }));
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
