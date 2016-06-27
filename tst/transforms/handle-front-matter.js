/* @flow */

import proxyquire from 'proxyquire';
import test from 'tape';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';

const handleFrontMatter = proxyquire('../../src/transforms/handle-front-matter',
    {
        'yaml-front-matter': {
            loadFront() {
                return {
                    some: 'stuff',
                    __content: 'the content'
                };
            }
        }
    }).default;

test('handleFrontMatter', (t) => {
    const item = new ContentItemBuilder(false, '/whatever.html').build();
    const site = new Site([item]);
    const newSite: Site = handleFrontMatter(site);
    t.equals(newSite.getNthContentItem(0).content, 'the content',
        'content without front matter');
    t.equals(newSite.getNthContentItem(0).meta.some, 'stuff',
        'front matter added to extras');
    t.end();
});
