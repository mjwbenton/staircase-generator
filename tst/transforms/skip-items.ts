import * as test from 'tape';
import { skipDirectories, skipMeta } from '../../src/transforms/skip-items';
import ContentItemBuilder from '../../src/content-item-builder';

test('skipItems', (t) => {

    t.test('skipDirectories', (st) => {
        {
            const item = new ContentItemBuilder(true, '/').build();
            st.ok(skipDirectories(item), 'is directory');
        }
        {
            const item = new ContentItemBuilder(false, '/').build();
            st.notOk(skipDirectories(item), 'isn\'t directory');
        }
        st.end();
    });

    t.test('skipMeta', (st) => {
        {
            const item = new ContentItemBuilder(false, '/meta.yaml').build();
            st.ok(skipMeta(item), 'is meta');
        }
        {
            const item = new ContentItemBuilder(false, '/whatever').build();
            st.notOk(skipMeta(item), 'isn\'t meta');
        }
        st.end();
    });

});
