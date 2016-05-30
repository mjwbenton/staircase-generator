/* @flow */

import React from 'react';
import HtmlHeader from './HtmlHeader';
import Navigation from './Navigation';
import type { ContentItem } from '../content-item-builder';
import type Site from '../site';
import { NAVIGATION_META_KEY } from '../features/navigation';

export default function Page({item, site}
        : {item : ContentItem, site : Site}) : React.Element {
    return <html>
        <HtmlHeader />
        <body>
            <Navigation navigation={site.getMeta(NAVIGATION_META_KEY)} />
            <div dangerouslySetInnerHTML={{ __html: item.getContent() }} />
        </body>
    </html>;
}
