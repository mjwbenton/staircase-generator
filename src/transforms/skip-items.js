/* @flow */

import type { ContentItem } from '../content-item-builder';

export function skipDirectories(item : ContentItem) : boolean {
    return item.isDirectory();
}

export function skipMeta(item : ContentItem) : boolean {
    return item.getFileName() === 'meta.yaml';
}
