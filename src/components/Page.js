/* @flow */

import React from 'react';
import HtmlHeader from './HtmlHeader';
import type { ContentItem } from '../content-item-builder';

export default function Page({item} : {item : ContentItem}) : React.Element {
    return <html>
        <HtmlHeader />
        <body>
            <div dangerouslySetInnerHTML={{ __html: item.getContent() }} />
        </body>
    </html>;
}
