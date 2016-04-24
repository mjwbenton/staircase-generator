/* @flow */

import type { ContentItem } from './content-item-builder';

class Site {
    items : ContentItem[];

    constructor(items : ContentItem[]) {
        this.items = items;
    }

    mapWithFilters(
            filters : Array<(item : ContentItem) => bool>,
            map : (item : ContentItem) => ContentItem) : Site {
        const newItems = this.items.map((item) => {
            const filtered = filters.some((filter) => {
                return filter(item);
            });
            if (filtered) {
                return item;
            }
            return map(item);
        });
        return new Site(newItems);
    }

    forEachWithFilters(filters : Array<(item : ContentItem) => bool>,
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
}

export default Site;
