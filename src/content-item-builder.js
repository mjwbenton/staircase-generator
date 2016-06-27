/* @flow */

import filepath from 'filepath';
import Site from './site';
import { Record } from 'immutable';

export type ContentItem = {
    isDirectory: boolean,
    path: string,
    filename: string,
    children: Site,
    content: string,
    meta: { [key: string]: any }
}
const ContentItemRecord = Record({
    isDirectory: undefined,
    path: undefined,
    filename: undefined,
    children: undefined,
    content: undefined,
    meta: undefined
});

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

    withMergedMeta(meta: {[key:string]: any}): Builder {
        this._meta = {
            ...this._meta,
            ...meta
        };
        return this;
    }

    build() {
        return new ContentItemRecord({
            isDirectory: this._isDirectory,
            path: this._path,
            children: this._children,
            content: this._content,
            meta: this._meta,
            filename: filepath.create(this._path).basename()
        });
    }

    static fromItem(item: ContentItem): Builder {
        return new Builder(item.isDirectory, item.path)
            .withChildren(item.children)
            .withContent(item.content)
            .withMeta(item.meta);
    }

}
