import * as test from 'blue-tape';
import compose from '../src/compose';
import Site from '../src/site';
import ContentItemBuilder from '../src/content-item-builder';

test('compose', (t) => {

    t.test('identity function', async (st) => {
        const inSite = new Site([]);
        const outSite = await compose((site) => site, (site) => site)(inSite);
        st.equals(outSite, inSite, 'identity function composes correctly');
    });

    t.test('functions apply in order', async (st) => {
        const contentItem = new ContentItemBuilder(false, '').build();
        const site1 = new Site([]);
        const site2 = new Site([contentItem]);
        const outSite = await compose((site) => site1, (site) => site2)(site1);
        st.equals(outSite, site2, 'second function applies second');
    });

});
