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

function cid(x : number, cis : [ContentItem]) {
    return new ContentItemBuilder(true, '')
        .withContent(x.toString())
        .withChildren(new Site(cis))
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
        const ci1 = ci(1);
        const ci2 = ci(2);
        const ci3 = cid(3, [ci1, ci2]);
        const ci4 = ci(4);
        {
            const result = [];
            new Site([ci3, ci4]).forEachWithFilters([], (x) => {
                result.push(x);
            });
            st.deepEquals(result, [ci1, ci2, ci3, ci4],
                    'for each applies to all items with no filters');
        }
        {
            const result = [];
            new Site([ci3, ci4]).forEachWithFilters(
                [(x) => intContent(x) < 2, (x) => intContent(x) > 3],
                (x) => {
                    result.push(x);
                });
            st.deepEquals(result, [ci2, ci3],
                    'for each applies to unfiltered items with filters');
        }
        st.end();
    });

    t.test('#forEachWithFiltersTopLevel', (st) => {
        {
            const input = [ci(1), ci(2), cid(3, [ci(4)])];
            const result = [];
            new Site(input).forEachWithFiltersTopLevel([], (x) => {
                result.push(x);
            });
            st.deepEquals(result, input,
                    'for each applies to all items with no filters');
        }
        {
            const result = [];
            new Site([ci(1), ci(2), ci(3), ci(4)]).forEachWithFiltersTopLevel(
                [(x) => intContent(x) < 2, (x) => intContent(x) > 3], (x) => {
                    result.push(x);
                });
            st.deepEquals(result, [ci(2), ci(3)],
                    'for each applies to unfiltered items with filters');
        }
        st.end();
    });

    t.test('#writeToPath', (st) => {
        // TODO: Write the test
        st.end();
    });

    t.test('readSiteFromPath', (st) => {
        // TODO: Write the test
        st.end();
    });

});
