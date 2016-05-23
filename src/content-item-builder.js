/* @flow */

import filepath from 'filepath';
import Site from './site';

export class ContentItem {
    _isDirectory : boolean;
    _path : string;
    _children : Site;
    _content : string;
    _extra : any;

    constructor(builder : Builder) {
        this._isDirectory = builder._isDirectory;
        this._path = builder._path;
        this._children = builder._children;
        this._content = builder._content;
        this._extra = builder._extra;
    }

    withContent(newContent : string) : ContentItem {
        return this._toBuilder().withContent(newContent).build();
    }

    withMergedExtra(additionalExtra : any) : ContentItem {
        const newExtra = Object.assign({}, this._extra, additionalExtra);
        return this._toBuilder().withExtra(newExtra).build();
    }

    withChildren(children : Site) : ContentItem {
        return this._toBuilder().withChildren(children).build();
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

    getExtra() : any {
        return this._extra;
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
            .withExtra(this._extra);
    }
}

export default class Builder {
    _isDirectory : boolean;
    _path : string;
    _children : Site;
    _content : string;
    _extra : any;

    constructor(isDirectory : boolean, path : string) {
        this._isDirectory = isDirectory;
        this._path = path;
        this._children = new Site([]);
        this._content = '';
        this._extra = {};
    }

    withChildren(children : Site) : Builder {
        this._children = children;
        return this;
    }

    withContent(content : string) : Builder {
        this._content = content;
        return this;
    }

    withExtra(extra : any) : Builder {
        this._extra = extra;
        return this;
    }

    build() : ContentItem {
        return new ContentItem(this);
    }

}
