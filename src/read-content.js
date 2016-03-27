import fsp from 'fs-promise';
import filepath from 'filepath';
import Site from './site';
import ContentItemBuilder from './content-item-builder';

const UTF8 = 'utf8';

export default function readContents(contents_directory) {
    return readItems(contents_directory).then((items) => new Site(items));
}

function readItems(contents_directory) {
    const content_path = filepath.create(contents_directory);
    return fsp.readdir(content_path.valueOf()).then((files) =>
        Promise.all(files.map((file) => {
            const path = content_path.append(file);
            return fsp.lstat(path.valueOf()).then((info) => {
                if (info.isDirectory()) {
                    return readItems(path.valueOf()).then((children) => {
                        const directoryItem = new ContentItemBuilder(true, path.valueOf())
                            .withChildren(children)
                            .build();
                        return [directoryItem].concat(children);
                    });
                } else {
                    return fsp.readFile(path.valueOf(), UTF8).then((content) => (
                        new ContentItemBuilder(false, path.valueOf()).withContent(content).build()
                    ));
                }
            });
        }))
    ).then((results) => 
        [].concat.apply([], results)
    ).catch((err) => {
        console.log(err); 
        throw err;
    });
}
