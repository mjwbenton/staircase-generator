/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import addDoctype from './transforms/add-doctype';
import { readSiteFromPath } from './site';

async function generateSite() {
    const site = await readSiteFromPath('./content');
    const transformedSite
        = addDoctype(wrapReact(handleMarkdown(handleFrontMatter(site))));
    await transformedSite.writeToPath('./output');
}
generateSite();
