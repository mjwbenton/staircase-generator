import fsp from 'fs-promise';
import filepath from 'filepath';

const UTF8 = 'utf8';

export default function readContents(contents_directory) {
    const content_path = filepath.create(contents_directory);
    return fsp.readdir(content_path.valueOf()).then((files) =>
        Promise.all(files.map((file) => {
            const path = content_path.append(file);
            return fsp.lstat(path.valueOf()).then((info) => {
                if (info.isDirectory()) {
                    return readContents(path.valueOf()).then((children) => {
                        const directoryItem = {
                            path,
                            isDirectory: info.isDirectory(),
                            children
                        };
                        return [directoryItem].concat(children);
                    });
                } else {
                    return fsp.readFile(path.valueOf(), UTF8).then((contents) => ({
                        path,
                        isDirectory: info.isDirectory(),
                        contents
                    }));
                }
            });
        }))
    ).then((results) => 
        [].concat.apply([], results)
    ).catch((err) => {
        console.err(err); 
        throw err;
    });
}
