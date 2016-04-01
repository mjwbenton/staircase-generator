import { skipMeta } from './transforms/skip-items';
import fs from 'fs';
import filepath from 'filepath';

export default function writeContent(output_dir) {
    return (site) => {
        const output_path = filepath.create(output_dir);
        createDir(output_path.valueOf());
        site.forEachWithFilters([skipMeta], (item) => {
            const out_file = output_path.append(item.getFilePath()).valueOf();
            if (item.isDirectory()) {
                createDir(out_file);
            } else {
                fs.writeFileSync(out_file, item.getContent());
            }
        });
       return site;
    }
}

function createDir(path) {
    try {
        fs.mkdirSync(path);
    } catch(err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
}
