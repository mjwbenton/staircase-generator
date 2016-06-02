/* @flow */

import type Site from '../site';
import request from 'request-promise';

import { skipMeta, skipDirectories } from '../transforms/skip-items';

const FLICKR_API_BASE_URL = 'https://api.flickr.com/services/rest/';
const FLICKR_BASE_PARAMETERS = '?format=json&nojsoncallback=1';

const FLICKR_SET_META_KEY = 'flickr_set';

const FLICKR_SET_METHOD = 'flickr.photosets.getInfo';
const FLICKR_PHOTOS_METHOD = 'flickr.photosets.getPhotos';
const PHOTOSET_ID_KEY = 'photoset_id';

function buildUrl({ id, farm, server, secret } : {[key : string] : string})
        : string {
    return `http://farm${farm}.static.flickr.com/${server}`
            + `/${id}_${secret}_z.jpg`;
}

function buildPageUrl(id : string, owner : string) : string {
    return `http://www.flickr.com/photos/${owner}/${id}`;
}

async function callFlickr(apiKey : string, methodName : string,
        params : { [key : string] : string }) {
    try {
        let url = FLICKR_API_BASE_URL + FLICKR_BASE_PARAMETERS
            + `&api_key=${apiKey}&method=${methodName}`;
        Object.keys(params).forEach((key) => {
            const value = params[key];
            url += `&${key}=${value}`;
        });
        const result : string = await request(url);
        return JSON.parse(result);
    } catch (err) {
        console.error(`Error calling flickr for method ${methodName}: ${err}`);
        throw err;
    }
}

async function getOwner(apiKey : string, setId : string) : Promise<string> {
    const setInfo = await callFlickr(apiKey, FLICKR_SET_METHOD, {
        [PHOTOSET_ID_KEY]: setId
    });
    return setInfo.photoset.owner;
}

async function getPhotos(apiKey : string, setId : string)
        : Promise<{ id : string, url : string}[]> {
    const photosResponse = await callFlickr(apiKey, FLICKR_PHOTOS_METHOD, {
        [PHOTOSET_ID_KEY]: setId
    });
    return photosResponse.photoset.photo.map((p) => ({
        id: p.id,
        url: buildUrl(p)
    }));
}

export const PHOTOS_META_KEY = 'photos';

export type Photo = {
    id : string,
    url : string,
    pageUrl : string
};

export default function buildFlickrSetOuter(apiKey : string) {
    return function buildFlickrSet(site : Site) {
        return site.mapWithFiltersAsync(
            [skipMeta, skipDirectories],
            async (item) => {
                const setId : string = item.getMeta(FLICKR_SET_META_KEY);
                if (typeof setId === 'string') {
                    const [owner, photos]
                        = await Promise.all([
                            getOwner(apiKey, setId),
                            getPhotos(apiKey, setId)
                        ]);
                    const photosWithPageUrl : Photo[] = photos.map((p) => {
                        return {
                            ...p,
                            pageUrl: buildPageUrl(p.id, owner)
                        };
                    });
                    return item.withMergedMeta(
                        {[PHOTOS_META_KEY]: photosWithPageUrl});
                }
                return item;
            }
        );
    };
}
