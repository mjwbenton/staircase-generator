/* @flow */

import immutable from 'seamless-immutable';
import filepath from 'filepath';

export class ContentItem {
    _isDirectory : boolean;
    path : string;
    children : ContentItem[];
    content : string;
    extra : any;
    // Set method actually from seamless-immutable
    set : (key : string, val : any) => ContentItem;

    constructor(builder : Builder) {
        this._isDirectory = builder._isDirectory;
        this.path = builder._path;
        this.children = builder._children;
        this.content = builder._content;
        this.extra = builder._extra;
    }

    withContent(newContent : string) : ContentItem {
        return this.set('content', newContent);
    }

    withMergedExtra(additionalExtra : any) : ContentItem {
        const newExtra = this.extra.merge(additionalExtra);
        return this.set('extra', newExtra);
    }

    getContent() : string {
        return this.content;
    }

    getFilePath() : string {
        return this.path;
    }

    getFileName() : string {
        return filepath.create(this.path).basename();
    }

    getExtra() : any {
        return this.extra;
    }

    isDirectory() : boolean {
        return this._isDirectory;
    }
}

export default class Builder {
    _isDirectory : boolean;
    _path : string;
    _children : ContentItem[];
    _content : string;
    _extra : any;

    constructor(isDirectory : boolean, path : string) {
        this._isDirectory = isDirectory;
        this._path = path;
        this._children = [];
        this._content = '';
        this._extra = {};
    }

    withChildren(children : ContentItem[]) : Builder {
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
        return immutable(new ContentItem(this), { prototype: ContentItem.prototype, deep: false });
    }

}
