/* @flow */

import test from 'tape';
import compose from '../src/compose';
import Site from '../src/site';
import ContentItemBuilder from '../src/content-item-builder';

test('compose', (t) => {

    t.test('identity function', (st) => {
        const inSite = new Site([]);
        const outSite = compose((site) => site, (site) => site)(inSite);
        st.equals(outSite, inSite, 'identity function composes correctly');
        st.end();
    });

    t.test('functions apply in order', (st) => {
        const contentItem = new ContentItemBuilder(false, '').build();
        const site1 = new Site([]);
        const site2 = new Site([contentItem]);
        const outSite = compose((site) => site1, (site) => site2)(site1);
        st.equals(outSite, site2, 'second function applies second');
        st.end();
    });

});
