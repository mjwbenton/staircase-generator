import * as test from 'tape';
import ContentItemBuilder from '../src/content-item-builder';

test('ContentItem', (t) => {

    t.test('Constructs item', (st) => {
        const item = new ContentItemBuilder(false, '/this/is/the/path.html')
            .withContent('content')
            .withMeta({ extra: 'stuff' })
            .build();
        st.equals(item.content, 'content', 'correct content');
        st.end();
    });

    t.test('#withMergedMeta merges objects', (st) => {
        const initialMeta = { extra: 'extra' };
        const newMeta = { other: 'stuff' };
        let item = new ContentItemBuilder(false, '/this/is/the/path.html')
            .withMeta(initialMeta)
            .build();
        st.equals(item.meta.extra, 'extra', 'correct initial meta');
        item = ContentItemBuilder.fromItem(item).withMergedMeta(newMeta)
                .build();
        st.deepEquals([item.meta.extra, item.meta.other],
            ['extra', 'stuff'], 'correct merged extras');
        st.end();
    });

    t.test('#getFileName returns just the filename', (st) => {
        const file = 'file.html';
        const folder = '/folder/';
        const item = new ContentItemBuilder(true, folder + file).build();
        st.equals(item.filename, file, 'correct filename');
        st.end();
    });

    t.test('#isDirectory returns input from constructor', (st) => {
        const item = new ContentItemBuilder(true, '/whatever').build();
        st.ok(item.isDirectory, 'correct isDirectory response');
        st.end();
    });

});
