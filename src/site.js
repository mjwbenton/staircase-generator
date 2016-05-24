/* @flow */

import fsp from 'fs-promise';
import filepath from 'filepath';
import ContentItemBuilder from './content-item-builder';
import type { ContentItem } from './content-item-builder';
import { ensureDirExists } from './fsutils';
import { skipMeta } from './transforms/skip-items';

const UTF8 = 'utf8';

export default class Site {
    items : ContentItem[];

    constructor(items : ContentItem[]) {
        this.items = items;
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

    writeToPath(outputDir : string) : Promise<void> {
        const outputPath = filepath.create(outputDir);
        return ensureDirExists(outputPath.valueOf()).then(() => {
            this.forEachWithFiltersTopLevel([skipMeta], (item) => {
                if (item.isDirectory()) {
                    item.getChildren().writeToPath(outputDir);
                } else {
                    const itemPath = outputPath.append(item.getFilePath())
                            .valueOf();
                    fsp.writeFile(itemPath, item.getContent());
                }
            });
        });
    }
}

export function readSiteFromPath(rootDirectory : string) : Promise<Site> {
    return readSiteFromSubPath(rootDirectory, rootDirectory);
}

function readSiteFromSubPath(rootDirectory : string, currentDirectory: string)
        : Promise<Site> {
    const currentPath = filepath.create(currentDirectory);
    return fsp.readdir(currentPath.valueOf()).then((files) =>
        Promise.all(files.map((file) => {
            const path = currentPath.append(file);
            const rootRelativePath = filepath.create(rootDirectory)
                .relative(path.valueOf());
            return fsp.lstat(path.valueOf()).then((info) => {
                if (info.isDirectory()) {
                    return createDirectoryContentItemFromPath(
                        rootDirectory, rootRelativePath);
                } else {
                    return createFileContentItemForPath(
                        rootDirectory, rootRelativePath);
                }
            });
        }))
    ).then((contentItems) => new Site(contentItems));
}

function createDirectoryContentItemFromPath(rootDirectory, relativePath)
        : Promise<ContentItem> {
    const fullPath = filepath.create(rootDirectory)
            .append(relativePath).valueOf();
    return readSiteFromSubPath(rootDirectory, fullPath).then((subSite) => {
        return new ContentItemBuilder(true, relativePath)
            .withChildren(subSite).build();
    });
}

function createFileContentItemForPath(rootDirectory, relativePath)
        : Promise<ContentItem> {
    const fullPath = filepath.create(rootDirectory)
            .append(relativePath).valueOf();
    return fsp.readFile(fullPath, UTF8).then((content) => (
        new ContentItemBuilder(false, relativePath)
            .withContent(content).build()
    ));
}
