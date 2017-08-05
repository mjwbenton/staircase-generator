import * as test from 'blue-tape';
import * as proxyquire from "proxyquire";
import * as sinon from 'sinon';

import ContentItemBuilder from '../src/content-item-builder';
import { ContentItem } from '../src/content-item-builder';
import {Site as SiteOrig, readSiteFromPath as readSiteFromPathOrig} from "../src/site";
import {Record} from "immutable";

const writeFileStub = sinon.stub();
const readdirStub = sinon.stub();
const lstatStub = sinon.stub();
const { Site, readSiteFromPath }: { Site: typeof SiteOrig, readSiteFromPath: typeof readSiteFromPathOrig} =
    proxyquire('../src/site', {
        'fs-promise': {
            writeFile: writeFileStub,
            readdir: readdirStub,
            lstat: lstatStub,
            readFile(file: string, encoding: string) {
                return Promise.resolve(file);
            }
        },
        './fsutils': {
            ensureDirExists() {
                return Promise.resolve();
            }
        },
        '@noCallThru': true
    });

function ci(x : number) {
    return new ContentItemBuilder(false, `${x}`)
        .withContent(x.toString())
        .build();
}

function cid(x : number, cis : ContentItem[]) {
    const itemsInDirectory = cis.map(
        (i) => ContentItemBuilder.fromItem(i)
                .withPath(`${x}/${i.path}`).build()
    );
    return new ContentItemBuilder(true, `${x}`)
        .withContent(x.toString())
        .withChildren(new Site(itemsInDirectory))
        .build();
}

function intContent(x : ContentItem) {
    return parseInt(x.content);
}

test('Site', (t) => {

    t.test('constructor', (st) => {
        const site = new Site([]);
        st.deepEquals(site.meta, {}, 'meta defaults to empty object');
        st.end();
    });

    t.test('#withMeta/#getMeta', (st) => {
        const key = 'key';
        const value = 'value';
        const site = new Site([]);
        const newSite = site.withMeta(key, value);
        st.equals(newSite.meta[key], value);
        st.assert(site.meta[key] === undefined);
        st.end();
    });

    t.test('#mapWithFilters', (st) => {
        {
            const site = new Site([ci(1), ci(2), ci(3), ci(4)])
                    .mapWithFilters([],
                        (x: ContentItem) => ci(parseInt(x.content) * 2));
            st.deepEquals(site.items, [ci(2), ci(4), ci(6), ci(8)],
                    'map applies to all items with no filters');
        }
        {
            const site = new Site([ci(1), ci(2), ci(3), ci(4)])
                    .mapWithFilters([
                        (x: ContentItem) => intContent(x) < 2,
                        (x: ContentItem) => intContent(x) > 3
                    ], (x: ContentItem) => ci(intContent(x) * 2));
            st.deepEquals(site.items, [ci(1), ci(4), ci(6), ci(4)],
                    'map only applies to unfiltered items');
        }
        st.end();
    });

    t.test('#forEachWithFilters', (st) => {
        const ci3 = cid(3, [ci(1), ci(2)]);
        const ci1 = ci3.children.getNthContentItem(0);
        const ci2 = ci3.children.getNthContentItem(1);
        const ci4 = ci(4);
        {
            const result: ContentItem[] = [];
            new Site([ci3, ci4]).forEachWithFilters([], (x: ContentItem) => {
                result.push(x);
            });
            st.deepEquals(result, [ci1, ci2, ci3, ci4],
                    'for each applies to all items with no filters');
        }
        {
            const result: ContentItem[] = [];
            new Site([ci3, ci4]).forEachWithFilters(
                [(x: ContentItem) => intContent(x) < 2, (x: ContentItem) => intContent(x) > 3],
                (x: ContentItem) => {
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
            const result: ContentItem[] = [];
            new Site(input).forEachWithFiltersTopLevel([], (x: ContentItem) => {
                result.push(x);
            });
            st.deepEquals(result, input,
                    'for each applies to all items with no filters');
        }
        {
            const result: ContentItem[] = [];
            new Site([ci(1), ci(2), ci(3), ci(4)]).forEachWithFiltersTopLevel(
                [(x) => intContent(x) < 2, (x) => intContent(x) > 3], (x: ContentItem) => {
                    result.push(x);
                });
            st.deepEquals(result, [ci(2), ci(3)],
                    'for each applies to unfiltered items with filters');
        }
        st.end();
    });

    t.test('#writeToPath', async (st) => {
        const site = new Site([ci(1), cid(4, [ci(2), ci(3)])]);
        await site.writeToPath('/test');
        st.assert(writeFileStub.calledWith('/test/1', '1'), 'file 1');
        st.assert(writeFileStub.calledWith('/test/4/2', '2'), 'file 2');
        st.assert(writeFileStub.calledWith('/test/4/3', '3'), 'file 3');
    });

    t.test('readSiteFromPath', async (st) => {
        const path = '/a';
        const files = ['1'];
        readdirStub.withArgs(path).returns(Promise.resolve(files));
        lstatStub.returns(Promise.resolve({
            isDirectory() {
                return false;
            }
        }));
        const site = await readSiteFromPath(path);
        const contentItem = site.getNthContentItem(0);
        st.equals(contentItem.path, '1', 'correct file path');
        st.equals(contentItem.filename, '1', 'correct file name');
        st.false(contentItem.isDirectory, 'not a directory');
        st.equals(contentItem.content, '/a/1', 'correct content');
    });

});
