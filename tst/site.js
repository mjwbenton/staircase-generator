/* @flow */

import test from 'blue-tape';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import ContentItemBuilder from '../src/content-item-builder';
import type { ContentItem } from '../src/content-item-builder';

const writeFileSpy = sinon.spy();
const Site = proxyquire('../src/site', {
    'fs-promise': {
        writeFile: writeFileSpy
    },
    './fsutils': {
        ensureDirExists() {
            return Promise.resolve();
        }
    },
    '@noCallThru': true
}).default;

function ci(x : number) {
    return new ContentItemBuilder(false, `${x}`)
        .withContent(x.toString())
        .build();
}

function cid(x : number, cis : [ContentItem]) {
    const itemsInDirectory = cis.map(
            (i) => i.withPath(`${x}/${i.getFilePath()}`));
    return new ContentItemBuilder(true, '')
        .withContent(x.toString())
        .withChildren(new Site(itemsInDirectory))
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
        const ci3 = cid(3, [ci(1), ci(2)]);
        const ci1 = ci3.getChildren().getNthContentItem(0);
        const ci2 = ci3.getChildren().getNthContentItem(1);
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
        const site = new Site([ci(1), cid(4, [ci(2), ci(3)])]);
        return site.writeToPath('/').then(() => {
            st.assert(writeFileSpy.calledWith('/1', '1'), 'file 1');
            st.assert(writeFileSpy.calledWith('/4/2', '2'), 'file 2');
            st.assert(writeFileSpy.calledWith('/4/3', '3'), 'file 3');
        });
    });

    t.test('readSiteFromPath', (st) => {
        // TODO: Write the test
        st.end();
    });

});
