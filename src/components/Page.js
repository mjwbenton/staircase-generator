/* @flow */

import React from 'react';
import HtmlHeader from './HtmlHeader';
import Navigation from './Navigation';
import Photos from './Photos';
import type { ContentItem } from '../content-item-builder';
import type Site from '../site';
import { NAVIGATION_META_KEY } from '../features/navigation';
import { PHOTOS_META_KEY } from '../features/flickr-set';

export default function Page({item, site}
        : {item : ContentItem, site : Site}) : React.Element {
    const photos = item.getMeta(PHOTOS_META_KEY)
        ? <Photos photos={item.getMeta(PHOTOS_META_KEY)} /> : '';
    return <html>
        <HtmlHeader />
        <body>
            <Navigation navigation={site.getMeta(NAVIGATION_META_KEY)} />
            <div dangerouslySetInnerHTML={{ __html: item.getContent() }} />
            {photos}
        </body>
    </html>;
}
