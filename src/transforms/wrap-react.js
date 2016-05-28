/* @flow */

import type Site from '../site';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { skipMeta, skipDirectories } from './skip-items';

export default function wrapReact(Component : any) {
    return (site : Site) => {
        return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
            const html = ReactDOMServer.renderToStaticMarkup(
                <Component item={item} />
            );
            return item.withContent(html);
        });
    };
}
