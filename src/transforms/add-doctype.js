/* @flow */
import type Site from '../site';
import { skipMeta, skipDirectories } from './skip-items';

const DOCTYPE = '<!doctype html>';

export default function addDoctype(site : Site) {
    return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
        const content = DOCTYPE + '\n' + item.getContent();
        return item.withContent(content);
    });
}
