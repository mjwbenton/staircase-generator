import Site from '../site';
import { skipMeta, skipDirectories } from '../transforms/skip-items';
import {getLogger} from '../logging';

export const NAVIGATION_META_KEY = 'navigation';

const TITLE_KEY = 'title';
const INDEX_KEY = 'index';
const GROUP_KEY = 'group';

export type NavigationEntry = {
    title: string,
    index: number,
    group: number,
    path: string
};

export default function buildNavigation(site : Site) : Site {
    const log = getLogger('navigation');
    const navigation : NavigationEntry[] = [];
    site.forEachWithFilters([skipMeta, skipDirectories], (item) => {
        if (item.meta[INDEX_KEY]) {
            log.debug(`Entry in file: ${item.path}`);
            const navigationEntry : NavigationEntry = {
                title: item.meta[TITLE_KEY],
                index: item.meta[INDEX_KEY],
                group: item.meta[GROUP_KEY] || 0,
                path: item.path
            };
            navigation.push(navigationEntry);
        }
    });
    const sortedNavigation = navigation.sort((a, b) => {
        if (a.group < b.group) {
            return -1;
        } else if (a.group > b.group) {
            return 1;
        } else if (a.index < b.index) {
            return -1;
        } else if (a.index > b.index) {
            return 1;
        } else {
            return 0;
        }
    });
    log.info('Final navigation entries:'
            + sortedNavigation.map((x) => x.title).toString());
    return site.withMeta(NAVIGATION_META_KEY, sortedNavigation);
}
