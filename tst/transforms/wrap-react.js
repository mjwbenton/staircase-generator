/* @flow */

import test from 'tape';
import proxyquire from 'proxyquire';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';
import React from 'react';

const wrapReact = proxyquire('../../src/transforms/wrap-react', {
    '../components/Page': {
        default(props) {
            return <div>{props.item.getContent()}</div>;
        }
    }
}).default;

test('wrapReact', (t) => {
    const content = 'whatever';
    const expectedContent = '<div>whatever</div>';
    const ci = new ContentItemBuilder(false, '/path/')
        .withContent(content)
        .build();
    const site = new Site([ci]);
    const newSite = wrapReact(site);
    t.equals(newSite.items[0].getContent(), expectedContent);
    t.end();
});
