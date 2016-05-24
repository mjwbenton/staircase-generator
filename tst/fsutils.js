import test from 'blue-tape';
import proxyquire from 'proxyquire';

const EXISTS_PATH = 'exists';
const ERROR_PATH = 'error';
const ERROR = { code: 'whatever' };

const ensureDirExists = proxyquire('../src/fsutils', {
    'fs-promise': {
        mkdir(path) {
            switch (path) {
            case EXISTS_PATH:
                return Promise.reject({ code: 'EEXIST' });
            case ERROR_PATH:
                return Promise.reject(ERROR);
            default:
                return Promise.resolve();
            }
        }
    }
}).ensureDirExists;

test('fsutils', (t) => {
    t.test('ensureDirExists - normal case', (st) => {
        return ensureDirExists('whatever');
    });

    t.test('ensureDirExists - already exists case', (st) => {
        return ensureDirExists(EXISTS_PATH);
    });

    t.test('ensureDirExists - error case', (st) => {
        return st.shouldFail(ensureDirExists(ERROR_PATH));
    });
});
