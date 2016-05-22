/* @flow */

import { skipMeta } from './transforms/skip-items';
import fs from 'fs';
import filepath from 'filepath';
import type Site from './site';

export default function writeContent(outputDir: string)
        : (site : Site) => Site {
    return (site) => {
        const outputPath = filepath.create(outputDir);
        createDir(outputPath.valueOf());
        site.forEachWithFilters([skipMeta], (item) => {
            const outFile : string = outputPath.append(
                    item.getFilePath()).valueOf();
            if (item.isDirectory()) {
                createDir(outFile);
            } else {
                fs.writeFileSync(outFile, item.getContent());
            }
        });
        return site;
    };
}

function createDir(path: string) {
    try {
        fs.mkdirSync(path);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}
