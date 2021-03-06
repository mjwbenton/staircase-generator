import * as path from "path";
import * as fsp from 'fs-promise';
import ContentItemBuilder from './content-item-builder';
import { ContentItem } from './content-item-builder';
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

    withChildren(children : ContentItem[]) {
        return new Site(children, this.meta);
    }

    getMeta(key : string) : any {
        return this.meta[key];
    }

    getNthContentItem(n: number): ContentItem {
        return this.items[n];
    }

    mapWithFilters(
            filters : Array<(item : ContentItem) => boolean>,
            map : (item : ContentItem) => ContentItem) : Site {
        const newItems = this.items.map((item) => {
            let toMapItem = item;
            // If directory, start by running over all the children
            if (item.isDirectory) {
                const newSubSite = item.children.mapWithFilters(
                    filters, map);
                toMapItem = ContentItemBuilder.fromItem(item)
                        .withChildren(newSubSite).build();
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
        return this.withChildren(newItems);
    }

    async mapWithFiltersAsync(
            filters : Array<(item : ContentItem) => boolean>,
            map : (item : ContentItem) => Promise<ContentItem>)
            : Promise<Site> {
        const newItemsPromises = this.items.map(async (item) => {
            let toMapItem = item;
            if (item.isDirectory) {
                const newSubSite = await item.children
                    .mapWithFiltersAsync(filters, map);
                toMapItem = ContentItemBuilder.fromItem(item)
                        .withChildren(newSubSite).build();
            }
            // Filter out if any of the filters return true
            const filtered = filters.some((filter) => {
                return filter(toMapItem);
            });
            if (filtered) {
                return toMapItem;
            }
            // Actually run the map method
            return await map(toMapItem);
        });
        return this.withChildren(await Promise.all(newItemsPromises));
    }

    forEachWithFilters(filters : Array<(item : ContentItem) => boolean>,
            forEach : (item : ContentItem) => void) {
        this.items.forEach((item) => {
            // If directory, start by running over all the children
            if (item.isDirectory) {
                item.children.forEachWithFilters(filters, forEach);
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
            filters : Array<(item : ContentItem) => boolean>,
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
        await ensureDirExists(outputDir);
        this.forEachWithFiltersTopLevel([skipMeta], (item) => {
            const itemPath = path.join(outputDir, item.filename);
            if (item.isDirectory) {
                item.children.writeToPath(itemPath);
            } else {
                fsp.writeFile(itemPath, item.content);
            }
        });
    }
}

export async function readSiteFromPath(rootDirectory : string) : Promise<Site> {
    return await readSiteFromSubPath(rootDirectory, rootDirectory);
}

async function readSiteFromSubPath(
        rootDirectory : string, currentDirectory: string) : Promise<Site> {
    const files = await fsp.readdir(currentDirectory);
    const itemPromises: Promise<ContentItem>[] = files.map(async (file) => {
        const filepath = path.join(currentDirectory, file);
        const rootRelativePath = path.relative(rootDirectory, filepath);
        const fileInfo = await fsp.lstat(filepath);
        if (fileInfo.isDirectory()) {
            return await createDirectoryContentItemFromPath(
                rootDirectory, rootRelativePath);
        } else {
            return await createFileContentItemForPath(
                rootDirectory, rootRelativePath);
        }
    });
    const contentItems = await Promise.all(itemPromises);
    return new Site(contentItems);
}

async function createDirectoryContentItemFromPath(rootDirectory: string, relativePath: string): Promise<ContentItem> {
    const fullPath = path.join(rootDirectory, relativePath);
    const subSite = await readSiteFromSubPath(rootDirectory, fullPath);
    return new ContentItemBuilder(true, relativePath)
        .withChildren(subSite).build();
}

async function createFileContentItemForPath(rootDirectory: string, relativePath: string): Promise<ContentItem> {
    const fullPath = path.join(rootDirectory, relativePath);
    const content = await fsp.readFile(fullPath, UTF8);
    return new ContentItemBuilder(false, relativePath)
        .withContent(content).build();
}

export default Site;
