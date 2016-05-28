/* @flow */

import type Site from '../site';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Page from '../components/Page';
import { skipMeta, skipDirectories } from './skip-items';

export default function wrapReact(site : Site) : Site {
    return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
        const html = ReactDOMServer.renderToStaticMarkup(
            <Page item={item} />
        );
        return item.withContent(html);
    });
}
