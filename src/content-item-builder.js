/* @flow */

import filepath from 'filepath';
import Site from './site';

export class ContentItem {
    _isDirectory : boolean;
    _path : string;
    _children : Site;
    _content : string;
    _meta : {[key : string] : any};

    constructor(builder : Builder) {
        this._isDirectory = builder._isDirectory;
        this._path = builder._path;
        this._children = builder._children;
        this._content = builder._content;
        this._meta = builder._meta;
    }

    withContent(newContent : string) : ContentItem {
        return this._toBuilder().withContent(newContent).build();
    }

    withMeta(key : string, obj : any) {
        const newMeta = Object.assign({}, this._meta, {
            [key]: obj
        });
        return this._toBuilder().withMeta(newMeta).build();
    }

    withMergedMeta(additionalMeta : {[key : string] : any}) : ContentItem {
        const newMeta = Object.assign({}, this._meta, additionalMeta);
        return this._toBuilder().withMeta(newMeta).build();
    }

    withChildren(children : Site) : ContentItem {
        return this._toBuilder().withChildren(children).build();
    }

    withPath(path : string) : ContentItem {
        return this._toBuilder().withPath(path).build();
    }

    getContent() : string {
        return this._content;
    }

    getFilePath() : string {
        return this._path;
    }

    getFileName() : string {
        return filepath.create(this._path).basename();
    }

    getMeta(key : string) : any {
        return this._meta[key];
    }

    getChildren() : Site {
        return this._children;
    }

    isDirectory() : boolean {
        return this._isDirectory;
    }

    _toBuilder() : Builder {
        return new Builder(this._isDirectory, this._path)
            .withContent(this._content)
            .withChildren(this._children)
            .withMeta(this._meta);
    }
}

export default class Builder {
    _isDirectory : boolean;
    _path : string;
    _children : Site;
    _content : string;
    _meta : {[key : string] : any};

    constructor(isDirectory : boolean, path : string) {
        this._isDirectory = isDirectory;
        this._path = path;
        this._children = new Site([]);
        this._content = '';
        this._meta = {};
    }

    withPath(path : string) : Builder {
        this._path = path;
        return this;
    }

    withChildren(children : Site) : Builder {
        this._children = children;
        return this;
    }

    withContent(content : string) : Builder {
        this._content = content;
        return this;
    }

    withMeta(meta : {[key : string] : any}) : Builder {
        this._meta = meta;
        return this;
    }

    build() : ContentItem {
        return new ContentItem(this);
    }

}
