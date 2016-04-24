/* @flow */

import type Site from '../site';

import marked from 'marked';
import { skipMeta, skipDirectories } from './skip-items';

export default function handleMarkdown(site : Site) : Site {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) =>
        item.withContent(marked(item.getContent()))
    );
}
