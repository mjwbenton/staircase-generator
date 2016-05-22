/* @flow */

import test from 'tape';
import Site from '../src/site';

import ContentItemBuilder from '../src/content-item-builder';
import type { ContentItem } from '../src/content-item-builder';

function ci(x : number) {
    return new ContentItemBuilder(false, '')
        .withContent(x.toString())
        .build();
}

function intContent(x : ContentItem) {
    return parseInt(x.getContent());
}

test('Site', (t) => {

    t.test('#mapWithFilters', (st) => {
        {
            const site = new Site([ci(1), ci(2), ci(3), ci(4)])
                    .mapWithFilters([],
                        (x) => ci(parseInt(x.getContent()) * 2));
            st.deepEquals(site.items, [ci(2), ci(4), ci(6), ci(8)],
                    'map applies to all items with no filters');
        }
        {
            const site = new Site([ci(1), ci(2), ci(3), ci(4)])
                    .mapWithFilters([
                        (x) => intContent(x) < 2,
                        (x) => intContent(x) > 3
                    ], (x) => ci(intContent(x) * 2));
            st.deepEquals(site.items, [ci(1), ci(4), ci(6), ci(4)],
                    'map only applies to unfiltered items');
        }
        st.end();
    });

    t.test('#forEachWithFilters', (st) => {
        {
            const result = [];
            new Site([ci(1), ci(2), ci(3), ci(4)])
                .forEachWithFilters([], (x) => {
                    result.push(x);
                });
            st.deepEquals(result, [ci(1), ci(2), ci(3), ci(4)],
                    'for each applies to all items with no filters');
        }
        {
            const result = [];
            new Site([ci(1), ci(2), ci(3), ci(4)]).forEachWithFilters(
                [(x) => intContent(x) < 2, (x) => intContent(x) > 3], (x) => {
                    result.push(x);
                });
            st.deepEquals(result, [ci(2), ci(3)],
                    'for each applies to all items with no filters');
        }
        st.end();
    });

});
