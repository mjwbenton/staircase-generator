/* @flow */

import type Site from '../site';
import ContentItemBuilder from '../content-item-builder';
import { getLogger } from '../logging';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { skipMeta, skipDirectories } from './skip-items';

export default function wrapReactOuter(Component : any) {
    return function wrapReact(site : Site) {
        const log = getLogger('wrapReact');
        const newSite = site.mapWithFilters([skipMeta, skipDirectories],
            (item) => {
                log.info(`Rendering page '${item.filename}' with react`);
                const html = ReactDOMServer.renderToStaticMarkup(
                    <Component item={item} site={site} />
                );
                return ContentItemBuilder.fromItem(item)
                        .withContent(html).build();
            });
        log.info('Finished wrapReact');
        return newSite;
    };
}
