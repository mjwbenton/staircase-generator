/* @flow */

import proxyquire from 'proxyquire';
import test from 'tape';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';

const FAKE_MARKUP = 'fakeMarkup';
const handleMarkdown : (site : Site) => Site
    = proxyquire('../../src/transforms/handle-markdown', {
        marked(markdown : string) : string {
            return FAKE_MARKUP;
        }
    }).default;

test('handleMarkdown', (t) => {
    const item = new ContentItemBuilder(false, '/whatever.html')
        .withContent('whatever')
        .build();
    const site = new Site([item]);
    const newSite = handleMarkdown(site);
    t.equals(newSite.items[0].getContent(), FAKE_MARKUP);
    t.end();
});
