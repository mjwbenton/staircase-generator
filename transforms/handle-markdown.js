import marked from 'marked';
import { skipMeta, skipDirectories } from './skip-items';

export default function handleMarkdown(site) {
    return site.mapWithFilters([skipDirectories, skipMeta], (item) => ({
        item,
        content: marked(item.content)
    }));
}