/* @flow */

import type Site from '../site';
import ContentItemBuilder from '../content-item-builder';

import marked from 'marked';
import { skipMeta, skipDirectories } from './skip-items';

export default function handleMarkdown(site : Site) : Site {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) =>
        ContentItemBuilder.fromItem(item)
                .withContent(marked(item.content)).build()
    );
}
