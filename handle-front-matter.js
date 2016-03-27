import { skipDirectories, skipMeta } from './skip-items';
import yamlFront from 'yaml-front-matter';

export default function handleFrontMatter(contents) {
    return contents.filter(skipDirectories).filter(skipMeta).map((item) => {
        return {
            ...item,
            frontMatter: yamlFront.loadFront(item.contents)
        };
    });
}
