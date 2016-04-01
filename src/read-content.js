import fsp from 'fs-promise';
import filepath from 'filepath';
import Site from './site';
import ContentItemBuilder from './content-item-builder';

const UTF8 = 'utf8';

export default function readContents(root_directory) {
    return readItems(root_directory, root_directory).then((items) => new Site(items));
}

function readItems(root_directory, current_directory) {
    const current_path = filepath.create(current_directory);
    return fsp.readdir(current_path.valueOf()).then((files) =>
        Promise.all(files.map((file) => {
            const path = current_path.append(file);
            const relative_path = filepath.create(root_directory).relative(path.valueOf());
            return fsp.lstat(path.valueOf()).then((info) => {
                if (info.isDirectory()) {
                    return readItems(root_directory, path.valueOf()).then((children) => {
                        const directoryItem = new ContentItemBuilder(true, relative_path)
                            .withChildren(children)
                            .build();
                        return [directoryItem].concat(children);
                    });
                } else {
                    return fsp.readFile(path.valueOf(), UTF8).then((content) => (
                        new ContentItemBuilder(false, relative_path).withContent(content).build()
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
