/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import { readSiteFromPath } from './site';

readSiteFromPath('./content').catch((err) => console.trace(err))
    .then(handleFrontMatter)
    .then(handleMarkdown)
    .then(wrapReact)
    .then((site) => site.writeToPath('./output'))
    .catch((err) => {
        console.error(err);
    });
