/* @flow */

import test from 'tape';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';
import type { ContentItem } from '../../src/content-item-builder';
import React from 'react';
import wrapReact from '../../src/transforms/wrap-react';

function Component({item}: {item: ContentItem}) {
    return <div>{item.content}</div>;
}

test('wrapReact', (t) => {
    const content = 'whatever';
    const expectedContent = '<div>whatever</div>';
    const ci = new ContentItemBuilder(false, '/path/')
        .withContent(content)
        .build();
    const site = new Site([ci]);
    const newSite = wrapReact(Component)(site);
    t.equals(newSite.getNthContentItem(0).content, expectedContent);
    t.end();
});
