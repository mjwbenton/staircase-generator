import { skipDirectories, skipMeta } from './skip-items';
import { loadFront } from 'yaml-front-matter';
import Site from '../site';
import ContentItemBuilder from '../content-item-builder';

const CONTENT_KEY = '__content';

export default function handleFrontMatter(site : Site) : Site {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) => {
        const frontMatter = loadFront(item.content);
        const content = frontMatter[CONTENT_KEY];
        delete frontMatter[CONTENT_KEY];
        return ContentItemBuilder.fromItem(item)
                .withMergedMeta(frontMatter).withContent(content).build();
    });
}
