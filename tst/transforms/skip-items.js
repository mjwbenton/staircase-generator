import test from 'tape';
import { skipDirectories, skipMeta } from '../../src/transforms/skip-items';

test('skipItems', (t) => {

    t.test('skipDirectories', (st) => {
        {
            const item = {
                isDirectory() {
                    return true;
                }
            }
            st.ok(skipDirectories(item), "is directory");
        }
        {
            const item = {
                isDirectory() {
                    return false;
                }
            }
            st.notOk(skipDirectories(item), "isn't directory");
        }
        st.end();
    });

    t.test('skipMeta', (st) => {
        {
            const item = {
                getFileName() {
                    return 'meta.yaml';
                }
            }
            st.ok(skipMeta(item), "is meta");
        }
        {
            const item = {
                getFileName() {
                    return 'whatever';
                }
            }
            st.notOk(skipMeta(item), "isn't meta");
        }
        st.end();
    });

});
