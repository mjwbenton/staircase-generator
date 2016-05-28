/* @flow */

import test from 'tape';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';
import React from 'react';
import wrapReact from '../../src/transforms/wrap-react';

function Component(props) {
    return <div>{props.item.getContent()}</div>;
}

test('wrapReact', (t) => {
    const content = 'whatever';
    const expectedContent = '<div>whatever</div>';
    const ci = new ContentItemBuilder(false, '/path/')
        .withContent(content)
        .build();
    const site = new Site([ci]);
    const newSite = wrapReact(Component)(site);
    t.equals(newSite.items[0].getContent(), expectedContent);
    t.end();
});
