/* @flow */

import test from 'tape';
import addDoctype from '../../src/transforms/add-doctype';
import ContentItemBuilder from '../../src/content-item-builder';
import Site from '../../src/site';

test('addDoctype', (t) => {
    const content = 'whatever';
    const ci = new ContentItemBuilder(false, '/path/')
        .withContent(content)
        .build();
    const site = new Site([ci]);
    const newSite = addDoctype(site);
    t.equals(newSite.items[0].content, `<!doctype html>\n${content}`);
    t.end();
});
