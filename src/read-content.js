import fsp from 'fs-promise';
import filepath from 'filepath';
import Site from './site';
import ContentItemBuilder from './content-item-builder';

const UTF8 = 'utf8';

export default function readContents(rootDirectory) {
    return readItems(rootDirectory, rootDirectory).then((items) => new Site(items));
}

function readItems(rootDirectory, currentDirectory) {
    const currentPath = filepath.create(currentDirectory);
    return fsp.readdir(currentPath.valueOf()).then((files) =>
        Promise.all(files.map((file) => {
            const path = currentPath.append(file);
            const relativePath = filepath.create(rootDirectory).relative(path.valueOf());
            return fsp.lstat(path.valueOf()).then((info) => {
                if (info.isDirectory()) {
                    return readItems(rootDirectory, path.valueOf()).then((children) => {
                        const directoryItem = new ContentItemBuilder(true, relativePath)
                            .withChildren(children)
                            .build();
                        return [directoryItem].concat(children);
                    });
                } else {
                    return fsp.readFile(path.valueOf(), UTF8).then((content) => (
                        new ContentItemBuilder(false, relativePath).withContent(content).build()
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
