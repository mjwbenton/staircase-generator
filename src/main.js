/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import addDoctype from './transforms/add-doctype';
import { readSiteFromPath } from './site';
import Page from './components/Page';
import buildNavigation from './features/navigation';
import buildFlickrSet from './features/flickr-set';
import compose from './compose';
import { setupDefaultLogger, getLogger } from './logging';

setupDefaultLogger();

async function generateSite() {
    getLogger('main').info('Starting Generation');
    try {
        const site = await readSiteFromPath('./content');
        const transformedSite = await compose(
            handleFrontMatter,
            buildNavigation,
            buildFlickrSet('ad7d7f87cbe5cdf41c1fe66808d5cc7d'),
            handleMarkdown,
            wrapReact(Page),
            addDoctype
        )(site);
        await transformedSite.writeToPath('./output');
    } catch (err) {
        console.error(`Error generating site: ${err}`);
        throw err;
    }
}
generateSite();
