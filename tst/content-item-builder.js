import test from 'tape'
import ContentItemBuilder from '../src/content-item-builder';

test('ContentItem', (t) => {

    t.test('Constructs immutable item', (st) => {
        const item = new ContentItemBuilder(false, '/this/is/the/path.html')
            .withContent("content")
            .withExtra({ extra: "stuff" })
            .build(); 
        st.equals(item.getContent(), "content", "correct content");
        st.throws(() => {
            item.content = "boo";
        }, "TypeError", "mutating throws TypeError");
        st.end();
    });

    t.test('#withMergedExtra merges objects', (st) => {
        const initialExtra = { extra: "stuff" };
        const newExtra = { other: "stuff" };
        let item = new ContentItemBuilder(false, '/this/is/the/path.html')
            .withExtra(initialExtra)
            .build();
        st.deepEquals(item.getExtra(), initialExtra, "correct initial extras");
        item = item.withMergedExtra(newExtra);
        st.deepEquals(item.getExtra(), { ...initialExtra, ...newExtra }, "correct merged extras");
        st.end();
    });

    t.test('#getFileName returns just the filename', (st) => {
        const file = 'file.html';
        const folder = '/folder/';
        const item = new ContentItemBuilder(true, folder + file).build();
        st.equals(item.getFileName(), file, "correct filename");
        st.end();
    });

    t.test('#isDirectory returns input from constructor', (st) => {
        const item = new ContentItemBuilder(true, '/whatever').build();
        st.ok(item.isDirectory(), "correct isDirectory response");
        st.end();
    });

});
