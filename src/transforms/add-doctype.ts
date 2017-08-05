import Site from '../site';
import ContentItemBuilder from '../content-item-builder';
import { skipMeta, skipDirectories } from './skip-items';

const DOCTYPE = '<!doctype html>';

export default function addDoctype(site : Site) {
    return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
        const content = DOCTYPE + '\n' + item.content;
        return ContentItemBuilder.fromItem(item).withContent(content).build();
    });
}
