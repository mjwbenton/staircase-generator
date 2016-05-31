/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import addDoctype from './transforms/add-doctype';
import { readSiteFromPath } from './site';
import Page from './components/Page';
import buildNavigation from './features/navigation';
import compose from './compose';

async function generateSite() {
    try {
        const site = await readSiteFromPath('./content');
        const transformedSite = await compose(
            handleFrontMatter,
            buildNavigation,
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
