import test from 'tape';
import { skipDirectories, skipMeta } from '../../src/transforms/skip-items';

test('skipItems', (t) => {

    t.test('skipDirectories - is directory', (st) => {
        const item = {
            isDirectory() {
                return true;
            }
        }
        st.ok(skipDirectories(item));
        st.end();
    });

    t.test('skipDirectories - isn\'t directory', (st) => {
        const item = {
            isDirectory() {
                return false;
            }
        }
        st.notOk(skipDirectories(item));
        st.end();
    });

    t.test('skipMeta - is meta', (st) => {
        const item = {
            getFileName() {
                return 'meta.yaml';
            }
        }
        st.ok(skipMeta(item));
        st.end();
    });

    t.test('skipMeta - isn\'t meta', (st) => {
        const item = {
            getFileName() {
                return 'whatever';
            }
        }
        st.notOk(skipMeta(item));
        st.end();
    });

});
