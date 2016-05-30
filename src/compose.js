/* @flow */

import type Site from './site';

export default function compose(...funcs : Array<(site : Site) => Site>) {
    return (site : Site) => {
        let outputSite = site;
        funcs.forEach((func) => {
            try {
                outputSite = func(outputSite);
            } catch (err) {
                console.error(`Error in transform function: ${func.name}`);
                console.error(err);
            }
        });
        return outputSite;
    };
}
