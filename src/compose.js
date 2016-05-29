/* @flow */

import type Site from './site';

export default function compose(...funcs : Array<(site : Site) => Site>) {
    return (site : Site) => {
        let outputSite = site;
        funcs.forEach((func) => {
            outputSite = func(outputSite);
        });
        return outputSite;
    };
}
