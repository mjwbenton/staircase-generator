/* @flow */

import fsp from 'fs-promise';
import filepath from 'filepath';
import ContentItemBuilder from './content-item-builder';
import type { ContentItem } from './content-item-builder';
import { ensureDirExists } from './fsutils';
import { skipMeta } from './transforms/skip-items';

const UTF8 = 'utf8';

export class Site {
    items : ContentItem[];
    meta : {[key : string] : any};

    constructor(items : ContentItem[], meta : {[key : string] : any} = {}) {
        this.items = items;
        this.meta = meta;
    }

    withMeta(key : string, obj : any) {
        const newMeta = Object.assign({}, this.meta, {
            [key]: obj
        });
        return new Site([...this.items], newMeta);
    }

    getMeta(key : string) : any {
        return this.meta[key];
    }

    getNthContentItem(n : number) : ContentItem {
        return this.items[n];
    }

    mapWithFilters(
            filters : Array<(item : ContentItem) => bool>,
            map : (item : ContentItem) => ContentItem) : Site {
        const newItems = this.items.map((item) => {
            let toMapItem = item;
            // If directory, start by running over all the children
            if (item.isDirectory()) {
                const newSubSite = item.getChildren().mapWithFilters(
                    filters, map);
                toMapItem = item.withChildren(newSubSite);
            }
            // Filter out if any of the filters return true
            const filtered = filters.some((filter) => {
                return filter(toMapItem);
            });
            if (filtered) {
                return toMapItem;
            }
            // Actually run the map method
            return map(toMapItem);
        });
        return new Site(newItems);
    }

    forEachWithFilters(filters : Array<(item : ContentItem) => bool>,
            forEach : (item : ContentItem) => void) {
        this.items.forEach((item) => {
            // If directory, start by running over all the children
            if (item.isDirectory()) {
                item.getChildren().forEachWithFilters(filters, forEach);
            }
            // Filter out if any of the filters return true
            const filtered = filters.some((filter) => {
                return filter(item);
            });
            if (!filtered) {
                forEach(item);
            }
        });
    }

    forEachWithFiltersTopLevel(
            filters : Array<(item : ContentItem) => bool>,
            forEach : (item : ContentItem) => void) {
        this.items.forEach((item) => {
            const filtered = filters.some((filter) => {
                return filter(item);
            });
            if (!filtered) {
                forEach(item);
            }
        });
    }

    async writeToPath(outputDir : string) : Promise<void> {
        const outputPath = filepath.create(outputDir);
        await ensureDirExists(outputPath.valueOf());
        this.forEachWithFiltersTopLevel([skipMeta], (item) => {
            const itemPath = outputPath.append(item.getFileName())
                .valueOf();
            if (item.isDirectory()) {
                item.getChildren().writeToPath(itemPath);
            } else {
                fsp.writeFile(itemPath, item.getContent());
            }
        });
    }
}

export async function readSiteFromPath(rootDirectory : string) : Promise<Site> {
    return await readSiteFromSubPath(rootDirectory, rootDirectory);
}

async function readSiteFromSubPath(
        rootDirectory : string, currentDirectory: string) : Promise<Site> {
    const currentPath = filepath.create(currentDirectory);
    const files = await fsp.readdir(currentPath.valueOf());
    const contentItems = await Promise.all(files.map(async (file) => {
        const path = currentPath.append(file);
        const rootRelativePath = filepath.create(rootDirectory)
            .relative(path.valueOf());
        const fileInfo = await fsp.lstat(path.valueOf());
        if (fileInfo.isDirectory()) {
            return await createDirectoryContentItemFromPath(
                rootDirectory, rootRelativePath);
        } else {
            return await createFileContentItemForPath(
                rootDirectory, rootRelativePath);
        }
    }));
    return new Site(contentItems);
}

async function createDirectoryContentItemFromPath(rootDirectory, relativePath)
        : Promise<ContentItem> {
    const fullPath = filepath.create(rootDirectory)
            .append(relativePath).valueOf();
    const subSite = await readSiteFromSubPath(rootDirectory, fullPath);
    return new ContentItemBuilder(true, relativePath)
        .withChildren(subSite).build();
}

async function createFileContentItemForPath(rootDirectory, relativePath)
        : Promise<ContentItem> {
    const fullPath = filepath.create(rootDirectory)
            .append(relativePath).valueOf();
    const content = await fsp.readFile(fullPath, UTF8);
    return new ContentItemBuilder(false, relativePath)
        .withContent(content).build();
}

export default Site;
