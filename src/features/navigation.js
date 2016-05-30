/* @flow */

import type Site from '../site';

import { skipMeta, skipDirectories } from '../transforms/skip-items';

export const NAVIGATION_META_KEY = 'navigation';

const TITLE_KEY = 'title';
const INDEX_KEY = 'index';

export type NavigationEntry = {
    title: string,
    index: number,
    path: string
};

export default function buildNavigation(site : Site) : Site {
    const navigation : NavigationEntry[] = [];
    site.forEachWithFilters([skipMeta, skipDirectories], (item) => {
        const navigationEntry : NavigationEntry = {
            title: item.getMeta(TITLE_KEY),
            index: item.getMeta(INDEX_KEY),
            path: item.getFilePath()
        };
        navigation.push(navigationEntry);
    });
    navigation.sort((a, b) => {
        const aIndex = a[INDEX_KEY];
        const bIndex = b[INDEX_KEY];
        if (aIndex < bIndex) {
            return -1;
        } else if (aIndex > bIndex) {
            return 1;
        } else {
            return 0;
        }
    });
    return site.withMeta(NAVIGATION_META_KEY, navigation);
}
