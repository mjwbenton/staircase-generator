import Immutable from 'seamless-immutable';
import filepath from 'filepath';

class ContentItem {

    constructor(builder) {
        this._isDirectory = builder._isDirectory;
        this.path = builder._path;
        this.children = builder._children;
        this.content = builder._content;
        this.extra = builder._extra;
    }

    withContent(newContent) {
        return this.set("content", newContent);
    }

    withMergedExtra(additionalExtra) {
        const newExtra = this.extra.merge(additionalExtra);
        return this.set("extra", newExtra);
    }

    getContent() {
        return this.content;
    }

    getFileName() {
        return filepath.create(this.path).basename();
    }

    getExtra() {
        return this.extra;
    }

    isDirectory() {
        return this._isDirectory;
    }
}

export default class Builder {

    constructor(isDirectory, path) {
        this._isDirectory = isDirectory;
        this._path = path;
        this._children = [];
        this._content = "";
        this._extra = {};
    }

    withChildren(children) {
        this._children = children;
        return this;
    }

    withContent(content) {
        this._content = content;
        return this;
    }

    withExtra(extra) {
        this._extra = extra;
        return this;
    }

    build() {
        return Immutable(new ContentItem(this), { prototype: ContentItem.prototype, deep: false });
    }

}
