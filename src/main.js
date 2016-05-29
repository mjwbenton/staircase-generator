/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import addDoctype from './transforms/add-doctype';
import { readSiteFromPath } from './site';
import Page from './components/Page';
import compose from './compose';

async function generateSite() {
    const site = await readSiteFromPath('./content');
    const transformedSite = compose(
        handleFrontMatter,
        handleMarkdown,
        wrapReact(Page),
        addDoctype
    )(site);
    await transformedSite.writeToPath('./output');
}
generateSite();
