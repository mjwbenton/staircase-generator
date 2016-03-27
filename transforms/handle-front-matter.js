import { skipDirectories, skipMeta } from './skip-items';
import yamlFront from 'yaml-front-matter';

const CONTENT_KEY = '__content';

export default function handleFrontMatter(site) {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) => {
        const frontMatter = yamlFront.loadFront(item.content);
        const content = frontMatter[CONTENT_KEY];
        delete frontMatter[CONTENT_KEY];
        return {
            ...item,
            extra: frontMatter,
            content: content
        };
    });
}
