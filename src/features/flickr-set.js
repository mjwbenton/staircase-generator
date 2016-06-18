/* @flow */

import type Site from '../site';
import {getLogger} from '../logging';
import request from 'request-promise';

import { skipMeta, skipDirectories } from '../transforms/skip-items';

const FLICKR_API_BASE_URL = 'https://api.flickr.com/services/rest/';
const FLICKR_BASE_PARAMETERS = '?format=json&nojsoncallback=1';

export const PHOTOS_META_KEY = 'photos';
const FLICKR_SET_META_KEY = 'flickr_set';

const FLICKR_PHOTOS_METHOD = 'flickr.photosets.getPhotos';
const FLICKR_SIZES_METHOD = 'flickr.photos.getSizes';
const PHOTO_ID_KEY = 'photo_id';
const PHOTOSET_ID_KEY = 'photoset_id';

const LARGE_SIZE_LABEL = 'Large 1600';

async function callFlickr(apiKey : string, methodName : string,
        params : { [key : string] : string }, retryNumber: number = 0) {
    const log = getLogger('flickr-set');
    try {
        let url = FLICKR_API_BASE_URL + FLICKR_BASE_PARAMETERS
            + `&api_key=${apiKey}&method=${methodName}`;
        Object.keys(params).forEach((key) => {
            const value = params[key];
            url += `&${key}=${value}`;
        });
        log.info(`Making request: ${url}`);
        const result : string = await request(url);
        log.info(`Recieved response: ${result}`);
        return JSON.parse(result);
    } catch (err) {
        log.error(`Error calling flickr for method ${methodName}: ${err}`);
        if (retryNumber < 2) {
            return callFlickr(apiKey, methodName, params, retryNumber + 1);
        }
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
    const photosResponse = await callFlickr(apiKey, FLICKR_PHOTOS_METHOD, {
        [PHOTOSET_ID_KEY]: setId
    });
    return await Promise.all(photosResponse.photoset.photo.map(async (p) => {
        const sizes = await callFlickr(apiKey, FLICKR_SIZES_METHOD, {
            [PHOTO_ID_KEY]: p.id
        });
        const size = sizes.size.find(
                (el) => el.label === LARGE_SIZE_LABEL);
        return {
            id: p.id,
            title: p.title,
            width: size.width,
            height: size.height,
            url: size.source,
            pageUrl: size.url
        };
    }));
}

export default function buildFlickrSetOuter(apiKey : string) {
    return function buildFlickrSet(site : Site) {
        return site.mapWithFiltersAsync(
            [skipMeta, skipDirectories],
            async (item) => {
                const setId : string = item.getMeta(FLICKR_SET_META_KEY);
                if (typeof setId === 'string') {
                    const photos = await getPhotos(apiKey, setId);
                    return item.withMergedMeta(
                        {[PHOTOS_META_KEY]: photos});
                }
                return item;
            }
        );
    };
}
