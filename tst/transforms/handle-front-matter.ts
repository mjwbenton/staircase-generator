import * as proxyquire from "proxyquire";
import * as test from 'tape';
import Site from '../../src/site';
import ContentItemBuilder from '../../src/content-item-builder';

const handleFrontMatter = proxyquire('../../src/transforms/handle-front-matter',
    {
        'gray-matter': (content: string) => {
            return {
                data: {
                    some: 'stuff'
                },
                content: 'the content'
            };
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
