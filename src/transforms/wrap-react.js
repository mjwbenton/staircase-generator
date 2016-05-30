/* @flow */

import type Site from '../site';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { skipMeta, skipDirectories } from './skip-items';

export default function wrapReactOuter(Component : any) {
    return function wrapReact(site : Site) {
        return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
            const html = ReactDOMServer.renderToStaticMarkup(
                <Component item={item} site={site} />
            );
            return item.withContent(html);
        });
    };
}
