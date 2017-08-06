import { skipDirectories, skipMeta } from './skip-items';
import * as matter from 'gray-matter';
import Site from '../site';
import ContentItemBuilder from '../content-item-builder';

export default function handleFrontMatter(site : Site) : Site {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) => {
        const parsedMatter = matter(item.content);
        return ContentItemBuilder.fromItem(item)
                .withMergedMeta(parsedMatter.data).withContent(parsedMatter.content).build();
    });
}
