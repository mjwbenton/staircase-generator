/* @flow */

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import writeContent from './write-content';
import { readSiteFromPath } from './site';

readSiteFromPath('./content').catch((err) => console.trace(err))
    .then(handleFrontMatter)
    .then(handleMarkdown)
    .then(wrapReact)
    .then(writeContent('./output'))
    .then((result) => {
        console.log(result.items);
    }).catch((err) => {
        console.error(err);
    });
