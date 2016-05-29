/* @flow */

import { skipDirectories, skipMeta } from './skip-items';
import yamlFront from 'yaml-front-matter';
import type Site from '../site';

const CONTENT_KEY = '__content';

export default function handleFrontMatter(site : Site) : Site {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) => {
        const frontMatter = yamlFront.loadFront(item.getContent());
        const content = frontMatter[CONTENT_KEY];
        delete frontMatter[CONTENT_KEY];
        return item.withMergedMeta(frontMatter).withContent(content);
    });
}
