/* @flow */

import type Site from './site';
import { getLogger } from './logging';

export default function compose(...funcs
        : Array<(site : Site) => Site|Promise<Site>>)
        : (site : Site) => Promise<Site> {
    return async (site : Site) => {
        return await callAndRecurse(site, funcs);
    };
}

async function callAndRecurse(site : Site,
        funcs : Array<(site : Site) => Site|Promise<Site>>)
        : Promise<Site> {
    if (funcs.length === 0) {
        return Promise.resolve(site);
    }
    const [func, ...remainingFunc] = funcs;
    let nextSite;
    try {
        nextSite = await func(site);
    } catch (err) {
        const log = getLogger('compose');
        log.error(`Error in transform function: ${func.name}`);
        log.error(err);
        throw err;
    }
    return callAndRecurse(nextSite, remainingFunc);
}
